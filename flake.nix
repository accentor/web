{
  description = "Accentor Web";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs = {
        flake-utils.follows = "flake-utils";
        nixpkgs.follows = "nixpkgs";
      };
    };
  };

  outputs = { self, nixpkgs, devshell, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; overlays = [ devshell.overlay ]; };
      in
      {
        packages = rec {
          default = accentor-web;
          accentor-web = pkgs.mkYarnPackage rec {
            pname = "accentor-web";
            version = "0.31.1";

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
              yarn
            ];
          };
        };
      }
    );
}
