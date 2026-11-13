// ===== test31.js —— 「JSON 方法 / toJSON」章节实战 =====
// 范围：JSON.stringify（replacer / space / toJSON）、JSON.parse（reviver）、往返丢失
// 规则：可以查文档，不要打开 test31.check.js
// 时间：45–60 分钟。判题：node test31.check.js
//
// 场景全部来自 agent 开发：工具结果落盘、日志脱敏、缓存 key、prompt 预算。
// 每题只准用 JS 内置能力，不要装 npm 包。

/* ============================================================
 * Part A：输出预测（6 题）
 * 先填 PREDICTIONS，再运行 node test31.js 看实际输出（别先跑再抄）。
 * 写法：把"实际返回值"当成字符串写进来，原样，别美化：
 *   结果是对象/数组的 -> 写 JSON 文本，例：'{"c":null}'
 *   结果是字符串的     -> 连引号一起写，例：'"X"'
 *   结果是数字的       -> 例：'2'
 * ========================================================== */
const PREDICTIONS = {
  a1: '{"c":"NaN"}', // JSON.stringify({ a: undefined, b: () => 1, c: NaN })
  a2: '', // JSON.stringify([undefined, () => 1, NaN, Infinity])
  a3: '', // JSON.stringify(new Date(0))
  a4: '{"b":2}', // JSON.stringify({ a: 1, b: 2 }, ['b'])
  a5: '2', // JSON.parse('{"a":1,"a":2}').a
  a6: '"X"', // JSON.stringify({ toJSON: () => 'X' })
};

// 对应代码，先读，别运行。node test31.js 会打印实际结果。
const A_SNIPPETS = {
  a1: () => JSON.stringify({ a: undefined, b: () => 1, c: NaN }),
  a2: () => JSON.stringify([undefined, () => 1, NaN, Infinity]),
  a3: () => JSON.stringify(new Date(0)),
  a4: () => JSON.stringify({ a: 1, b: 2 }, ['b']),
  a5: () => JSON.parse('{"a":1,"a":2}').a,
  a6: () => JSON.stringify({ toJSON: () => 'X' }),
};

/* ============================================================
 * Part B：实战实现（6 题）
 * ========================================================== */

/**
 * B1. toJson(value)
 * 把任意值变成 JSON 文本，用于落盘 / 打日志。绝不抛异常。
 *   { a: 1 }  -> '{"a":1}'
 *   'x'       -> '"x"'（字符串会带引号）
 *   循环引用   -> null（超出自身体系，不要让它炸掉调用方）
 *   undefined -> null（JSON.stringify(undefined) 返回的是 undefined，不是字符串）
 * 提示：try/catch + 检查结果 typeof === 'string'
 */
function toJson(value) {
  // TODO
  try {
     //循环引用是在stringify里面抛
     const s = JSON.stringify(value)
    return typeof s == 'string'?s:null
  } catch (error) {
     return null
  }
}

/**
 * B2. logSafe(value)
 * 工具结果写日志用：函数和 undefined 自动消失，循环引用不抛，BigInt 变字符串。
 *   { a: 1, fn() {}, u: undefined } -> '{"a":1}'
 *   循环引用（o.self = o）           -> '{"a":1}'（回边整条丢掉）
 *   { n: 10n }                      -> '{"n":"10"}'（JSON 不支持 BigInt，直接 stringify 会抛）
 * 提示：replacer + Set 记录已出现过的对象；BigInt 用 typeof v === 'bigint' 判
 */
function logSafe(value) {
  // TODO
  try {
     //循环引用是在stringify里面抛
     const s = JSON.stringify(value, function replacer(key,v1){
        if(typeof v1 == 'bigint'){
            return v1+''  
        }
        return v1
     })
    return typeof s == 'string'?s:null
  } catch (error) {
     return null
  }
}

/**
 * B3. stableStringify(value)
 * 稳定序列化：对象的键按字母升序输出，用作缓存 key / 幂等判断。
 *   { b: 2, a: 1 }                 -> '{"a":1,"b":2}'
 *   { b: { d: 4, c: 3 }, a: [{ z: 1, y: 2 }] }
 *                                  -> '{"a":[{"y":2,"z":1}],"b":{"c":3,"d":4}}'
 *   数组顺序不许变：{ list: [3, 1, 2] } -> '{"list":[3,1,2]}'
 * 提示：replacer 改不了键顺序，得先递归重建对象（Object.keys().sort()），再 JSON.stringify
 */
function stableStringify(value) {
  // TODO
}

/**
 * B4. cloneJson(value)
 * JSON 深拷贝：返回完全独立的副本，改副本不影响原对象。
 * 只需支持 JSON 能表达的数据（纯对象 / 数组 / 字符串 / 数字 / 布尔 / null）。
 * 要求：嵌套对象、嵌套数组的每一层都不共享引用（!==）。
 * 提示：一行就能写完。顺便想一遍：Date / 函数 / undefined / Map 会变成什么？
 *   （真实项目里结构化数据用 structuredClone，但它同样不支持函数）
 */
function cloneJson(value) {
  // TODO
}

/**
 * B5. reviveDates(text)
 * 解析 JSON，并把 ISO 时间字符串还原成 Date（LLM / 接口返回的时间都是字符串）。
 *   '{"createdAt":"2026-11-11T10:00:00.000Z"}'  -> createdAt 是 Date 实例
 *   '{"list":[{"at":"2026-01-01T00:00:00Z"}]}'  -> 嵌套里面也要还原
 *   '{"name":"2026"}' / '{"d":"2026-11-11"}'（只有日期没时间）-> 保持字符串
 * 提示：JSON.parse 的第二个参数 reviver；正则 /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/
 */
function reviveDates(text) {
  // TODO
}

/**
 * B6. makeSecret(record)
 * 日志脱敏：返回一个"序列化时自动遮住 token / password"的对象。
 *   JSON.stringify(makeSecret({ name: 'x', token: 'abc', password: 'p' }))
 *     -> '{"name":"x","token":"***","password":"***"}'
 *   不存在的字段不要凭空添加
 *   不许修改传进来的 record（做完 record.token 还得是 'abc'）
 *   放进别的对象里序列化也要生效：JSON.stringify({ user })
 * 提示：对象上挂一个 toJSON 方法，stringify 会先调它；用展开复制，别改原对象
 */
function makeSecret(record) {
  // TODO
}

/* ============================================================
 * Part C：陷阱题（3 题）
 * ========================================================== */

/**
 * C1. isJsonEqual(a, b)
 * 判断两个 JSON 可表达的值是否相等，键的顺序不影响结果（缓存去重常用）。
 *   { a: 1, b: 2 } vs { b: 2, a: 1 }            -> true
 *   { x: { p: 1, q: 2 } } vs { x: { q: 2, p: 1 } } -> true
 *   [1, 2] vs [2, 1]                            -> false（数组有序）
 *   { a: 1 } vs { a: '1' }                      -> false
 *   { a: undefined } vs {}                      -> true（undefined 在 JSON 里本来就不存在）
 * 提示：先排序再比；可以直接复用你写的 stableStringify
 */
function isJsonEqual(a, b) {
  // TODO
}

/**
 * C2. minifyJson(text)
 * 把格式化过的 JSON 压成一行，省 prompt / 日志空间。非法输入返回 null。
 *   '{\n  "a": 1,\n  "b": 2\n}' -> '{"a":1,"b":2}'
 *   '{"n": 1.0}'                -> '{"n":1}'（重新序列化会规范化数字）
 *   'bad'                       -> null
 *   '{"s":"你好"}'              -> '{"s":"你好"}'（中文不许变成 \uXXXX）
 * 提示：JSON.parse -> JSON.stringify；必须 try/catch
 */
function minifyJson(text) {
  // TODO
}

/**
 * C3. byteSize(value)
 * prompt 预算是按字节算的，不是按字符数。返回 JSON 文本的 UTF-8 字节数。
 *   byteSize({ a: 1 })      -> 7
 *   byteSize('你好')        -> 8
 *   byteSize({ q: '你好' }) -> 14
 * 提示：Buffer.byteLength(str, 'utf8')；'你好'.length 是 2，但 UTF-8 占 6 字节
 */
function byteSize(value) {
  // TODO
}

/* ============================================================
 * 导出（判题脚本用，不要改）
 * ========================================================== */
module.exports = {
  PREDICTIONS,
  A_SNIPPETS,
  toJson,
  logSafe,
  stableStringify,
  cloneJson,
  reviveDates,
  makeSecret,
  isJsonEqual,
  minifyJson,
  byteSize,
};

/* ============================================================
 * 自测：node test31.js 只打印 Part A 的实际输出
 * ========================================================== */
if (require.main === module) {
  console.log('Part A 实际输出（对照你的 PREDICTIONS）：');
  for (const [id, run] of Object.entries(A_SNIPPETS)) {
    let out;
    try {
      out = String(run());
    } catch (e) {
      out = `抛异常: ${e.message}`;
    }
    console.log(`  ${id}: ${out}`);
  }
  console.log('\n判题请运行: node test31.check.js');
}
