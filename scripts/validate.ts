import { readFileSync } from 'node:fs';
import { validateCatalog } from '../src/resources.ts';
import { validateSources } from './source-registry.ts';
const data = JSON.parse(readFileSync(new URL('../data/resources.json', import.meta.url), 'utf8'));
const sources = JSON.parse(readFileSync(new URL('../.agents/skills/resource-research/references/sources.json', import.meta.url), 'utf8'));
const errors = [...validateCatalog(data), ...validateSources(sources)];
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`数据校验通过：${data.resources.length} 条正式资源，${sources.sources.length} 个来源定义`);
