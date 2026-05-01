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
          accentor-web = pkgs.stdenv.mkDerivation (finalAttrs: {
            inherit pname version;
            src = pkgs.lib.cleanSourceWith { filter = name: type: !(builtins.elem name [ ".github" "flake.lock" "flake.nix" ]); src = ./.; name = "${pname}-${version}-source"; };
            yarnOfflineCache = pkgs.fetchYarnDeps {
              yarnLock = ./yarn.lock;
              hash = builtins.readFile ./yarn.lock.hash;
            };

            nativeBuildInputs = [
              pkgs.yarnConfigHook
              pkgs.yarnBuildHook
              pkgs.yarnInstallHook
              pkgs.nodejs_22
            ];

            installPhase = ''
              cp -r dist $out
            '';
          });
        };

        devShells = rec {
          default = accentor-web;
          accentor-web = pkgs.devshell.mkShell {
            name = "Accentor Web";
            packages = with pkgs; [
              nixpkgs-fmt
              prefetch-yarn-deps
              (yarn.override { nodejs = nodejs_22; })
            ];
            commands = [
              {
                name = "hash-yarn-lock";
                category = "[general commands]";
                help = "Update nix hash of yarn.lock";
                command = "nix-hash --type sha256 --to-sri $(prefetch-yarn-deps 2>/dev/null) > yarn.lock.hash";
              }
            ];
          };
        };
      }
    );
}
