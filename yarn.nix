{ fetchurl, fetchgit, linkFarm, runCommand, gnutar }: rec {
  offline_cache = linkFarm "offline" packages;
  packages = [
    {
      name = "_accentor_api_client_js___api_client_js_0.23.6.tgz";
      path = fetchurl {
        name = "_accentor_api_client_js___api_client_js_0.23.6.tgz";
        url  = "https://registry.yarnpkg.com/@accentor/api-client-js/-/api-client-js-0.23.6.tgz";
        sha512 = "JfudDg9llwLGS3ORKUSMcKKIlGediIVmxvJpLt58kNxvfHYI5PNFDwxNylzXqsmd7Yo+mqaL/CpwHt7Al4m2hg==";
      };
    }
    {
      name = "_babel_code_frame___code_frame_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_code_frame___code_frame_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.28.6.tgz";
        sha512 = "JYgintcMjRiCvS8mMECzaEn+m3PfoQiyqukOMCCVQtoJGYJw8j/8LBJEiqkHLkfwCcs74E3pbAUFNg7d9VNJ+Q==";
      };
    }
    {
      name = "_babel_compat_data___compat_data_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_compat_data___compat_data_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/compat-data/-/compat-data-7.28.6.tgz";
        sha512 = "2lfu57JtzctfIrcGMz992hyLlByuzgIk58+hhGCxjKZ3rWI82NnVLjXcaTqkI2NvlcvOskZaiZ5kjUALo3Lpxg==";
      };
    }
    {
      name = "_babel_core___core_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_core___core_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/core/-/core-7.28.6.tgz";
        sha512 = "H3mcG6ZDLTlYfaSNi0iOKkigqMFvkTKlGUYlD8GW7nNOYRrevuA46iTypPyv+06V3fEmvvazfntkBU34L0azAw==";
      };
    }
    {
      name = "_babel_generator___generator_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_generator___generator_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/generator/-/generator-7.28.6.tgz";
        sha512 = "lOoVRwADj8hjf7al89tvQ2a1lf53Z+7tiXMgpZJL3maQPDxh0DgLMN62B2MKUOFcoodBHLMbDM6WAbKgNy5Suw==";
      };
    }
    {
      name = "_babel_helper_annotate_as_pure___helper_annotate_as_pure_7.27.3.tgz";
      path = fetchurl {
        name = "_babel_helper_annotate_as_pure___helper_annotate_as_pure_7.27.3.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.27.3.tgz";
        sha512 = "fXSwMQqitTGeHLBC08Eq5yXz2m37E4pJX1qAU1+2cNedz/ifv/bVXft90VeSav5nFO61EcNgwr0aJxbyPaWBPg==";
      };
    }
    {
      name = "_babel_helper_compilation_targets___helper_compilation_targets_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helper_compilation_targets___helper_compilation_targets_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz";
        sha512 = "JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==";
      };
    }
    {
      name = "_babel_helper_create_class_features_plugin___helper_create_class_features_plugin_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helper_create_class_features_plugin___helper_create_class_features_plugin_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.28.6.tgz";
        sha512 = "dTOdvsjnG3xNT9Y0AUg1wAl38y+4Rl4sf9caSQZOXdNqVn+H+HbbJ4IyyHaIqNR6SW9oJpA/RuRjsjCw2IdIow==";
      };
    }
    {
      name = "_babel_helper_globals___helper_globals_7.28.0.tgz";
      path = fetchurl {
        name = "_babel_helper_globals___helper_globals_7.28.0.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-globals/-/helper-globals-7.28.0.tgz";
        sha512 = "+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==";
      };
    }
    {
      name = "_babel_helper_member_expression_to_functions___helper_member_expression_to_functions_7.28.5.tgz";
      path = fetchurl {
        name = "_babel_helper_member_expression_to_functions___helper_member_expression_to_functions_7.28.5.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.28.5.tgz";
        sha512 = "cwM7SBRZcPCLgl8a7cY0soT1SptSzAlMH39vwiRpOQkJlh53r5hdHwLSCZpQdVLT39sZt+CRpNwYG4Y2v77atg==";
      };
    }
    {
      name = "_babel_helper_module_imports___helper_module_imports_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helper_module_imports___helper_module_imports_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz";
        sha512 = "l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==";
      };
    }
    {
      name = "_babel_helper_module_transforms___helper_module_transforms_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helper_module_transforms___helper_module_transforms_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz";
        sha512 = "67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==";
      };
    }
    {
      name = "_babel_helper_optimise_call_expression___helper_optimise_call_expression_7.27.1.tgz";
      path = fetchurl {
        name = "_babel_helper_optimise_call_expression___helper_optimise_call_expression_7.27.1.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.27.1.tgz";
        sha512 = "URMGH08NzYFhubNSGJrpUEphGKQwMQYBySzat5cAByY1/YgIRkULnIy3tAMeszlL/so2HbeilYloUmSpd7GdVw==";
      };
    }
    {
      name = "_babel_helper_plugin_utils___helper_plugin_utils_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helper_plugin_utils___helper_plugin_utils_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz";
        sha512 = "S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==";
      };
    }
    {
      name = "_babel_helper_replace_supers___helper_replace_supers_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helper_replace_supers___helper_replace_supers_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-replace-supers/-/helper-replace-supers-7.28.6.tgz";
        sha512 = "mq8e+laIk94/yFec3DxSjCRD2Z0TAjhVbEJY3UQrlwVo15Lmt7C2wAUbK4bjnTs4APkwsYLTahXRraQXhb1WCg==";
      };
    }
    {
      name = "_babel_helper_skip_transparent_expression_wrappers___helper_skip_transparent_expression_wrappers_7.27.1.tgz";
      path = fetchurl {
        name = "_babel_helper_skip_transparent_expression_wrappers___helper_skip_transparent_expression_wrappers_7.27.1.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.27.1.tgz";
        sha512 = "Tub4ZKEXqbPjXgWLl2+3JpQAYBJ8+ikpQ2Ocj/q/r0LwE3UhENh7EUabyHjz2kCEsrRY83ew2DQdHluuiDQFzg==";
      };
    }
    {
      name = "_babel_helper_string_parser___helper_string_parser_7.27.1.tgz";
      path = fetchurl {
        name = "_babel_helper_string_parser___helper_string_parser_7.27.1.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz";
        sha512 = "qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==";
      };
    }
    {
      name = "_babel_helper_validator_identifier___helper_validator_identifier_7.28.5.tgz";
      path = fetchurl {
        name = "_babel_helper_validator_identifier___helper_validator_identifier_7.28.5.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz";
        sha512 = "qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==";
      };
    }
    {
      name = "_babel_helper_validator_option___helper_validator_option_7.27.1.tgz";
      path = fetchurl {
        name = "_babel_helper_validator_option___helper_validator_option_7.27.1.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz";
        sha512 = "YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==";
      };
    }
    {
      name = "_babel_helpers___helpers_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_helpers___helpers_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helpers/-/helpers-7.28.6.tgz";
        sha512 = "xOBvwq86HHdB7WUDTfKfT/Vuxh7gElQ+Sfti2Cy6yIWNW05P8iUslOVcZ4/sKbE+/jQaukQAdz/gf3724kYdqw==";
      };
    }
    {
      name = "_babel_parser___parser_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_parser___parser_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/parser/-/parser-7.28.6.tgz";
        sha512 = "TeR9zWR18BvbfPmGbLampPMW+uW1NZnJlRuuHso8i87QZNq2JRF9i6RgxRqtEq+wQGsS19NNTWr2duhnE49mfQ==";
      };
    }
    {
      name = "_babel_plugin_proposal_decorators___plugin_proposal_decorators_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_plugin_proposal_decorators___plugin_proposal_decorators_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-proposal-decorators/-/plugin-proposal-decorators-7.28.6.tgz";
        sha512 = "RVdFPPyY9fCRAX68haPmOk2iyKW8PKJFthmm8NeSI3paNxKWGZIn99+VbIf0FrtCpFnPgnpF/L48tadi617ULg==";
      };
    }
    {
      name = "_babel_plugin_syntax_decorators___plugin_syntax_decorators_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_plugin_syntax_decorators___plugin_syntax_decorators_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-syntax-decorators/-/plugin-syntax-decorators-7.28.6.tgz";
        sha512 = "71EYI0ONURHJBL4rSFXnITXqXrrY8q4P0q006DPfN+Rk+ASM+++IBXem/ruokgBZR8YNEWZ8R6B+rCb8VcUTqA==";
      };
    }
    {
      name = "_babel_plugin_syntax_import_attributes___plugin_syntax_import_attributes_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_plugin_syntax_import_attributes___plugin_syntax_import_attributes_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-syntax-import-attributes/-/plugin-syntax-import-attributes-7.28.6.tgz";
        sha512 = "jiLC0ma9XkQT3TKJ9uYvlakm66Pamywo+qwL+oL8HJOvc6TWdZXVfhqJr8CCzbSGUAbDOzlGHJC1U+vRfLQDvw==";
      };
    }
    {
      name = "_babel_plugin_syntax_import_meta___plugin_syntax_import_meta_7.10.4.tgz";
      path = fetchurl {
        name = "_babel_plugin_syntax_import_meta___plugin_syntax_import_meta_7.10.4.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-syntax-import-meta/-/plugin-syntax-import-meta-7.10.4.tgz";
        sha512 = "Yqfm+XDx0+Prh3VSeEQCPU81yC+JWZ2pDPFSS4ZdpfZhp4MkFMaDC1UqseovEKwSUpnIL7+vK+Clp7bfh0iD7g==";
      };
    }
    {
      name = "_babel_plugin_syntax_jsx___plugin_syntax_jsx_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_plugin_syntax_jsx___plugin_syntax_jsx_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.28.6.tgz";
        sha512 = "wgEmr06G6sIpqr8YDwA2dSRTE3bJ+V0IfpzfSY3Lfgd7YWOaAdlykvJi13ZKBt8cZHfgH1IXN+CL656W3uUa4w==";
      };
    }
    {
      name = "_babel_plugin_syntax_typescript___plugin_syntax_typescript_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_plugin_syntax_typescript___plugin_syntax_typescript_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-syntax-typescript/-/plugin-syntax-typescript-7.28.6.tgz";
        sha512 = "+nDNmQye7nlnuuHDboPbGm00Vqg3oO8niRRL27/4LYHUsHYh0zJ1xWOz0uRwNFmM1Avzk8wZbc6rdiYhomzv/A==";
      };
    }
    {
      name = "_babel_plugin_transform_typescript___plugin_transform_typescript_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_plugin_transform_typescript___plugin_transform_typescript_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/plugin-transform-typescript/-/plugin-transform-typescript-7.28.6.tgz";
        sha512 = "0YWL2RFxOqEm9Efk5PvreamxPME8OyY0wM5wh5lHjF+VtVhdneCWGzZeSqzOfiobVqQaNCd2z0tQvnI9DaPWPw==";
      };
    }
    {
      name = "_babel_template___template_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_template___template_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/template/-/template-7.28.6.tgz";
        sha512 = "YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==";
      };
    }
    {
      name = "_babel_traverse___traverse_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_traverse___traverse_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.28.6.tgz";
        sha512 = "fgWX62k02qtjqdSNTAGxmKYY/7FSL9WAS1o2Hu5+I5m9T0yxZzr4cnrfXQ/MX0rIifthCSs6FKTlzYbJcPtMNg==";
      };
    }
    {
      name = "_babel_types___types_7.28.6.tgz";
      path = fetchurl {
        name = "_babel_types___types_7.28.6.tgz";
        url  = "https://registry.yarnpkg.com/@babel/types/-/types-7.28.6.tgz";
        sha512 = "0ZrskXVEHSWIqZM/sQZ4EV3jZJXRkio/WCxaqKZP1g//CEWEPSfeZFcms4XeKBCHU0ZKnIkdJeU/kF+eRp5lBg==";
      };
    }
    {
      name = "_esbuild_aix_ppc64___aix_ppc64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_aix_ppc64___aix_ppc64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/aix-ppc64/-/aix-ppc64-0.27.2.tgz";
        sha512 = "GZMB+a0mOMZs4MpDbj8RJp4cw+w1WV5NYD6xzgvzUJ5Ek2jerwfO2eADyI6ExDSUED+1X8aMbegahsJi+8mgpw==";
      };
    }
    {
      name = "_esbuild_android_arm64___android_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_android_arm64___android_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/android-arm64/-/android-arm64-0.27.2.tgz";
        sha512 = "pvz8ZZ7ot/RBphf8fv60ljmaoydPU12VuXHImtAs0XhLLw+EXBi2BLe3OYSBslR4rryHvweW5gmkKFwTiFy6KA==";
      };
    }
    {
      name = "_esbuild_android_arm___android_arm_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_android_arm___android_arm_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/android-arm/-/android-arm-0.27.2.tgz";
        sha512 = "DVNI8jlPa7Ujbr1yjU2PfUSRtAUZPG9I1RwW4F4xFB1Imiu2on0ADiI/c3td+KmDtVKNbi+nffGDQMfcIMkwIA==";
      };
    }
    {
      name = "_esbuild_android_x64___android_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_android_x64___android_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/android-x64/-/android-x64-0.27.2.tgz";
        sha512 = "z8Ank4Byh4TJJOh4wpz8g2vDy75zFL0TlZlkUkEwYXuPSgX8yzep596n6mT7905kA9uHZsf/o2OJZubl2l3M7A==";
      };
    }
    {
      name = "_esbuild_darwin_arm64___darwin_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_darwin_arm64___darwin_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/darwin-arm64/-/darwin-arm64-0.27.2.tgz";
        sha512 = "davCD2Zc80nzDVRwXTcQP/28fiJbcOwvdolL0sOiOsbwBa72kegmVU0Wrh1MYrbuCL98Omp5dVhQFWRKR2ZAlg==";
      };
    }
    {
      name = "_esbuild_darwin_x64___darwin_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_darwin_x64___darwin_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/darwin-x64/-/darwin-x64-0.27.2.tgz";
        sha512 = "ZxtijOmlQCBWGwbVmwOF/UCzuGIbUkqB1faQRf5akQmxRJ1ujusWsb3CVfk/9iZKr2L5SMU5wPBi1UWbvL+VQA==";
      };
    }
    {
      name = "_esbuild_freebsd_arm64___freebsd_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_freebsd_arm64___freebsd_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.2.tgz";
        sha512 = "lS/9CN+rgqQ9czogxlMcBMGd+l8Q3Nj1MFQwBZJyoEKI50XGxwuzznYdwcav6lpOGv5BqaZXqvBSiB/kJ5op+g==";
      };
    }
    {
      name = "_esbuild_freebsd_x64___freebsd_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_freebsd_x64___freebsd_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/freebsd-x64/-/freebsd-x64-0.27.2.tgz";
        sha512 = "tAfqtNYb4YgPnJlEFu4c212HYjQWSO/w/h/lQaBK7RbwGIkBOuNKQI9tqWzx7Wtp7bTPaGC6MJvWI608P3wXYA==";
      };
    }
    {
      name = "_esbuild_linux_arm64___linux_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_arm64___linux_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-arm64/-/linux-arm64-0.27.2.tgz";
        sha512 = "hYxN8pr66NsCCiRFkHUAsxylNOcAQaxSSkHMMjcpx0si13t1LHFphxJZUiGwojB1a/Hd5OiPIqDdXONia6bhTw==";
      };
    }
    {
      name = "_esbuild_linux_arm___linux_arm_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_arm___linux_arm_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-arm/-/linux-arm-0.27.2.tgz";
        sha512 = "vWfq4GaIMP9AIe4yj1ZUW18RDhx6EPQKjwe7n8BbIecFtCQG4CfHGaHuh7fdfq+y3LIA2vGS/o9ZBGVxIDi9hw==";
      };
    }
    {
      name = "_esbuild_linux_ia32___linux_ia32_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_ia32___linux_ia32_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-ia32/-/linux-ia32-0.27.2.tgz";
        sha512 = "MJt5BRRSScPDwG2hLelYhAAKh9imjHK5+NE/tvnRLbIqUWa+0E9N4WNMjmp/kXXPHZGqPLxggwVhz7QP8CTR8w==";
      };
    }
    {
      name = "_esbuild_linux_loong64___linux_loong64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_loong64___linux_loong64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-loong64/-/linux-loong64-0.27.2.tgz";
        sha512 = "lugyF1atnAT463aO6KPshVCJK5NgRnU4yb3FUumyVz+cGvZbontBgzeGFO1nF+dPueHD367a2ZXe1NtUkAjOtg==";
      };
    }
    {
      name = "_esbuild_linux_mips64el___linux_mips64el_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_mips64el___linux_mips64el_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-mips64el/-/linux-mips64el-0.27.2.tgz";
        sha512 = "nlP2I6ArEBewvJ2gjrrkESEZkB5mIoaTswuqNFRv/WYd+ATtUpe9Y09RnJvgvdag7he0OWgEZWhviS1OTOKixw==";
      };
    }
    {
      name = "_esbuild_linux_ppc64___linux_ppc64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_ppc64___linux_ppc64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-ppc64/-/linux-ppc64-0.27.2.tgz";
        sha512 = "C92gnpey7tUQONqg1n6dKVbx3vphKtTHJaNG2Ok9lGwbZil6DrfyecMsp9CrmXGQJmZ7iiVXvvZH6Ml5hL6XdQ==";
      };
    }
    {
      name = "_esbuild_linux_riscv64___linux_riscv64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_riscv64___linux_riscv64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-riscv64/-/linux-riscv64-0.27.2.tgz";
        sha512 = "B5BOmojNtUyN8AXlK0QJyvjEZkWwy/FKvakkTDCziX95AowLZKR6aCDhG7LeF7uMCXEJqwa8Bejz5LTPYm8AvA==";
      };
    }
    {
      name = "_esbuild_linux_s390x___linux_s390x_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_s390x___linux_s390x_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-s390x/-/linux-s390x-0.27.2.tgz";
        sha512 = "p4bm9+wsPwup5Z8f4EpfN63qNagQ47Ua2znaqGH6bqLlmJ4bx97Y9JdqxgGZ6Y8xVTixUnEkoKSHcpRlDnNr5w==";
      };
    }
    {
      name = "_esbuild_linux_x64___linux_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_linux_x64___linux_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/linux-x64/-/linux-x64-0.27.2.tgz";
        sha512 = "uwp2Tip5aPmH+NRUwTcfLb+W32WXjpFejTIOWZFw/v7/KnpCDKG66u4DLcurQpiYTiYwQ9B7KOeMJvLCu/OvbA==";
      };
    }
    {
      name = "_esbuild_netbsd_arm64___netbsd_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_netbsd_arm64___netbsd_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/netbsd-arm64/-/netbsd-arm64-0.27.2.tgz";
        sha512 = "Kj6DiBlwXrPsCRDeRvGAUb/LNrBASrfqAIok+xB0LxK8CHqxZ037viF13ugfsIpePH93mX7xfJp97cyDuTZ3cw==";
      };
    }
    {
      name = "_esbuild_netbsd_x64___netbsd_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_netbsd_x64___netbsd_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/netbsd-x64/-/netbsd-x64-0.27.2.tgz";
        sha512 = "HwGDZ0VLVBY3Y+Nw0JexZy9o/nUAWq9MlV7cahpaXKW6TOzfVno3y3/M8Ga8u8Yr7GldLOov27xiCnqRZf0tCA==";
      };
    }
    {
      name = "_esbuild_openbsd_arm64___openbsd_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_openbsd_arm64___openbsd_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/openbsd-arm64/-/openbsd-arm64-0.27.2.tgz";
        sha512 = "DNIHH2BPQ5551A7oSHD0CKbwIA/Ox7+78/AWkbS5QoRzaqlev2uFayfSxq68EkonB+IKjiuxBFoV8ESJy8bOHA==";
      };
    }
    {
      name = "_esbuild_openbsd_x64___openbsd_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_openbsd_x64___openbsd_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/openbsd-x64/-/openbsd-x64-0.27.2.tgz";
        sha512 = "/it7w9Nb7+0KFIzjalNJVR5bOzA9Vay+yIPLVHfIQYG/j+j9VTH84aNB8ExGKPU4AzfaEvN9/V4HV+F+vo8OEg==";
      };
    }
    {
      name = "_esbuild_openharmony_arm64___openharmony_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_openharmony_arm64___openharmony_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/openharmony-arm64/-/openharmony-arm64-0.27.2.tgz";
        sha512 = "LRBbCmiU51IXfeXk59csuX/aSaToeG7w48nMwA6049Y4J4+VbWALAuXcs+qcD04rHDuSCSRKdmY63sruDS5qag==";
      };
    }
    {
      name = "_esbuild_sunos_x64___sunos_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_sunos_x64___sunos_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/sunos-x64/-/sunos-x64-0.27.2.tgz";
        sha512 = "kMtx1yqJHTmqaqHPAzKCAkDaKsffmXkPHThSfRwZGyuqyIeBvf08KSsYXl+abf5HDAPMJIPnbBfXvP2ZC2TfHg==";
      };
    }
    {
      name = "_esbuild_win32_arm64___win32_arm64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_win32_arm64___win32_arm64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/win32-arm64/-/win32-arm64-0.27.2.tgz";
        sha512 = "Yaf78O/B3Kkh+nKABUF++bvJv5Ijoy9AN1ww904rOXZFLWVc5OLOfL56W+C8F9xn5JQZa3UX6m+IktJnIb1Jjg==";
      };
    }
    {
      name = "_esbuild_win32_ia32___win32_ia32_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_win32_ia32___win32_ia32_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/win32-ia32/-/win32-ia32-0.27.2.tgz";
        sha512 = "Iuws0kxo4yusk7sw70Xa2E2imZU5HoixzxfGCdxwBdhiDgt9vX9VUCBhqcwY7/uh//78A1hMkkROMJq9l27oLQ==";
      };
    }
    {
      name = "_esbuild_win32_x64___win32_x64_0.27.2.tgz";
      path = fetchurl {
        name = "_esbuild_win32_x64___win32_x64_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/@esbuild/win32-x64/-/win32-x64-0.27.2.tgz";
        sha512 = "sRdU18mcKf7F+YgheI/zGf5alZatMUTKj/jNS6l744f9u3WFu4v7twcUI9vu4mknF4Y9aDlblIie0IM+5xxaqQ==";
      };
    }
    {
      name = "_eslint_community_eslint_utils___eslint_utils_4.9.1.tgz";
      path = fetchurl {
        name = "_eslint_community_eslint_utils___eslint_utils_4.9.1.tgz";
        url  = "https://registry.yarnpkg.com/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz";
        sha512 = "phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==";
      };
    }
    {
      name = "_eslint_community_regexpp___regexpp_4.12.2.tgz";
      path = fetchurl {
        name = "_eslint_community_regexpp___regexpp_4.12.2.tgz";
        url  = "https://registry.yarnpkg.com/@eslint-community/regexpp/-/regexpp-4.12.2.tgz";
        sha512 = "EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==";
      };
    }
    {
      name = "_eslint_config_array___config_array_0.21.1.tgz";
      path = fetchurl {
        name = "_eslint_config_array___config_array_0.21.1.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/config-array/-/config-array-0.21.1.tgz";
        sha512 = "aw1gNayWpdI/jSYVgzN5pL0cfzU02GT3NBpeT/DXbx1/1x7ZKxFPd9bwrzygx/qiwIQiJ1sw/zD8qY/kRvlGHA==";
      };
    }
    {
      name = "_eslint_config_helpers___config_helpers_0.4.2.tgz";
      path = fetchurl {
        name = "_eslint_config_helpers___config_helpers_0.4.2.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/config-helpers/-/config-helpers-0.4.2.tgz";
        sha512 = "gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==";
      };
    }
    {
      name = "_eslint_core___core_0.17.0.tgz";
      path = fetchurl {
        name = "_eslint_core___core_0.17.0.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/core/-/core-0.17.0.tgz";
        sha512 = "yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==";
      };
    }
    {
      name = "_eslint_eslintrc___eslintrc_3.3.3.tgz";
      path = fetchurl {
        name = "_eslint_eslintrc___eslintrc_3.3.3.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/eslintrc/-/eslintrc-3.3.3.tgz";
        sha512 = "Kr+LPIUVKz2qkx1HAMH8q1q6azbqBAsXJUxBl/ODDuVPX45Z9DfwB8tPjTi6nNZ8BuM3nbJxC5zCAg5elnBUTQ==";
      };
    }
    {
      name = "_eslint_js___js_9.39.2.tgz";
      path = fetchurl {
        name = "_eslint_js___js_9.39.2.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/js/-/js-9.39.2.tgz";
        sha512 = "q1mjIoW1VX4IvSocvM/vbTiveKC4k9eLrajNEuSsmjymSDEbpGddtpfOoN7YGAqBK3NG+uqo8ia4PDTt8buCYA==";
      };
    }
    {
      name = "_eslint_object_schema___object_schema_2.1.7.tgz";
      path = fetchurl {
        name = "_eslint_object_schema___object_schema_2.1.7.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/object-schema/-/object-schema-2.1.7.tgz";
        sha512 = "VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==";
      };
    }
    {
      name = "_eslint_plugin_kit___plugin_kit_0.4.1.tgz";
      path = fetchurl {
        name = "_eslint_plugin_kit___plugin_kit_0.4.1.tgz";
        url  = "https://registry.yarnpkg.com/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz";
        sha512 = "43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==";
      };
    }
    {
      name = "_humanfs_core___core_0.19.1.tgz";
      path = fetchurl {
        name = "_humanfs_core___core_0.19.1.tgz";
        url  = "https://registry.yarnpkg.com/@humanfs/core/-/core-0.19.1.tgz";
        sha512 = "5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==";
      };
    }
    {
      name = "_humanfs_node___node_0.16.7.tgz";
      path = fetchurl {
        name = "_humanfs_node___node_0.16.7.tgz";
        url  = "https://registry.yarnpkg.com/@humanfs/node/-/node-0.16.7.tgz";
        sha512 = "/zUx+yOsIrG4Y43Eh2peDeKCxlRt/gET6aHfaKpuq267qXdYDFViVHfMaLyygZOnl0kGWxFIgsBy8QFuTLUXEQ==";
      };
    }
    {
      name = "_humanwhocodes_module_importer___module_importer_1.0.1.tgz";
      path = fetchurl {
        name = "_humanwhocodes_module_importer___module_importer_1.0.1.tgz";
        url  = "https://registry.yarnpkg.com/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz";
        sha512 = "bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==";
      };
    }
    {
      name = "_humanwhocodes_retry___retry_0.4.3.tgz";
      path = fetchurl {
        name = "_humanwhocodes_retry___retry_0.4.3.tgz";
        url  = "https://registry.yarnpkg.com/@humanwhocodes/retry/-/retry-0.4.3.tgz";
        sha512 = "bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==";
      };
    }
    {
      name = "_intlify_core_base___core_base_11.2.8.tgz";
      path = fetchurl {
        name = "_intlify_core_base___core_base_11.2.8.tgz";
        url  = "https://registry.yarnpkg.com/@intlify/core-base/-/core-base-11.2.8.tgz";
        sha512 = "nBq6Y1tVkjIUsLsdOjDSJj4AsjvD0UG3zsg9Fyc+OivwlA/oMHSKooUy9tpKj0HqZ+NWFifweHavdljlBLTwdA==";
      };
    }
    {
      name = "_intlify_message_compiler___message_compiler_11.2.8.tgz";
      path = fetchurl {
        name = "_intlify_message_compiler___message_compiler_11.2.8.tgz";
        url  = "https://registry.yarnpkg.com/@intlify/message-compiler/-/message-compiler-11.2.8.tgz";
        sha512 = "A5n33doOjmHsBtCN421386cG1tWp5rpOjOYPNsnpjIJbQ4POF0QY2ezhZR9kr0boKwaHjbOifvyQvHj2UTrDFQ==";
      };
    }
    {
      name = "_intlify_shared___shared_11.2.8.tgz";
      path = fetchurl {
        name = "_intlify_shared___shared_11.2.8.tgz";
        url  = "https://registry.yarnpkg.com/@intlify/shared/-/shared-11.2.8.tgz";
        sha512 = "l6e4NZyUgv8VyXXH4DbuucFOBmxLF56C/mqh2tvApbzl2Hrhi1aTDcuv5TKdxzfHYmpO3UB0Cz04fgDT9vszfw==";
      };
    }
    {
      name = "_jridgewell_gen_mapping___gen_mapping_0.3.13.tgz";
      path = fetchurl {
        name = "_jridgewell_gen_mapping___gen_mapping_0.3.13.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz";
        sha512 = "2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==";
      };
    }
    {
      name = "_jridgewell_remapping___remapping_2.3.5.tgz";
      path = fetchurl {
        name = "_jridgewell_remapping___remapping_2.3.5.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/remapping/-/remapping-2.3.5.tgz";
        sha512 = "LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==";
      };
    }
    {
      name = "_jridgewell_resolve_uri___resolve_uri_3.1.2.tgz";
      path = fetchurl {
        name = "_jridgewell_resolve_uri___resolve_uri_3.1.2.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz";
        sha512 = "bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==";
      };
    }
    {
      name = "_jridgewell_sourcemap_codec___sourcemap_codec_1.5.5.tgz";
      path = fetchurl {
        name = "_jridgewell_sourcemap_codec___sourcemap_codec_1.5.5.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz";
        sha512 = "cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==";
      };
    }
    {
      name = "_jridgewell_trace_mapping___trace_mapping_0.3.31.tgz";
      path = fetchurl {
        name = "_jridgewell_trace_mapping___trace_mapping_0.3.31.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz";
        sha512 = "zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==";
      };
    }
    {
      name = "_mdi_font___font_7.4.47.tgz";
      path = fetchurl {
        name = "_mdi_font___font_7.4.47.tgz";
        url  = "https://registry.yarnpkg.com/@mdi/font/-/font-7.4.47.tgz";
        sha512 = "43MtGpd585SNzHZPcYowu/84Vz2a2g31TvPMTm9uTiCSWzaheQySUcSyUH/46fPnuPQWof2yd0pGBtzee/IQWw==";
      };
    }
    {
      name = "_mdi_svg___svg_7.4.47.tgz";
      path = fetchurl {
        name = "_mdi_svg___svg_7.4.47.tgz";
        url  = "https://registry.yarnpkg.com/@mdi/svg/-/svg-7.4.47.tgz";
        sha512 = "WQ2gDll12T9WD34fdRFgQVgO8bag3gavrAgJ0frN4phlwdJARpE6gO1YvLEMJR0KKgoc+/Ea/A0Pp11I00xBvw==";
      };
    }
    {
      name = "_nodelib_fs.scandir___fs.scandir_2.1.5.tgz";
      path = fetchurl {
        name = "_nodelib_fs.scandir___fs.scandir_2.1.5.tgz";
        url  = "https://registry.yarnpkg.com/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz";
        sha512 = "vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==";
      };
    }
    {
      name = "_nodelib_fs.stat___fs.stat_2.0.5.tgz";
      path = fetchurl {
        name = "_nodelib_fs.stat___fs.stat_2.0.5.tgz";
        url  = "https://registry.yarnpkg.com/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz";
        sha512 = "RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==";
      };
    }
    {
      name = "_nodelib_fs.walk___fs.walk_1.2.8.tgz";
      path = fetchurl {
        name = "_nodelib_fs.walk___fs.walk_1.2.8.tgz";
        url  = "https://registry.yarnpkg.com/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz";
        sha512 = "oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==";
      };
    }
    {
      name = "_parcel_watcher_android_arm64___watcher_android_arm64_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_android_arm64___watcher_android_arm64_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-android-arm64/-/watcher-android-arm64-2.5.6.tgz";
        sha512 = "YQxSS34tPF/6ZG7r/Ih9xy+kP/WwediEUsqmtf0cuCV5TPPKw/PQHRhueUo6JdeFJaqV3pyjm0GdYjZotbRt/A==";
      };
    }
    {
      name = "_parcel_watcher_darwin_arm64___watcher_darwin_arm64_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_darwin_arm64___watcher_darwin_arm64_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-darwin-arm64/-/watcher-darwin-arm64-2.5.6.tgz";
        sha512 = "Z2ZdrnwyXvvvdtRHLmM4knydIdU9adO3D4n/0cVipF3rRiwP+3/sfzpAwA/qKFL6i1ModaabkU7IbpeMBgiVEA==";
      };
    }
    {
      name = "_parcel_watcher_darwin_x64___watcher_darwin_x64_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_darwin_x64___watcher_darwin_x64_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-darwin-x64/-/watcher-darwin-x64-2.5.6.tgz";
        sha512 = "HgvOf3W9dhithcwOWX9uDZyn1lW9R+7tPZ4sug+NGrGIo4Rk1hAXLEbcH1TQSqxts0NYXXlOWqVpvS1SFS4fRg==";
      };
    }
    {
      name = "_parcel_watcher_freebsd_x64___watcher_freebsd_x64_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_freebsd_x64___watcher_freebsd_x64_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-freebsd-x64/-/watcher-freebsd-x64-2.5.6.tgz";
        sha512 = "vJVi8yd/qzJxEKHkeemh7w3YAn6RJCtYlE4HPMoVnCpIXEzSrxErBW5SJBgKLbXU3WdIpkjBTeUNtyBVn8TRng==";
      };
    }
    {
      name = "_parcel_watcher_linux_arm_glibc___watcher_linux_arm_glibc_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_linux_arm_glibc___watcher_linux_arm_glibc_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-linux-arm-glibc/-/watcher-linux-arm-glibc-2.5.6.tgz";
        sha512 = "9JiYfB6h6BgV50CCfasfLf/uvOcJskMSwcdH1PHH9rvS1IrNy8zad6IUVPVUfmXr+u+Km9IxcfMLzgdOudz9EQ==";
      };
    }
    {
      name = "_parcel_watcher_linux_arm_musl___watcher_linux_arm_musl_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_linux_arm_musl___watcher_linux_arm_musl_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-linux-arm-musl/-/watcher-linux-arm-musl-2.5.6.tgz";
        sha512 = "Ve3gUCG57nuUUSyjBq/MAM0CzArtuIOxsBdQ+ftz6ho8n7s1i9E1Nmk/xmP323r2YL0SONs1EuwqBp2u1k5fxg==";
      };
    }
    {
      name = "_parcel_watcher_linux_arm64_glibc___watcher_linux_arm64_glibc_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_linux_arm64_glibc___watcher_linux_arm64_glibc_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-linux-arm64-glibc/-/watcher-linux-arm64-glibc-2.5.6.tgz";
        sha512 = "f2g/DT3NhGPdBmMWYoxixqYr3v/UXcmLOYy16Bx0TM20Tchduwr4EaCbmxh1321TABqPGDpS8D/ggOTaljijOA==";
      };
    }
    {
      name = "_parcel_watcher_linux_arm64_musl___watcher_linux_arm64_musl_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_linux_arm64_musl___watcher_linux_arm64_musl_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-linux-arm64-musl/-/watcher-linux-arm64-musl-2.5.6.tgz";
        sha512 = "qb6naMDGlbCwdhLj6hgoVKJl2odL34z2sqkC7Z6kzir8b5W65WYDpLB6R06KabvZdgoHI/zxke4b3zR0wAbDTA==";
      };
    }
    {
      name = "_parcel_watcher_linux_x64_glibc___watcher_linux_x64_glibc_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_linux_x64_glibc___watcher_linux_x64_glibc_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-linux-x64-glibc/-/watcher-linux-x64-glibc-2.5.6.tgz";
        sha512 = "kbT5wvNQlx7NaGjzPFu8nVIW1rWqV780O7ZtkjuWaPUgpv2NMFpjYERVi0UYj1msZNyCzGlaCWEtzc+exjMGbQ==";
      };
    }
    {
      name = "_parcel_watcher_linux_x64_musl___watcher_linux_x64_musl_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_linux_x64_musl___watcher_linux_x64_musl_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-linux-x64-musl/-/watcher-linux-x64-musl-2.5.6.tgz";
        sha512 = "1JRFeC+h7RdXwldHzTsmdtYR/Ku8SylLgTU/reMuqdVD7CtLwf0VR1FqeprZ0eHQkO0vqsbvFLXUmYm/uNKJBg==";
      };
    }
    {
      name = "_parcel_watcher_win32_arm64___watcher_win32_arm64_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_win32_arm64___watcher_win32_arm64_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-win32-arm64/-/watcher-win32-arm64-2.5.6.tgz";
        sha512 = "3ukyebjc6eGlw9yRt678DxVF7rjXatWiHvTXqphZLvo7aC5NdEgFufVwjFfY51ijYEWpXbqF5jtrK275z52D4Q==";
      };
    }
    {
      name = "_parcel_watcher_win32_ia32___watcher_win32_ia32_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_win32_ia32___watcher_win32_ia32_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-win32-ia32/-/watcher-win32-ia32-2.5.6.tgz";
        sha512 = "k35yLp1ZMwwee3Ez/pxBi5cf4AoBKYXj00CZ80jUz5h8prpiaQsiRPKQMxoLstNuqe2vR4RNPEAEcjEFzhEz/g==";
      };
    }
    {
      name = "_parcel_watcher_win32_x64___watcher_win32_x64_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher_win32_x64___watcher_win32_x64_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher-win32-x64/-/watcher-win32-x64-2.5.6.tgz";
        sha512 = "hbQlYcCq5dlAX9Qx+kFb0FHue6vbjlf0FrNzSKdYK2APUf7tGfGxQCk2ihEREmbR6ZMc0MVAD5RIX/41gpUzTw==";
      };
    }
    {
      name = "_parcel_watcher___watcher_2.5.6.tgz";
      path = fetchurl {
        name = "_parcel_watcher___watcher_2.5.6.tgz";
        url  = "https://registry.yarnpkg.com/@parcel/watcher/-/watcher-2.5.6.tgz";
        sha512 = "tmmZ3lQxAe/k/+rNnXQRawJ4NjxO2hqiOLTHvWchtGZULp4RyFeh6aU4XdOYBFe2KE1oShQTv4AblOs2iOrNnQ==";
      };
    }
    {
      name = "_pkgr_core___core_0.2.9.tgz";
      path = fetchurl {
        name = "_pkgr_core___core_0.2.9.tgz";
        url  = "https://registry.yarnpkg.com/@pkgr/core/-/core-0.2.9.tgz";
        sha512 = "QNqXyfVS2wm9hweSYD2O7F0G06uurj9kZ96TRQE5Y9hU7+tgdZwIkbAKc5Ocy1HxEY2kuDQa6cQ1WRs/O5LFKA==";
      };
    }
    {
      name = "_polka_url___url_1.0.0_next.29.tgz";
      path = fetchurl {
        name = "_polka_url___url_1.0.0_next.29.tgz";
        url  = "https://registry.yarnpkg.com/@polka/url/-/url-1.0.0-next.29.tgz";
        sha512 = "wwQAWhWSuHaag8c4q/KN/vCoeOJYshAIvMQwD4GpSb3OiZklFfvAgmj0VCBBImRpuF/aFgIRzllXlVX93Jevww==";
      };
    }
    {
      name = "_rolldown_pluginutils___pluginutils_1.0.0_beta.53.tgz";
      path = fetchurl {
        name = "_rolldown_pluginutils___pluginutils_1.0.0_beta.53.tgz";
        url  = "https://registry.yarnpkg.com/@rolldown/pluginutils/-/pluginutils-1.0.0-beta.53.tgz";
        sha512 = "vENRlFU4YbrwVqNDZ7fLvy+JR1CRkyr01jhSiDpE1u6py3OMzQfztQU2jxykW3ALNxO4kSlqIDeYyD0Y9RcQeQ==";
      };
    }
    {
      name = "_rollup_rollup_android_arm_eabi___rollup_android_arm_eabi_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_android_arm_eabi___rollup_android_arm_eabi_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.56.0.tgz";
        sha512 = "LNKIPA5k8PF1+jAFomGe3qN3bbIgJe/IlpDBwuVjrDKrJhVWywgnJvflMt/zkbVNLFtF1+94SljYQS6e99klnw==";
      };
    }
    {
      name = "_rollup_rollup_android_arm64___rollup_android_arm64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_android_arm64___rollup_android_arm64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.56.0.tgz";
        sha512 = "lfbVUbelYqXlYiU/HApNMJzT1E87UPGvzveGg2h0ktUNlOCxKlWuJ9jtfvs1sKHdwU4fzY7Pl8sAl49/XaEk6Q==";
      };
    }
    {
      name = "_rollup_rollup_darwin_arm64___rollup_darwin_arm64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_darwin_arm64___rollup_darwin_arm64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.56.0.tgz";
        sha512 = "EgxD1ocWfhoD6xSOeEEwyE7tDvwTgZc8Bss7wCWe+uc7wO8G34HHCUH+Q6cHqJubxIAnQzAsyUsClt0yFLu06w==";
      };
    }
    {
      name = "_rollup_rollup_darwin_x64___rollup_darwin_x64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_darwin_x64___rollup_darwin_x64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.56.0.tgz";
        sha512 = "1vXe1vcMOssb/hOF8iv52A7feWW2xnu+c8BV4t1F//m9QVLTfNVpEdja5ia762j/UEJe2Z1jAmEqZAK42tVW3g==";
      };
    }
    {
      name = "_rollup_rollup_freebsd_arm64___rollup_freebsd_arm64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_freebsd_arm64___rollup_freebsd_arm64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.56.0.tgz";
        sha512 = "bof7fbIlvqsyv/DtaXSck4VYQ9lPtoWNFCB/JY4snlFuJREXfZnm+Ej6yaCHfQvofJDXLDMTVxWscVSuQvVWUQ==";
      };
    }
    {
      name = "_rollup_rollup_freebsd_x64___rollup_freebsd_x64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_freebsd_x64___rollup_freebsd_x64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.56.0.tgz";
        sha512 = "KNa6lYHloW+7lTEkYGa37fpvPq+NKG/EHKM8+G/g9WDU7ls4sMqbVRV78J6LdNuVaeeK5WB9/9VAFbKxcbXKYg==";
      };
    }
    {
      name = "_rollup_rollup_linux_arm_gnueabihf___rollup_linux_arm_gnueabihf_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_arm_gnueabihf___rollup_linux_arm_gnueabihf_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.56.0.tgz";
        sha512 = "E8jKK87uOvLrrLN28jnAAAChNq5LeCd2mGgZF+fGF5D507WlG/Noct3lP/QzQ6MrqJ5BCKNwI9ipADB6jyiq2A==";
      };
    }
    {
      name = "_rollup_rollup_linux_arm_musleabihf___rollup_linux_arm_musleabihf_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_arm_musleabihf___rollup_linux_arm_musleabihf_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.56.0.tgz";
        sha512 = "jQosa5FMYF5Z6prEpTCCmzCXz6eKr/tCBssSmQGEeozA9tkRUty/5Vx06ibaOP9RCrW1Pvb8yp3gvZhHwTDsJw==";
      };
    }
    {
      name = "_rollup_rollup_linux_arm64_gnu___rollup_linux_arm64_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_arm64_gnu___rollup_linux_arm64_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.56.0.tgz";
        sha512 = "uQVoKkrC1KGEV6udrdVahASIsaF8h7iLG0U0W+Xn14ucFwi6uS539PsAr24IEF9/FoDtzMeeJXJIBo5RkbNWvQ==";
      };
    }
    {
      name = "_rollup_rollup_linux_arm64_musl___rollup_linux_arm64_musl_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_arm64_musl___rollup_linux_arm64_musl_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.56.0.tgz";
        sha512 = "vLZ1yJKLxhQLFKTs42RwTwa6zkGln+bnXc8ueFGMYmBTLfNu58sl5/eXyxRa2RarTkJbXl8TKPgfS6V5ijNqEA==";
      };
    }
    {
      name = "_rollup_rollup_linux_loong64_gnu___rollup_linux_loong64_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_loong64_gnu___rollup_linux_loong64_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.56.0.tgz";
        sha512 = "FWfHOCub564kSE3xJQLLIC/hbKqHSVxy8vY75/YHHzWvbJL7aYJkdgwD/xGfUlL5UV2SB7otapLrcCj2xnF1dg==";
      };
    }
    {
      name = "_rollup_rollup_linux_loong64_musl___rollup_linux_loong64_musl_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_loong64_musl___rollup_linux_loong64_musl_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.56.0.tgz";
        sha512 = "z1EkujxIh7nbrKL1lmIpqFTc/sr0u8Uk0zK/qIEFldbt6EDKWFk/pxFq3gYj4Bjn3aa9eEhYRlL3H8ZbPT1xvA==";
      };
    }
    {
      name = "_rollup_rollup_linux_ppc64_gnu___rollup_linux_ppc64_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_ppc64_gnu___rollup_linux_ppc64_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.56.0.tgz";
        sha512 = "iNFTluqgdoQC7AIE8Q34R3AuPrJGJirj5wMUErxj22deOcY7XwZRaqYmB6ZKFHoVGqRcRd0mqO+845jAibKCkw==";
      };
    }
    {
      name = "_rollup_rollup_linux_ppc64_musl___rollup_linux_ppc64_musl_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_ppc64_musl___rollup_linux_ppc64_musl_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.56.0.tgz";
        sha512 = "MtMeFVlD2LIKjp2sE2xM2slq3Zxf9zwVuw0jemsxvh1QOpHSsSzfNOTH9uYW9i1MXFxUSMmLpeVeUzoNOKBaWg==";
      };
    }
    {
      name = "_rollup_rollup_linux_riscv64_gnu___rollup_linux_riscv64_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_riscv64_gnu___rollup_linux_riscv64_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.56.0.tgz";
        sha512 = "in+v6wiHdzzVhYKXIk5U74dEZHdKN9KH0Q4ANHOTvyXPG41bajYRsy7a8TPKbYPl34hU7PP7hMVHRvv/5aCSew==";
      };
    }
    {
      name = "_rollup_rollup_linux_riscv64_musl___rollup_linux_riscv64_musl_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_riscv64_musl___rollup_linux_riscv64_musl_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.56.0.tgz";
        sha512 = "yni2raKHB8m9NQpI9fPVwN754mn6dHQSbDTwxdr9SE0ks38DTjLMMBjrwvB5+mXrX+C0npX0CVeCUcvvvD8CNQ==";
      };
    }
    {
      name = "_rollup_rollup_linux_s390x_gnu___rollup_linux_s390x_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_s390x_gnu___rollup_linux_s390x_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.56.0.tgz";
        sha512 = "zhLLJx9nQPu7wezbxt2ut+CI4YlXi68ndEve16tPc/iwoylWS9B3FxpLS2PkmfYgDQtosah07Mj9E0khc3Y+vQ==";
      };
    }
    {
      name = "_rollup_rollup_linux_x64_gnu___rollup_linux_x64_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_x64_gnu___rollup_linux_x64_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.56.0.tgz";
        sha512 = "MVC6UDp16ZSH7x4rtuJPAEoE1RwS8N4oK9DLHy3FTEdFoUTCFVzMfJl/BVJ330C+hx8FfprA5Wqx4FhZXkj2Kw==";
      };
    }
    {
      name = "_rollup_rollup_linux_x64_musl___rollup_linux_x64_musl_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_linux_x64_musl___rollup_linux_x64_musl_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.56.0.tgz";
        sha512 = "ZhGH1eA4Qv0lxaV00azCIS1ChedK0V32952Md3FtnxSqZTBTd6tgil4nZT5cU8B+SIw3PFYkvyR4FKo2oyZIHA==";
      };
    }
    {
      name = "_rollup_rollup_openbsd_x64___rollup_openbsd_x64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_openbsd_x64___rollup_openbsd_x64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.56.0.tgz";
        sha512 = "O16XcmyDeFI9879pEcmtWvD/2nyxR9mF7Gs44lf1vGGx8Vg2DRNx11aVXBEqOQhWb92WN4z7fW/q4+2NYzCbBA==";
      };
    }
    {
      name = "_rollup_rollup_openharmony_arm64___rollup_openharmony_arm64_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_openharmony_arm64___rollup_openharmony_arm64_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.56.0.tgz";
        sha512 = "LhN/Reh+7F3RCgQIRbgw8ZMwUwyqJM+8pXNT6IIJAqm2IdKkzpCh/V9EdgOMBKuebIrzswqy4ATlrDgiOwbRcQ==";
      };
    }
    {
      name = "_rollup_rollup_win32_arm64_msvc___rollup_win32_arm64_msvc_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_win32_arm64_msvc___rollup_win32_arm64_msvc_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.56.0.tgz";
        sha512 = "kbFsOObXp3LBULg1d3JIUQMa9Kv4UitDmpS+k0tinPBz3watcUiV2/LUDMMucA6pZO3WGE27P7DsfaN54l9ing==";
      };
    }
    {
      name = "_rollup_rollup_win32_ia32_msvc___rollup_win32_ia32_msvc_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_win32_ia32_msvc___rollup_win32_ia32_msvc_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.56.0.tgz";
        sha512 = "vSSgny54D6P4vf2izbtFm/TcWYedw7f8eBrOiGGecyHyQB9q4Kqentjaj8hToe+995nob/Wv48pDqL5a62EWtg==";
      };
    }
    {
      name = "_rollup_rollup_win32_x64_gnu___rollup_win32_x64_gnu_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_win32_x64_gnu___rollup_win32_x64_gnu_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.56.0.tgz";
        sha512 = "FeCnkPCTHQJFbiGG49KjV5YGW/8b9rrXAM2Mz2kiIoktq2qsJxRD5giEMEOD2lPdgs72upzefaUvS+nc8E3UzQ==";
      };
    }
    {
      name = "_rollup_rollup_win32_x64_msvc___rollup_win32_x64_msvc_4.56.0.tgz";
      path = fetchurl {
        name = "_rollup_rollup_win32_x64_msvc___rollup_win32_x64_msvc_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.56.0.tgz";
        sha512 = "H8AE9Ur/t0+1VXujj90w0HrSOuv0Nq9r1vSZF2t5km20NTfosQsGGUXDaKdQZzwuLts7IyL1fYT4hM95TI9c4g==";
      };
    }
    {
      name = "_tsconfig_node22___node22_22.0.5.tgz";
      path = fetchurl {
        name = "_tsconfig_node22___node22_22.0.5.tgz";
        url  = "https://registry.yarnpkg.com/@tsconfig/node22/-/node22-22.0.5.tgz";
        sha512 = "hLf2ld+sYN/BtOJjHUWOk568dvjFQkHnLNa6zce25GIH+vxKfvTgm3qpaH6ToF5tu/NN0IH66s+Bb5wElHrLcw==";
      };
    }
    {
      name = "_types_estree___estree_1.0.8.tgz";
      path = fetchurl {
        name = "_types_estree___estree_1.0.8.tgz";
        url  = "https://registry.yarnpkg.com/@types/estree/-/estree-1.0.8.tgz";
        sha512 = "dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==";
      };
    }
    {
      name = "_types_json_schema___json_schema_7.0.15.tgz";
      path = fetchurl {
        name = "_types_json_schema___json_schema_7.0.15.tgz";
        url  = "https://registry.yarnpkg.com/@types/json-schema/-/json-schema-7.0.15.tgz";
        sha512 = "5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==";
      };
    }
    {
      name = "_types_node___node_22.19.7.tgz";
      path = fetchurl {
        name = "_types_node___node_22.19.7.tgz";
        url  = "https://registry.yarnpkg.com/@types/node/-/node-22.19.7.tgz";
        sha512 = "MciR4AKGHWl7xwxkBa6xUGxQJ4VBOmPTF7sL+iGzuahOFaO0jHCsuEfS80pan1ef4gWId1oWOweIhrDEYLuaOw==";
      };
    }
    {
      name = "_types_web_bluetooth___web_bluetooth_0.0.21.tgz";
      path = fetchurl {
        name = "_types_web_bluetooth___web_bluetooth_0.0.21.tgz";
        url  = "https://registry.yarnpkg.com/@types/web-bluetooth/-/web-bluetooth-0.0.21.tgz";
        sha512 = "oIQLCGWtcFZy2JW77j9k8nHzAOpqMHLQejDA48XXMWH6tjCQHz5RCFz1bzsmROyL6PUm+LLnUiI4BCn221inxA==";
      };
    }
    {
      name = "_typescript_eslint_eslint_plugin___eslint_plugin_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_eslint_plugin___eslint_plugin_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.53.1.tgz";
        sha512 = "cFYYFZ+oQFi6hUnBTbLRXfTJiaQtYE3t4O692agbBl+2Zy+eqSKWtPjhPXJu1G7j4RLjKgeJPDdq3EqOwmX5Ag==";
      };
    }
    {
      name = "_typescript_eslint_parser___parser_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_parser___parser_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/parser/-/parser-8.53.1.tgz";
        sha512 = "nm3cvFN9SqZGXjmw5bZ6cGmvJSyJPn0wU9gHAZZHDnZl2wF9PhHv78Xf06E0MaNk4zLVHL8hb2/c32XvyJOLQg==";
      };
    }
    {
      name = "_typescript_eslint_project_service___project_service_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_project_service___project_service_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/project-service/-/project-service-8.53.1.tgz";
        sha512 = "WYC4FB5Ra0xidsmlPb+1SsnaSKPmS3gsjIARwbEkHkoWloQmuzcfypljaJcR78uyLA1h8sHdWWPHSLDI+MtNog==";
      };
    }
    {
      name = "_typescript_eslint_scope_manager___scope_manager_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_scope_manager___scope_manager_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/scope-manager/-/scope-manager-8.53.1.tgz";
        sha512 = "Lu23yw1uJMFY8cUeq7JlrizAgeQvWugNQzJp8C3x8Eo5Jw5Q2ykMdiiTB9vBVOOUBysMzmRRmUfwFrZuI2C4SQ==";
      };
    }
    {
      name = "_typescript_eslint_tsconfig_utils___tsconfig_utils_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_tsconfig_utils___tsconfig_utils_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/tsconfig-utils/-/tsconfig-utils-8.53.1.tgz";
        sha512 = "qfvLXS6F6b1y43pnf0pPbXJ+YoXIC7HKg0UGZ27uMIemKMKA6XH2DTxsEDdpdN29D+vHV07x/pnlPNVLhdhWiA==";
      };
    }
    {
      name = "_typescript_eslint_type_utils___type_utils_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_type_utils___type_utils_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/type-utils/-/type-utils-8.53.1.tgz";
        sha512 = "MOrdtNvyhy0rHyv0ENzub1d4wQYKb2NmIqG7qEqPWFW7Mpy2jzFC3pQ2yKDvirZB7jypm5uGjF2Qqs6OIqu47w==";
      };
    }
    {
      name = "_typescript_eslint_types___types_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_types___types_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/types/-/types-8.53.1.tgz";
        sha512 = "jr/swrr2aRmUAUjW5/zQHbMaui//vQlsZcJKijZf3M26bnmLj8LyZUpj8/Rd6uzaek06OWsqdofN/Thenm5O8A==";
      };
    }
    {
      name = "_typescript_eslint_typescript_estree___typescript_estree_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_typescript_estree___typescript_estree_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/typescript-estree/-/typescript-estree-8.53.1.tgz";
        sha512 = "RGlVipGhQAG4GxV1s34O91cxQ/vWiHJTDHbXRr0li2q/BGg3RR/7NM8QDWgkEgrwQYCvmJV9ichIwyoKCQ+DTg==";
      };
    }
    {
      name = "_typescript_eslint_utils___utils_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_utils___utils_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/utils/-/utils-8.53.1.tgz";
        sha512 = "c4bMvGVWW4hv6JmDUEG7fSYlWOl3II2I4ylt0NM+seinYQlZMQIaKaXIIVJWt9Ofh6whrpM+EdDQXKXjNovvrg==";
      };
    }
    {
      name = "_typescript_eslint_visitor_keys___visitor_keys_8.53.1.tgz";
      path = fetchurl {
        name = "_typescript_eslint_visitor_keys___visitor_keys_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/@typescript-eslint/visitor-keys/-/visitor-keys-8.53.1.tgz";
        sha512 = "oy+wV7xDKFPRyNggmXuZQSBzvoLnpmJs+GhzRhPjrxl2b/jIlyjVokzm47CZCDUdXKr2zd7ZLodPfOBpOPyPlg==";
      };
    }
    {
      name = "_unhead_vue___vue_2.1.2.tgz";
      path = fetchurl {
        name = "_unhead_vue___vue_2.1.2.tgz";
        url  = "https://registry.yarnpkg.com/@unhead/vue/-/vue-2.1.2.tgz";
        sha512 = "w5yxH/fkkLWAFAOnMSIbvAikNHYn6pgC7zGF/BasXf+K3CO1cYIPFehYAk5jpcsbiNPMc3goyyw1prGLoyD14g==";
      };
    }
    {
      name = "_vitejs_plugin_vue___plugin_vue_6.0.3.tgz";
      path = fetchurl {
        name = "_vitejs_plugin_vue___plugin_vue_6.0.3.tgz";
        url  = "https://registry.yarnpkg.com/@vitejs/plugin-vue/-/plugin-vue-6.0.3.tgz";
        sha512 = "TlGPkLFLVOY3T7fZrwdvKpjprR3s4fxRln0ORDo1VQ7HHyxJwTlrjKU3kpVWTlaAjIEuCTokmjkZnr8Tpc925w==";
      };
    }
    {
      name = "_volar_language_core___language_core_2.4.27.tgz";
      path = fetchurl {
        name = "_volar_language_core___language_core_2.4.27.tgz";
        url  = "https://registry.yarnpkg.com/@volar/language-core/-/language-core-2.4.27.tgz";
        sha512 = "DjmjBWZ4tJKxfNC1F6HyYERNHPYS7L7OPFyCrestykNdUZMFYzI9WTyvwPcaNaHlrEUwESHYsfEw3isInncZxQ==";
      };
    }
    {
      name = "_volar_source_map___source_map_2.4.27.tgz";
      path = fetchurl {
        name = "_volar_source_map___source_map_2.4.27.tgz";
        url  = "https://registry.yarnpkg.com/@volar/source-map/-/source-map-2.4.27.tgz";
        sha512 = "ynlcBReMgOZj2i6po+qVswtDUeeBRCTgDurjMGShbm8WYZgJ0PA4RmtebBJ0BCYol1qPv3GQF6jK7C9qoVc7lg==";
      };
    }
    {
      name = "_volar_typescript___typescript_2.4.27.tgz";
      path = fetchurl {
        name = "_volar_typescript___typescript_2.4.27.tgz";
        url  = "https://registry.yarnpkg.com/@volar/typescript/-/typescript-2.4.27.tgz";
        sha512 = "eWaYCcl/uAPInSK2Lze6IqVWaBu/itVqR5InXcHXFyles4zO++Mglt3oxdgj75BDcv1Knr9Y93nowS8U3wqhxg==";
      };
    }
    {
      name = "_vue_babel_helper_vue_transform_on___babel_helper_vue_transform_on_1.5.0.tgz";
      path = fetchurl {
        name = "_vue_babel_helper_vue_transform_on___babel_helper_vue_transform_on_1.5.0.tgz";
        url  = "https://registry.yarnpkg.com/@vue/babel-helper-vue-transform-on/-/babel-helper-vue-transform-on-1.5.0.tgz";
        sha512 = "0dAYkerNhhHutHZ34JtTl2czVQHUNWv6xEbkdF5W+Yrv5pCWsqjeORdOgbtW2I9gWlt+wBmVn+ttqN9ZxR5tzA==";
      };
    }
    {
      name = "_vue_babel_plugin_jsx___babel_plugin_jsx_1.5.0.tgz";
      path = fetchurl {
        name = "_vue_babel_plugin_jsx___babel_plugin_jsx_1.5.0.tgz";
        url  = "https://registry.yarnpkg.com/@vue/babel-plugin-jsx/-/babel-plugin-jsx-1.5.0.tgz";
        sha512 = "mneBhw1oOqCd2247O0Yw/mRwC9jIGACAJUlawkmMBiNmL4dGA2eMzuNZVNqOUfYTa6vqmND4CtOPzmEEEqLKFw==";
      };
    }
    {
      name = "_vue_babel_plugin_resolve_type___babel_plugin_resolve_type_1.5.0.tgz";
      path = fetchurl {
        name = "_vue_babel_plugin_resolve_type___babel_plugin_resolve_type_1.5.0.tgz";
        url  = "https://registry.yarnpkg.com/@vue/babel-plugin-resolve-type/-/babel-plugin-resolve-type-1.5.0.tgz";
        sha512 = "Wm/60o+53JwJODm4Knz47dxJnLDJ9FnKnGZJbUUf8nQRAtt6P+undLUAVU3Ha33LxOJe6IPoifRQ6F/0RrU31w==";
      };
    }
    {
      name = "_vue_compiler_core___compiler_core_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_compiler_core___compiler_core_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/compiler-core/-/compiler-core-3.5.27.tgz";
        sha512 = "gnSBQjZA+//qDZen+6a2EdHqJ68Z7uybrMf3SPjEGgG4dicklwDVmMC1AeIHxtLVPT7sn6sH1KOO+tS6gwOUeQ==";
      };
    }
    {
      name = "_vue_compiler_dom___compiler_dom_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_compiler_dom___compiler_dom_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/compiler-dom/-/compiler-dom-3.5.27.tgz";
        sha512 = "oAFea8dZgCtVVVTEC7fv3T5CbZW9BxpFzGGxC79xakTr6ooeEqmRuvQydIiDAkglZEAd09LgVf1RoDnL54fu5w==";
      };
    }
    {
      name = "_vue_compiler_sfc___compiler_sfc_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_compiler_sfc___compiler_sfc_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/compiler-sfc/-/compiler-sfc-3.5.27.tgz";
        sha512 = "sHZu9QyDPeDmN/MRoshhggVOWE5WlGFStKFwu8G52swATgSny27hJRWteKDSUUzUH+wp+bmeNbhJnEAel/auUQ==";
      };
    }
    {
      name = "_vue_compiler_ssr___compiler_ssr_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_compiler_ssr___compiler_ssr_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/compiler-ssr/-/compiler-ssr-3.5.27.tgz";
        sha512 = "Sj7h+JHt512fV1cTxKlYhg7qxBvack+BGncSpH+8vnN+KN95iPIcqB5rsbblX40XorP+ilO7VIKlkuu3Xq2vjw==";
      };
    }
    {
      name = "_vue_devtools_api___devtools_api_6.6.4.tgz";
      path = fetchurl {
        name = "_vue_devtools_api___devtools_api_6.6.4.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-api/-/devtools-api-6.6.4.tgz";
        sha512 = "sGhTPMuXqZ1rVOk32RylztWkfXTRhuS7vgAKv0zjqk8gbsHkJ7xfFf+jbySxt7tWObEJwyKaHMikV/WGDiQm8g==";
      };
    }
    {
      name = "_vue_devtools_api___devtools_api_7.7.9.tgz";
      path = fetchurl {
        name = "_vue_devtools_api___devtools_api_7.7.9.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-api/-/devtools-api-7.7.9.tgz";
        sha512 = "kIE8wvwlcZ6TJTbNeU2HQNtaxLx3a84aotTITUuL/4bzfPxzajGBOoqjMhwZJ8L9qFYDU/lAYMEEm11dnZOD6g==";
      };
    }
    {
      name = "_vue_devtools_core___devtools_core_8.0.5.tgz";
      path = fetchurl {
        name = "_vue_devtools_core___devtools_core_8.0.5.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-core/-/devtools-core-8.0.5.tgz";
        sha512 = "dpCw8nl0GDBuiL9SaY0mtDxoGIEmU38w+TQiYEPOLhW03VDC0lfNMYXS/qhl4I0YlysGp04NLY4UNn6xgD0VIQ==";
      };
    }
    {
      name = "_vue_devtools_kit___devtools_kit_7.7.9.tgz";
      path = fetchurl {
        name = "_vue_devtools_kit___devtools_kit_7.7.9.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-kit/-/devtools-kit-7.7.9.tgz";
        sha512 = "PyQ6odHSgiDVd4hnTP+aDk2X4gl2HmLDfiyEnn3/oV+ckFDuswRs4IbBT7vacMuGdwY/XemxBoh302ctbsptuA==";
      };
    }
    {
      name = "_vue_devtools_kit___devtools_kit_8.0.5.tgz";
      path = fetchurl {
        name = "_vue_devtools_kit___devtools_kit_8.0.5.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-kit/-/devtools-kit-8.0.5.tgz";
        sha512 = "q2VV6x1U3KJMTQPUlRMyWEKVbcHuxhqJdSr6Jtjz5uAThAIrfJ6WVZdGZm5cuO63ZnSUz0RCsVwiUUb0mDV0Yg==";
      };
    }
    {
      name = "_vue_devtools_shared___devtools_shared_7.7.9.tgz";
      path = fetchurl {
        name = "_vue_devtools_shared___devtools_shared_7.7.9.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-shared/-/devtools-shared-7.7.9.tgz";
        sha512 = "iWAb0v2WYf0QWmxCGy0seZNDPdO3Sp5+u78ORnyeonS6MT4PC7VPrryX2BpMJrwlDeaZ6BD4vP4XKjK0SZqaeA==";
      };
    }
    {
      name = "_vue_devtools_shared___devtools_shared_8.0.5.tgz";
      path = fetchurl {
        name = "_vue_devtools_shared___devtools_shared_8.0.5.tgz";
        url  = "https://registry.yarnpkg.com/@vue/devtools-shared/-/devtools-shared-8.0.5.tgz";
        sha512 = "bRLn6/spxpmgLk+iwOrR29KrYnJjG9DGpHGkDFG82UM21ZpJ39ztUT9OXX3g+usW7/b2z+h46I9ZiYyB07XMXg==";
      };
    }
    {
      name = "_vue_eslint_config_prettier___eslint_config_prettier_10.2.0.tgz";
      path = fetchurl {
        name = "_vue_eslint_config_prettier___eslint_config_prettier_10.2.0.tgz";
        url  = "https://registry.yarnpkg.com/@vue/eslint-config-prettier/-/eslint-config-prettier-10.2.0.tgz";
        sha512 = "GL3YBLwv/+b86yHcNNfPJxOTtVFJ4Mbc9UU3zR+KVoG7SwGTjPT+32fXamscNumElhcpXW3mT0DgzS9w32S7Bw==";
      };
    }
    {
      name = "_vue_eslint_config_typescript___eslint_config_typescript_14.6.0.tgz";
      path = fetchurl {
        name = "_vue_eslint_config_typescript___eslint_config_typescript_14.6.0.tgz";
        url  = "https://registry.yarnpkg.com/@vue/eslint-config-typescript/-/eslint-config-typescript-14.6.0.tgz";
        sha512 = "UpiRY/7go4Yps4mYCjkvlIbVWmn9YvPGQDxTAlcKLphyaD77LjIu3plH4Y9zNT0GB4f3K5tMmhhtRhPOgrQ/bQ==";
      };
    }
    {
      name = "_vue_language_core___language_core_3.2.3.tgz";
      path = fetchurl {
        name = "_vue_language_core___language_core_3.2.3.tgz";
        url  = "https://registry.yarnpkg.com/@vue/language-core/-/language-core-3.2.3.tgz";
        sha512 = "VpN/GnYDzGLh44AI6i1OB/WsLXo6vwnl0EWHBelGc4TyC0yEq6azwNaed/+Tgr8anFlSdWYnMEkyHJDPe7ii7A==";
      };
    }
    {
      name = "_vue_reactivity___reactivity_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_reactivity___reactivity_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/reactivity/-/reactivity-3.5.27.tgz";
        sha512 = "vvorxn2KXfJ0nBEnj4GYshSgsyMNFnIQah/wczXlsNXt+ijhugmW+PpJ2cNPe4V6jpnBcs0MhCODKllWG+nvoQ==";
      };
    }
    {
      name = "_vue_runtime_core___runtime_core_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_runtime_core___runtime_core_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/runtime-core/-/runtime-core-3.5.27.tgz";
        sha512 = "fxVuX/fzgzeMPn/CLQecWeDIFNt3gQVhxM0rW02Tvp/YmZfXQgcTXlakq7IMutuZ/+Ogbn+K0oct9J3JZfyk3A==";
      };
    }
    {
      name = "_vue_runtime_dom___runtime_dom_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_runtime_dom___runtime_dom_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/runtime-dom/-/runtime-dom-3.5.27.tgz";
        sha512 = "/QnLslQgYqSJ5aUmb5F0z0caZPGHRB8LEAQ1s81vHFM5CBfnun63rxhvE/scVb/j3TbBuoZwkJyiLCkBluMpeg==";
      };
    }
    {
      name = "_vue_server_renderer___server_renderer_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_server_renderer___server_renderer_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/server-renderer/-/server-renderer-3.5.27.tgz";
        sha512 = "qOz/5thjeP1vAFc4+BY3Nr6wxyLhpeQgAE/8dDtKo6a6xdk+L4W46HDZgNmLOBUDEkFXV3G7pRiUqxjX0/2zWA==";
      };
    }
    {
      name = "_vue_shared___shared_3.5.27.tgz";
      path = fetchurl {
        name = "_vue_shared___shared_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/@vue/shared/-/shared-3.5.27.tgz";
        sha512 = "dXr/3CgqXsJkZ0n9F3I4elY8wM9jMJpP3pvRG52r6m0tu/MsAFIe6JpXVGeNMd/D9F4hQynWT8Rfuj0bdm9kFQ==";
      };
    }
    {
      name = "_vue_tsconfig___tsconfig_0.8.1.tgz";
      path = fetchurl {
        name = "_vue_tsconfig___tsconfig_0.8.1.tgz";
        url  = "https://registry.yarnpkg.com/@vue/tsconfig/-/tsconfig-0.8.1.tgz";
        sha512 = "aK7feIWPXFSUhsCP9PFqPyFOcz4ENkb8hZ2pneL6m2UjCkccvaOhC/5KCKluuBufvp2KzkbdA2W2pk20vLzu3g==";
      };
    }
    {
      name = "_vuetify_loader_shared___loader_shared_2.1.2.tgz";
      path = fetchurl {
        name = "_vuetify_loader_shared___loader_shared_2.1.2.tgz";
        url  = "https://registry.yarnpkg.com/@vuetify/loader-shared/-/loader-shared-2.1.2.tgz";
        sha512 = "X+1jBLmXHkpQEnC0vyOb4rtX2QSkBiFhaFXz8yhQqN2A4vQ6k2nChxN4Ol7VAY5KoqMdFoRMnmNdp/1qYXDQig==";
      };
    }
    {
      name = "_vueuse_core___core_14.1.0.tgz";
      path = fetchurl {
        name = "_vueuse_core___core_14.1.0.tgz";
        url  = "https://registry.yarnpkg.com/@vueuse/core/-/core-14.1.0.tgz";
        sha512 = "rgBinKs07hAYyPF834mDTigH7BtPqvZ3Pryuzt1SD/lg5wEcWqvwzXXYGEDb2/cP0Sj5zSvHl3WkmMELr5kfWw==";
      };
    }
    {
      name = "_vueuse_metadata___metadata_14.1.0.tgz";
      path = fetchurl {
        name = "_vueuse_metadata___metadata_14.1.0.tgz";
        url  = "https://registry.yarnpkg.com/@vueuse/metadata/-/metadata-14.1.0.tgz";
        sha512 = "7hK4g015rWn2PhKcZ99NyT+ZD9sbwm7SGvp7k+k+rKGWnLjS/oQozoIZzWfCewSUeBmnJkIb+CNr7Zc/EyRnnA==";
      };
    }
    {
      name = "_vueuse_shared___shared_14.1.0.tgz";
      path = fetchurl {
        name = "_vueuse_shared___shared_14.1.0.tgz";
        url  = "https://registry.yarnpkg.com/@vueuse/shared/-/shared-14.1.0.tgz";
        sha512 = "EcKxtYvn6gx1F8z9J5/rsg3+lTQnvOruQd8fUecW99DCK04BkWD7z5KQ/wTAx+DazyoEE9dJt/zV8OIEQbM6kw==";
      };
    }
    {
      name = "acorn_jsx___acorn_jsx_5.3.2.tgz";
      path = fetchurl {
        name = "acorn_jsx___acorn_jsx_5.3.2.tgz";
        url  = "https://registry.yarnpkg.com/acorn-jsx/-/acorn-jsx-5.3.2.tgz";
        sha512 = "rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==";
      };
    }
    {
      name = "acorn___acorn_8.15.0.tgz";
      path = fetchurl {
        name = "acorn___acorn_8.15.0.tgz";
        url  = "https://registry.yarnpkg.com/acorn/-/acorn-8.15.0.tgz";
        sha512 = "NZyJarBfL7nWwIq+FDL6Zp/yHEhePMNnnJ0y3qfieCrmNvYct8uvtiV41UvlSe6apAfk0fY1FbWx+NwfmpvtTg==";
      };
    }
    {
      name = "ajv___ajv_6.12.6.tgz";
      path = fetchurl {
        name = "ajv___ajv_6.12.6.tgz";
        url  = "https://registry.yarnpkg.com/ajv/-/ajv-6.12.6.tgz";
        sha512 = "j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==";
      };
    }
    {
      name = "alien_signals___alien_signals_3.1.2.tgz";
      path = fetchurl {
        name = "alien_signals___alien_signals_3.1.2.tgz";
        url  = "https://registry.yarnpkg.com/alien-signals/-/alien-signals-3.1.2.tgz";
        sha512 = "d9dYqZTS90WLiU0I5c6DHj/HcKkF8ZyGN3G5x8wSbslulz70KOxaqCT0hQCo9KOyhVqzqGojvNdJXoTumZOtcw==";
      };
    }
    {
      name = "ansi_styles___ansi_styles_4.3.0.tgz";
      path = fetchurl {
        name = "ansi_styles___ansi_styles_4.3.0.tgz";
        url  = "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-4.3.0.tgz";
        sha512 = "zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==";
      };
    }
    {
      name = "ansis___ansis_4.2.0.tgz";
      path = fetchurl {
        name = "ansis___ansis_4.2.0.tgz";
        url  = "https://registry.yarnpkg.com/ansis/-/ansis-4.2.0.tgz";
        sha512 = "HqZ5rWlFjGiV0tDm3UxxgNRqsOTniqoKZu0pIAfh7TZQMGuZK+hH0drySty0si0QXj1ieop4+SkSfPZBPPkHig==";
      };
    }
    {
      name = "argparse___argparse_2.0.1.tgz";
      path = fetchurl {
        name = "argparse___argparse_2.0.1.tgz";
        url  = "https://registry.yarnpkg.com/argparse/-/argparse-2.0.1.tgz";
        sha512 = "8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==";
      };
    }
    {
      name = "autoprefixer___autoprefixer_10.4.23.tgz";
      path = fetchurl {
        name = "autoprefixer___autoprefixer_10.4.23.tgz";
        url  = "https://registry.yarnpkg.com/autoprefixer/-/autoprefixer-10.4.23.tgz";
        sha512 = "YYTXSFulfwytnjAPlw8QHncHJmlvFKtczb8InXaAx9Q0LbfDnfEYDE55omerIJKihhmU61Ft+cAOSzQVaBUmeA==";
      };
    }
    {
      name = "balanced_match___balanced_match_1.0.2.tgz";
      path = fetchurl {
        name = "balanced_match___balanced_match_1.0.2.tgz";
        url  = "https://registry.yarnpkg.com/balanced-match/-/balanced-match-1.0.2.tgz";
        sha512 = "3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==";
      };
    }
    {
      name = "baseline_browser_mapping___baseline_browser_mapping_2.9.17.tgz";
      path = fetchurl {
        name = "baseline_browser_mapping___baseline_browser_mapping_2.9.17.tgz";
        url  = "https://registry.yarnpkg.com/baseline-browser-mapping/-/baseline-browser-mapping-2.9.17.tgz";
        sha512 = "agD0MgJFUP/4nvjqzIB29zRPUuCF7Ge6mEv9s8dHrtYD7QWXRcx75rOADE/d5ah1NI+0vkDl0yorDd5U852IQQ==";
      };
    }
    {
      name = "birpc___birpc_2.9.0.tgz";
      path = fetchurl {
        name = "birpc___birpc_2.9.0.tgz";
        url  = "https://registry.yarnpkg.com/birpc/-/birpc-2.9.0.tgz";
        sha512 = "KrayHS5pBi69Xi9JmvoqrIgYGDkD6mcSe/i6YKi3w5kekCLzrX4+nawcXqrj2tIp50Kw/mT/s3p+GVK0A0sKxw==";
      };
    }
    {
      name = "boolbase___boolbase_1.0.0.tgz";
      path = fetchurl {
        name = "boolbase___boolbase_1.0.0.tgz";
        url  = "https://registry.yarnpkg.com/boolbase/-/boolbase-1.0.0.tgz";
        sha512 = "JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==";
      };
    }
    {
      name = "brace_expansion___brace_expansion_1.1.12.tgz";
      path = fetchurl {
        name = "brace_expansion___brace_expansion_1.1.12.tgz";
        url  = "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-1.1.12.tgz";
        sha512 = "9T9UjW3r0UW5c1Q7GTwllptXwhvYmEzFhzMfZ9H7FQWt+uZePjZPjBP/W1ZEyZ1twGWom5/56TF4lPcqjnDHcg==";
      };
    }
    {
      name = "brace_expansion___brace_expansion_2.0.2.tgz";
      path = fetchurl {
        name = "brace_expansion___brace_expansion_2.0.2.tgz";
        url  = "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-2.0.2.tgz";
        sha512 = "Jt0vHyM+jmUBqojB7E1NIYadt0vI0Qxjxd2TErW94wDz+E2LAm5vKMXXwg6ZZBTHPuUlDgQHKXvjGBdfcF1ZDQ==";
      };
    }
    {
      name = "braces___braces_3.0.3.tgz";
      path = fetchurl {
        name = "braces___braces_3.0.3.tgz";
        url  = "https://registry.yarnpkg.com/braces/-/braces-3.0.3.tgz";
        sha512 = "yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==";
      };
    }
    {
      name = "browserslist___browserslist_4.28.1.tgz";
      path = fetchurl {
        name = "browserslist___browserslist_4.28.1.tgz";
        url  = "https://registry.yarnpkg.com/browserslist/-/browserslist-4.28.1.tgz";
        sha512 = "ZC5Bd0LgJXgwGqUknZY/vkUQ04r8NXnJZ3yYi4vDmSiZmC/pdSN0NbNRPxZpbtO4uAfDUAFffO8IZoM3Gj8IkA==";
      };
    }
    {
      name = "bundle_name___bundle_name_4.1.0.tgz";
      path = fetchurl {
        name = "bundle_name___bundle_name_4.1.0.tgz";
        url  = "https://registry.yarnpkg.com/bundle-name/-/bundle-name-4.1.0.tgz";
        sha512 = "tjwM5exMg6BGRI+kNmTntNsvdZS1X8BFYS6tnJ2hdH0kVxM6/eVZ2xy+FqStSWvYmtfFMDLIxurorHwDKfDz5Q==";
      };
    }
    {
      name = "callsites___callsites_3.1.0.tgz";
      path = fetchurl {
        name = "callsites___callsites_3.1.0.tgz";
        url  = "https://registry.yarnpkg.com/callsites/-/callsites-3.1.0.tgz";
        sha512 = "P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==";
      };
    }
    {
      name = "caniuse_lite___caniuse_lite_1.0.30001766.tgz";
      path = fetchurl {
        name = "caniuse_lite___caniuse_lite_1.0.30001766.tgz";
        url  = "https://registry.yarnpkg.com/caniuse-lite/-/caniuse-lite-1.0.30001766.tgz";
        sha512 = "4C0lfJ0/YPjJQHagaE9x2Elb69CIqEPZeG0anQt9SIvIoOH4a4uaRl73IavyO+0qZh6MDLH//DrXThEYKHkmYA==";
      };
    }
    {
      name = "chalk___chalk_4.1.2.tgz";
      path = fetchurl {
        name = "chalk___chalk_4.1.2.tgz";
        url  = "https://registry.yarnpkg.com/chalk/-/chalk-4.1.2.tgz";
        sha512 = "oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==";
      };
    }
    {
      name = "chokidar___chokidar_4.0.3.tgz";
      path = fetchurl {
        name = "chokidar___chokidar_4.0.3.tgz";
        url  = "https://registry.yarnpkg.com/chokidar/-/chokidar-4.0.3.tgz";
        sha512 = "Qgzu8kfBvo+cA4962jnP1KkS6Dop5NS6g7R5LFYJr4b8Ub94PPQXUksCw9PvXoeXPRRddRNC5C1JQUR2SMGtnA==";
      };
    }
    {
      name = "color_convert___color_convert_2.0.1.tgz";
      path = fetchurl {
        name = "color_convert___color_convert_2.0.1.tgz";
        url  = "https://registry.yarnpkg.com/color-convert/-/color-convert-2.0.1.tgz";
        sha512 = "RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==";
      };
    }
    {
      name = "color_name___color_name_1.1.4.tgz";
      path = fetchurl {
        name = "color_name___color_name_1.1.4.tgz";
        url  = "https://registry.yarnpkg.com/color-name/-/color-name-1.1.4.tgz";
        sha512 = "dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==";
      };
    }
    {
      name = "concat_map___concat_map_0.0.1.tgz";
      path = fetchurl {
        name = "concat_map___concat_map_0.0.1.tgz";
        url  = "https://registry.yarnpkg.com/concat-map/-/concat-map-0.0.1.tgz";
        sha512 = "/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==";
      };
    }
    {
      name = "confbox___confbox_0.1.8.tgz";
      path = fetchurl {
        name = "confbox___confbox_0.1.8.tgz";
        url  = "https://registry.yarnpkg.com/confbox/-/confbox-0.1.8.tgz";
        sha512 = "RMtmw0iFkeR4YV+fUOSucriAQNb9g8zFR52MWCtl+cCZOFRNL6zeB395vPzFhEjjn4fMxXudmELnl/KF/WrK6w==";
      };
    }
    {
      name = "convert_source_map___convert_source_map_2.0.0.tgz";
      path = fetchurl {
        name = "convert_source_map___convert_source_map_2.0.0.tgz";
        url  = "https://registry.yarnpkg.com/convert-source-map/-/convert-source-map-2.0.0.tgz";
        sha512 = "Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==";
      };
    }
    {
      name = "copy_anything___copy_anything_4.0.5.tgz";
      path = fetchurl {
        name = "copy_anything___copy_anything_4.0.5.tgz";
        url  = "https://registry.yarnpkg.com/copy-anything/-/copy-anything-4.0.5.tgz";
        sha512 = "7Vv6asjS4gMOuILabD3l739tsaxFQmC+a7pLZm02zyvs8p977bL3zEgq3yDk5rn9B0PbYgIv++jmHcuUab4RhA==";
      };
    }
    {
      name = "cross_spawn___cross_spawn_7.0.6.tgz";
      path = fetchurl {
        name = "cross_spawn___cross_spawn_7.0.6.tgz";
        url  = "https://registry.yarnpkg.com/cross-spawn/-/cross-spawn-7.0.6.tgz";
        sha512 = "uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==";
      };
    }
    {
      name = "cssesc___cssesc_3.0.0.tgz";
      path = fetchurl {
        name = "cssesc___cssesc_3.0.0.tgz";
        url  = "https://registry.yarnpkg.com/cssesc/-/cssesc-3.0.0.tgz";
        sha512 = "/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==";
      };
    }
    {
      name = "csstype___csstype_3.2.3.tgz";
      path = fetchurl {
        name = "csstype___csstype_3.2.3.tgz";
        url  = "https://registry.yarnpkg.com/csstype/-/csstype-3.2.3.tgz";
        sha512 = "z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==";
      };
    }
    {
      name = "debug___debug_4.4.3.tgz";
      path = fetchurl {
        name = "debug___debug_4.4.3.tgz";
        url  = "https://registry.yarnpkg.com/debug/-/debug-4.4.3.tgz";
        sha512 = "RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==";
      };
    }
    {
      name = "deep_is___deep_is_0.1.4.tgz";
      path = fetchurl {
        name = "deep_is___deep_is_0.1.4.tgz";
        url  = "https://registry.yarnpkg.com/deep-is/-/deep-is-0.1.4.tgz";
        sha512 = "oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==";
      };
    }
    {
      name = "default_browser_id___default_browser_id_5.0.1.tgz";
      path = fetchurl {
        name = "default_browser_id___default_browser_id_5.0.1.tgz";
        url  = "https://registry.yarnpkg.com/default-browser-id/-/default-browser-id-5.0.1.tgz";
        sha512 = "x1VCxdX4t+8wVfd1so/9w+vQ4vx7lKd2Qp5tDRutErwmR85OgmfX7RlLRMWafRMY7hbEiXIbudNrjOAPa/hL8Q==";
      };
    }
    {
      name = "default_browser___default_browser_5.4.0.tgz";
      path = fetchurl {
        name = "default_browser___default_browser_5.4.0.tgz";
        url  = "https://registry.yarnpkg.com/default-browser/-/default-browser-5.4.0.tgz";
        sha512 = "XDuvSq38Hr1MdN47EDvYtx3U0MTqpCEn+F6ft8z2vYDzMrvQhVp0ui9oQdqW3MvK3vqUETglt1tVGgjLuJ5izg==";
      };
    }
    {
      name = "define_lazy_prop___define_lazy_prop_3.0.0.tgz";
      path = fetchurl {
        name = "define_lazy_prop___define_lazy_prop_3.0.0.tgz";
        url  = "https://registry.yarnpkg.com/define-lazy-prop/-/define-lazy-prop-3.0.0.tgz";
        sha512 = "N+MeXYoqr3pOgn8xfyRPREN7gHakLYjhsHhWGT3fWAiL4IkAt0iDw14QiiEm2bE30c5XX5q0FtAA3CK5f9/BUg==";
      };
    }
    {
      name = "detect_libc___detect_libc_2.1.2.tgz";
      path = fetchurl {
        name = "detect_libc___detect_libc_2.1.2.tgz";
        url  = "https://registry.yarnpkg.com/detect-libc/-/detect-libc-2.1.2.tgz";
        sha512 = "Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==";
      };
    }
    {
      name = "electron_to_chromium___electron_to_chromium_1.5.278.tgz";
      path = fetchurl {
        name = "electron_to_chromium___electron_to_chromium_1.5.278.tgz";
        url  = "https://registry.yarnpkg.com/electron-to-chromium/-/electron-to-chromium-1.5.278.tgz";
        sha512 = "dQ0tM1svDRQOwxnXxm+twlGTjr9Upvt8UFWAgmLsxEzFQxhbti4VwxmMjsDxVC51Zo84swW7FVCXEV+VAkhuPw==";
      };
    }
    {
      name = "entities___entities_7.0.1.tgz";
      path = fetchurl {
        name = "entities___entities_7.0.1.tgz";
        url  = "https://registry.yarnpkg.com/entities/-/entities-7.0.1.tgz";
        sha512 = "TWrgLOFUQTH994YUyl1yT4uyavY5nNB5muff+RtWaqNVCAK408b5ZnnbNAUEWLTCpum9w6arT70i1XdQ4UeOPA==";
      };
    }
    {
      name = "error_stack_parser_es___error_stack_parser_es_1.0.5.tgz";
      path = fetchurl {
        name = "error_stack_parser_es___error_stack_parser_es_1.0.5.tgz";
        url  = "https://registry.yarnpkg.com/error-stack-parser-es/-/error-stack-parser-es-1.0.5.tgz";
        sha512 = "5qucVt2XcuGMcEGgWI7i+yZpmpByQ8J1lHhcL7PwqCwu9FPP3VUXzT4ltHe5i2z9dePwEHcDVOAfSnHsOlCXRA==";
      };
    }
    {
      name = "esbuild___esbuild_0.27.2.tgz";
      path = fetchurl {
        name = "esbuild___esbuild_0.27.2.tgz";
        url  = "https://registry.yarnpkg.com/esbuild/-/esbuild-0.27.2.tgz";
        sha512 = "HyNQImnsOC7X9PMNaCIeAm4ISCQXs5a5YasTXVliKv4uuBo1dKrG0A+uQS8M5eXjVMnLg3WgXaKvprHlFJQffw==";
      };
    }
    {
      name = "escalade___escalade_3.2.0.tgz";
      path = fetchurl {
        name = "escalade___escalade_3.2.0.tgz";
        url  = "https://registry.yarnpkg.com/escalade/-/escalade-3.2.0.tgz";
        sha512 = "WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==";
      };
    }
    {
      name = "escape_string_regexp___escape_string_regexp_4.0.0.tgz";
      path = fetchurl {
        name = "escape_string_regexp___escape_string_regexp_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz";
        sha512 = "TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==";
      };
    }
    {
      name = "eslint_config_prettier___eslint_config_prettier_10.1.8.tgz";
      path = fetchurl {
        name = "eslint_config_prettier___eslint_config_prettier_10.1.8.tgz";
        url  = "https://registry.yarnpkg.com/eslint-config-prettier/-/eslint-config-prettier-10.1.8.tgz";
        sha512 = "82GZUjRS0p/jganf6q1rEO25VSoHH0hKPCTrgillPjdI/3bgBhAE1QzHrHTizjpRvy6pGAvKjDJtk2pF9NDq8w==";
      };
    }
    {
      name = "eslint_plugin_prettier___eslint_plugin_prettier_5.5.5.tgz";
      path = fetchurl {
        name = "eslint_plugin_prettier___eslint_plugin_prettier_5.5.5.tgz";
        url  = "https://registry.yarnpkg.com/eslint-plugin-prettier/-/eslint-plugin-prettier-5.5.5.tgz";
        sha512 = "hscXkbqUZ2sPithAuLm5MXL+Wph+U7wHngPBv9OMWwlP8iaflyxpjTYZkmdgB4/vPIhemRlBEoLrH7UC1n7aUw==";
      };
    }
    {
      name = "eslint_plugin_vue___eslint_plugin_vue_10.7.0.tgz";
      path = fetchurl {
        name = "eslint_plugin_vue___eslint_plugin_vue_10.7.0.tgz";
        url  = "https://registry.yarnpkg.com/eslint-plugin-vue/-/eslint-plugin-vue-10.7.0.tgz";
        sha512 = "r2XFCK4qlo1sxEoAMIoTTX0PZAdla0JJDt1fmYiworZUX67WeEGqm+JbyAg3M+pGiJ5U6Mp5WQbontXWtIW7TA==";
      };
    }
    {
      name = "eslint_plugin_vuetify___eslint_plugin_vuetify_2.5.3.tgz";
      path = fetchurl {
        name = "eslint_plugin_vuetify___eslint_plugin_vuetify_2.5.3.tgz";
        url  = "https://registry.yarnpkg.com/eslint-plugin-vuetify/-/eslint-plugin-vuetify-2.5.3.tgz";
        sha512 = "HQQ3HSeg4lOQp+bImVuGsIQBgRexMGudZBZ8iK7ypQsNkKlVu2JSDDslOoTUGTj+QY/SE5PtXOwz0lMITuv8Rg==";
      };
    }
    {
      name = "eslint_scope___eslint_scope_8.4.0.tgz";
      path = fetchurl {
        name = "eslint_scope___eslint_scope_8.4.0.tgz";
        url  = "https://registry.yarnpkg.com/eslint-scope/-/eslint-scope-8.4.0.tgz";
        sha512 = "sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==";
      };
    }
    {
      name = "eslint_visitor_keys___eslint_visitor_keys_3.4.3.tgz";
      path = fetchurl {
        name = "eslint_visitor_keys___eslint_visitor_keys_3.4.3.tgz";
        url  = "https://registry.yarnpkg.com/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz";
        sha512 = "wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==";
      };
    }
    {
      name = "eslint_visitor_keys___eslint_visitor_keys_4.2.1.tgz";
      path = fetchurl {
        name = "eslint_visitor_keys___eslint_visitor_keys_4.2.1.tgz";
        url  = "https://registry.yarnpkg.com/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz";
        sha512 = "Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==";
      };
    }
    {
      name = "eslint___eslint_9.39.2.tgz";
      path = fetchurl {
        name = "eslint___eslint_9.39.2.tgz";
        url  = "https://registry.yarnpkg.com/eslint/-/eslint-9.39.2.tgz";
        sha512 = "LEyamqS7W5HB3ujJyvi0HQK/dtVINZvd5mAAp9eT5S/ujByGjiZLCzPcHVzuXbpJDJF/cxwHlfceVUDZ2lnSTw==";
      };
    }
    {
      name = "espree___espree_10.4.0.tgz";
      path = fetchurl {
        name = "espree___espree_10.4.0.tgz";
        url  = "https://registry.yarnpkg.com/espree/-/espree-10.4.0.tgz";
        sha512 = "j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==";
      };
    }
    {
      name = "esquery___esquery_1.7.0.tgz";
      path = fetchurl {
        name = "esquery___esquery_1.7.0.tgz";
        url  = "https://registry.yarnpkg.com/esquery/-/esquery-1.7.0.tgz";
        sha512 = "Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==";
      };
    }
    {
      name = "esrecurse___esrecurse_4.3.0.tgz";
      path = fetchurl {
        name = "esrecurse___esrecurse_4.3.0.tgz";
        url  = "https://registry.yarnpkg.com/esrecurse/-/esrecurse-4.3.0.tgz";
        sha512 = "KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==";
      };
    }
    {
      name = "estraverse___estraverse_5.3.0.tgz";
      path = fetchurl {
        name = "estraverse___estraverse_5.3.0.tgz";
        url  = "https://registry.yarnpkg.com/estraverse/-/estraverse-5.3.0.tgz";
        sha512 = "MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==";
      };
    }
    {
      name = "estree_walker___estree_walker_2.0.2.tgz";
      path = fetchurl {
        name = "estree_walker___estree_walker_2.0.2.tgz";
        url  = "https://registry.yarnpkg.com/estree-walker/-/estree-walker-2.0.2.tgz";
        sha512 = "Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==";
      };
    }
    {
      name = "esutils___esutils_2.0.3.tgz";
      path = fetchurl {
        name = "esutils___esutils_2.0.3.tgz";
        url  = "https://registry.yarnpkg.com/esutils/-/esutils-2.0.3.tgz";
        sha512 = "kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==";
      };
    }
    {
      name = "fast_deep_equal___fast_deep_equal_3.1.3.tgz";
      path = fetchurl {
        name = "fast_deep_equal___fast_deep_equal_3.1.3.tgz";
        url  = "https://registry.yarnpkg.com/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz";
        sha512 = "f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==";
      };
    }
    {
      name = "fast_diff___fast_diff_1.3.0.tgz";
      path = fetchurl {
        name = "fast_diff___fast_diff_1.3.0.tgz";
        url  = "https://registry.yarnpkg.com/fast-diff/-/fast-diff-1.3.0.tgz";
        sha512 = "VxPP4NqbUjj6MaAOafWeUn2cXWLcCtljklUtZf0Ind4XQ+QPtmA0b18zZy0jIQx+ExRVCR/ZQpBmik5lXshNsw==";
      };
    }
    {
      name = "fast_glob___fast_glob_3.3.3.tgz";
      path = fetchurl {
        name = "fast_glob___fast_glob_3.3.3.tgz";
        url  = "https://registry.yarnpkg.com/fast-glob/-/fast-glob-3.3.3.tgz";
        sha512 = "7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==";
      };
    }
    {
      name = "fast_json_stable_stringify___fast_json_stable_stringify_2.1.0.tgz";
      path = fetchurl {
        name = "fast_json_stable_stringify___fast_json_stable_stringify_2.1.0.tgz";
        url  = "https://registry.yarnpkg.com/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz";
        sha512 = "lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==";
      };
    }
    {
      name = "fast_levenshtein___fast_levenshtein_2.0.6.tgz";
      path = fetchurl {
        name = "fast_levenshtein___fast_levenshtein_2.0.6.tgz";
        url  = "https://registry.yarnpkg.com/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz";
        sha512 = "DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==";
      };
    }
    {
      name = "fastq___fastq_1.20.1.tgz";
      path = fetchurl {
        name = "fastq___fastq_1.20.1.tgz";
        url  = "https://registry.yarnpkg.com/fastq/-/fastq-1.20.1.tgz";
        sha512 = "GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==";
      };
    }
    {
      name = "fdir___fdir_6.5.0.tgz";
      path = fetchurl {
        name = "fdir___fdir_6.5.0.tgz";
        url  = "https://registry.yarnpkg.com/fdir/-/fdir-6.5.0.tgz";
        sha512 = "tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==";
      };
    }
    {
      name = "fetch_retry___fetch_retry_6.0.0.tgz";
      path = fetchurl {
        name = "fetch_retry___fetch_retry_6.0.0.tgz";
        url  = "https://registry.yarnpkg.com/fetch-retry/-/fetch-retry-6.0.0.tgz";
        sha512 = "BUFj1aMubgib37I3v4q78fYo63Po7t4HUPTpQ6/QE6yK6cIQrP+W43FYToeTEyg5m2Y7eFUtijUuAv/PDlWuag==";
      };
    }
    {
      name = "file_entry_cache___file_entry_cache_8.0.0.tgz";
      path = fetchurl {
        name = "file_entry_cache___file_entry_cache_8.0.0.tgz";
        url  = "https://registry.yarnpkg.com/file-entry-cache/-/file-entry-cache-8.0.0.tgz";
        sha512 = "XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==";
      };
    }
    {
      name = "fill_range___fill_range_7.1.1.tgz";
      path = fetchurl {
        name = "fill_range___fill_range_7.1.1.tgz";
        url  = "https://registry.yarnpkg.com/fill-range/-/fill-range-7.1.1.tgz";
        sha512 = "YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==";
      };
    }
    {
      name = "find_up___find_up_5.0.0.tgz";
      path = fetchurl {
        name = "find_up___find_up_5.0.0.tgz";
        url  = "https://registry.yarnpkg.com/find-up/-/find-up-5.0.0.tgz";
        sha512 = "78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==";
      };
    }
    {
      name = "flat_cache___flat_cache_4.0.1.tgz";
      path = fetchurl {
        name = "flat_cache___flat_cache_4.0.1.tgz";
        url  = "https://registry.yarnpkg.com/flat-cache/-/flat-cache-4.0.1.tgz";
        sha512 = "f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==";
      };
    }
    {
      name = "flatted___flatted_3.3.3.tgz";
      path = fetchurl {
        name = "flatted___flatted_3.3.3.tgz";
        url  = "https://registry.yarnpkg.com/flatted/-/flatted-3.3.3.tgz";
        sha512 = "GX+ysw4PBCz0PzosHDepZGANEuFCMLrnRTiEy9McGjmkCQYwRq4A/X786G/fjM/+OjsWSU1ZrY5qyARZmO/uwg==";
      };
    }
    {
      name = "fraction.js___fraction.js_5.3.4.tgz";
      path = fetchurl {
        name = "fraction.js___fraction.js_5.3.4.tgz";
        url  = "https://registry.yarnpkg.com/fraction.js/-/fraction.js-5.3.4.tgz";
        sha512 = "1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==";
      };
    }
    {
      name = "fsevents___fsevents_2.3.3.tgz";
      path = fetchurl {
        name = "fsevents___fsevents_2.3.3.tgz";
        url  = "https://registry.yarnpkg.com/fsevents/-/fsevents-2.3.3.tgz";
        sha512 = "5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==";
      };
    }
    {
      name = "gensync___gensync_1.0.0_beta.2.tgz";
      path = fetchurl {
        name = "gensync___gensync_1.0.0_beta.2.tgz";
        url  = "https://registry.yarnpkg.com/gensync/-/gensync-1.0.0-beta.2.tgz";
        sha512 = "3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==";
      };
    }
    {
      name = "glob_parent___glob_parent_5.1.2.tgz";
      path = fetchurl {
        name = "glob_parent___glob_parent_5.1.2.tgz";
        url  = "https://registry.yarnpkg.com/glob-parent/-/glob-parent-5.1.2.tgz";
        sha512 = "AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==";
      };
    }
    {
      name = "glob_parent___glob_parent_6.0.2.tgz";
      path = fetchurl {
        name = "glob_parent___glob_parent_6.0.2.tgz";
        url  = "https://registry.yarnpkg.com/glob-parent/-/glob-parent-6.0.2.tgz";
        sha512 = "XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==";
      };
    }
    {
      name = "globals___globals_14.0.0.tgz";
      path = fetchurl {
        name = "globals___globals_14.0.0.tgz";
        url  = "https://registry.yarnpkg.com/globals/-/globals-14.0.0.tgz";
        sha512 = "oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==";
      };
    }
    {
      name = "globals___globals_16.5.0.tgz";
      path = fetchurl {
        name = "globals___globals_16.5.0.tgz";
        url  = "https://registry.yarnpkg.com/globals/-/globals-16.5.0.tgz";
        sha512 = "c/c15i26VrJ4IRt5Z89DnIzCGDn9EcebibhAOjw5ibqEHsE1wLUgkPn9RDmNcUKyU87GeaL633nyJ+pplFR2ZQ==";
      };
    }
    {
      name = "gsap___gsap_3.14.2.tgz";
      path = fetchurl {
        name = "gsap___gsap_3.14.2.tgz";
        url  = "https://registry.yarnpkg.com/gsap/-/gsap-3.14.2.tgz";
        sha512 = "P8/mMxVLU7o4+55+1TCnQrPmgjPKnwkzkXOK1asnR9Jg2lna4tEY5qBJjMmAaOBDDZWtlRjBXjLa0w53G/uBLA==";
      };
    }
    {
      name = "has_flag___has_flag_4.0.0.tgz";
      path = fetchurl {
        name = "has_flag___has_flag_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/has-flag/-/has-flag-4.0.0.tgz";
        sha512 = "EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==";
      };
    }
    {
      name = "hookable___hookable_5.5.3.tgz";
      path = fetchurl {
        name = "hookable___hookable_5.5.3.tgz";
        url  = "https://registry.yarnpkg.com/hookable/-/hookable-5.5.3.tgz";
        sha512 = "Yc+BQe8SvoXH1643Qez1zqLRmbA5rCL+sSmk6TVos0LWVfNIB7PGncdlId77WzLGSIB5KaWgTaNTs2lNVEI6VQ==";
      };
    }
    {
      name = "hookable___hookable_6.0.1.tgz";
      path = fetchurl {
        name = "hookable___hookable_6.0.1.tgz";
        url  = "https://registry.yarnpkg.com/hookable/-/hookable-6.0.1.tgz";
        sha512 = "uKGyY8BuzN/a5gvzvA+3FVWo0+wUjgtfSdnmjtrOVwQCZPHpHDH2WRO3VZSOeluYrHoDCiXFffZXs8Dj1ULWtw==";
      };
    }
    {
      name = "ignore___ignore_5.3.2.tgz";
      path = fetchurl {
        name = "ignore___ignore_5.3.2.tgz";
        url  = "https://registry.yarnpkg.com/ignore/-/ignore-5.3.2.tgz";
        sha512 = "hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==";
      };
    }
    {
      name = "ignore___ignore_7.0.5.tgz";
      path = fetchurl {
        name = "ignore___ignore_7.0.5.tgz";
        url  = "https://registry.yarnpkg.com/ignore/-/ignore-7.0.5.tgz";
        sha512 = "Hs59xBNfUIunMFgWAbGX5cq6893IbWg4KnrjbYwX3tx0ztorVgTDA6B2sxf8ejHJ4wz8BqGUMYlnzNBer5NvGg==";
      };
    }
    {
      name = "immediate___immediate_3.0.6.tgz";
      path = fetchurl {
        name = "immediate___immediate_3.0.6.tgz";
        url  = "https://registry.yarnpkg.com/immediate/-/immediate-3.0.6.tgz";
        sha512 = "XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==";
      };
    }
    {
      name = "immutable___immutable_5.1.4.tgz";
      path = fetchurl {
        name = "immutable___immutable_5.1.4.tgz";
        url  = "https://registry.yarnpkg.com/immutable/-/immutable-5.1.4.tgz";
        sha512 = "p6u1bG3YSnINT5RQmx/yRZBpenIl30kVxkTLDyHLIMk0gict704Q9n+thfDI7lTRm9vXdDYutVzXhzcThxTnXA==";
      };
    }
    {
      name = "import_fresh___import_fresh_3.3.1.tgz";
      path = fetchurl {
        name = "import_fresh___import_fresh_3.3.1.tgz";
        url  = "https://registry.yarnpkg.com/import-fresh/-/import-fresh-3.3.1.tgz";
        sha512 = "TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==";
      };
    }
    {
      name = "imurmurhash___imurmurhash_0.1.4.tgz";
      path = fetchurl {
        name = "imurmurhash___imurmurhash_0.1.4.tgz";
        url  = "https://registry.yarnpkg.com/imurmurhash/-/imurmurhash-0.1.4.tgz";
        sha512 = "JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==";
      };
    }
    {
      name = "is_docker___is_docker_3.0.0.tgz";
      path = fetchurl {
        name = "is_docker___is_docker_3.0.0.tgz";
        url  = "https://registry.yarnpkg.com/is-docker/-/is-docker-3.0.0.tgz";
        sha512 = "eljcgEDlEns/7AXFosB5K/2nCM4P7FQPkGc/DWLy5rmFEWvZayGrik1d9/QIY5nJ4f9YsVvBkA6kJpHn9rISdQ==";
      };
    }
    {
      name = "is_extglob___is_extglob_2.1.1.tgz";
      path = fetchurl {
        name = "is_extglob___is_extglob_2.1.1.tgz";
        url  = "https://registry.yarnpkg.com/is-extglob/-/is-extglob-2.1.1.tgz";
        sha512 = "SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==";
      };
    }
    {
      name = "is_glob___is_glob_4.0.3.tgz";
      path = fetchurl {
        name = "is_glob___is_glob_4.0.3.tgz";
        url  = "https://registry.yarnpkg.com/is-glob/-/is-glob-4.0.3.tgz";
        sha512 = "xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==";
      };
    }
    {
      name = "is_inside_container___is_inside_container_1.0.0.tgz";
      path = fetchurl {
        name = "is_inside_container___is_inside_container_1.0.0.tgz";
        url  = "https://registry.yarnpkg.com/is-inside-container/-/is-inside-container-1.0.0.tgz";
        sha512 = "KIYLCCJghfHZxqjYBE7rEy0OBuTd5xCHS7tHVgvCLkx7StIoaxwNW3hCALgEUjFfeRk+MG/Qxmp/vtETEF3tRA==";
      };
    }
    {
      name = "is_number___is_number_7.0.0.tgz";
      path = fetchurl {
        name = "is_number___is_number_7.0.0.tgz";
        url  = "https://registry.yarnpkg.com/is-number/-/is-number-7.0.0.tgz";
        sha512 = "41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==";
      };
    }
    {
      name = "is_what___is_what_5.5.0.tgz";
      path = fetchurl {
        name = "is_what___is_what_5.5.0.tgz";
        url  = "https://registry.yarnpkg.com/is-what/-/is-what-5.5.0.tgz";
        sha512 = "oG7cgbmg5kLYae2N5IVd3jm2s+vldjxJzK1pcu9LfpGuQ93MQSzo0okvRna+7y5ifrD+20FE8FvjusyGaz14fw==";
      };
    }
    {
      name = "is_wsl___is_wsl_3.1.0.tgz";
      path = fetchurl {
        name = "is_wsl___is_wsl_3.1.0.tgz";
        url  = "https://registry.yarnpkg.com/is-wsl/-/is-wsl-3.1.0.tgz";
        sha512 = "UcVfVfaK4Sc4m7X3dUSoHoozQGBEFeDC+zVo06t98xe8CzHSZZBekNXH+tu0NalHolcJ/QAGqS46Hef7QXBIMw==";
      };
    }
    {
      name = "isexe___isexe_2.0.0.tgz";
      path = fetchurl {
        name = "isexe___isexe_2.0.0.tgz";
        url  = "https://registry.yarnpkg.com/isexe/-/isexe-2.0.0.tgz";
        sha512 = "RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==";
      };
    }
    {
      name = "jiti___jiti_2.6.1.tgz";
      path = fetchurl {
        name = "jiti___jiti_2.6.1.tgz";
        url  = "https://registry.yarnpkg.com/jiti/-/jiti-2.6.1.tgz";
        sha512 = "ekilCSN1jwRvIbgeg/57YFh8qQDNbwDb9xT/qu2DAHbFFZUicIl4ygVaAvzveMhMVr3LnpSKTNnwt8PoOfmKhQ==";
      };
    }
    {
      name = "js_tokens___js_tokens_4.0.0.tgz";
      path = fetchurl {
        name = "js_tokens___js_tokens_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/js-tokens/-/js-tokens-4.0.0.tgz";
        sha512 = "RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==";
      };
    }
    {
      name = "js_yaml___js_yaml_4.1.1.tgz";
      path = fetchurl {
        name = "js_yaml___js_yaml_4.1.1.tgz";
        url  = "https://registry.yarnpkg.com/js-yaml/-/js-yaml-4.1.1.tgz";
        sha512 = "qQKT4zQxXl8lLwBtHMWwaTcGfFOZviOJet3Oy/xmGk2gZH677CJM9EvtfdSkgWcATZhj/55JZ0rmy3myCT5lsA==";
      };
    }
    {
      name = "jsesc___jsesc_3.1.0.tgz";
      path = fetchurl {
        name = "jsesc___jsesc_3.1.0.tgz";
        url  = "https://registry.yarnpkg.com/jsesc/-/jsesc-3.1.0.tgz";
        sha512 = "/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==";
      };
    }
    {
      name = "json_buffer___json_buffer_3.0.1.tgz";
      path = fetchurl {
        name = "json_buffer___json_buffer_3.0.1.tgz";
        url  = "https://registry.yarnpkg.com/json-buffer/-/json-buffer-3.0.1.tgz";
        sha512 = "4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==";
      };
    }
    {
      name = "json_schema_traverse___json_schema_traverse_0.4.1.tgz";
      path = fetchurl {
        name = "json_schema_traverse___json_schema_traverse_0.4.1.tgz";
        url  = "https://registry.yarnpkg.com/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz";
        sha512 = "xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==";
      };
    }
    {
      name = "json_stable_stringify_without_jsonify___json_stable_stringify_without_jsonify_1.0.1.tgz";
      path = fetchurl {
        name = "json_stable_stringify_without_jsonify___json_stable_stringify_without_jsonify_1.0.1.tgz";
        url  = "https://registry.yarnpkg.com/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz";
        sha512 = "Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==";
      };
    }
    {
      name = "json5___json5_2.2.3.tgz";
      path = fetchurl {
        name = "json5___json5_2.2.3.tgz";
        url  = "https://registry.yarnpkg.com/json5/-/json5-2.2.3.tgz";
        sha512 = "XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==";
      };
    }
    {
      name = "keyv___keyv_4.5.4.tgz";
      path = fetchurl {
        name = "keyv___keyv_4.5.4.tgz";
        url  = "https://registry.yarnpkg.com/keyv/-/keyv-4.5.4.tgz";
        sha512 = "oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==";
      };
    }
    {
      name = "kolorist___kolorist_1.8.0.tgz";
      path = fetchurl {
        name = "kolorist___kolorist_1.8.0.tgz";
        url  = "https://registry.yarnpkg.com/kolorist/-/kolorist-1.8.0.tgz";
        sha512 = "Y+60/zizpJ3HRH8DCss+q95yr6145JXZo46OTpFvDZWLfRCE4qChOyk1b26nMaNpfHHgxagk9dXT5OP0Tfe+dQ==";
      };
    }
    {
      name = "levn___levn_0.4.1.tgz";
      path = fetchurl {
        name = "levn___levn_0.4.1.tgz";
        url  = "https://registry.yarnpkg.com/levn/-/levn-0.4.1.tgz";
        sha512 = "+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==";
      };
    }
    {
      name = "lie___lie_3.1.1.tgz";
      path = fetchurl {
        name = "lie___lie_3.1.1.tgz";
        url  = "https://registry.yarnpkg.com/lie/-/lie-3.1.1.tgz";
        sha512 = "RiNhHysUjhrDQntfYSfY4MU24coXXdEOgw9WGcKHNeEwffDYbF//u87M1EWaMGzuFoSbqW0C9C6lEEhDOAswfw==";
      };
    }
    {
      name = "localforage___localforage_1.10.0.tgz";
      path = fetchurl {
        name = "localforage___localforage_1.10.0.tgz";
        url  = "https://registry.yarnpkg.com/localforage/-/localforage-1.10.0.tgz";
        sha512 = "14/H1aX7hzBBmmh7sGPd+AOMkkIrHM3Z1PAyGgZigA1H1p5O5ANnMyWzvpAETtG68/dC4pC0ncy3+PPGzXZHPg==";
      };
    }
    {
      name = "locate_path___locate_path_6.0.0.tgz";
      path = fetchurl {
        name = "locate_path___locate_path_6.0.0.tgz";
        url  = "https://registry.yarnpkg.com/locate-path/-/locate-path-6.0.0.tgz";
        sha512 = "iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==";
      };
    }
    {
      name = "lodash.merge___lodash.merge_4.6.2.tgz";
      path = fetchurl {
        name = "lodash.merge___lodash.merge_4.6.2.tgz";
        url  = "https://registry.yarnpkg.com/lodash.merge/-/lodash.merge-4.6.2.tgz";
        sha512 = "0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==";
      };
    }
    {
      name = "lru_cache___lru_cache_5.1.1.tgz";
      path = fetchurl {
        name = "lru_cache___lru_cache_5.1.1.tgz";
        url  = "https://registry.yarnpkg.com/lru-cache/-/lru-cache-5.1.1.tgz";
        sha512 = "KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==";
      };
    }
    {
      name = "magic_string___magic_string_0.30.21.tgz";
      path = fetchurl {
        name = "magic_string___magic_string_0.30.21.tgz";
        url  = "https://registry.yarnpkg.com/magic-string/-/magic-string-0.30.21.tgz";
        sha512 = "vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==";
      };
    }
    {
      name = "merge2___merge2_1.4.1.tgz";
      path = fetchurl {
        name = "merge2___merge2_1.4.1.tgz";
        url  = "https://registry.yarnpkg.com/merge2/-/merge2-1.4.1.tgz";
        sha512 = "8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==";
      };
    }
    {
      name = "micromatch___micromatch_4.0.8.tgz";
      path = fetchurl {
        name = "micromatch___micromatch_4.0.8.tgz";
        url  = "https://registry.yarnpkg.com/micromatch/-/micromatch-4.0.8.tgz";
        sha512 = "PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==";
      };
    }
    {
      name = "minimatch___minimatch_3.1.2.tgz";
      path = fetchurl {
        name = "minimatch___minimatch_3.1.2.tgz";
        url  = "https://registry.yarnpkg.com/minimatch/-/minimatch-3.1.2.tgz";
        sha512 = "J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==";
      };
    }
    {
      name = "minimatch___minimatch_9.0.5.tgz";
      path = fetchurl {
        name = "minimatch___minimatch_9.0.5.tgz";
        url  = "https://registry.yarnpkg.com/minimatch/-/minimatch-9.0.5.tgz";
        sha512 = "G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==";
      };
    }
    {
      name = "mitt___mitt_3.0.1.tgz";
      path = fetchurl {
        name = "mitt___mitt_3.0.1.tgz";
        url  = "https://registry.yarnpkg.com/mitt/-/mitt-3.0.1.tgz";
        sha512 = "vKivATfr97l2/QBCYAkXYDbrIWPM2IIKEl7YPhjCvKlG3kE2gm+uBo6nEXK3M5/Ffh/FLpKExzOQ3JJoJGFKBw==";
      };
    }
    {
      name = "mlly___mlly_1.8.0.tgz";
      path = fetchurl {
        name = "mlly___mlly_1.8.0.tgz";
        url  = "https://registry.yarnpkg.com/mlly/-/mlly-1.8.0.tgz";
        sha512 = "l8D9ODSRWLe2KHJSifWGwBqpTZXIXTeo8mlKjY+E2HAakaTeNpqAyBZ8GSqLzHgw4XmHmC8whvpjJNMbFZN7/g==";
      };
    }
    {
      name = "mrmime___mrmime_2.0.1.tgz";
      path = fetchurl {
        name = "mrmime___mrmime_2.0.1.tgz";
        url  = "https://registry.yarnpkg.com/mrmime/-/mrmime-2.0.1.tgz";
        sha512 = "Y3wQdFg2Va6etvQ5I82yUhGdsKrcYox6p7FfL1LbK2J4V01F9TGlepTIhnK24t7koZibmg82KGglhA1XK5IsLQ==";
      };
    }
    {
      name = "ms___ms_2.1.3.tgz";
      path = fetchurl {
        name = "ms___ms_2.1.3.tgz";
        url  = "https://registry.yarnpkg.com/ms/-/ms-2.1.3.tgz";
        sha512 = "6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==";
      };
    }
    {
      name = "muggle_string___muggle_string_0.4.1.tgz";
      path = fetchurl {
        name = "muggle_string___muggle_string_0.4.1.tgz";
        url  = "https://registry.yarnpkg.com/muggle-string/-/muggle-string-0.4.1.tgz";
        sha512 = "VNTrAak/KhO2i8dqqnqnAHOa3cYBwXEZe9h+D5h/1ZqFSTEFHdM65lR7RoIqq3tBBYavsOXV84NoHXZ0AkPyqQ==";
      };
    }
    {
      name = "nanoid___nanoid_3.3.11.tgz";
      path = fetchurl {
        name = "nanoid___nanoid_3.3.11.tgz";
        url  = "https://registry.yarnpkg.com/nanoid/-/nanoid-3.3.11.tgz";
        sha512 = "N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==";
      };
    }
    {
      name = "nanoid___nanoid_5.1.6.tgz";
      path = fetchurl {
        name = "nanoid___nanoid_5.1.6.tgz";
        url  = "https://registry.yarnpkg.com/nanoid/-/nanoid-5.1.6.tgz";
        sha512 = "c7+7RQ+dMB5dPwwCp4ee1/iV/q2P6aK1mTZcfr1BTuVlyW9hJYiMPybJCcnBlQtuSmTIWNeazm/zqNoZSSElBg==";
      };
    }
    {
      name = "natural_compare___natural_compare_1.4.0.tgz";
      path = fetchurl {
        name = "natural_compare___natural_compare_1.4.0.tgz";
        url  = "https://registry.yarnpkg.com/natural-compare/-/natural-compare-1.4.0.tgz";
        sha512 = "OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==";
      };
    }
    {
      name = "node_addon_api___node_addon_api_7.1.1.tgz";
      path = fetchurl {
        name = "node_addon_api___node_addon_api_7.1.1.tgz";
        url  = "https://registry.yarnpkg.com/node-addon-api/-/node-addon-api-7.1.1.tgz";
        sha512 = "5m3bsyrjFWE1xf7nz7YXdN4udnVtXK6/Yfgn5qnahL6bCkf2yKt4k3nuTKAtT4r3IG8JNR2ncsIMdZuAzJjHQQ==";
      };
    }
    {
      name = "node_releases___node_releases_2.0.27.tgz";
      path = fetchurl {
        name = "node_releases___node_releases_2.0.27.tgz";
        url  = "https://registry.yarnpkg.com/node-releases/-/node-releases-2.0.27.tgz";
        sha512 = "nmh3lCkYZ3grZvqcCH+fjmQ7X+H0OeZgP40OierEaAptX4XofMh5kwNbWh7lBduUzCcV/8kZ+NDLCwm2iorIlA==";
      };
    }
    {
      name = "nth_check___nth_check_2.1.1.tgz";
      path = fetchurl {
        name = "nth_check___nth_check_2.1.1.tgz";
        url  = "https://registry.yarnpkg.com/nth-check/-/nth-check-2.1.1.tgz";
        sha512 = "lqjrjmaOoAnWfMmBPL+XNnynZh2+swxiX3WUE0s4yEHI6m+AwrK2UZOimIRl3X/4QctVqS8AiZjFqyOGrMXb/w==";
      };
    }
    {
      name = "ohash___ohash_2.0.11.tgz";
      path = fetchurl {
        name = "ohash___ohash_2.0.11.tgz";
        url  = "https://registry.yarnpkg.com/ohash/-/ohash-2.0.11.tgz";
        sha512 = "RdR9FQrFwNBNXAr4GixM8YaRZRJ5PUWbKYbE5eOsrwAjJW0q2REGcf79oYPsLyskQCZG1PLN+S/K1V00joZAoQ==";
      };
    }
    {
      name = "open___open_10.2.0.tgz";
      path = fetchurl {
        name = "open___open_10.2.0.tgz";
        url  = "https://registry.yarnpkg.com/open/-/open-10.2.0.tgz";
        sha512 = "YgBpdJHPyQ2UE5x+hlSXcnejzAvD0b22U2OuAP+8OnlJT+PjWPxtgmGqKKc+RgTM63U9gN0YzrYc71R2WT/hTA==";
      };
    }
    {
      name = "optionator___optionator_0.9.4.tgz";
      path = fetchurl {
        name = "optionator___optionator_0.9.4.tgz";
        url  = "https://registry.yarnpkg.com/optionator/-/optionator-0.9.4.tgz";
        sha512 = "6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==";
      };
    }
    {
      name = "p_limit___p_limit_3.1.0.tgz";
      path = fetchurl {
        name = "p_limit___p_limit_3.1.0.tgz";
        url  = "https://registry.yarnpkg.com/p-limit/-/p-limit-3.1.0.tgz";
        sha512 = "TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==";
      };
    }
    {
      name = "p_locate___p_locate_5.0.0.tgz";
      path = fetchurl {
        name = "p_locate___p_locate_5.0.0.tgz";
        url  = "https://registry.yarnpkg.com/p-locate/-/p-locate-5.0.0.tgz";
        sha512 = "LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==";
      };
    }
    {
      name = "parent_module___parent_module_1.0.1.tgz";
      path = fetchurl {
        name = "parent_module___parent_module_1.0.1.tgz";
        url  = "https://registry.yarnpkg.com/parent-module/-/parent-module-1.0.1.tgz";
        sha512 = "GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==";
      };
    }
    {
      name = "path_browserify___path_browserify_1.0.1.tgz";
      path = fetchurl {
        name = "path_browserify___path_browserify_1.0.1.tgz";
        url  = "https://registry.yarnpkg.com/path-browserify/-/path-browserify-1.0.1.tgz";
        sha512 = "b7uo2UCUOYZcnF/3ID0lulOJi/bafxa1xPe7ZPsammBSpjSWQkjNxlt635YGS2MiR9GjvuXCtz2emr3jbsz98g==";
      };
    }
    {
      name = "path_exists___path_exists_4.0.0.tgz";
      path = fetchurl {
        name = "path_exists___path_exists_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/path-exists/-/path-exists-4.0.0.tgz";
        sha512 = "ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==";
      };
    }
    {
      name = "path_key___path_key_3.1.1.tgz";
      path = fetchurl {
        name = "path_key___path_key_3.1.1.tgz";
        url  = "https://registry.yarnpkg.com/path-key/-/path-key-3.1.1.tgz";
        sha512 = "ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==";
      };
    }
    {
      name = "pathe___pathe_2.0.3.tgz";
      path = fetchurl {
        name = "pathe___pathe_2.0.3.tgz";
        url  = "https://registry.yarnpkg.com/pathe/-/pathe-2.0.3.tgz";
        sha512 = "WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==";
      };
    }
    {
      name = "perfect_debounce___perfect_debounce_1.0.0.tgz";
      path = fetchurl {
        name = "perfect_debounce___perfect_debounce_1.0.0.tgz";
        url  = "https://registry.yarnpkg.com/perfect-debounce/-/perfect-debounce-1.0.0.tgz";
        sha512 = "xCy9V055GLEqoFaHoC1SoLIaLmWctgCUaBaWxDZ7/Zx4CTyX7cJQLJOok/orfjZAh9kEYpjJa4d0KcJmCbctZA==";
      };
    }
    {
      name = "perfect_debounce___perfect_debounce_2.1.0.tgz";
      path = fetchurl {
        name = "perfect_debounce___perfect_debounce_2.1.0.tgz";
        url  = "https://registry.yarnpkg.com/perfect-debounce/-/perfect-debounce-2.1.0.tgz";
        sha512 = "LjgdTytVFXeUgtHZr9WYViYSM/g8MkcTPYDlPa3cDqMirHjKiSZPYd6DoL7pK8AJQr+uWkQvCjHNdiMqsrJs+g==";
      };
    }
    {
      name = "picocolors___picocolors_1.1.1.tgz";
      path = fetchurl {
        name = "picocolors___picocolors_1.1.1.tgz";
        url  = "https://registry.yarnpkg.com/picocolors/-/picocolors-1.1.1.tgz";
        sha512 = "xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==";
      };
    }
    {
      name = "picomatch___picomatch_2.3.1.tgz";
      path = fetchurl {
        name = "picomatch___picomatch_2.3.1.tgz";
        url  = "https://registry.yarnpkg.com/picomatch/-/picomatch-2.3.1.tgz";
        sha512 = "JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==";
      };
    }
    {
      name = "picomatch___picomatch_4.0.3.tgz";
      path = fetchurl {
        name = "picomatch___picomatch_4.0.3.tgz";
        url  = "https://registry.yarnpkg.com/picomatch/-/picomatch-4.0.3.tgz";
        sha512 = "5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==";
      };
    }
    {
      name = "pinia___pinia_3.0.4.tgz";
      path = fetchurl {
        name = "pinia___pinia_3.0.4.tgz";
        url  = "https://registry.yarnpkg.com/pinia/-/pinia-3.0.4.tgz";
        sha512 = "l7pqLUFTI/+ESXn6k3nu30ZIzW5E2WZF/LaHJEpoq6ElcLD+wduZoB2kBN19du6K/4FDpPMazY2wJr+IndBtQw==";
      };
    }
    {
      name = "pkg_types___pkg_types_1.3.1.tgz";
      path = fetchurl {
        name = "pkg_types___pkg_types_1.3.1.tgz";
        url  = "https://registry.yarnpkg.com/pkg-types/-/pkg-types-1.3.1.tgz";
        sha512 = "/Jm5M4RvtBFVkKWRu2BLUTNP8/M2a+UwuAX+ae4770q1qVGtfjG+WTCupoZixokjmHiry8uI+dlY8KXYV5HVVQ==";
      };
    }
    {
      name = "postcss_selector_parser___postcss_selector_parser_7.1.1.tgz";
      path = fetchurl {
        name = "postcss_selector_parser___postcss_selector_parser_7.1.1.tgz";
        url  = "https://registry.yarnpkg.com/postcss-selector-parser/-/postcss-selector-parser-7.1.1.tgz";
        sha512 = "orRsuYpJVw8LdAwqqLykBj9ecS5/cRHlI5+nvTo8LcCKmzDmqVORXtOIYEEQuL9D4BxtA1lm5isAqzQZCoQ6Eg==";
      };
    }
    {
      name = "postcss_value_parser___postcss_value_parser_4.2.0.tgz";
      path = fetchurl {
        name = "postcss_value_parser___postcss_value_parser_4.2.0.tgz";
        url  = "https://registry.yarnpkg.com/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz";
        sha512 = "1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==";
      };
    }
    {
      name = "postcss___postcss_8.5.6.tgz";
      path = fetchurl {
        name = "postcss___postcss_8.5.6.tgz";
        url  = "https://registry.yarnpkg.com/postcss/-/postcss-8.5.6.tgz";
        sha512 = "3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg==";
      };
    }
    {
      name = "prelude_ls___prelude_ls_1.2.1.tgz";
      path = fetchurl {
        name = "prelude_ls___prelude_ls_1.2.1.tgz";
        url  = "https://registry.yarnpkg.com/prelude-ls/-/prelude-ls-1.2.1.tgz";
        sha512 = "vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==";
      };
    }
    {
      name = "prettier_linter_helpers___prettier_linter_helpers_1.0.1.tgz";
      path = fetchurl {
        name = "prettier_linter_helpers___prettier_linter_helpers_1.0.1.tgz";
        url  = "https://registry.yarnpkg.com/prettier-linter-helpers/-/prettier-linter-helpers-1.0.1.tgz";
        sha512 = "SxToR7P8Y2lWmv/kTzVLC1t/GDI2WGjMwNhLLE9qtH8Q13C+aEmuRlzDst4Up4s0Wc8sF2M+J57iB3cMLqftfg==";
      };
    }
    {
      name = "prettier___prettier_3.8.1.tgz";
      path = fetchurl {
        name = "prettier___prettier_3.8.1.tgz";
        url  = "https://registry.yarnpkg.com/prettier/-/prettier-3.8.1.tgz";
        sha512 = "UOnG6LftzbdaHZcKoPFtOcCKztrQ57WkHDeRD9t/PTQtmT0NHSeWWepj6pS0z/N7+08BHFDQVUrfmfMRcZwbMg==";
      };
    }
    {
      name = "punycode___punycode_2.3.1.tgz";
      path = fetchurl {
        name = "punycode___punycode_2.3.1.tgz";
        url  = "https://registry.yarnpkg.com/punycode/-/punycode-2.3.1.tgz";
        sha512 = "vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==";
      };
    }
    {
      name = "queue_microtask___queue_microtask_1.2.3.tgz";
      path = fetchurl {
        name = "queue_microtask___queue_microtask_1.2.3.tgz";
        url  = "https://registry.yarnpkg.com/queue-microtask/-/queue-microtask-1.2.3.tgz";
        sha512 = "NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==";
      };
    }
    {
      name = "readdirp___readdirp_4.1.2.tgz";
      path = fetchurl {
        name = "readdirp___readdirp_4.1.2.tgz";
        url  = "https://registry.yarnpkg.com/readdirp/-/readdirp-4.1.2.tgz";
        sha512 = "GDhwkLfywWL2s6vEjyhri+eXmfH6j1L7JE27WhqLeYzoh/A3DBaYGEj2H/HFZCn/kMfim73FXxEJTw06WtxQwg==";
      };
    }
    {
      name = "requireindex___requireindex_1.2.0.tgz";
      path = fetchurl {
        name = "requireindex___requireindex_1.2.0.tgz";
        url  = "https://registry.yarnpkg.com/requireindex/-/requireindex-1.2.0.tgz";
        sha512 = "L9jEkOi3ASd9PYit2cwRfyppc9NoABujTP8/5gFcbERmo5jUoAKovIC3fsF17pkTnGsrByysqX+Kxd2OTNI1ww==";
      };
    }
    {
      name = "resolve_from___resolve_from_4.0.0.tgz";
      path = fetchurl {
        name = "resolve_from___resolve_from_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/resolve-from/-/resolve-from-4.0.0.tgz";
        sha512 = "pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==";
      };
    }
    {
      name = "reusify___reusify_1.1.0.tgz";
      path = fetchurl {
        name = "reusify___reusify_1.1.0.tgz";
        url  = "https://registry.yarnpkg.com/reusify/-/reusify-1.1.0.tgz";
        sha512 = "g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==";
      };
    }
    {
      name = "rfdc___rfdc_1.4.1.tgz";
      path = fetchurl {
        name = "rfdc___rfdc_1.4.1.tgz";
        url  = "https://registry.yarnpkg.com/rfdc/-/rfdc-1.4.1.tgz";
        sha512 = "q1b3N5QkRUWUl7iyylaaj3kOpIT0N2i9MqIEQXP73GVsN9cw3fdx8X63cEmWhJGi2PPCF23Ijp7ktmd39rawIA==";
      };
    }
    {
      name = "roboto_fontface___roboto_fontface_0.10.0.tgz";
      path = fetchurl {
        name = "roboto_fontface___roboto_fontface_0.10.0.tgz";
        url  = "https://registry.yarnpkg.com/roboto-fontface/-/roboto-fontface-0.10.0.tgz";
        sha512 = "OlwfYEgA2RdboZohpldlvJ1xngOins5d7ejqnIBWr9KaMxsnBqotpptRXTyfNRLnFpqzX6sTDt+X+a+6udnU8g==";
      };
    }
    {
      name = "rollup___rollup_4.56.0.tgz";
      path = fetchurl {
        name = "rollup___rollup_4.56.0.tgz";
        url  = "https://registry.yarnpkg.com/rollup/-/rollup-4.56.0.tgz";
        sha512 = "9FwVqlgUHzbXtDg9RCMgodF3Ua4Na6Gau+Sdt9vyCN4RhHfVKX2DCHy3BjMLTDd47ITDhYAnTwGulWTblJSDLg==";
      };
    }
    {
      name = "run_applescript___run_applescript_7.1.0.tgz";
      path = fetchurl {
        name = "run_applescript___run_applescript_7.1.0.tgz";
        url  = "https://registry.yarnpkg.com/run-applescript/-/run-applescript-7.1.0.tgz";
        sha512 = "DPe5pVFaAsinSaV6QjQ6gdiedWDcRCbUuiQfQa2wmWV7+xC9bGulGI8+TdRmoFkAPaBXk8CrAbnlY2ISniJ47Q==";
      };
    }
    {
      name = "run_parallel___run_parallel_1.2.0.tgz";
      path = fetchurl {
        name = "run_parallel___run_parallel_1.2.0.tgz";
        url  = "https://registry.yarnpkg.com/run-parallel/-/run-parallel-1.2.0.tgz";
        sha512 = "5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==";
      };
    }
    {
      name = "sass___sass_1.97.3.tgz";
      path = fetchurl {
        name = "sass___sass_1.97.3.tgz";
        url  = "https://registry.yarnpkg.com/sass/-/sass-1.97.3.tgz";
        sha512 = "fDz1zJpd5GycprAbu4Q2PV/RprsRtKC/0z82z0JLgdytmcq0+ujJbJ/09bPGDxCLkKY3Np5cRAOcWiVkLXJURg==";
      };
    }
    {
      name = "semver___semver_6.3.1.tgz";
      path = fetchurl {
        name = "semver___semver_6.3.1.tgz";
        url  = "https://registry.yarnpkg.com/semver/-/semver-6.3.1.tgz";
        sha512 = "BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==";
      };
    }
    {
      name = "semver___semver_7.7.3.tgz";
      path = fetchurl {
        name = "semver___semver_7.7.3.tgz";
        url  = "https://registry.yarnpkg.com/semver/-/semver-7.7.3.tgz";
        sha512 = "SdsKMrI9TdgjdweUSR9MweHA4EJ8YxHn8DFaDisvhVlUOe4BF1tLD7GAj0lIqWVl+dPb/rExr0Btby5loQm20Q==";
      };
    }
    {
      name = "shebang_command___shebang_command_2.0.0.tgz";
      path = fetchurl {
        name = "shebang_command___shebang_command_2.0.0.tgz";
        url  = "https://registry.yarnpkg.com/shebang-command/-/shebang-command-2.0.0.tgz";
        sha512 = "kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==";
      };
    }
    {
      name = "shebang_regex___shebang_regex_3.0.0.tgz";
      path = fetchurl {
        name = "shebang_regex___shebang_regex_3.0.0.tgz";
        url  = "https://registry.yarnpkg.com/shebang-regex/-/shebang-regex-3.0.0.tgz";
        sha512 = "7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==";
      };
    }
    {
      name = "sirv___sirv_3.0.2.tgz";
      path = fetchurl {
        name = "sirv___sirv_3.0.2.tgz";
        url  = "https://registry.yarnpkg.com/sirv/-/sirv-3.0.2.tgz";
        sha512 = "2wcC/oGxHis/BoHkkPwldgiPSYcpZK3JU28WoMVv55yHJgcZ8rlXvuG9iZggz+sU1d4bRgIGASwyWqjxu3FM0g==";
      };
    }
    {
      name = "sortablejs___sortablejs_1.14.0.tgz";
      path = fetchurl {
        name = "sortablejs___sortablejs_1.14.0.tgz";
        url  = "https://registry.yarnpkg.com/sortablejs/-/sortablejs-1.14.0.tgz";
        sha512 = "pBXvQCs5/33fdN1/39pPL0NZF20LeRbLQ5jtnheIPN9JQAaufGjKdWduZn4U7wCtVuzKhmRkI0DFYHYRbB2H1w==";
      };
    }
    {
      name = "source_map_js___source_map_js_1.2.1.tgz";
      path = fetchurl {
        name = "source_map_js___source_map_js_1.2.1.tgz";
        url  = "https://registry.yarnpkg.com/source-map-js/-/source-map-js-1.2.1.tgz";
        sha512 = "UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==";
      };
    }
    {
      name = "speakingurl___speakingurl_14.0.1.tgz";
      path = fetchurl {
        name = "speakingurl___speakingurl_14.0.1.tgz";
        url  = "https://registry.yarnpkg.com/speakingurl/-/speakingurl-14.0.1.tgz";
        sha512 = "1POYv7uv2gXoyGFpBCmpDVSNV74IfsWlDW216UPjbWufNf+bSU6GdbDsxdcxtfwb4xlI3yxzOTKClUosxARYrQ==";
      };
    }
    {
      name = "strip_json_comments___strip_json_comments_3.1.1.tgz";
      path = fetchurl {
        name = "strip_json_comments___strip_json_comments_3.1.1.tgz";
        url  = "https://registry.yarnpkg.com/strip-json-comments/-/strip-json-comments-3.1.1.tgz";
        sha512 = "6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==";
      };
    }
    {
      name = "superjson___superjson_2.2.6.tgz";
      path = fetchurl {
        name = "superjson___superjson_2.2.6.tgz";
        url  = "https://registry.yarnpkg.com/superjson/-/superjson-2.2.6.tgz";
        sha512 = "H+ue8Zo4vJmV2nRjpx86P35lzwDT3nItnIsocgumgr0hHMQ+ZGq5vrERg9kJBo5AWGmxZDhzDo+WVIJqkB0cGA==";
      };
    }
    {
      name = "supports_color___supports_color_7.2.0.tgz";
      path = fetchurl {
        name = "supports_color___supports_color_7.2.0.tgz";
        url  = "https://registry.yarnpkg.com/supports-color/-/supports-color-7.2.0.tgz";
        sha512 = "qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==";
      };
    }
    {
      name = "synckit___synckit_0.11.12.tgz";
      path = fetchurl {
        name = "synckit___synckit_0.11.12.tgz";
        url  = "https://registry.yarnpkg.com/synckit/-/synckit-0.11.12.tgz";
        sha512 = "Bh7QjT8/SuKUIfObSXNHNSK6WHo6J1tHCqJsuaFDP7gP0fkzSfTxI8y85JrppZ0h8l0maIgc2tfuZQ6/t3GtnQ==";
      };
    }
    {
      name = "tinyglobby___tinyglobby_0.2.15.tgz";
      path = fetchurl {
        name = "tinyglobby___tinyglobby_0.2.15.tgz";
        url  = "https://registry.yarnpkg.com/tinyglobby/-/tinyglobby-0.2.15.tgz";
        sha512 = "j2Zq4NyQYG5XMST4cbs02Ak8iJUdxRM0XI5QyxXuZOzKOINmWurp3smXu3y5wDcJrptwpSjgXHzIQxR0omXljQ==";
      };
    }
    {
      name = "to_regex_range___to_regex_range_5.0.1.tgz";
      path = fetchurl {
        name = "to_regex_range___to_regex_range_5.0.1.tgz";
        url  = "https://registry.yarnpkg.com/to-regex-range/-/to-regex-range-5.0.1.tgz";
        sha512 = "65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==";
      };
    }
    {
      name = "totalist___totalist_3.0.1.tgz";
      path = fetchurl {
        name = "totalist___totalist_3.0.1.tgz";
        url  = "https://registry.yarnpkg.com/totalist/-/totalist-3.0.1.tgz";
        sha512 = "sf4i37nQ2LBx4m3wB74y+ubopq6W/dIzXg0FDGjsYnZHVa1Da8FH853wlL2gtUhg+xJXjfk3kUZS3BRoQeoQBQ==";
      };
    }
    {
      name = "ts_api_utils___ts_api_utils_2.4.0.tgz";
      path = fetchurl {
        name = "ts_api_utils___ts_api_utils_2.4.0.tgz";
        url  = "https://registry.yarnpkg.com/ts-api-utils/-/ts-api-utils-2.4.0.tgz";
        sha512 = "3TaVTaAv2gTiMB35i3FiGJaRfwb3Pyn/j3m/bfAvGe8FB7CF6u+LMYqYlDh7reQf7UNvoTvdfAqHGmPGOSsPmA==";
      };
    }
    {
      name = "type_check___type_check_0.4.0.tgz";
      path = fetchurl {
        name = "type_check___type_check_0.4.0.tgz";
        url  = "https://registry.yarnpkg.com/type-check/-/type-check-0.4.0.tgz";
        sha512 = "XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==";
      };
    }
    {
      name = "typescript_eslint___typescript_eslint_8.53.1.tgz";
      path = fetchurl {
        name = "typescript_eslint___typescript_eslint_8.53.1.tgz";
        url  = "https://registry.yarnpkg.com/typescript-eslint/-/typescript-eslint-8.53.1.tgz";
        sha512 = "gB+EVQfP5RDElh9ittfXlhZJdjSU4jUSTyE2+ia8CYyNvet4ElfaLlAIqDvQV9JPknKx0jQH1racTYe/4LaLSg==";
      };
    }
    {
      name = "typescript___typescript_5.9.3.tgz";
      path = fetchurl {
        name = "typescript___typescript_5.9.3.tgz";
        url  = "https://registry.yarnpkg.com/typescript/-/typescript-5.9.3.tgz";
        sha512 = "jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==";
      };
    }
    {
      name = "ufo___ufo_1.6.3.tgz";
      path = fetchurl {
        name = "ufo___ufo_1.6.3.tgz";
        url  = "https://registry.yarnpkg.com/ufo/-/ufo-1.6.3.tgz";
        sha512 = "yDJTmhydvl5lJzBmy/hyOAA0d+aqCBuwl818haVdYCRrWV84o7YyeVm4QlVHStqNrrJSTb6jKuFAVqAFsr+K3Q==";
      };
    }
    {
      name = "undici_types___undici_types_6.21.0.tgz";
      path = fetchurl {
        name = "undici_types___undici_types_6.21.0.tgz";
        url  = "https://registry.yarnpkg.com/undici-types/-/undici-types-6.21.0.tgz";
        sha512 = "iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==";
      };
    }
    {
      name = "unhead___unhead_2.1.2.tgz";
      path = fetchurl {
        name = "unhead___unhead_2.1.2.tgz";
        url  = "https://registry.yarnpkg.com/unhead/-/unhead-2.1.2.tgz";
        sha512 = "vSihrxyb+zsEUfEbraZBCjdE0p/WSoc2NGDrpwwSNAwuPxhYK1nH3eegf02IENLpn1sUhL8IoO84JWmRQ6tILA==";
      };
    }
    {
      name = "unplugin_utils___unplugin_utils_0.3.1.tgz";
      path = fetchurl {
        name = "unplugin_utils___unplugin_utils_0.3.1.tgz";
        url  = "https://registry.yarnpkg.com/unplugin-utils/-/unplugin-utils-0.3.1.tgz";
        sha512 = "5lWVjgi6vuHhJ526bI4nlCOmkCIF3nnfXkCMDeMJrtdvxTs6ZFCM8oNufGTsDbKv/tJ/xj8RpvXjRuPBZJuJog==";
      };
    }
    {
      name = "upath___upath_2.0.1.tgz";
      path = fetchurl {
        name = "upath___upath_2.0.1.tgz";
        url  = "https://registry.yarnpkg.com/upath/-/upath-2.0.1.tgz";
        sha512 = "1uEe95xksV1O0CYKXo8vQvN1JEbtJp7lb7C5U9HMsIp6IVwntkH/oNUzyVNQSd4S1sYk2FpSSW44FqMc8qee5w==";
      };
    }
    {
      name = "update_browserslist_db___update_browserslist_db_1.2.3.tgz";
      path = fetchurl {
        name = "update_browserslist_db___update_browserslist_db_1.2.3.tgz";
        url  = "https://registry.yarnpkg.com/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz";
        sha512 = "Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==";
      };
    }
    {
      name = "uri_js___uri_js_4.4.1.tgz";
      path = fetchurl {
        name = "uri_js___uri_js_4.4.1.tgz";
        url  = "https://registry.yarnpkg.com/uri-js/-/uri-js-4.4.1.tgz";
        sha512 = "7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==";
      };
    }
    {
      name = "util_deprecate___util_deprecate_1.0.2.tgz";
      path = fetchurl {
        name = "util_deprecate___util_deprecate_1.0.2.tgz";
        url  = "https://registry.yarnpkg.com/util-deprecate/-/util-deprecate-1.0.2.tgz";
        sha512 = "EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==";
      };
    }
    {
      name = "vite_dev_rpc___vite_dev_rpc_1.1.0.tgz";
      path = fetchurl {
        name = "vite_dev_rpc___vite_dev_rpc_1.1.0.tgz";
        url  = "https://registry.yarnpkg.com/vite-dev-rpc/-/vite-dev-rpc-1.1.0.tgz";
        sha512 = "pKXZlgoXGoE8sEKiKJSng4hI1sQ4wi5YT24FCrwrLt6opmkjlqPPVmiPWWJn8M8byMxRGzp1CrFuqQs4M/Z39A==";
      };
    }
    {
      name = "vite_hot_client___vite_hot_client_2.1.0.tgz";
      path = fetchurl {
        name = "vite_hot_client___vite_hot_client_2.1.0.tgz";
        url  = "https://registry.yarnpkg.com/vite-hot-client/-/vite-hot-client-2.1.0.tgz";
        sha512 = "7SpgZmU7R+dDnSmvXE1mfDtnHLHQSisdySVR7lO8ceAXvM0otZeuQQ6C8LrS5d/aYyP/QZ0hI0L+dIPrm4YlFQ==";
      };
    }
    {
      name = "vite_plugin_inspect___vite_plugin_inspect_11.3.3.tgz";
      path = fetchurl {
        name = "vite_plugin_inspect___vite_plugin_inspect_11.3.3.tgz";
        url  = "https://registry.yarnpkg.com/vite-plugin-inspect/-/vite-plugin-inspect-11.3.3.tgz";
        sha512 = "u2eV5La99oHoYPHE6UvbwgEqKKOQGz86wMg40CCosP6q8BkB6e5xPneZfYagK4ojPJSj5anHCrnvC20DpwVdRA==";
      };
    }
    {
      name = "vite_plugin_vue_devtools___vite_plugin_vue_devtools_8.0.5.tgz";
      path = fetchurl {
        name = "vite_plugin_vue_devtools___vite_plugin_vue_devtools_8.0.5.tgz";
        url  = "https://registry.yarnpkg.com/vite-plugin-vue-devtools/-/vite-plugin-vue-devtools-8.0.5.tgz";
        sha512 = "p619BlKFOqQXJ6uDWS1vUPQzuJOD6xJTfftj57JXBGoBD/yeQCowR7pnWcr/FEX4/HVkFbreI6w2uuGBmQOh6A==";
      };
    }
    {
      name = "vite_plugin_vue_inspector___vite_plugin_vue_inspector_5.3.2.tgz";
      path = fetchurl {
        name = "vite_plugin_vue_inspector___vite_plugin_vue_inspector_5.3.2.tgz";
        url  = "https://registry.yarnpkg.com/vite-plugin-vue-inspector/-/vite-plugin-vue-inspector-5.3.2.tgz";
        sha512 = "YvEKooQcSiBTAs0DoYLfefNja9bLgkFM7NI2b07bE2SruuvX0MEa9cMaxjKVMkeCp5Nz9FRIdcN1rOdFVBeL6Q==";
      };
    }
    {
      name = "vite_plugin_vuetify___vite_plugin_vuetify_2.1.3.tgz";
      path = fetchurl {
        name = "vite_plugin_vuetify___vite_plugin_vuetify_2.1.3.tgz";
        url  = "https://registry.yarnpkg.com/vite-plugin-vuetify/-/vite-plugin-vuetify-2.1.3.tgz";
        sha512 = "Q4SC/4TqbNvaZIFb9YsfBqkGlYHbJJJ6uU3CnRBZqLUF3s5eCMVZAaV4GkTbehIH/bhSj42lMXztOwc71u6rVw==";
      };
    }
    {
      name = "vite___vite_7.3.1.tgz";
      path = fetchurl {
        name = "vite___vite_7.3.1.tgz";
        url  = "https://registry.yarnpkg.com/vite/-/vite-7.3.1.tgz";
        sha512 = "w+N7Hifpc3gRjZ63vYBXA56dvvRlNWRczTdmCBBa+CotUzAPf5b7YMdMR/8CQoeYE5LX3W4wj6RYTgonm1b9DA==";
      };
    }
    {
      name = "vscode_uri___vscode_uri_3.1.0.tgz";
      path = fetchurl {
        name = "vscode_uri___vscode_uri_3.1.0.tgz";
        url  = "https://registry.yarnpkg.com/vscode-uri/-/vscode-uri-3.1.0.tgz";
        sha512 = "/BpdSx+yCQGnCvecbyXdxHDkuk55/G3xwnC0GqY4gmQ3j+A+g8kzzgB4Nk/SINjqn6+waqw3EgbVF2QKExkRxQ==";
      };
    }
    {
      name = "vue_eslint_parser___vue_eslint_parser_10.2.0.tgz";
      path = fetchurl {
        name = "vue_eslint_parser___vue_eslint_parser_10.2.0.tgz";
        url  = "https://registry.yarnpkg.com/vue-eslint-parser/-/vue-eslint-parser-10.2.0.tgz";
        sha512 = "CydUvFOQKD928UzZhTp4pr2vWz1L+H99t7Pkln2QSPdvmURT0MoC4wUccfCnuEaihNsu9aYYyk+bep8rlfkUXw==";
      };
    }
    {
      name = "vue_global_events___vue_global_events_3.0.1.tgz";
      path = fetchurl {
        name = "vue_global_events___vue_global_events_3.0.1.tgz";
        url  = "https://registry.yarnpkg.com/vue-global-events/-/vue-global-events-3.0.1.tgz";
        sha512 = "9S7S3bG0XDBnpm2DJSSjpx6xIX/YIleycpnvmRRYSdiMltnzRfJQ8uVB3QX5eCLkmiv/Udg9UjO2wwpTO5LDvQ==";
      };
    }
    {
      name = "vue_i18n___vue_i18n_11.2.8.tgz";
      path = fetchurl {
        name = "vue_i18n___vue_i18n_11.2.8.tgz";
        url  = "https://registry.yarnpkg.com/vue-i18n/-/vue-i18n-11.2.8.tgz";
        sha512 = "vJ123v/PXCZntd6Qj5Jumy7UBmIuE92VrtdX+AXr+1WzdBHojiBxnAxdfctUFL+/JIN+VQH4BhsfTtiGsvVObg==";
      };
    }
    {
      name = "vue_router___vue_router_4.6.4.tgz";
      path = fetchurl {
        name = "vue_router___vue_router_4.6.4.tgz";
        url  = "https://registry.yarnpkg.com/vue-router/-/vue-router-4.6.4.tgz";
        sha512 = "Hz9q5sa33Yhduglwz6g9skT8OBPii+4bFn88w6J+J4MfEo4KRRpmiNG/hHHkdbRFlLBOqxN8y8gf2Fb0MTUgVg==";
      };
    }
    {
      name = "vue_tsc___vue_tsc_3.2.3.tgz";
      path = fetchurl {
        name = "vue_tsc___vue_tsc_3.2.3.tgz";
        url  = "https://registry.yarnpkg.com/vue-tsc/-/vue-tsc-3.2.3.tgz";
        sha512 = "1RdRB7rQXGFMdpo0aXf9spVzWEPGAk7PEb/ejHQwVrcuQA/HsGiixIc3uBQeqY2YjeEEgvr2ShQewBgcN4c1Cw==";
      };
    }
    {
      name = "vue___vue_3.5.27.tgz";
      path = fetchurl {
        name = "vue___vue_3.5.27.tgz";
        url  = "https://registry.yarnpkg.com/vue/-/vue-3.5.27.tgz";
        sha512 = "aJ/UtoEyFySPBGarREmN4z6qNKpbEguYHMmXSiOGk69czc+zhs0NF6tEFrY8TZKAl8N/LYAkd4JHVd5E/AsSmw==";
      };
    }
    {
      name = "vuedraggable___vuedraggable_4.1.0.tgz";
      path = fetchurl {
        name = "vuedraggable___vuedraggable_4.1.0.tgz";
        url  = "https://registry.yarnpkg.com/vuedraggable/-/vuedraggable-4.1.0.tgz";
        sha512 = "FU5HCWBmsf20GpP3eudURW3WdWTKIbEIQxh9/8GE806hydR9qZqRRxRE3RjqX7PkuLuMQG/A7n3cfj9rCEchww==";
      };
    }
    {
      name = "vuetify___vuetify_3.11.7.tgz";
      path = fetchurl {
        name = "vuetify___vuetify_3.11.7.tgz";
        url  = "https://registry.yarnpkg.com/vuetify/-/vuetify-3.11.7.tgz";
        sha512 = "3nK1mKTXQRbU4QXukV4WIbs5YZgMK19flHpFq3pU+6Fpa5YLB8RyyK1BLWAW8JmhSVcaqVUcB/EJ3oJ8g3XNCw==";
      };
    }
    {
      name = "which___which_2.0.2.tgz";
      path = fetchurl {
        name = "which___which_2.0.2.tgz";
        url  = "https://registry.yarnpkg.com/which/-/which-2.0.2.tgz";
        sha512 = "BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==";
      };
    }
    {
      name = "word_wrap___word_wrap_1.2.5.tgz";
      path = fetchurl {
        name = "word_wrap___word_wrap_1.2.5.tgz";
        url  = "https://registry.yarnpkg.com/word-wrap/-/word-wrap-1.2.5.tgz";
        sha512 = "BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==";
      };
    }
    {
      name = "wsl_utils___wsl_utils_0.1.0.tgz";
      path = fetchurl {
        name = "wsl_utils___wsl_utils_0.1.0.tgz";
        url  = "https://registry.yarnpkg.com/wsl-utils/-/wsl-utils-0.1.0.tgz";
        sha512 = "h3Fbisa2nKGPxCpm89Hk33lBLsnaGBvctQopaBSOW/uIs6FTe1ATyAnKFJrzVs9vpGdsTe73WF3V4lIsk4Gacw==";
      };
    }
    {
      name = "xml_name_validator___xml_name_validator_4.0.0.tgz";
      path = fetchurl {
        name = "xml_name_validator___xml_name_validator_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/xml-name-validator/-/xml-name-validator-4.0.0.tgz";
        sha512 = "ICP2e+jsHvAj2E2lIHxa5tjXRlKDJo4IdvPvCXbXQGdzSfmSpNVyIKMvoZHjDY9DP0zV17iI85o90vRFXNccRw==";
      };
    }
    {
      name = "yallist___yallist_3.1.1.tgz";
      path = fetchurl {
        name = "yallist___yallist_3.1.1.tgz";
        url  = "https://registry.yarnpkg.com/yallist/-/yallist-3.1.1.tgz";
        sha512 = "a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==";
      };
    }
    {
      name = "yocto_queue___yocto_queue_0.1.0.tgz";
      path = fetchurl {
        name = "yocto_queue___yocto_queue_0.1.0.tgz";
        url  = "https://registry.yarnpkg.com/yocto-queue/-/yocto-queue-0.1.0.tgz";
        sha512 = "rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==";
      };
    }
  ];
}
