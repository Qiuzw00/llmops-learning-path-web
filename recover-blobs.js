const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = 'D:/qzw/AppData/Trea work';
const outputDir = path.join(repoPath '.git', 'lost-found', 'other');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const fsckOutput = execSync('git fsck --lost-found --dangling', { cwd: repoPath, encoding: 'utf-8' });
const blobs = fsckOutput
  .split('\n')
  .filter(line => line.startsWith('dangling blob'))
  .map(line => line.split(' ')[2])
  .filter(Boolean);

console.log(`Found ${blobs.length} dangling blobs`);

for (const blob of blobs) {
  const content = execSync(`git cat-file -p ${blob}`, { cwd: repoPath, encoding: 'utf-8' });
  const ext = detectExt(content);
  const filename = `${blob}${ext}`;
  fs.writeFileSync(path.join(outputDir, filename), content);
}

console.log(`Recovered to ${outputDir}`);

function detectExt(content) {
  const trimmed = content.trim();
  if (trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.includes('=>') || trimmed.includes('const ')) {
    if (trimmed.includes('<') && trimmed.includes('/>')) return '.tsx';
    if (trimmed.includes('interface ') || trimmed.includes('type ')) return '.ts';
    return '.ts';
  }
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return '.json';
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) return '.html';
  if (trimmed.startsWith('/*') || trimmed.includes(':')) {
    if (trimmed.includes('@import') || trimmed.includes('@theme')) return '.css';
  }
  if (trimmed.includes('node_modules') || trimmed.includes('/')) return '.txt';
  return '.txt';
}
