// @ts-check

/** This script sets up a Svelte project to support TypeScript in `.svelte` files
 *  with <script lang="ts"> and validates the code with svelte-check.
 */

import fs from 'fs';
import path from 'path';
import url from 'url';
import { argv } from 'process';

// Resolve paths
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = argv[2] || path.join(__dirname, "..");

// Helper function to write JSON files with formatting
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Update `package.json` dependencies and scripts
const packageJSONPath = path.join(projectRoot, "package.json");
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));

packageJSON.devDependencies = {
  ...packageJSON.devDependencies,
  "svelte-check": "^3.0.0",
  "svelte-preprocess": "^5.0.0",
  "@rollup/plugin-typescript": "^11.0.0",
  "typescript": "^4.9.0",
  "tslib": "^2.5.0",
  "@tsconfig/svelte": "^3.0.0"
};

packageJSON.scripts = {
  ...packageJSON.scripts,
  "check": "svelte-check"
};

writeJSON(packageJSONPath, packageJSON);

// Rename `src/main.js` to `src/main.ts`
const mainJSPath = path.join(projectRoot, "src", "main.js");
const mainTSPath = path.join(projectRoot, "src", "main.ts");
if (fs.existsSync(mainJSPath)) {
  fs.renameSync(mainJSPath, mainTSPath);
}

// Update `App.svelte` to use TypeScript
const appSveltePath = path.join(projectRoot, "src", "App.svelte");
if (fs.existsSync(appSveltePath)) {
  let appFile = fs.readFileSync(appSveltePath, "utf-8");
  appFile = appFile.replace("<script>", '<script lang="ts">');
  appFile = appFile.replace("export let name;", 'export let name: string;');
  fs.writeFileSync(appSveltePath, appFile);
}

// Update `rollup.config.js` to support TypeScript
const rollupConfigPath = path.join(projectRoot, "rollup.config.js");
if (fs.existsSync(rollupConfigPath)) {
  let rollupConfig = fs.readFileSync(rollupConfigPath, "utf-8");

  rollupConfig = rollupConfig.replace(
    `'rollup-plugin-css-only';`,
    `'rollup-plugin-css-only';\nimport sveltePreprocess from 'svelte-preprocess';\nimport typescript from '@rollup/plugin-typescript';`
  );

  rollupConfig = rollupConfig.replace(`'src/main.js'`, `'src/main.ts'`);

  rollupConfig = rollupConfig.replace(
    'compilerOptions:',
    'preprocess: sveltePreprocess({ sourceMap: !production }),\n\t\t\tcompilerOptions:'
  );

  rollupConfig = rollupConfig.replace(
    'commonjs(),',
    'commonjs(),\n\t\ttypescript({\n\t\t\tsourceMap: !production,\n\t\t\tinlineSources: !production\n\t\t}),'
  );

  fs.writeFileSync(rollupConfigPath, rollupConfig);
}

// Create `tsconfig.json`
const tsconfigPath = path.join(projectRoot, "tsconfig.json");
fs.writeFileSync(
  tsconfigPath,
  `{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"]
}`
);

// Create `svelte.config.js`
const svelteConfigPath = path.join(projectRoot, "svelte.config.js");
fs.writeFileSync(
  svelteConfigPath,
  `import sveltePreprocess from 'svelte-preprocess';

export default {
  preprocess: sveltePreprocess()
};
`
);

// Add `global.d.ts`
const globalDTSPath = path.join(projectRoot, "src", "global.d.ts");
fs.writeFileSync(globalDTSPath, `/// <reference types="svelte" />`);

// Add VSCode extension recommendations
const vscodeExtensionsPath = path.join(projectRoot, ".vscode", "extensions.json");
fs.mkdirSync(path.join(projectRoot, ".vscode"), { recursive: true });
fs.writeFileSync(
  vscodeExtensionsPath,
  `{
  "recommendations": ["svelte.svelte-vscode"]
}`
);

// Clean up script if running without an argument
if (!argv[2]) {
  try {
    fs.unlinkSync(__filename);

    const remainingFiles = fs.readdirSync(__dirname);
    if (remainingFiles.length === 1 && remainingFiles[0] === ".DS_store") {
      fs.unlinkSync(path.join(__dirname, ".DS_store"));
    }

    if (fs.readdirSync(__dirname).length === 0) {
      fs.rmdirSync(__dirname);
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

console.log("Converted to TypeScript.");
if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log("\nYou will need to re-run your dependency manager (npm/yarn) to install updated dependencies.");
}