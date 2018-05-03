var labels = {emptySpace: 0, ship: 1, reservedSpace: 2},
    table1 = createTable(),
    table2 = createTable(),
    igrac1 = 'Player 1',
    igrac2 = 'Player 2';
var ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var shipsOnTable = {};

randomShipsPosition(table1);
randomShipsPosition(table2);

document.getElementById("player1").innerHTML = drawOnPage(table1, "player1").outerHTML;
document.getElementById("player2").innerHTML = drawOnPage(table2, "player2").outerHTML;

document.getElementById("player1").addEventListener("click", targetingCell);
document.getElementById("player2").addEventListener("click", targetingCell);

function targetingCell(event) {
    if (event.target !== event.currentTarget) {
        console.log("tabela: ", event.currentTarget.id, " polje: ", event.target.id);
    }
    event.stopPropagation();
}

function createTable() {
    var table = [];
    for (var hight = 0; hight < 10; hight++) {
        table[hight] = [];
        for (var width = 0; width < 10; width++) {
            table[hight][width] = labels.emptySpace;
        }
    }
    return table;
}

function drawOnPage(table, player) {
    var tabla = document.createElement("table");
    tabla.setAttribute("id", player);
    for (var row = 0; row < table.length; row++) {
        var rowInTable = document.createElement("tr");
        rowInTable.setAttribute("id", player + "_" + row);
        for (var cell = 0; cell < table[row].length; cell++) {
            var cellInRow = document.createElement("td");
            if (table[row][cell] === 0) cellInRow.style.backgroundColor = "white";
            if (table[row][cell] === 1) cellInRow.style.backgroundColor = "black";
            if (table[row][cell] === 2) cellInRow.style.backgroundColor = "silver"; //samo za testiranje
            cellInRow.setAttribute("id", row + "." + cell);
            rowInTable.appendChild(cellInRow);
        }
        tabla.appendChild(rowInTable);
    }
    return tabla;
}

function findReservedSpace(table, cell) {
    var i, j;
    if ((cell[0] > 0 && cell[0] < 9) && (cell[1] > 0 && cell[1] < 9)) {
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if (cell[0] === 0 && cell[1] === 0) {
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 2; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if (cell[0] === 9 && cell[1] === 9) {
        for (i = -1; i < 1; i++) {
            for (j = -1; j < 1; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if (cell[0] === 0 && cell[1] === 9) {
        for (i = 0; i < 2; i++) {
            for (j = -1; j < 1; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if (cell[0] === 9 && cell[1] === 0) {
        for (i = -1; i < 1; i++) {
            for (j = 0; j < 2; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if (cell[0] === 0 && (cell[1] > 0 && cell[1] < 9)) {
        for (i = 0; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if (cell[0] === 9 && (cell[1] > 0 && cell[1] < 9)) {
        for (i = -1; i < 1; i++) {
            for (j = -1; j < 2; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if ((cell[0] > 0 && cell[0] < 9) && cell[1] === 0) {
        for (i = -1; i < 2; i++) {
            for (j = 0; j < 2; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    } else if ((cell[0] > 0 && cell[0] < 9) && cell[1] === 9) {
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 1; j++) {
                addReservedSpace(table, cell, i, j);
            }
        }
    }
}

function addReservedSpace(table, cell, i, j) {
    if (table[cell[0] + i][cell[1] + j] !== labels.ship) {
        table[cell[0] + i][cell[1] + j] = labels.reservedSpace;
    }
}


function randomShipsPosition(table) {
    var key;
    table === table1 ? key = "Player1" : key = "Player2";
    shipsOnTable[key] = [];
    for (var ship = 0; ship < ships.length; ship++) {
        var direction = Math.floor(Math.random() * 2),
            row = Math.floor(Math.random() * 10),
            cell = Math.floor(Math.random() * 10),
            shipLength,
            shipPosition = [];

        if (direction === 0) {
            for (shipLength = 0; shipLength < ships[ship]; shipLength++) {
                if (cell + ships[ship] <= table.length) {
                    table[row][cell + shipLength] = labels.ship;
                    findReservedSpace(table, [row, cell + shipLength]);
                    shipPosition[shipLength] = [row, cell + shipLength];
                } else {
                    table[row][cell - shipLength] = labels.ship;
                    findReservedSpace(table, [row, cell - shipLength]);
                    shipPosition[shipLength] = [row, cell - shipLength];
                }
            }
        } else if (direction === 1) {
            for (shipLength = 0; shipLength < ships[ship]; shipLength++) {
                if (row + ships[ship] <= table[0].length) {
                    table[row + shipLength][cell] = labels.ship;
                    findReservedSpace(table, [row + shipLength, cell]);
                    shipPosition[shipLength] = [row + shipLength, cell];
                } else {
                    table[row - shipLength][cell] = labels.ship;
                    findReservedSpace(table, [row - shipLength, cell]);
                    shipPosition[shipLength] = [row - shipLength, cell];
                }
            }
        }
        shipsOnTable[key]["ship" + ship] = shipPosition;
    }
}

function koIgraPrvi() {
    var prviIgra = Math.ceil(Math.random() * 2);
    if (prviIgra == 1) {
        alert("Prvi na potezu je: " + igrac1);
    } else {
        alert("Prvi na potezu je: " + igrac2);
    }
}

koIgraPrvi();