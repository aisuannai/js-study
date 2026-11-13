let salaries = {
  "John": 100,
  "Pete": 300,
  "Mary": 250
};


let maxSalary = 0;
let maxName = null;

  for(let [name, salary] of Object.entries(salaries)) {
    if (maxSalary < salary) {
      maxSalary = salary;
      maxName = name;
    }
  }
alert(maxName)