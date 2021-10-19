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

