{
  devshell,
  nixfmt,
  accentor-web,
}:

devshell.mkShell {
  name = "Accentor Web";
  packages = [
    nixfmt
    accentor-web.nodejs
  ];
}
