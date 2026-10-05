import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';
function walk(dir) {return readdirSync(dir,{withFileTypes:true}).flatMap(item => item.isDirectory() ? walk(join(dir,item.name)) : item.name.endsWith('.js') ? [join(dir,item.name)]:[]);}
for (const file of ['index.js',...walk('configs'),...walk('src'),...walk('scripts')]) {const result = spawnSync(process.execPath,['--check',file],{stdio:'inherit'}); if (result.status) process.exit(result.status);}
console.log('Sintaxis ES Modules verificada');
