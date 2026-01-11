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
        pname = "accentor-web";
        version = "0.34.0";
        deps = pkgs.mkYarnModules {
          inherit version;
          pname = "${pname}-modules";
          packageJSON = ./package.json;
          yarnLock = ./yarn.lock;
          yarnNix = ./yarn.nix;
        };
      in
      {
        packages = rec {
          default = accentor-web;
          accentor-web = pkgs.stdenv.mkDerivation (finalAttrs: {
            inherit pname version;
            src = pkgs.lib.cleanSourceWith { filter = name: type: !(builtins.elem name [ ".github" "flake.lock" "flake.nix" ]); src = ./.; name = "${pname}-${version}-source"; };

            nativeBuildInputs = [ (pkgs.yarn.override { nodejs = pkgs.nodejs_22; }) ];

            configurePhase = ''
              cp -r ${deps}/node_modules/ .
            '';

            buildPhase = ''
              yarn run build
            '';

            installPhase = ''
              cp -r dist $out
            '';

            distPhase = "true";
          });
        };

        devShells = rec {
          default = accentor-web;
          accentor-web = pkgs.devshell.mkShell {
            name = "Accentor Web";
            packages = with pkgs; [
              nixpkgs-fmt
              yarn2nix
              (yarn.override { nodejs = nodejs_22; })
            ];
          };
        };
      }
    );
}
