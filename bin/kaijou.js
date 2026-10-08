#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const vendorKai = path.join(__dirname, '..', 'vendor', 'kai');
const cwd = process.cwd();
const localKai = path.join(cwd, 'kai');
const configPath = path.join(cwd, '.kai', 'config');

function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function ensureLocalKai() {
  if (fs.existsSync(localKai)) {
    try {
      fs.accessSync(localKai, fs.constants.X_OK);
      return localKai;
    } catch {
      /* fall through: refresh from vendor */
    }
  }
  if (!fs.existsSync(vendorKai)) {
    die('kaijou: bundled kai CLI missing (corrupt package)');
  }
  fs.copyFileSync(vendorKai, localKai);
  fs.chmodSync(localKai, 0o755);
  console.error('kaijou: installed ./kai');
  return localKai;
}

function runKai(kaiPath, args) {
  const r = spawnSync(kaiPath, args, { cwd, stdio: 'inherit' });
  if (r.error) die('kaijou: failed to run kai: ' + r.error.message);
  process.exit(r.status == null ? 1 : r.status);
}

const args = process.argv.slice(2);
const kaiPath = ensureLocalKai();
const inited = fs.existsSync(configPath);

if (!inited) {
  const prefix = args[0] === 'init' && args[1] ? args[1] : 'Kai';
  console.error('kaijou: no .kai/config — running init…');
  const r = spawnSync(kaiPath, ['init', prefix], { cwd, stdio: 'inherit' });
  if (r.error) die('kaijou: init failed: ' + r.error.message);
  if (r.status) process.exit(r.status);
  // If user only wanted init (npx kaijou  or  npx kaijou init [prefix]), stop here.
  if (args.length === 0 || args[0] === 'init') {
    process.exit(0);
  }
  // Otherwise continue with the original args (skip a leading init already done).
  const rest = args[0] === 'init' ? args.slice(2) : args;
  if (rest.length === 0) process.exit(0);
  runKai(kaiPath, rest);
}

if (args.length === 0) {
  runKai(kaiPath, ['list']);
}

runKai(kaiPath, args);
