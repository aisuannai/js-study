// 自检脚本：node test23.check.js
// 不要改这个文件；它只检查行为，不给答案。
const { countdown, batch, take, charCount, safeTruncate } = require('./test23.js');

let pass = 0;
let fail = 0;

function eq(actual, expected, msg) {
  let a, e;
  try {
    a = JSON.stringify(actual);
    e = JSON.stringify(expected);
  } catch (_) {
    a = String(actual);
    e = String(expected);
  }
  if (a === e) {
    pass++;
    console.log(`  ok    ${msg}`);
  } else {
    fail++;
    console.log(`  FAIL  ${msg}`);
    console.log(`        期望: ${e}`);
    console.log(`        实际: ${a}`);
  }
}

function test(name, fn) {
  console.log(`\n${name}`);
  try {
    fn();
  } catch (err) {
    fail++;
    console.log(`  FAIL  抛异常: ${err && err.message}`);
  }
}

test('A. countdown(n)', () => {
  eq([...countdown(3)], [3, 2, 1], '基本用法 [...countdown(3)]');
  eq([...countdown(0)], [], 'n = 0 时为空');
  eq(Array.from(countdown(2), (x) => x * 10), [20, 10], '能配合 Array.from 的 mapFn');
  eq(countdown(3) !== countdown(3), true, '每次调用返回不同的对象');

  const c = countdown(2);
  const nested = [];
  for (const x of c) {
    for (const y of c) nested.push([x, y]);
  }
  eq(nested, [[2, 2], [2, 1], [1, 2], [1, 1]], '同一个对象嵌套遍历互不干扰');
});

test('B. batch(items, size)', () => {
  eq([...batch([1, 2, 3, 4, 5], 2)], [[1, 2], [3, 4], [5]], '基本分页，尾巴不丢');
  eq([...batch([], 3)], [], '空数组');
  eq([...batch([1], 3)], [[1]], '不足一批');
  eq([...batch([1, 2, 3, 4], 2)], [[1, 2], [3, 4]], '刚好整除');

  const b = batch([1, 2, 3, 4], 2);
  eq([...b], [[1, 2], [3, 4]], '第一次遍历');
  eq([...b], [[1, 2], [3, 4]], '同一个对象第二次遍历从头开始');

  const b2 = batch([1, 2, 3, 4, 5, 6], 2);
  let first;
  for (const p of b2) {
    first = p;
    break;
  }
  eq(first, [1, 2], 'break 拿到第一批');
  eq([...b2], [[1, 2], [3, 4], [5, 6]], 'break 之后重新遍历从头开始');

  const src = [1, 2, 3];
  [...batch(src, 2)];
  eq(src, [1, 2, 3], '原数组未被修改');

  const b3 = batch([1, 2, 3], 1);
  const nested = [];
  for (const p of b3) {
    for (const q of b3) nested.push([p[0], q[0]]);
  }
  const expected = [];
  for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) expected.push([i, j]);
  eq(nested, expected, '同一个对象嵌套遍历互不干扰');
});

test('C. take(iterable, n)', () => {
  eq(take('hello', 2), ['h', 'e'], "take('hello', 2)");
  eq(take([1, 2, 3], 10), [1, 2, 3], 'n 超过长度时全给');
  eq(take([1, 2, 3], 0), [], 'n = 0 返回空数组');
  eq(take(countdown(5), 2), [5, 4], '能消费自己写的迭代对象');
  eq(take(batch([1, 2, 3, 4], 2), 1), [[1, 2]], '能消费 batch，且只取一批就停');
});

test('D. charCount / safeTruncate', () => {
  eq(charCount('𝒳😂'), 2, 'emoji 按字符计数');
  eq(charCount('hello'), 5, '普通字符串');
  eq(charCount(''), 0, '空字符串');
  eq(safeTruncate('𝒳😂a', 2), '𝒳😂', 'emoji 不被切断');
  eq(safeTruncate('𝒳😂', 1), '𝒳', '截断到单个 emoji');
  eq(safeTruncate('abc', 10), 'abc', 'max 超过长度时原样返回');
});

console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
