const tsConfigPaths = require("tsconfig-paths");
const tsConfig = require("./tsconfig.json");

const baseUrl = "./dist"; // This should be the same as the outDir in tsconfig.json

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
