let ask = (quesion, yes, no) =>{
    if(confirm(quesion)){
        yes()
    } else {
        no()
    }
}

ask(
    'do you agree?',
    ()=>alert('You agreed'),
    ()=>alert('You cancend')
)