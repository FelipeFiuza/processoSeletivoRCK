//tratamento de arquivo OK
//modulo para interagir com file system
const fs = require('fs');

//Declaracao das 5 funcoes: carregar dados, tratar caracteres dos 'nomes', tratar tipo dos 'precos', tratar parametro 'quantidade', exportar para json


function loadDatabase (location) {
    //neste caso, o arquivo é estático e pode ser lido usando o require
    return require(location);
}


//Devera ser passado como parametro duas arrays, uma com os caracteres a serem localizados e a outra com os caracteres que serao colocados no lugar
function nameRepair(objArray, takeOutArray, putInArray) {
    
    //loop para passar por todos os objetos da array
    for(i = 0; i < objArray.length; i++) {
        
        //loop para passar por todos os caracteres que devem ser encontrados
        for(j = 0; j < takeOutArray.length; j++){
            
            let strRepair = objArray[i].name,
                regularExp = new RegExp(takeOutArray[j], "g"); //Criar expressao regular que encontre todas as instancias do caracter atual
            
            //substitui os caracteres encontrados pela regex pelo caracter da array putInArray, uma iteracao para cada caracter diferente a ser modificado
            strRepair = strRepair.replace(regularExp, putInArray[j]);
            
            //funcao com regular expression para tornar primeira maiuscula a primeira letra de cada palavra
            //futuramente me dedicarei a entender melhor a associacao de expressoes regulares para adicionar como excecao as palavras nao significativas ("com", "de")
            //adaptado de https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
            strRepair = strRepair.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            
            objArray[i].name = strRepair;
               
        }
    }
}


//tratamento do preco, executando parseFloat
function priceRepair(objArray) {
    
    for(i = 0; i < objArray.length; i++) {
        
        objArray[i].price = parseFloat(objArray[i].price);
    }
}

//Checa se objeto possui a propriedade "quantidade", caso negativo atribui propriedade ao objeto, inicializada com '0'
function qtyRepair(objArray) {
        
    for(i = 0; i < objArray.length; i++) {
        
        if (!objArray[i].hasOwnProperty('quantity')) {
            
            objArray[i].quantity = 0;            
        }
    }
    
}

//funcao ordenacao para uso com array.sort(), adaptado de https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
function ordenarCategoriaId(a, b) {
    
    //Usando toUpperCase() para ignorar diferenças de maiusculas e minusculas
    const categoryA = a.category.toUpperCase();
    const categoryB = b.category.toUpperCase();

    let comparison = 0;
    
    //comparacao das categorias
    if (categoryA > categoryB) {
    comparison = 1;
    } else if (categoryA < categoryB) {
    comparison = -1;
    }

    //categorias iguais, comparar ids
    if (comparison == 0){
      if (a.id > b.id) {
          comparison = 1
      } else {
          comparison = -1
      }
    }

    return comparison;
}

//adaptado de https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824, referencia utilizada para entender operacoes com arquivos JSON
function exportDatabase(database, location) {
    
    //transformando o objeto em string, parametro espaço atribuido como 1 para melhorar legibilidade e seguir padrao do arquivo de entrada
    const jsonString = JSON.stringify(database, null, 1);

    fs.writeFile(location, jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

let wrongChars =    ["æ", "¢", "ø", "ß"],
    correctChars =  ["a", "c", "o", "b"];

var myDatabase = loadDatabase('./broken-database.json');

nameRepair(myDatabase, wrongChars, correctChars);

priceRepair(myDatabase);

qtyRepair(myDatabase);



myDatabase.sort(ordenarCategoriaId);

console.log(myDatabase);

exportDatabase(myDatabase, './saida.json');



