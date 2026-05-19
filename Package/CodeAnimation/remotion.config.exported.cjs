"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// remotion.config.exported.cts
var remotion_config_exported_exports = {};
__export(remotion_config_exported_exports, {
  ApplyBaseConfig: () => ApplyBaseConfig,
  ApplyDefaultConfig: () => ApplyDefaultConfig,
  DefaultCodeHikeConfig: () => DefaultCodeHikeConfig,
  EnableMdx: () => EnableMdx
});
module.exports = __toCommonJS(remotion_config_exported_exports);
var Fs = __toESM(require("fs"));
var Path = __toESM(require("path"));
var import_config = require("@remotion/cli/config");
var DefaultCodeHikeConfig = {
  syntaxHighlighting: {
    theme: "github-dark"
  }
};
var TsConfigPath = Path.resolve(process.cwd(), "tsconfig.json");
var TsConfigRaw = JSON.parse(Fs.readFileSync(TsConfigPath, "utf-8"));
async function EnableMdx(CurrentConfiguration) {
  const { remarkCodeHike, recmaCodeHike } = await import("@sorrell/codehike/mdx");
  function HandleTsConfig(Rule) {
    if (typeof Rule !== "object" || Rule === null || !("use" in Rule)) {
      return void 0;
    }
    const UseValue = Rule.use;
    if (!Array.isArray(UseValue)) {
      return Rule;
    }
    return {
      ...Rule,
      use: UseValue.map((LoaderEntry) => {
        if (typeof LoaderEntry === "object" && LoaderEntry !== null && "loader" in LoaderEntry && typeof LoaderEntry.loader === "string" && LoaderEntry.loader.includes("esbuild-loader")) {
          return {
            ...LoaderEntry,
            options: {
              ...LoaderEntry.options ?? {},
              tsconfigRaw: TsConfigRaw
            }
          };
        }
        return LoaderEntry;
      })
    };
  }
  const InitialRules = [
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ...(CurrentConfiguration.module || { rules: [] }).rules || [],
    {
      test: /\.mdx?$/,
      use: [
        {
          loader: "@mdx-js/loader",
          options: {
            recmaPlugins: [[recmaCodeHike, DefaultCodeHikeConfig]],
            remarkPlugins: [[remarkCodeHike, DefaultCodeHikeConfig]]
          }
        }
      ]
    }
  ];
  const rules = InitialRules.map(HandleTsConfig).filter((Rule) => {
    return Rule !== void 0;
  });
  return {
    ...CurrentConfiguration,
    module: {
      ...CurrentConfiguration.module,
      rules
    }
  };
}
function ApplyBaseConfig() {
  import_config.Config.overrideWebpackConfig(EnableMdx);
}
function ApplyDefaultConfig(EntryPoint = "./Source/index.tsx") {
  ApplyBaseConfig();
  import_config.Config.setVideoImageFormat("jpeg");
  import_config.Config.setEntryPoint(EntryPoint);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApplyBaseConfig,
  ApplyDefaultConfig,
  DefaultCodeHikeConfig,
  EnableMdx
});
/**
 * @file      remotion.config.exported.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
