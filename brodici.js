var redova=10;
var kolona=10;
/////////TABLA1////////////
var tabla1=document.getElementById("tabla1");
var tabla2=document.getElementById("tabla2");
function kreirajTabelu(redova, kolona) {
    var tabela = document.createElement("table");
    tabela.setAttribute("id","tabela");
    for (var i = 0; i < redova; i++) {
        var noviRed = document.createElement("tr");
        for (var j = 0; j < kolona; j++) {
            var novaKolona = document.createElement("td");
            novaKolona.setAttribute("id", "novaKolona");
            noviRed.appendChild(novaKolona);
        }
        tabela.appendChild(noviRed);
    }
    return tabela;
}

tabla1.appendChild(kreirajTabelu(redova, kolona));
tabla2.appendChild(kreirajTabelu(redova, kolona));
