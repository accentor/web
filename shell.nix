{ devshell
, nixpkgs-fmt
, nodejs_24
}:

devshell.mkShell {
  name = "Accentor Web";
  packages = [ nixpkgs-fmt nodejs_24 ];
}
