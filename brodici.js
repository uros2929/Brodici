var labels = {emptySpace: 0, ship: 1, reservedSpace: 2},
    table1 = createTable(),
    table2 = createTable(),
    igrac1 = 'Player 1',
    igrac2 = 'Player 2';
var ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var shipsOnTable = {};

randomShipsPosition(table1);
randomShipsPosition(table2);

document.getElementById("player1").innerHTML = drawOnPage(table1, "Player1").outerHTML;
document.getElementById("player2").innerHTML = drawOnPage(table2, "Player2").outerHTML;

//document.getElementById("player2").addEventListener("click");
//document.getElementById("player1").addEventListener("click");
document.getElementById("player1").addEventListener("dblclick", rotateShip);
document.getElementById("player2").addEventListener("dblclick", rotateShip);

function rotateShip(event) {
    console.log(event.currentTarget.id);
    if (event.target !== event.currentTarget) {
        var tableID = event.currentTarget.id;
        for (var key in shipsOnTable[tableID]) {
            for (var element in shipsOnTable[tableID][key].position) {
                if (shipsOnTable[tableID][key].position[element].toString() === event.target.id.split("_").toString()) {
                    //console.log("key:", key, " direction:", shipsOnTable[tableID][key].direction);
                    console.log("old position",shipsOnTable[tableID][key].position);
                    var targetedShip = shipsOnTable[tableID][key].position;
                    var newPosition = [];
                    for (var index = 0; index < targetedShip.length; index++) {
                        if (shipsOnTable[tableID][key].direction === "horizontal") {
                            newPosition[index] = [targetedShip[index][0] + index, targetedShip[index][1] - index];
                        } else if (shipsOnTable[tableID][key].direction === "vertical") {
                            newPosition[index] = [targetedShip[index][0] - index, targetedShip[index][1] + index];
                        }
                    }
                    console.log("new position",newPosition);
                    //upisati newPosition u tabelu
                }
            }
        }
    }
    event.stopPropagation();
}

function moveShip(event) {
    if (event.target !== event.currentTarget) {
        var tableID = event.currentTarget.id;
        for (var key in shipsOnTable[tableID]) {
            for (var element in shipsOnTable[tableID][key].position) {
                if (shipsOnTable[tableID][key].position[element].toString() === event.target.id.split("_").toString()) {
                    //logika
                }
            }
        }
    }
    event.stopPropagation();
}

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
        for (var cell = 0; cell < table[row].length; cell++) {
            var cellInRow = document.createElement("td");
            if (table[row][cell] === 0) cellInRow.style.backgroundColor = "white";
            if (table[row][cell] === 1) cellInRow.style.backgroundColor = "black";
            if (table[row][cell] === 2) cellInRow.style.backgroundColor = "silver"; //samo za testiranje
            cellInRow.setAttribute("id", row + "_" + cell);
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
    table === table1 ? key = "player1" : key = "player2";
    shipsOnTable[key] = [];
    for (var ship = 0; ship < ships.length; ship++) {
        var direction = Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical",
            row = Math.floor(Math.random() * 10),
            cell = Math.floor(Math.random() * 10),
            shipLength,

            shipPosition = [];

        if (direction === "horizontal") {
            for (shipLength = 0; shipLength < ships[ship]; shipLength++) {
                if (cell + ships[ship] <= table.length) {
                    shipPosition[shipLength] = [row, cell + shipLength];
                } else {
                    shipPosition[shipLength] = [row, cell - shipLength];
                }
            }
        } else if (direction === "vertical") {
            for (shipLength = 0; shipLength < ships[ship]; shipLength++) {
                if (row + ships[ship] <= table[0].length) {
                    shipPosition[shipLength] = [row + shipLength, cell];
                } else {
                    shipPosition[shipLength] = [row - shipLength, cell];
                }
            }
        }
        var counter = 0,
            index;
        for (index = 0; index < shipPosition.length; index++) {
            if (table[shipPosition[index][0]][shipPosition[index][1]] === labels.emptySpace) {
                counter++;
            }
        }
        if (counter === shipPosition.length) {
            for (index = 0; index < shipPosition.length; index++) {
                shipsOnTable[key]["ship" + ship] = {};
                shipsOnTable[key]["ship" + ship]["position"] = shipPosition;
                shipsOnTable[key]["ship" + ship]["direction"] = direction;
                table[shipPosition[index][0]][shipPosition[index][1]] = labels.ship;
                findReservedSpace(table, [shipPosition[index][0], shipPosition[index][1]]);
            }
        } else {
            ship--;
        }
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

//koIgraPrvi();