let salaries = {
  "John": 100,
  "Pete": 300,
  "Mary": 250
};

let a = Object.values(salaries)


let b = a.reduce((res,num)=>{
    res += num
    return res
})

alert(b)