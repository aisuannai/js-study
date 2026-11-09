function checkSpam(param){

    if(!param){
        return false
    }
    param = param.toLocaleLowerCase()
    return (param.includes('viagra') || param.includes('xxx'))
}


n = prompt('请输入字符','')
alert(checkSpam(n))