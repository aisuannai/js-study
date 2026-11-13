function toJson(value) {
  // TODO
  let str= JSON.stringify(value, function replacer(key,value){
      try {
         return value ?? undefined
      } catch (error) {
         return null
      }
  } )
  if(typeof str == 'string' ){
      return str
  } 
  return null
}

alert(toJson({a:1}))