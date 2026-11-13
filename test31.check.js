// ===== test31.check.js —— 判题脚本（JSON 方法 / toJSON） =====
// 本人用：node test31.check.js
// 不要改这个文件；做不出来就去看对应知识点，不要看答案。

const t = require('./test31.js');

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

function normA(v) {
  return (typeof v === 'string' ? v : String(v)).trim();
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
    else {
      console.log(`      你的结果: ${JSON.stringify(got)}`);
      console.log(`      正确结果: ${JSON.stringify(want)}`);
    }
  }
}

/* ---------- Part A：输出预测 ---------- */
const A_EXPECT = {
  a1: '{"c":null}',
  a2: '[null,null,null,null]',
  a3: '"1970-01-01T00:00:00.000Z"',
  a4: '{"b":2}',
  a5: '2',
  a6: '"X"',
};

const A_REVIEW = {
  a1: '对象里的 undefined 和函数整个消失，NaN 变成 null（JSON 没有这几种值）',
  a2: '数组里不能"消失"，undefined / 函数 / NaN / Infinity 全变 null（长度不变）',
  a3: 'Date 走 toJSON，变成带引号的 ISO 字符串（不是数字，也不是对象）',
  a4: 'replacer 传数组 = 白名单，只保留列出的键',
  a5: 'JSON 重复键不报错，后者覆盖前者',
  a6: '有 toJSON 方法就先调它，用它返回的值再序列化',
};

Object.keys(A_EXPECT).forEach((id) => {
  const pred = t.PREDICTIONS[id];
  check(id, '输出预测', A_REVIEW[id], () => ({
    ok: normA(pred) === normA(A_EXPECT[id]),
    got: normA(pred) === '' ? '(未作答)' : pred,
    want: A_EXPECT[id],
  }));
});

/* ---------- Part B：实战实现 ---------- */
check('B1', 'toJson（绝不抛）', 'JSON.stringify(undefined) 返回 undefined 而不是字符串；循环引用会抛 TypeError', () => {
  const circular = { a: 1 };
  circular.self = circular;
  const cases = [
    [{ a: 1 }, '{"a":1}'],
    [{ a: [1, 2] }, '{"a":[1,2]}'],
    ['x', '"x"'],
    [undefined, null],
    [circular, null],
  ];
  for (const [input, want] of cases) {
    const got = t.toJson(input);
    if (got !== want) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('B2', 'logSafe（日志安全序列化）', 'replacer 里: BigInt 转字符串; 对象放进 Set 判断是否重复出现（砍回边）', () => {
  const circular = { a: 1 };
  circular.self = circular;
  const cases = [
    [{ a: 1, fn() {}, u: undefined }, '{"a":1}'],
    [circular, '{"a":1}'],
    [{ n: 10n }, '{"n":"10"}'],
    [{ list: [1n, 2n] }, '{"list":["1","2"]}'],
  ];
  for (const [input, want] of cases) {
    const got = t.logSafe(input);
    if (got !== want) return { ok: false, got, want };
  }
  return { ok: true };
});

check('B3', 'stableStringify（键排序）', '递归重建对象: Object.keys().sort()；数组保持原顺序，不排序', () => {
  const cases = [
    [{ b: 2, a: 1 }, '{"a":1,"b":2}'],
    [{ b: { d: 4, c: 3 }, a: [{ z: 1, y: 2 }] }, '{"a":[{"y":2,"z":1}],"b":{"c":3,"d":4}}'],
    [{ list: [3, 1, 2] }, '{"list":[3,1,2]}'],
    [5, '5'],
    [null, 'null'],
  ];
  for (const [input, want] of cases) {
    const got = t.stableStringify(input);
    if (got !== want) return { ok: false, got, want, input };
  }
  return { ok: true };
});

check('B4', 'cloneJson（深拷贝）', 'JSON.parse(JSON.stringify(x)) 一行；每一层都要是新的引用', () => {
  const src = { a: { b: { c: 1 } }, list: [{ d: 2 }] };
  const copy = t.cloneJson(src);
  if (!deepEqual(copy, src)) return { ok: false, got: copy, want: src };
  const problems = [];
  if (copy === src) problems.push('顶层还是同一个引用');
  if (copy.a === src.a) problems.push('嵌套对象共享引用');
  if (copy.a.b === src.a.b) problems.push('深层对象共享引用');
  if (copy.list === src.list) problems.push('嵌套数组共享引用');
  if (copy.list[0] === src.list[0]) problems.push('数组元素共享引用');
  if (problems.length) return { ok: false, got: problems.join('; '), want: '每层都是新引用' };

  copy.a.b.c = 99;
  copy.list.push({ d: 3 });
  if (src.a.b.c !== 1 || src.list.length !== 1) {
    return { ok: false, got: '改副本影响了原对象', want: '原对象保持不变' };
  }
  const arrCopy = t.cloneJson([1, [2]]);
  if (!deepEqual(arrCopy, [1, [2]])) {
    return { ok: false, got: arrCopy, want: '[1,[2]]' };
  }
  return { ok: true };
});

check('B5', 'reviveDates（reviver 还原时间）', 'JSON.parse 第二个参数 reviver；只有带 T 的 ISO 时间才转，纯日期保持字符串', () => {
  const text = '{"createdAt":"2026-11-11T10:00:00.000Z","name":"2026"}';
  const got = t.reviveDates(text);
  if (!(got.createdAt instanceof Date)) {
    return { ok: false, got: got.createdAt, want: 'Date 实例' };
  }
  const expectMs = Date.parse('2026-11-11T10:00:00.000Z');
  if (got.createdAt.getTime() !== expectMs) {
    return { ok: false, got: got.createdAt.toISOString(), want: new Date(expectMs).toISOString() };
  }
  if (got.name !== '2026') return { ok: false, got: got.name, want: "'2026' 仍是字符串" };

  const nested = t.reviveDates('{"list":[{"at":"2026-01-01T00:00:00Z"}]}');
  if (!(nested.list[0].at instanceof Date)) {
    return { ok: false, got: nested.list[0].at, want: '嵌套里也是 Date' };
  }
  const dateOnly = t.reviveDates('{"d":"2026-11-11"}');
  if (dateOnly.d !== '2026-11-11') {
    return { ok: false, got: dateOnly.d, want: "'2026-11-11' 保持字符串（没带时间）" };
  }
  return { ok: true };
});

check('B6', 'makeSecret（toJSON 脱敏）', 'toJSON 返回的值就是最终输出；展开复制，别改入参；不存在的字段不要补', () => {
  const rec = { name: 'x', token: 'abc', password: 'p', role: 'admin' };
  const out = t.makeSecret(rec);
  const want = '{"name":"x","token":"***","password":"***","role":"admin"}';
  const got = JSON.stringify(out);
  if (got !== want) return { ok: false, got, want };
  if (JSON.stringify({ user: out }) !== `{"user":${want}}`) {
    return { ok: false, got: JSON.stringify({ user: out }), want: `{"user":${want}}（嵌套也要生效）` };
  }
  if (rec.token !== 'abc' || rec.password !== 'p') {
    return { ok: false, got: `token=${rec.token}`, want: '原对象不许被改' };
  }
  const thin = JSON.stringify(t.makeSecret({ name: 'y' }));
  if (thin !== '{"name":"y"}') {
    return { ok: false, got: thin, want: '{"name":"y"}（没 token 就不要补）' };
  }
  return { ok: true };
});

/* ---------- Part C：陷阱题 ---------- */
check('C1', 'isJsonEqual（键顺序无关）', '直接 JSON.stringify 比字符串会误判键顺序；先排序或递归比较', () => {
  const cases = [
    [{ a: 1, b: 2 }, { b: 2, a: 1 }, true],
    [{ x: { p: 1, q: 2 } }, { x: { q: 2, p: 1 } }, true],
    [{ a: 1 }, { a: '1' }, false],
    [[1, 2], [2, 1], false],
    [{ a: undefined }, {}, true],
    [null, null, true],
  ];
  for (const [a, b, want] of cases) {
    const got = t.isJsonEqual(a, b);
    if (got !== want) return { ok: false, got, want, input: [a, b] };
  }
  return { ok: true };
});

check('C2', 'minifyJson（压缩）', 'parse -> stringify 会规范化格式和数字；非法输入 try/catch 返回 null', () => {
  const cases = [
    ['{\n  "a": 1,\n  "b": 2\n}', '{"a":1,"b":2}'],
    ['{"n": 1.0}', '{"n":1}'],
    ['bad', null],
    ['{"s":"你好"}', '{"s":"你好"}'],
    ['"str"', '"str"'],
  ];
  for (const [text, want] of cases) {
    const got = t.minifyJson(text);
    if (got !== want) return { ok: false, got, want, input: text };
  }
  return { ok: true };
});

check('C3', 'byteSize（UTF-8 字节数）', 'str.length 是 UTF-16 码元数；中文 1 个 length 但占 3 字节', () => {
  const cases = [
    [{ a: 1 }, 7],
    ['你好', 8],
    [{ q: '你好' }, 14],
    [[1, 2, 3], 7],
  ];
  for (const [input, want] of cases) {
    const got = t.byteSize(input);
    if (got !== want) return { ok: false, got, want, input };
  }
  return { ok: true };
});

/* ---------- 结算 ---------- */
const total = pass + fail;
const rate = Math.round((pass / total) * 100);
console.log('\n' + '-'.repeat(50));
console.log(`得分: ${pass}/${total}  (${rate}%)`);

if (fail === 0) {
  console.log('全对。5.12 可以打 ✅，接着去补 5.7 Set / 5.9 / 5.10。');
} else {
  console.log(`错题: ${failed.map((f) => f.id).join(', ')}`);
  console.log('\n错题对应的复习点：');
  failed.forEach((f) => console.log(`  ${f.id} → ${f.review}`));
  if (rate < 60) {
    console.log('\n建议：把 5.12「JSON 方法，toJSON」重读一遍（重点 replacer / reviver / toJSON 三处）。');
  } else if (rate < 85) {
    console.log('\n建议：只补错题对应的那个 API，别整章重读。');
  } else {
    console.log('\n建议：不用重读，把错题抄下来，明天不看文档再写一遍。');
  }
}
