let user = {
    name:'jzz',
    years:30
}

let {name,years:age,isAdmin=false} = user 

alert(name)

alert(age)

alert(isAdmin)