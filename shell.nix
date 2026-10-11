{ devshell
, nixpkgs-fmt
, nodejs_24
, vue-language-server
}:

devshell.mkShell {
  name = "Accentor Web";
  packages = [ nixpkgs-fmt nodejs_24 vue-language-server ];
}
