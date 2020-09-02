//file:///C:/github/processoSeletivoRCK/Teste%20Pr%C3%A1tico%20-%20PS%20TI.pdf
//tratamento de arquivo OK
//modulo para interagir com file system
const fs = require('fs');

//neste caso, o arquivo é estático e pode ser lido usando o require
const myDatabase = require('./broken-database.json');

/*brokenDatabase[0].name = 'testaaaa';

//transformando o objeto em string, parametro espaço atribuido como 1 para melhorar legibilidade e seguir padrao do arquivo de entrada
const jsonString = JSON.stringify(myDatabase, null, 1);

fs.writeFile('./saida.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})*/
/*const myDatabase = [{
    "id": 5677240,
    "name": "Cønjuntø de Pænelæs æntiæderentes ¢øm 05 Peçæs Pæris",
    "quantity": 21,
    "price": "192.84",
    "category": "Panelas"
  },
  {
    "id": 9628920,
    "name": "Lævæ & Se¢æ 10,2 Kg Sæmsung E¢ø ßußßle ßræn¢æ ¢øm 09 Prøgræmæs de Lævægem",
    "quantity": 57,
    "price": 3719.70,
    "category": "Eletrodomésticos"
  },
  {
    "id": 1316334,
    "name": "Refrigerædør ßøttøm Freezer Ele¢trølux de 02 Pørtæs Frøst Free ¢øm 598 Litrøs",
    "quantity": 12,
    "price": 3880.23,
    "category": "Eletrodomésticos"
  },
  {
    "id": 6502394,
    "name": "Føgãø de Pisø Ele¢trølux de 04 ßø¢æs, Mesæ de Vidrø Prætæ",
    "quantity": 37,
    "price": "1419",
    "category": "Eletrodomésticos"
  },
  {
    "id": 9576720,
    "name": "Førnø Mi¢rø-øndæs Pænæsøni¢ ¢øm ¢æpæ¢idæde de 21 Litrøs ßræn¢ø",
    "quantity": 13,
    "price": "358.77",
    "category": "Eletrodomésticos"
  },
  {
    "id": 8875900,
    "name": "Smært TV 4K Søny LED 65” 4K X-Reælity Prø, UpS¢ælling, Møtiønfløw XR 240 e Wi-F",
    "quantity": 0,
    "price": 5799.42,
    "category": "Eletrônicos"
  },
  {
    "id": 9746439,
    "name": "Høme Theæter LG ¢øm ßlu-ræy 3D, 5.1 ¢ænæis e 1000W",
    "quantity": 80,
    "price": 2199,
    "category": "Eletrônicos"
  },
  {
    "id": 2162952,
    "name": "Kit Gæmer æ¢er - Nøteßøøk + Heædset + Møuse",
    "price": "25599.00",
    "category": "Eletrônicos"
  },
  {
    "id": 3500957,
    "name": "Mønitør 29 LG FHD Ultræwide ¢øm 1000:1 de ¢øntræste",
    "quantity": 18,
    "price": 1559.40,
    "category": "Eletrônicos"
  },
  {
    "id": 1911864,
    "name": "Møuse Gæmer Predætør ¢estus 510 Føx Pretø",
    "price": "699",
    "category": "Acessórios"
  }
]*/

function nameRepair(objArray, takeOutArray, putInArray){
    
    for(i = 0; i < objArray.length; i++) {
        
        for(j = 0; j < takeOutArray.length; j++){
            
            let strRepair = objArray[i].name,
                regularExp = new RegExp(takeOutArray[j], "g");
            
            strRepair = strRepair.replace(regularExp, putInArray[j]);
            
            //funcao com regular expression para tornar primeira maiuscula a primeira letra de cada palavra
            //futuramente me dedicarei a entender melhor a associacao de expressoes regulares para adicionar como excecao as palavras nao significativas ("com", "de")
            //retirado de https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
            strRepair = strRepair.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            
            objArray[i].name = strRepair;
               
        }
    }
}


function priceRepair(objArray){
    
    for(i = 0; i < objArray.length; i++) {
        
        objArray[i].price = parseFloat(objArray[i].price);
    }
}

function qtyRepair(objArray) {
        
    for(i = 0; i < objArray.length; i++) {
        
        if (!objArray[i].hasOwnProperty('quantity')) {
            
            objArray[i].quantity = 0;            
        }
    }
    
}

let wrongChars =    ["æ", "¢", "ø", "ß"],
    correctChars =  ["a", "c", "o", "b"];

nameRepair(myDatabase, wrongChars, correctChars);

priceRepair(myDatabase);

qtyRepair(myDatabase);

console.log(myDatabase);

const jsonString = JSON.stringify(myDatabase, null, 1);

fs.writeFile('./saida.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})



