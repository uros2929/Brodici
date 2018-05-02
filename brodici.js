var emptySpace = 0,
    ship = 1,
    table1 = createTable(),
    table2 = createTable();

var ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

document.getElementById("player1").innerHTML = drawOnPage(table1,"player1").outerHTML;
document.getElementById("player2").innerHTML = drawOnPage(table2,"player2").outerHTML;

document.getElementById("player1").addEventListener("click", targetingCell);
document.getElementById("player2").addEventListener("click", targetingCell);

function targetingCell(event) {
    if (event.target !== event.currentTarget) {
        console.log("tabela: ",event.currentTarget.id, " polje: ",event.target.id);
    }
    event.stopPropagation();
}

function createTable() {
    var table = [];
    for (var hight = 0; hight < 10; hight++) {
        table[hight] = [];
        for (var width = 0; width < 10; width++) {
            table[hight][width] = emptySpace;
        }
    }
    return table;
}

function drawOnPage(table, player) {
    var tabla = document.createElement("table");
    tabla.setAttribute("id", player);
    for (var row = 0; row < table.length; row++) {
        var rowInTable = document.createElement("tr");
        rowInTable.setAttribute("id", player+"_"+row);
        for (var cell = 0; cell < table[row].length; cell++) {
            var cellInRow = document.createElement("td");
            if (table[row][cell] === 0) cellInRow.style.backgroundColor = "white";
            if (table[row][cell] === 1) cellInRow.style.backgroundColor = "black";
            cellInRow.setAttribute("id", row + "." + cell);
            rowInTable.appendChild(cellInRow);
        }
        tabla.appendChild(rowInTable);
    }
    return tabla;
}