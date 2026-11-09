// ===== test30.check.js —— 判题脚本 =====
// 本人用：node test30.check.js
// 不要改这个文件；做不出来就去看对应知识点，不要看答案。

const t = require('./test30.js');

let pass = 0;
let fail = 0;
const failed = [];

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

function norm(v) {
  // 宽松比较：忽略空格、引号、方括号，'[1,2]' 和 '1,2' 都算对
  if (typeof v === 'string') return v.replace(/[\s"'[\]]/g, '');
  try {
    return JSON.stringify(v).replace(/[\s"'[\]]/g, '');
  } catch {
    return String(v);
  }
}

function check(id, title, review, run) {
  let ok = false;
  let got;
  let want;
  let err = null;
  try {
    const r = run();
    ok = r.ok;
    got = r.got;
    want = r.want;
  } catch (e) {
    err = e && e.message ? e.message : String(e);
  }
  if (ok) {
    pass++;
    console.log(`PASS  ${id}  ${title}`);
  } else {
    fail++;
    failed.push({ id, title, review });
    console.log(`FAIL  ${id}  ${title}`);
    if (err) console.log(`      抛异常: ${err}`);
    else console.log(`      你的结果: ${JSON.stringify(got)}   正确结果: ${JSON.stringify(want)}`);
  }
}

/* ---------- Part A：输出预测 ---------- */
const A_EXPECT = {
  a1: 'false',
  a2: 'NaN',
  a3: '1,10,100,9',
  a4: 'a,b',
  a5: '4,6',
  a6: '10',
  a7: '3',
  a8: '3',
};

const A_REVIEW = {
  a1: '数字精度：浮点数不能用 === 比较（0.1+0.2=0.30000000000000004）',
  a2: 'parseInt 会截断字符串前缀，Number 不会 —— 解析用户输入时选错就是 NaN',
  a3: 'sort() 默认按字符串比较！数字排序必须传比较函数',
  a4: 'split(sep, limit) 的第二个参数是"最多几个元素"',
  a5: 'map/filter 都返回新数组，链式调用不复用中间结果',
  a6: 'reduce 不传初始值时，第一个元素当累加器',
  a7: 'trim 去掉首尾空白；length 是 UTF-16 码元数',
  a8: 'slice 是浅复制出新数组，push 到新数组不影响原数组（对比 sort/splice 会改原数组）',
};

Object.keys(A_EXPECT).forEach((id) => {
  const pred = t.PREDICTIONS[id];
  check(id, '输出预测', A_REVIEW[id], () => ({
    ok: norm(pred) === norm(A_EXPECT[id]),
    got: pred === '' ? '(未作答)' : pred,
    want: A_EXPECT[id],
  }));
});

/* ---------- Part B：实现题 ---------- */
check('B1', 'toInt', 'number/string 的边界：Number.isFinite、Math.trunc、字符串必须是纯整数', () => {
  const cases = [
    ['42', 42],
    [' -7 ', -7],
    [3.9, 3],
    ['12px', null],
    ['', null],
    [null, null],
    [true, null],
    [NaN, null],
    [Infinity, null],
  ];
  for (const [input, want] of cases) {
    const got = t.toInt(input);
    if (!Object.is(got, want)) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('B2', 'parseToolArgs', 'JSON.parse 会抛异常；并且 null/数组都不是"普通对象"（agent 参数解析）', () => {
  const cases = [
    ['{"a":1}', { a: 1 }],
    [' {"x":2} ', { x: 2 }],
    ['', {}],
    ['{bad', {}],
    ['null', {}],
    ['[1,2]', {}],
    ['"str"', {}],
  ];
  for (const [input, want] of cases) {
    const got = t.parseToolArgs(input);
    if (!deepEqual(got, want)) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('B3', 'truncate', 'slice 的边界 + 省略号占位：总长度要 <= max', () => {
  const cases = [
    ['hello world', 8, 'hello w…'],
    ['abc', 10, 'abc'],
    ['abc', 0, ''],
    ['abc', 1, '…'],
    ['', 5, ''],
  ];
  for (const [text, max, want] of cases) {
    const got = t.truncate(text, max);
    if (got !== want) return { ok: false, got, want, input: [text, max] };
  }
  return { ok: true };
});

check('B4', 'dedupeById', 'Map 覆盖同名 key 时保持首次插入顺序', () => {
  const input = [
    { id: 1, v: 'a' },
    { id: 2, v: 'b' },
    { id: 1, v: 'c' },
  ];
  const want = [
    { id: 1, v: 'c' },
    { id: 2, v: 'b' },
  ];
  const got = t.dedupeById(input);
  return { ok: deepEqual(got, want), got, want };
});

check('B5', 'groupByRole', 'reduce 累加到对象；不要给没出现的 role 补 0', () => {
  const cases = [
    [[{ role: 'user' }, { role: 'user' }, { role: 'tool' }], { user: 2, tool: 1 }],
    [[], {}],
    [[{ role: 'assistant' }], { assistant: 1 }],
  ];
  for (const [input, want] of cases) {
    const got = t.groupByRole(input);
    if (!deepEqual(got, want)) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('B6', 'topN', 'sort 会改原数组！要用 [...items] 或 toSorted()；比较函数返回 b.score - a.score', () => {
  const items = [
    { name: 'a', score: 1 },
    { name: 'b', score: 3 },
    { name: 'c', score: 3 },
    { name: 'd', score: 2 },
  ];
  const snapshot = JSON.stringify(items);
  const got = t.topN(items, 2);
  if (JSON.stringify(items) !== snapshot) {
    return { ok: false, got: '原数组被修改了', want: '原数组保持不变' };
  }
  const ok = got.length === 2 && got[0].score === 3 && got[1].score === 3;
  return { ok, got, want: '长度 2，score 都为 3' };
});

check('B7', 'extractJson', '字符串抠取（indexOf/slice 或正则）+ try/catch 解析（模型爱加 ```json 围栏）', () => {
  const cases = [
    ['```json\n{"tool":"read"}\n```', { tool: 'read' }],
    ['说明：```json\n[1,2]\n``` 结束', [1, 2]],
    ['{"a":1}', { a: 1 }],
    ['oops', null],
    ['```\n{"ok":true}\n```', { ok: true }],
  ];
  for (const [input, want] of cases) {
    const got = t.extractJson(input);
    if (!deepEqual(got, want)) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('B8', 'countWords', 'match 可能返回 null（?? []）：Map 计数 + 双重排序条件', () => {
  const cases = [
    ['Hello hello, world! Tool tool tool', [['tool', 3], ['hello', 2], ['world', 1]]],
    ['', []],
    ['b a b a c', [['a', 2], ['b', 2], ['c', 1]]],
  ];
  for (const [input, want] of cases) {
    const got = t.countWords(input);
    if (!deepEqual(got, want)) return { ok: false, got, want, input };
  }
  return { ok: true };
});

/* ---------- Part C：陷阱题 ---------- */
check('C1', 'updateMessage（不可变更新）', '浅拷贝陷阱：只展开数组不够，被改的那条也要展开成新对象', () => {
  const msgs = [
    { role: 'user', content: 'old', id: 1 },
    { role: 'assistant', content: 'hi', id: 2 },
  ];
  const out = t.updateMessage(msgs, 0, { content: 'new' });
  if (msgs[0].content !== 'old') {
    return { ok: false, got: '原对象被修改: ' + msgs[0].content, want: 'old' };
  }
  if (out === msgs) return { ok: false, got: '返回了原数组', want: '新数组' };
  if (out[0] === msgs[0]) return { ok: false, got: '被修改的条目没生成新对象', want: '新对象' };
  if (out[1] !== msgs[1]) return { ok: false, got: '其它条目不应被重建', want: '共享引用' };
  const ok =
    out.length === 2 &&
    out[0].content === 'new' &&
    out[0].role === 'user' &&
    out[0].id === 1;
  return { ok, got: out[0], want: { role: 'user', content: 'new', id: 1 } };
});

check('C2', 'isNumericString', 'Number() 会把 ""、" " 转成 0，所以必须先用正则/trim 把边界卡死', () => {
  const cases = [
    ['12', true],
    [' -3.5 ', true],
    [' 42 ', true],
    ['', false],
    ['  ', false],
    ['12px', false],
    ['Infinity', false],
    ['0x10', false],
    ['1e3', false],
    [42, false],
    [null, false],
  ];
  for (const [input, want] of cases) {
    const got = t.isNumericString(input);
    if (got !== want) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('C3', 'sortNumericStrings', 'sort() 默认按字符串比较；副本 + 数值比较函数', () => {
  const input = ['10', '9', '1'];
  const snapshot = JSON.stringify(input);
  const got = t.sortNumericStrings(input);
  if (JSON.stringify(input) !== snapshot) {
    return { ok: false, got: '原数组被修改了', want: '原数组保持不变' };
  }
  const want = ['1', '9', '10'];
  return { ok: deepEqual(got, want), got, want };
});

/* ---------- 结算 ---------- */
const total = pass + fail;
const rate = Math.round((pass / total) * 100);
console.log('\n' + '-'.repeat(50));
console.log(`得分: ${pass}/${total}  (${rate}%)`);

if (fail === 0) {
  console.log('全对。数据类型/数组方法这一块可以结业了，直接进入 TS。');
} else {
  console.log(`错题: ${failed.map((f) => f.id).join(', ')}`);
  console.log('\n错题对应的复习点：');
  failed.forEach((f) => console.log(`  ${f.id} → ${f.review}`));
  if (rate < 60) {
    console.log('\n建议：把「数组方法」和「数字类型」两节重读，其它先放着。');
  } else if (rate < 85) {
    console.log('\n建议：只补错题对应的那一节，别整章重读。');
  } else {
    console.log('\n建议：不用重读，把错题抄到一张纸上，明天再写一遍。');
  }
}
