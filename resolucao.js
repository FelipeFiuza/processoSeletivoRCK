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

//funcao de ordenacao para uso com array.sort(), adaptado de https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
function sortCategoriaId(a, b) {
    
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

//funcao de ordenacao
function ordenarCategoriaId(database) {
    
    database.sort(sortCategoriaId);
    
    console.table(database, ["category", "id", "name"]);
    
}

//adaptado de https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824, referencia utilizada para entender operacoes com arquivos JSON
function exportDatabase(database, location) {
    
    //transformando o objeto em string, parametro espaço atribuido como 1 para melhorar legibilidade e seguir padrao do arquivo de entrada
    const jsonString = JSON.stringify(database, null, 1);

    fs.writeFile(location, jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        }
    })
}


//funcao calculo de estoque por categoria
function valorEstoqueCategoria(database) {
    
    //inicializacao de uma array de objeto 'estoque', onde cada objeto representa uma categoria e recebe valor do estoque do primeiro produto
    let estoque = [{
        categoria: database[0].category,
        valEstoque: database[0].quantity * database[0].price      
    }],
        index = 0;
    
    //loop para passar por todos os objetos da array de produtos
    for(i = 1; i < database.length; i++) {
        
        //caso seja uma categoria diferente, inicializa novo objeto estoque, atribui o nome e o valor de estoque 
        if (estoque[index].categoria != database[i].category) {
            
            index++;
            estoque.push({
                categoria: database[i].category,
                valEstoque: database[i].quantity * database[i].price
            })
            
        } else {
            
            //sendo a mesma categoria do produto atual, apenas acumular o valor de estoque
            estoque[index].valEstoque += database[i].quantity * database[i].price;   
        }        
    }
    
    console.table(estoque);
}

let wrongChars =    ["æ", "¢", "ø", "ß"],
    correctChars =  ["a", "c", "o", "b"];

var myDatabase = loadDatabase('./broken-database.json');

nameRepair(myDatabase, wrongChars, correctChars);

priceRepair(myDatabase);

qtyRepair(myDatabase);

ordenarCategoriaId(myDatabase);

valorEstoqueCategoria(myDatabase);

exportDatabase(myDatabase, './saida.json');





