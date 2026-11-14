function stableStringify(value) {
  // TODO
  let b = {}
  let c =  Object.entries(value)
  for (let en of c){
       if(typeof en[1] == 'object'){
          let cons = Object.keys(en[1]).sort()
          console.log(cons)
       }
  }
//    const a= Object.keys(value).sort()
//    for(let j of a){
//      b[j] = value[j]
//   }
  return JSON.stringify(b)
}
let o = { b: { d: 4, c: 3 }, a: [{ z: 1, y: 2 }] }
console.log(stableStringify(o))