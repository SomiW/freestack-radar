import { readFileSync } from 'node:fs';
import { validateCatalog } from '../src/resources.ts';
const data = JSON.parse(readFileSync(new URL('../data/resources.json', import.meta.url), 'utf8'));
const errors = validateCatalog(data);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`数据校验通过：${data.resources.length} 条正式资源`);
