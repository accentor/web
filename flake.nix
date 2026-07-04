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
      in
      {
        packages = rec {
          default = accentor-web;
          accentor-web = pkgs.buildNpmPackage {
            inherit pname version;
            src = pkgs.lib.cleanSourceWith { filter = name: type: !(builtins.elem name [ ".github" "flake.lock" "flake.nix" ]); src = ./.; name = "${pname}-${version}-source"; };

            npmConfigHook = pkgs.importNpmLock.npmConfigHook;
            npmDeps = pkgs.importNpmLock {
              npmRoot = ./.;
            };
            # npmFlags = [ "--legacy-peer-deps" ];

            installPhase = ''
              cp -r dist $out
            '';
          };
        };

        devShells = rec {
          default = accentor-web;
          accentor-web = pkgs.devshell.mkShell {
            name = "Accentor Web";
            packages = with pkgs; [
              nixpkgs-fmt
              nodejs_22
            ];
            commands = [];
          };
        };
      }
    );
}
