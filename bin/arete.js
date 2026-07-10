#!/usr/bin/env node
'use strict';
// ARETE CLI: wire the five-gate operating standard into agent memory files,
// seed the falsifiable bench, and read the defect panel from a CHIRON ledger.
// Deterministic on purpose: zero LLM calls, zero network, zero dependencies.

const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_ROOT = path.resolve(__dirname, '..');
const MARK_BEGIN = '<!-- arete:begin (managed by ARETE, do not edit inside) -->';
const MARK_END = '<!-- arete:end -->';
const GATE_NAMES = { 1: 'scope', 2: 'evidence', 3: 'adversarial', 4: 'verify', 5: 'report' };
const CLASS_TO_GATE = { scope: 1, evidence: 2, adversarial: 3, verify: 4, report: 5 };

function loadLoop() {
  return fs.readFileSync(path.join(REPO_ROOT, 'templates', 'loop.md'), 'utf8').trim();
}

function block() {
  return `${MARK_BEGIN}\n${loadLoop()}\n${MARK_END}`;
}

function upsertBlock(content) {
  const b = block();
  const re = new RegExp(
    MARK_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + MARK_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  if (re.test(content)) return { next: content.replace(re, b), action: 'updated' };
  const sep = content.endsWith('\n') || content === '' ? '' : '\n';
  return { next: content + sep + '\n' + b + '\n', action: 'appended' };
}

function initTargets(root) {
  return [path.join(root, 'CLAUDE.md'), path.join(root, 'AGENTS.md')];
}

function cmdInit(args) {
  const apply = args.includes('--apply');
  const root = argValue(args, '--root') || process.cwd();
  const plan = [];
  for (const file of initTargets(root)) {
    const exists = fs.existsSync(file);
    const current = exists ? fs.readFileSync(file, 'utf8') : '';
    const { next, action } = upsertBlock(current);
    if (next === current) { plan.push({ file, action: 'unchanged' }); continue; }
    plan.push({ file, action: exists ? action : 'created' });
    if (apply) fs.writeFileSync(file, next, 'utf8');
  }
  for (const p of plan) console.log(`${apply ? 'WROTE' : 'PLAN'}  ${p.action.padEnd(9)} ${p.file}`);
  if (!apply) console.log('\nDry run. Nothing written. Re-run with --apply to write inside the managed markers only.');
  else console.log('\nDone. Your own content outside the markers was not touched. Remove with: arete init --remove --apply');
  return 0;
}

function cmdRemove(args) {
  const apply = args.includes('--apply');
  const root = argValue(args, '--root') || process.cwd();
  for (const file of initTargets(root)) {
    if (!fs.existsSync(file)) continue;
    const current = fs.readFileSync(file, 'utf8');
    const re = new RegExp('\\n?' + MARK_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + MARK_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?');
    if (!re.test(current)) { console.log(`${apply ? 'SKIP ' : 'PLAN '} no block  ${file}`); continue; }
    console.log(`${apply ? 'WROTE' : 'PLAN '} strip     ${file}`);
    if (apply) fs.writeFileSync(file, current.replace(re, '\n'), 'utf8');
  }
  if (!apply) console.log('\nDry run. Re-run with --apply to strip the managed block.');
  return 0;
}

function cmdDoctor(args) {
  const root = argValue(args, '--root') || process.cwd();
  let wired = 0;
  for (const file of initTargets(root)) {
    const exists = fs.existsSync(file);
    const has = exists && fs.readFileSync(file, 'utf8').includes(MARK_BEGIN);
    if (has) wired++;
    console.log(`${has ? 'OK   ' : 'MISS '} ${file}${exists ? '' : ' (file absent)'}`);
  }
  const benchDir = path.join(root, 'arete-bench');
  console.log(`${fs.existsSync(benchDir) ? 'OK   ' : 'INFO '} bench kit ${fs.existsSync(benchDir) ? 'seeded at ' + benchDir : 'not seeded (arete bench to seed; optional)'}`);
  console.log(wired === 0 ? '\nNot wired. Run: arete init --apply' : `\nWired into ${wired}/2 agent files.`);
  return 0; // warn first, never trap
}

function cmdBench(args) {
  const target = path.resolve(argValue(args, '--dir') || path.join(process.cwd(), 'arete-bench'));
  const src = path.join(REPO_ROOT, 'bench');
  fs.mkdirSync(path.join(target, 'task'), { recursive: true });
  for (const f of ['TASK.md', 'ARETE_PROMPT.md', 'RUBRIC.md']) {
    fs.copyFileSync(path.join(src, f), path.join(target, f));
  }
  for (const f of ['stats.py', 'test_stats.py']) {
    fs.copyFileSync(path.join(src, 'task', f), path.join(target, 'task', f));
  }
  console.log(`Seeded bench kit at ${target}`);
  console.log('\nHow to run a clean A/B (each arm in a FRESH copy of task/):');
  console.log('  1. Copy task/ to a folder OUTSIDE any agent workspace (no CLAUDE.md or AGENTS.md above it).');
  console.log('  2. BARE arm: paste TASK.md into a fresh session on the model under test.');
  console.log('     LOADED arm: paste ARETE_PROMPT.md, then TASK.md, into a fresh session.');
  console.log('  3. Grade both final reports with RUBRIC.md (9 rows, pass/fail each).');
  console.log('  4. Keep the rows. One probe is signal, not proof; conclusions come from accumulated runs.');
  return 0;
}

function defaultLedgers() {
  return [
    path.join(process.cwd(), '.chiron', 'ledger.md'),
    path.join(os.homedir(), '.claude', '.chiron', 'ledger.md'),
    path.join(os.homedir(), '.chiron', 'global', 'ledger.md'),
  ];
}

function cmdPanel(args) {
  const explicit = argValue(args, '--ledger');
  const candidates = explicit ? [path.resolve(explicit)] : defaultLedgers();
  const found = candidates.filter((p) => fs.existsSync(p));
  if (found.length === 0) {
    console.log('No ledger found. Looked in:');
    candidates.forEach((c) => console.log('  ' + c));
    console.log('The panel reads correction ledgers (CHIRON format). Point at one with --ledger <path>.');
    return 0;
  }
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let tagged = 0;
  let entries = 0;
  for (const file of found) {
    const text = fs.readFileSync(file, 'utf8');
    entries += (text.match(/^#{2,3}\s|^- \*\*CHI-R/gm) || []).length;
    const re = /(?:gate|class):(scope|evidence|adversarial|verify|report|[1-5])/gi;
    let m;
    while ((m = re.exec(text)) !== null) {
      const raw = m[1].toLowerCase();
      const gate = /^[1-5]$/.test(raw) ? Number(raw) : CLASS_TO_GATE[raw];
      if (gate) { counts[gate]++; tagged++; }
    }
  }
  console.log(`Ledgers read: ${found.length}   tagged corrections: ${tagged}`);
  for (const g of [1, 2, 3, 4, 5]) {
    const bar = '#'.repeat(counts[g]);
    console.log(`  gate ${g} ${GATE_NAMES[g].padEnd(11)} ${String(counts[g]).padStart(3)}  ${bar}`);
  }
  if (tagged === 0) {
    console.log('\nNo gate tags yet. Tag future corrections with class:<scope|evidence|adversarial|verify|report>');
    console.log('in the correction source; the panel turns them into a defect map of your discipline.');
  } else {
    const worst = [1, 2, 3, 4, 5].reduce((a, b) => (counts[b] > counts[a] ? b : a));
    console.log(`\nLeakiest gate: ${worst} (${GATE_NAMES[worst]}). That is the discipline to harden next.`);
  }
  return 0;
}

function argValue(args, flag) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}

function help() {
  console.log(`ARETE ${require(path.join(REPO_ROOT, 'package.json')).version}: the operating standard for AI agents. Five gates, any model.

Usage: arete <command> [options]

  init      Write the five-gate loop into CLAUDE.md and AGENTS.md behind managed
            markers. Dry-run by default; --apply to write; --root <dir> to target.
  init --remove   Strip the managed block (dry-run by default, --apply to write).
  doctor    Show what is wired and what is not. Never blocks.
  bench     Seed the falsifiable A/B kit (seeded-bug task + rubric) into ./arete-bench
            or --dir <path>. You run the arms; the kit keeps you honest.
  panel     Read correction ledgers (CHIRON format) for gate tags and show which
            gate leaks most. --ledger <path> to point at a specific ledger.

Everything is deterministic: no LLM calls, no network, nothing outside the managed markers.`);
  return 0;
}

const [cmd, ...rest] = process.argv.slice(2);
let code;
switch (cmd) {
  case 'init': code = rest.includes('--remove') ? cmdRemove(rest) : cmdInit(rest); break;
  case 'doctor': code = cmdDoctor(rest); break;
  case 'bench': code = cmdBench(rest); break;
  case 'panel': code = cmdPanel(rest); break;
  default: code = help();
}
process.exit(code);
