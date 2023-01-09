#! /usr/bin/env node
const { resolve } = require('node:path');
const { symlink, rmSync } = require('node:fs');
const { execSync } = require('node:child_process');

if (process.argv.length < 4) {
    console.log('Usage: npx custom-link [package name] [filename1] [filename2]...');
    return;
}

const args = process.argv.slice(2);
const packageName = args[0];
const files = args.slice(1);
let globalPrefix;
try {
    globalPrefix = execSync('npm prefix -g').toString().split('\n').slice(-2, -1)[0];
} catch (err) {
    console.log('Failed to parse global prefix string');
}

files.forEach((file) => {
    rmSync(resolve(__dirname, 'node_modules', packageName, file), { recursive: true, force: true });
    symlink(
        resolve(globalPrefix, 'node_modules', packageName, file),
        resolve(__dirname, 'node_modules', packageName, file),
        'file',
        (err) => {
            if (err) {
                console.log('', err);
            }
        },
    );

    console.log(`Linked ${resolve(__dirname,'node_modules', packageName, file)} to contents of ${resolve(globalPrefix, 'node_modules', packageName, file)}`);
});