{
  description = "Accentor WEB";

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

  outputs = inputs@{ self, nixpkgs, flake-utils, ... }:
    let
      inherit (flake-utils.lib) eachDefaultSystem;
    in
    eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ inputs.devshell.overlay ];
        };
      in
      {
        defaultPackage = pkgs.mkYarnPackage rec {
          pname = "accentor-web";
          version = "0.30.0";

          src = pkgs.lib.cleanSourceWith { filter = name: type: !(builtins.elem name [ ".github" "flake.lock" "flake.nix" ]); src = ./.; name = "source"; };
          packageJSON = ./package.json;
          yarnLock = ./yarn.lock;
          yarnNix = ./yarn.nix;

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

        devShell = pkgs.devshell.mkShell {
          name = "Accentor WEB";
          packages = with pkgs; [
            yarn2nix
            yarn
          ];
        };
      }
    );
}
