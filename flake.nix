{
  description = "Accentor Web";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = inputs: {
    packages = builtins.mapAttrs (system: pkgs: {
      accentor-web = pkgs.callPackage ./default.nix { };
      default = inputs.self.packages.${system}.accentor-web;
    }) inputs.nixpkgs.legacyPackages;
    overlays.default = (
      self: super: {
        accentor-web = self.callPackage ./default.nix { };
      }
    );
  };
}
