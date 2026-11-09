let calculator = {
    reade(a,b){
        this.a = a;
        this.b = b
    },
    sum(){
        return this.a + this.b
    },
    mul(){
        return this.a * this.b
    }
}

calculator.reade(1,2)

console.log(calculator.sum())

console.log(calculator.mul())