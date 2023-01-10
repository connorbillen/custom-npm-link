#! /usr/bin/env node
const { resolve } = require('node:path');
const { symlinkSync, rmSync, existsSync, mkdirSync } = require('node:fs');
const { execSync } = require('node:child_process');
const { cwd: getCwd } = require('node:process');

if (process.argv.length < 3) {
    console.log('Usage: npx link [path1] [path2] [path3]...');
    return;
}

const paths = process.argv.slice(2);
const cwd = getCwd();
let globalPrefix;
try {
    globalPrefix = execSync('npm prefix -g').toString().split('\n').slice(-2, -1)[0];
} catch (err) {
    console.log('Failed to parse global prefix string');
}

paths.forEach((path) => {
    const localPath = resolve(cwd, 'node_modules', path);
    const baseLocalPath = resolve(localPath, '../');
    const globalPath = resolve(globalPrefix, 'node_modules', path);

    console.log('', localPath);
    console.log('', existsSync(localPath));
    if (existsSync(localPath)) {
        console.log('Destination path exists, removing');
        rmSync(localPath, { force: true });
        rmSync(localPath, { recursive: true, force: true });
    } 
    if (!existsSync(baseLocalPath)) {
        console.log('Destination directory doesn\'t exist, creating');
        mkdirSync(baseLocalPath, { recursive: true });
    }

    symlinkSync(globalPath, localPath, 'file');
    console.log(`Linked ${localPath} to contents of ${globalPath}`);
});