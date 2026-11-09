function extractCurrencyValue(param){
    if(typeof param =='string'){
       let index= param.indexOf('$')
       return param.slice(index+1, param.length)
    }
    return false
}

let n = prompt('请输入字符','')
alert(extractCurrencyValue(n))