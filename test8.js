let num = prompt('请输入数字','')
let flag = true
for(i=1;i<=num;i++){
    
    for(j=2;j<i;j++){
        if(i%j==0){
            flag = false
            break
        }
    }
    if(flag){
        console.log('素数:'+i)
    } else {
        flag = true
    }
}