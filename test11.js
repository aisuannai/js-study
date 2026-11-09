function isEmpty(obj){
    for(let key in obj){
        return false
    }
    return true
}

// 在调用之前
let menu = {
  width: 200,
  height: 300,
  title: "My menu"
};


function multiplyNumeric(menu){
    for(let key in menu){
        if(typeof menu[key] === 'number'){
            menu[key] =  menu[key] * 2
        }
    }
}

multiplyNumeric(menu)
for(const key in menu){
    console.log(`key:${key} value:${menu[key]}`)
}