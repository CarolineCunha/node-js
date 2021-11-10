const crypto  = require('crypto')

function generateRandomId() {
    const id = crypto.randomUUID()
    return id
}

const teste = generateRandomId()
console.log(teste)