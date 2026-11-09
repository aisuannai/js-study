function readNumer(){

   while(true){
     let value = prompt('请输入数字','')
     if(value === null || value === ''){
        continue
     }
     if(isFinite(value)){
         alert(`value is ${value}`)
         break
      }
   }
}

readNumer()