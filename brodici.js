const labels = {emptySpace: 0, ship: 1, reservedSpace: 2};

let table1 = createTable(),
    table2 = createTable(),
    igrac1 = 'Player 1',
    igrac2 = 'Player 2',
    ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
    shipsOnTable = {};

randomShipsPosition(table1);
randomShipsPosition(table2);

setInterval(() => {
    document.getElementById("player1").innerHTML = drawOnPage(table1, "Player1").outerHTML;
    document.getElementById("player2").innerHTML = drawOnPage(table2, "Player2").outerHTML;
}, 1000);

document.getElementById("player1").addEventListener("dblclick", rotateShip);
document.getElementById("player2").addEventListener("dblclick", rotateShip);

function rotateShip(event) {
    if (event.target !== event.currentTarget) {
        let player = event.currentTarget.id;
        let table = player === "player1" ? table1 : table2;
        for (let key in shipsOnTable[player]) {
            let ship = shipsOnTable[player][key];
            for (let shipElement of ship.position) {
                if (shipElement.toString() === event.target.id.split("_").toString()) {
                    let oldPosition = ship.position,
                        oldDirection = ship.direction,
                        newPosition = [],
                        shipNumber = key;
                    for (let index = 0; index < oldPosition.length; index++) {
                        if (ship.direction === "horizontal") {
                            newPosition[index] = [oldPosition[index][0] + index, oldPosition[index][1] - index];
                        } else if (ship.direction === "vertical") {
                            newPosition[index] = [oldPosition[index][0] - index, oldPosition[index][1] + index];
                        }
                        if (newPosition[index][0] < 0 || newPosition[index][0] > 9 ||newPosition[index][1] < 0 || newPosition[index][1] > 9) return;
                    }
                    removeOldPosition(table, oldPosition, player, shipNumber);
                    if (isPositionEmpty(newPosition, player, table) === true) {
                        addRotatedShip(newPosition, oldDirection, player, table, shipNumber);
                    } else {
                        returnOldPositon(oldPosition, oldDirection, player, table, shipNumber);
                    }
                }
            }
        }
    }
    event.stopPropagation();
}

function addRotatedShip(newPosition, oldDirection, player, table, shipNumber) {
    let newDirection;
    oldDirection === "vertical" ? newDirection = "horizontal" : newDirection = "vertical";
    shipsOnTable[player][shipNumber] = {
        position: newPosition,
        direction: newDirection
    };
    for (let cell = 0; cell < newPosition.length; cell++) {
        table[newPosition[cell][0]][newPosition[cell][1]] = labels.ship;
    }
    updateReservedSpace(table, player);
}

function removeOldPosition(table, oldPosition, player, shipNumber) {
    delete shipsOnTable[player][shipNumber];
    for (let cell = 0; cell < oldPosition.length; cell++) {
        table[oldPosition[cell][0]][oldPosition[cell][1]] = labels.emptySpace;
    }
    updateReservedSpace(table, player);
}

function updateReservedSpace(table, player) {
    //remove old reserved space
    for (let row = 0; row < table.length; row++) {
        for (let column = 0; column < table[row].length; column++) {
            if (table[row][column] !== labels.ship) table[row][column] = labels.emptySpace;
        }
    }
    //add new reserved space
    for (let ship in shipsOnTable[player]) {
        let shipPosition = shipsOnTable[player][ship]["position"];
        for (let position = 0; position < shipPosition.length; position++) {
            let cell = shipPosition[position];
            findReservedSpace(table, cell);
        }
    }
}

function returnOldPositon(oldPosition, oldDirection, player, table, shipNumber) {
    shipsOnTable[player][shipNumber] = {
        position: oldPosition,
        direction: oldDirection
    };
    for (let cell = 0; cell < oldPosition.length; cell++) {
        table[oldPosition[cell][0]][oldPosition[cell][1]] = labels.ship;
    }
    updateReservedSpace(table, player);
}

function isPositionEmpty(newShip, player, table) {
    let counter = 0;
    for (let cell = 0; cell < newShip.length; cell++) {
        if (typeof table[newShip[cell][0]][newShip[cell][1]] === "undefined") {
            console.log(table[newShip[cell][0]][newShip[cell][1]]);
            return false;
        }
        if (table[newShip[cell][0]][newShip[cell][1]] === labels.emptySpace)
            counter++;
    }
    return newShip.length === counter ;
}

function createTable() {
    let table = [];
    for (let hight = 0; hight < 10; hight++) {
        table[hight] = [];
        for (let width = 0; width < 10; width++) {
            table[hight][width] = labels.emptySpace;
        }
    }
    return table;
}

function drawOnPage(table, player) {
    let tabla = document.createElement("table");
    tabla.setAttribute("id", player);
    for (let row = 0; row < table.length; row++) {
        let rowInTable = document.createElement("tr");
        for (let cell = 0; cell < table[row].length; cell++) {
            let cellInRow = document.createElement("td");
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
    if ((cell[0] > 0 && cell[0] < 9) && (cell[1] > 0 && cell[1] < 9)) {
        addReservedSpace(table, cell, -1, 2, -1, 2)
    } else if (cell[0] === 0 && cell[1] === 0) {
        addReservedSpace(table, cell, 0, 2, 0, 2)
    } else if (cell[0] === 9 && cell[1] === 9) {
        addReservedSpace(table, cell, -1, 1, -1, 1)
    } else if (cell[0] === 0 && cell[1] === 9) {
        addReservedSpace(table, cell, 0, 2, -1, 1)
    } else if (cell[0] === 9 && cell[1] === 0) {
        addReservedSpace(table, cell, -1, 1, 0, 2)
    } else if (cell[0] === 0 && (cell[1] > 0 && cell[1] < 9)) {
        addReservedSpace(table, cell, 0, 2, -1, 2)
    } else if (cell[0] === 9 && (cell[1] > 0 && cell[1] < 9)) {
        addReservedSpace(table, cell, -1, 1, -1, 2)
    } else if ((cell[0] > 0 && cell[0] < 9) && cell[1] === 0) {
        addReservedSpace(table, cell, -1, 2, 0, 2)
    } else if ((cell[0] > 0 && cell[0] < 9) && cell[1] === 9) {
        addReservedSpace(table, cell, -1, 2, -1, 1)
    }
}

function addReservedSpace(table, cell, iEqual, iLess, jEqual, jLess) {
    for (let i = iEqual; i < iLess; i++) {
        for (let j = jEqual; j < jLess; j++) {
            if (table[cell[0] + i][cell[1] + j] !== labels.ship) {
                table[cell[0] + i][cell[1] + j] = labels.reservedSpace;
            }
        }
    }
}

function randomShipsPosition(table) {
    let key;
    table === table1 ? key = "player1" : key = "player2";
    shipsOnTable[key] = [];
    for (let ship = 0; ship < ships.length; ship++) {
        let direction = Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical",
            row = Math.floor(Math.random() * 10),
            cell = Math.floor(Math.random() * 10),
            shipLength,
            shipPosition = [],
            counter = 0,
            index;

        if (direction === "horizontal") {
            for (shipLength = 0; shipLength < ships[ship]; shipLength++) {
                while (cell + ships[ship] >= table.length) {
                    row = Math.floor(Math.random() * 10);
                    cell = Math.floor(Math.random() * 10);
                }
                shipPosition[shipLength] = [row, cell + shipLength];
            }
        } else if (direction === "vertical") {
            for (shipLength = 0; shipLength < ships[ship]; shipLength++) {
                while (row + ships[ship] >= table[0].length) {
                    row = Math.floor(Math.random() * 10);
                    cell = Math.floor(Math.random() * 10);
                }
                shipPosition[shipLength] = [row + shipLength, cell];
            }
        }
        for (index = 0; index < shipPosition.length; index++) {
            let position = shipPosition[index];
            if (table[shipPosition[index][0]][shipPosition[index][1]] === labels.emptySpace) {
                counter++;
            }
        }
        if (counter === shipPosition.length) {
            for (index = 0; index < shipPosition.length; index++) {
                let position = shipPosition[index];
                shipsOnTable[key]["ship" + ship] = {
                    position: shipPosition,
                    direction: direction
                };
                table[position[0]][position[1]] = labels.ship;
                findReservedSpace(table, [position[0], position[1]]);
            }
        } else {
            ship--;
        }
    }
}

function koIgraPrvi() {
    let prviIgra = Math.ceil(Math.random() * 2);
    if (prviIgra === 1) {
        return igrac1;
    } else {
        return igrac2;
    }
}

//koIgraPrvi();