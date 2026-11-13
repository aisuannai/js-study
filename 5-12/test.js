let user = {
    name:"Jon",
    age:35
}

let user_json = JSON.stringify(user)

alert(user_json)

let user_copy = JSON.parse(user_json)


console.log(Object.entries(user_copy))