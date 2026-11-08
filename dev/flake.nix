{
  description = "Accentor Web development";

  inputs = {
    super = {
      url = "../";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs: {
    devShells = builtins.mapAttrs (
      system: pkgs':
      let
        pkgs = pkgs'.appendOverlays [
          inputs.devshell.overlays.default
          inputs.super.overlays.default
        ];
      in
      {
        accentor-web = pkgs.callPackage ./shell.nix { };
        default = inputs.self.devShells.${system}.accentor-web;
      }
    ) inputs.nixpkgs.legacyPackages;
  };
}
