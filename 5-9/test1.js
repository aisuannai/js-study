function count(obj){
    let a = Object.keys(obj)
    return a.length
}

let user = {
  name: 'John',
  age: 30
};

alert( count(user) ); 