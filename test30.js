// ===== test30.js —— 「数据类型 → 数组方法」综合测试 =====
// 范围：原始类型方法 / number / string / array / 数组方法 / 解构与展开（轻）
// 规则：可以查文档，不要打开 test30.check.js
// 时间：60–90 分钟。判题：node test30.check.js
//
// 评分重点不是"背语法"，而是"写 agent 代码时会不会踩坑"。

/* ============================================================
 * Part A：输出预测（8 题）
 * 先把答案填进下面 PREDICTIONS，再运行 node test30.js 对答案。
 * 格式：布尔/数字都写成字符串；对象/数组写成 JSON（不带空格）。
 * 例：'true'、'NaN'、'[1,2]'、'{"a":1}'
 * ========================================================== */
const PREDICTIONS = {
  a1: '', // 0.1 + 0.2 === 0.3
  a2: '', // parseInt('12px') + Number('12px')
  a3: '', // [10, 9, 1, 100].sort()
  a4: '', // 'a-b-c'.split('-', 2)
  a5: '', // [1,2,3].map(x => x * 2).filter(x => x > 2)
  a6: '', // [1,2,3,4].reduce((a, b) => a + b)
  a7: '', // ' abc '.trim().length
  a8: '', // const a=[1,2,3]; const b=a.slice(0,2); b.push(9); 此时 a.length
};

// 下面是每道题对应的代码，自己读，别运行，先猜。
const A_SNIPPETS = {
  a1: () => 0.1 + 0.2 === 0.3,
  a2: () => parseInt('12px') + Number('12px'),
  a3: () => [10, 9, 1, 100].sort(),
  a4: () => 'a-b-c'.split('-', 2),
  a5: () => [1, 2, 3].map((x) => x * 2).filter((x) => x > 2),
  a6: () => [1, 2, 3, 4].reduce((a, b) => a + b),
  a7: () => ' abc '.trim().length,
  a8: () => {
    const a = [1, 2, 3];
    const b = a.slice(0, 2);
    b.push(9);
    return a.length;
  },
};

/* ============================================================
 * Part B：实战实现（8 题）
 * 场景全部来自 agent 开发：解析参数、压缩上下文、统计用量。
 * 只准用 JS 内置能力，不要装 npm 包。
 * ========================================================== */

/**
 * B1. toInt(value)
 * 把 LLM 或表单传来的一坨值安全转成整数。
 *   number 且有限      -> 取整（Math.trunc）
 *   字符串形如 "42" / " -7 " -> 转成数字
 *   其它（"12px"、""、null、true、NaN）-> null
 * 提示：Number.isFinite + 字符串正则
 */
function toInt(value) {
  // TODO
}

/**
 * B2. parseToolArgs(raw)
 * 安全解析工具参数。必须是"普通对象"，否则返回 {}。
 *   '{"a":1}'   -> { a: 1 }
 *   ' {"x":2} ' -> { x: 2 }（允许前后空格）
 *   '' / '{bad' / 'null' / '[1,2]' -> {}
 * 提示：JSON.parse 会抛异常，要 try/catch
 */
function parseToolArgs(raw) {
  // TODO
}

/**
 * B3. truncate(text, max)
 * 压缩上下文用的截断。总长度（含省略号）不超过 max。
 *   text 长度 <= max      -> 原样返回
 *   max <= 0              -> ''
 *   否则                  -> 前 max-1 个字符 + '…'（英文 1 个字符宽度）
 * 例：truncate('hello world', 8) === 'hello w…'
 */
function truncate(text, max) {
  // TODO
}

/**
 * B4. dedupeById(items)
 * 按 id 去重，保留"最后一个"。返回新数组，顺序按每个 id 首次出现的位置。
 *   [{id:1,v:'a'}, {id:2}, {id:1,v:'b'}] -> [{id:1,v:'b'}, {id:2}]
 * 提示：Map 的 key 可以是任意类型，且 set 已存在的 key 不会改变顺序
 */
function dedupeById(items) {
  // TODO
}

/**
 * B5. groupByRole(messages)
 * 统计每种 role 出现次数。只输出出现过的 role，不要补 0。
 *   [{role:'user'},{role:'user'},{role:'tool'}] -> { user: 2, tool: 1 }
 */
function groupByRole(messages) {
  // TODO
}

/**
 * B6. topN(items, n)
 * 按 score 从大到小取前 n 个。不许修改原数组。
 *   items: [{ name, score }, ...]
 * 例：topN([{name:'a',score:1},{name:'b',score:3}], 1) -> [{name:'b',score:3}]
 */
function topN(items, n) {
  // TODO
}

/**
 * B7. extractJson(text)
 * 从模型输出里抠出 JSON 并解析，失败返回 null。
 *   '```json\n{"tool":"read"}\n```'        -> { tool: 'read' }
 *   '说明：```json\n[1,2]\n``` 结束'        -> [1, 2]
 *   '{"a":1}'                              -> { a: 1 }
 *   'oops'                                 -> null
 * 提示：可以只用 indexOf/slice 找 ``` 围栏，也可以顺手用正则 /```(?:json)?([\s\S]*?)```/
 */
function extractJson(text) {
  // TODO
}

/**
 * B8. countWords(text)
 * 统计词频：统一小写，单词指连续的字母/数字/下划线。
 * 返回 [word, count] 数组，按次数降序；次数相同按字母升序。
 *   'Hello hello, world! Tool tool tool'
 *   -> [['tool',3], ['hello',2], ['world',1]]
 * 提示：text.toLowerCase().match(/[a-z0-9_]+/g) ?? []，然后 Map 计数
 */
function countWords(text) {
  // TODO
}

/* ============================================================
 * Part C：陷阱题（3 题）
 * ========================================================== */

/**
 * C1. updateMessage(messages, index, patch)
 * 不可变更新：返回新数组、新对象，原数组和原对象一个字段都不能被改。
 *   - 返回值必须是新数组（!== messages）
 *   - 被修改的那条必须是新对象（!== messages[index]）
 *   - 其余条目可以共享引用
 *   - patch 里的字段覆盖原字段，未提到的字段保留
 * 这是 agent 里最常见的"上下文污染"bug 源头。
 */
function updateMessage(messages, index, patch) {
  // TODO
}

/**
 * C2. isNumericString(value)
 * 判断是不是"真正的十进制数字字符串"（允许前后空格、正负号、小数）。
 *   '12' -> true；' -3.5 ' -> true；' 42 ' -> true
 *   ''、'  '、'12px'、'Infinity'、'0x10'、'1e3'、42（非字符串）-> false
 * 提示：先 trim，再用 /^-?\d+(\.\d+)?$/ 测
 */
function isNumericString(value) {
  // TODO
}

/**
 * C3. sortNumericStrings(arr)
 * 把数字字符串按"数值大小"升序排列，返回新数组，不许改原数组。
 *   ['10','9','1'] -> ['1','9','10']
 * 提示：sort() 默认按字符串比较，10 会排在 9 前面
 */
function sortNumericStrings(arr) {
  // TODO
}

/* ============================================================
 * 导出（判题脚本用，不要改）
 * ========================================================== */
module.exports = {
  PREDICTIONS,
  A_SNIPPETS,
  toInt,
  parseToolArgs,
  truncate,
  dedupeById,
  groupByRole,
  topN,
  extractJson,
  countWords,
  updateMessage,
  isNumericString,
  sortNumericStrings,
};
