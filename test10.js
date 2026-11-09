let user = {
    name:'John',
    surname:'Smith'
}

for(const key in user){
    console.log(`key:${key} value:${user[key]}`)
}

delete user.name;

for(const key in user){
    console.log(`key:${key} value:${user[key]}`)
}