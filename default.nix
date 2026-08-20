{ buildNpmPackage
, lib
, importNpmLock
}:

let
  rootFiles = lib.fileset.fileFilter (file: builtins.elem file.name [ ".browserlistrc" ".env" "env.d.ts" "eslint.config.ts" "index.html" "package.json" "package-lock.json" "tsconfig.json" "vite.config.ts" ]) ./.;
  srcFiles = lib.fileset.unions [ rootFiles ./src ./scss ./public ];
  src = lib.fileset.toSource { root = ./.; fileset = srcFiles; };
in
buildNpmPackage {
  inherit src;
  pname = "accentor-web";
  version = (lib.importJSON ./package.json).version;
  npmConfigHook = importNpmLock.npmConfigHook;
  npmDeps = importNpmLock {
    npmRoot = src;
  };

  installPhase = ''
    cp -r dist $out
  '';
}
