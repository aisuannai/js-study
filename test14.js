function Accumulator(value){
    this.value = value
    this.read = ()=>{
        this.value += +prompt('a?', 0);
    }
}

let accumulator = new Accumulator(3)
accumulator.read();
alert(accumulator.value)