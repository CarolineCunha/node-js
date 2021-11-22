const crypto  = require('crypto')

function generateRandomId() {
    const id = crypto.randomUUID()
    return id
}

const teste = generateRandomId()
console.log(teste)

generateRandomId2 = () => {
    const id = crypto.randomUUID()
    return id
}
const teste2 = generateRandomId2()
console.log(teste2)

const teste3 = crypto.createHash('sha256').update(teste2).digest('hex')
console.log(teste3)

function soma(x,y){
    return x + y
}
soma(3,4)