'use strict';

module.exports.soma = async (event) => {
  x = Number(event.key1)
  y = Number(event.key2)

  var soma = x + y
  console.log(soma)

  const response = {
    statusCode: 200,
    body: JSON.stringify({message:`${soma}`})
  }
  return response;
  };

module.exports.subtracao = async (event) => {
  x = Number(event.key1)
  y = Number(event.key2)

  var subtracao  = x - y
  console.log(soma)

  const response = {
    statusCode: 200,
    body: JSON.stringify({message:`${subtracao}`})
  }
  return response;
}

module.exports.multiplicacao = async (event) => {
  x = Number(event.key1)
  y = Number(event.key2)

  var multiplicacao  = x - y
  console.log(soma)

  const response = {
    statusCode: 200,
    body: JSON.stringify({message:`${multiplicacao}`})
  }
  return response;
}

module.exports
