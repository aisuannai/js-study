let num_array = []
let totoal = 0

while(true){
   let num = prompt('请输入数字','')
   if(num === null || num === ''){
        break
   }
   num = +num
   if(Number.isFinite(num)){
       num_array.push(num)
   } else {
       break
   }
}
 for(let key of num_array){
   totoal += key
}
  alert(`总数:${totoal}`)