{
  description = "Accentor Web";

  inputs = {
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = inputs:
    {
      packages = builtins.mapAttrs
        (system: pkgs: {
          accentor-web = pkgs.callPackage ./default.nix { };
          default = inputs.self.packages.${system}.accentor-web;
        })
        inputs.nixpkgs.legacyPackages;
      devShells = builtins.mapAttrs
        (system: pkgs':
          let
            pkgs = pkgs'.extend inputs.devshell.overlays.default;
          in
          {
            accentor-web = pkgs.callPackage ./shell.nix { };
            default = inputs.self.devShells.${system}.accentor-web;
          }
        )
        inputs.nixpkgs.legacyPackages;
    };
}
