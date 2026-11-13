// ===== 5-10/test3.check.js —— 「解构赋值」实战判题 =====
// 本人用：node 5-10/test3.check.js
// 不要改这个文件；做不出来就回去看 5.10 那一节，不要看答案。
//
// 前提：5-10/test3.js 末尾必须导出函数：
//   module.exports = { summarize };

const path = require('path');

let m;
try {
  m = require(path.join(__dirname, 'test3.js'));
} catch (e) {
  console.log('加载 test3.js 时抛异常：' + e.message);
  console.log('提示：文件底部的调试调用（console.log(summarize(...))）在 require 时也会执行，');
  console.log('      先把它包进 try/catch 或删掉，再跑判题。');
  process.exit(1);
}

if (typeof m.summarize !== 'function') {
  console.log('没有拿到 summarize 函数。');
  console.log('请在 5-10/test3.js 末尾加一行：module.exports = { summarize };');
  process.exit(1);
}

const summarize = m.summarize;

let pass = 0;
let fail = 0;
const failed = [];

function same(a, b) {
  return Object.is(a, b);
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

// 只比三个字段，忽略多余字段
function fields(v) {
  if (v === null || typeof v !== 'object') return v;
  return { role: v.role, content: v.content, tokens: v.tokens };
}

function caseOf(id, title, review, input, want) {
  check(id, title, review, () => {
    const got = fields(summarize(input));
    return {
      ok: same(got.role, want.role) && same(got.content, want.content) && same(got.tokens, want.tokens),
      got,
      want,
    };
  });
}

const DEFAULTS = { role: 'user', content: '', tokens: 0 };

/* ---------- 1. 正常取值 ---------- */
caseOf(
  '1',
  '全部字段都有',
  '冒号左边是源字段名，右边才是变量；三层嵌套很容易写反',
  { role: 'assistant', content: 'hi', meta: { tokens: 12 } },
  { role: 'assistant', content: 'hi', tokens: 12 },
);

/* ---------- 2. 空对象走默认值 ---------- */
caseOf('2', '空对象 -> 全默认', '默认值写在哪个位置：{ a = 1 }', {}, DEFAULTS);

/* ---------- 3. 不传参数 ---------- */
check('3', '不传参数不抛异常', '参数解构要 `= {}` 兜底，否则 undefined 直接 TypeError', () => {
  const got = fields(summarize());
  return {
    ok: got.role === 'user' && got.content === '' && got.tokens === 0,
    got,
    want: DEFAULTS,
  };
});

/* ---------- 4. meta 为 null（本题核心） ---------- */
caseOf(
  '4',
  'meta 为 null -> tokens 取 0',
  '默认值只对 undefined 生效；null 会拿去解构，所以要先 ?? 兜成 {}',
  { meta: null },
  DEFAULTS,
);

/* ---------- 5. meta 是空对象 ---------- */
caseOf('5', 'meta 是 {} -> tokens 取 0', '嵌套解构每一层都要有自己的默认值', { meta: {} }, DEFAULTS);

/* ---------- 6. 只给一部分 ---------- */
caseOf('6', '只给 role', '没给的字段走默认值', { role: 'system' }, { role: 'system', content: '', tokens: 0 });

/* ---------- 7. 返回值契约 ---------- */
check('7', '返回的是对象，不是 undefined', '函数体里只 console.log 不 return = 返回 undefined', () => {
  const r = summarize({ role: 'user', content: 'x', meta: { tokens: 3 } });
  return {
    ok: r !== null && typeof r === 'object' && r.content === 'x',
    got: r,
    want: { role: 'user', content: 'x', tokens: 3 },
  };
});

/* ---------- 8. 不许改入参 ---------- */
check('8', '不改入参', '解构是取值；但如果回头去给 input.xxx 赋值就会污染调用方', () => {
  const input = { role: 'assistant', content: 'a', meta: { tokens: 5 } };
  summarize(input);
  return {
    ok: input.role === 'assistant' && input.content === 'a' && input.meta.tokens === 5,
    got: input,
    want: { role: 'assistant', content: 'a', meta: { tokens: 5 } },
  };
});

/* ---------- 汇总 ---------- */
console.log('\n' + '-'.repeat(50));
console.log(`得分: ${pass}/${pass + fail}  (${Math.round((pass / (pass + fail)) * 100)}%)`);

if (fail) {
  console.log('错题: ' + failed.map((f) => f.id).join(', '));
  console.log('\n错题对应的复习点：');
  for (const f of failed) console.log(`  ${f.id} → ${f.review}`);
  process.exit(1);
} else {
  console.log('全过。合上答案，从零再写一遍，然后去做 test31 的 Part A。');
}
