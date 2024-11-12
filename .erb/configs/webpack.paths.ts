const path = require('path');

const rootPath = path.join(__dirname, '../..');

const erbPath = path.join(__dirname, '..');
const erbNodeModulesPath = path.join(erbPath, 'node_modules');

const dllPath = path.join(__dirname, '../dll');

const srcPath = path.join(rootPath, 'Source');
const srcMainPath = path.join(srcPath, 'Main');
const srcRendererPath = path.join(srcPath, 'Renderer');

const ReleasePath = path.join(rootPath, 'Release');
const appPath = path.join(ReleasePath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'Main');
const distRendererPath = path.join(distPath, 'Renderer');

const buildPath = path.join(ReleasePath, 'build');

export default {
  rootPath,
  erbNodeModulesPath,
  dllPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  ReleasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  buildPath,
};
