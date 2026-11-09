function ucFirst(param){

   let first_char =  param?.slice(0,1).toUpperCase()
   
   return first_char + param?.slice(1)
}

value = ucFirst(prompt('字符串转换',''))

alert(value)