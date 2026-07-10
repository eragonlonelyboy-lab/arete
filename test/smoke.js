'use strict';
// Deterministic smoke test: init dry-run/apply/idempotence/remove, doctor, bench seed, panel counts.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CLI = path.join(__dirname, '..', 'bin', 'arete.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'arete-smoke-'));
let failures = 0;

function run(args) {
  return execFileSync('node', [CLI, ...args], { encoding: 'utf8' });
}
function check(name, cond) {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}`);
  if (!cond) failures++;
}

// init dry-run writes nothing
run(['init', '--root', tmp]);
check('init dry-run creates no files', !fs.existsSync(path.join(tmp, 'CLAUDE.md')));

// init --apply writes both targets with markers
run(['init', '--apply', '--root', tmp]);
const claude = fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8');
check('init --apply writes CLAUDE.md with markers', claude.includes('<!-- arete:begin'));
check('init --apply writes AGENTS.md', fs.existsSync(path.join(tmp, 'AGENTS.md')));

// idempotent: re-apply leaves exactly one block
run(['init', '--apply', '--root', tmp]);
const claude2 = fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8');
check('re-apply is idempotent (one block)', (claude2.match(/arete:begin/g) || []).length === 1);

// preserves user content outside markers
fs.writeFileSync(path.join(tmp, 'CLAUDE.md'), '# My rules\nkeep me\n' + claude2, 'utf8');
run(['init', '--apply', '--root', tmp]);
check('user content preserved', fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8').includes('keep me'));

// doctor reports wired
check('doctor reports OK', run(['doctor', '--root', tmp]).includes('Wired into 2/2'));

// remove strips the block
run(['init', '--remove', '--apply', '--root', tmp]);
check('remove strips block', !fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8').includes('arete:begin'));
check('remove keeps user content', fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8').includes('keep me'));

// bench seeds the kit
run(['bench', '--dir', path.join(tmp, 'bench')]);
for (const f of ['TASK.md', 'ARETE_PROMPT.md', 'RUBRIC.md', path.join('task', 'stats.py'), path.join('task', 'test_stats.py')]) {
  check(`bench seeds ${f}`, fs.existsSync(path.join(tmp, 'bench', f)));
}

// panel counts tags from a fixture ledger
const ledger = path.join(tmp, 'ledger.md');
fs.writeFileSync(ledger, [
  '## CHI-R001',
  'source: session 2026-07-10 class:verify',
  '## CHI-R002',
  'source: session 2026-07-10 class:verify',
  '## CHI-R003',
  'source: session 2026-07-10 gate:2',
].join('\n'), 'utf8');
const panel = run(['panel', '--ledger', ledger]);
check('panel counts verify=2', /gate 4 verify\s+2/.test(panel));
check('panel counts evidence=1', /gate 2 evidence\s+1/.test(panel));
check('panel names leakiest gate 4', panel.includes('Leakiest gate: 4'));

fs.rmSync(tmp, { recursive: true, force: true });
console.log(failures === 0 ? '\nall smoke checks pass' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
