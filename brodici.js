var redova=10;
var kolona=10;
/////////TABLA1////////////
var tabla1=document.getElementById("tabla1");
function kreirajTabelu(redova, kolona) {
    var tabela1 = document.createElement("table");
    tabela1.setAttribute("id","tabela1");
    for (var i = 0; i < redova; i++) {
        var noviRed1 = document.createElement("tr");
        for (var j = 0; j < kolona; j++) {
            var novaKolona1 = document.createElement("td");
            novaKolona1.setAttribute("id", "novaKolona1");
            noviRed1.appendChild(novaKolona1);
        }
        tabela1.appendChild(noviRed1);
    }
    return tabela1;
}

tabla1.appendChild(kreirajTabelu(redova, kolona));


/////////TABLA2////////////
var tabla2=document.getElementById("tabla2");
function kreirajTabelu(redova, kolona) {
    var tabela2 = document.createElement("table");
    tabela2.setAttribute("id","tabela2");
    for (var i = 0; i < redova; i++) {
        var noviRed2 = document.createElement("tr");
        for (var j = 0; j < kolona; j++) {
            var novaKolona2 = document.createElement("td");
            novaKolona2.setAttribute("id", "novaKolona2");
            noviRed2.appendChild(novaKolona2);
        }
        tabela2.appendChild(noviRed2);
    }
    return tabela2;
}

tabla2.appendChild(kreirajTabelu(redova, kolona));
