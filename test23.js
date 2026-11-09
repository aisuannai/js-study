// ===== test23.js —— 可迭代对象练习 =====
// 规则：只改 TODO 处的函数体；底部 module.exports 不要动。
// 做完运行：node test23.check.js

/**
 * A. countdown(n)
 * 返回一个"自定义可迭代对象"（不是数组，也不是 generator）：
 *   for (const x of countdown(3)) console.log(x)   // 3 2 1
 * 要求：
 *   - 不许先造出 [3,2,1] 再 return 它（要真的实现 Symbol.iterator + next）
 *   - 同一个对象被嵌套遍历时，内外两层互不干扰
 */
function countdown(n) {
  let num
  // TODO
   return {
     [Symbol.iterator](){
      this.num = n
       return this
     },
     next(){
        if(this.num < 0){
            return {done:true}
        } else {
           return {done:false,value:this.num--}
        }
     }
  }
}

/**
 * B. batch(items, size)
 * 返回一个自定义可迭代对象，每次 next() 产出一"批"（一个数组）：
 *   [...batch([1,2,3,4,5], 2)]   // [[1,2],[3,4],[5]]
 * 要求：
 *   - 最后一批不足 size 也要产出，不能丢掉尾巴
 *   - 同一个对象可以反复遍历，每次都从头开始
 *   - 遍历中途 break，之后重新遍历也要从头开始
 *   - 不许修改传入的 items 原数组
 *   - size <= 0 时的行为自己定，在下面写一句注释说明
 */
function batch(items, size) {
  // TODO
}

/**
 * C. take(iterable, n)
 * 必须"显式调用迭代器"：it = iterable[Symbol.iterator]()，然后自己调 it.next()，
 * 取到前 n 个值放进数组返回。
 * 不许用 for..of，不许先 Array.from / [...iterable] 转成数组再切。
 *   take('hello', 2)        // ['h','e']
 *   take(countdown(5), 2)   // [5,4]
 *   take([1,2,3], 10)       // [1,2,3]（不够就全给）
 *   take([1,2,3], 0)        // []
 */
function take(iterable, n) {
  // TODO
}

/**
 * D. charCount(str) / safeTruncate(str, max)
 * 按"字符"计数和截断（不是 UTF-16 码元）：
 *   charCount('𝒳😂')         // 2
 *   charCount('hello')       // 5
 *   safeTruncate('𝒳😂a', 2)  // '𝒳😂'
 *   safeTruncate('abc', 10)  // 'abc'
 */
function charCount(str) {
  // TODO
}

function safeTruncate(str, max) {
  // TODO
}

module.exports = { countdown, batch, take, charCount, safeTruncate };
