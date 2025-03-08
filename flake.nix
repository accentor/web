{
  description = "Accentor Web";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    systems.url = "github:nix-systems/default";
  };

  outputs = { self, nixpkgs, devshell, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; overlays = [ devshell.overlays.default ]; };
      in
      {
        packages = rec {
          default = accentor-web;
          accentor-web = pkgs.mkYarnPackage rec {
            pname = "accentor-web";
            version = "0.33.0";

            src = pkgs.lib.cleanSourceWith { filter = name: type: !(builtins.elem name [ ".github" "flake.lock" "flake.nix" ]); src = ./.; name = "source"; };
            packageJSON = ./package.json;
            yarnLock = ./yarn.lock;
            yarnNix = ./yarn.nix;

            # Otherwise this tries to write to read-only paths, and caching is unnecessary anyway.
            SKIP_CACHE = "true";
            buildPhase = ''
              cp deps/accentor/postcss.config.js .
              yarn run build
            '';

            installPhase = ''
              cp -r deps/accentor/dist $out
              rm $out/**/*.map
            '';

            distPhase = "true";
          };
        };

        devShells = rec {
          default = accentor-web;
          accentor-web = pkgs.devshell.mkShell {
            name = "Accentor Web";
            packages = with pkgs; [
              nixpkgs-fmt
              yarn2nix
              (yarn.override { nodejs = nodejs_20; })
            ];
          };
        };
      }
    );
}
