let username = prompt("请输入账号",'');
if( username === '' || username === null){
    alert('Canceled')
} else {
    if(username == 'Admin'){
        let password = prompt("请输入密码",'')
        if(password === '' || password === null){
            alert('Canceled')
        }
        else if(password === 'TheMaster'){
            alert('Welcome')
        } else {
            alert('Wrong password')
        }
    } else {
        alert('i dont konw you')
    }

}
