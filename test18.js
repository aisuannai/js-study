function truncate(param){
   if (!(typeof param == 'string')){
       return false
   }
   if(param.length > 21){
        return param.slice(0,21) + '...'
   } else {
        return param
   }
}

let n = prompt('请输入字符串','')
alert(truncate(n))