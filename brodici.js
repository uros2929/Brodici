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

turnOnListeners();

function turnOnListeners() {
    const [player1, player2] = [document.getElementById("player1"), document.getElementById("player2")];

    player1.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    }, false);
    player2.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    }, false);
    player1.addEventListener("mousedown", createTargetProperties);
    player2.addEventListener("mousedown", createTargetProperties);

    player1.addEventListener("mouseup", doSomething);
    player2.addEventListener("mouseup", doSomething);


}

function createTargetProperties(event) {
    let targetProperties;
    if (event.target !== event.currentTarget) {
        let player = event.currentTarget.id;
        for (let key in shipsOnTable[player]) {
            let ship = shipsOnTable[player][key];
            for (let shipElement of ship.position) {
                if (shipElement.toString() === event.target.id.split("_").toString()) {
                    targetProperties = {
                        player: player,
                        table: player === "player1" ? table1 : table2,
                        oldPosition: ship.position,
                        oldDirection: ship.direction,
                        newPosition: 0,
                        shipNumber: key,
                        lengthOfShip: ship.position.length,
                        indexOfElement: ship.position.indexOf(shipElement)
                    };
                }
            }
        }
    }
    localStorage.setItem("property", JSON.stringify(targetProperties));
}

function doSomething(event) {
    let targetProperties = JSON.parse(localStorage.getItem("property"));
    if (event.button === 0) {
        moveShip(event, targetProperties);
    } else if (event.button === 2) {
        rotateShip(event, targetProperties);
    }
}

function moveShip(event, targetProperties) {
    targetProperties.newPosition = createNewMovedPosition(event, targetProperties);
    removeOldPosition(targetProperties);
    if (isPositionEmpty(targetProperties) === true) {
        addTranslatedShip(targetProperties, "move");
    } else {
        returnOldPositon(targetProperties);
    }
    localStorage.removeItem("property");
    event.preventDefault();
    event.stopPropagation();
}

function createNewMovedPosition(event, targetProperties) {
    let newPosition = [],
        newPlace = event.target.id.split("_"),
        moveVertical = newPlace[0] - targetProperties.oldPosition[targetProperties.indexOfElement][0],
        moveHorizontal = newPlace[1] - targetProperties.oldPosition[targetProperties.indexOfElement][1];

    for (let index = 0; index < targetProperties.oldPosition.length; index++) {
        newPosition[index] = [targetProperties.oldPosition[index][0] + moveVertical, targetProperties.oldPosition[index][1] + moveHorizontal];
    }
    return newPosition;
}

function rotateShip(event, targetProperties) {
    if (targetProperties.lengthOfShip !== 1) {
        targetProperties.newPosition = createNewRotatedPosition(targetProperties);
        removeOldPosition(targetProperties);
        if (isPositionEmpty(targetProperties) === true) {
            addTranslatedShip(targetProperties, "rotate");
        } else {
            returnOldPositon(targetProperties);
        }
    }
    localStorage.removeItem("property");
    event.stopPropagation();
    event.preventDefault();
}

function createNewRotatedPosition(obj) {
    let newPosition = [],
        increment;
    if (obj.indexOfElement === 0) {
        increment = 0
    }
    else if (obj.indexOfElement === 1) {
        increment = -1
    }
    else if (obj.indexOfElement === 2) {
        increment = -2
    }
    else if (obj.indexOfElement === 3) {
        increment = -3
    }
    for (let index = 0; index < obj.oldPosition.length; index++) {
        let cell = obj.oldPosition[index];
        if (obj.oldDirection === "horizontal") {
            newPosition[index] = [cell[0] + increment, cell[1] - increment];
        } else if (obj.oldDirection === "vertical") {
            newPosition[index] = [cell[0] - increment, cell[1] + increment];
        }
        if (newPosition[index][0] < 0 || newPosition[index][0] > 9 || newPosition[index][1] < 0 || newPosition[index][1] > 9) return;
        increment++;
    }
    return newPosition;
}

function addTranslatedShip(obj, rotateOrMove) {
    let newDirection;
    if (rotateOrMove === "rotate") {
        obj.oldDirection === "vertical" ? newDirection = "horizontal" : newDirection = "vertical";
    } else {
        newDirection = obj.oldDirection;
    }
    shipsOnTable[obj.player][obj.shipNumber] = {
        position: obj.newPosition,
        direction: newDirection
    };
    for (let cell = 0; cell < obj.newPosition.length; cell++) {
        obj.table[obj.newPosition[cell][0]][obj.newPosition[cell][1]] = labels.ship;
    }
    obj.player === "player1" ? table1 = obj.table : table2 = obj.table;
    updateReservedSpace(obj.table, obj.player);
}

function removeOldPosition(obj) {
    delete shipsOnTable[obj.player][obj.shipNumber];
    for (let cell = 0; cell < obj.oldPosition.length; cell++) {
        obj.table[obj.oldPosition[cell][0]][obj.oldPosition[cell][1]] = labels.emptySpace;
    }
    updateReservedSpace(obj.table, obj.player);
}

function updateReservedSpace(table, player) {
    for (let row = 0; row < table.length; row++) { //remove old reserved space
        for (let column = 0; column < table[row].length; column++) {
            if (table[row][column] !== labels.ship) table[row][column] = labels.emptySpace;
        }
    }
    for (let ship in shipsOnTable[player]) { //add new reserved space
        let shipPosition = shipsOnTable[player][ship]["position"];
        for (let position = 0; position < shipPosition.length; position++) {
            addReservedSpace(table, shipPosition[position]);
        }
    }
}

function returnOldPositon(obj) {
    shipsOnTable[obj.player][obj.shipNumber] = {
        position: obj.oldPosition,
        direction: obj.oldDirection
    };
    for (let cell = 0; cell < obj.oldPosition.length; cell++) {
        obj.table[obj.oldPosition[cell][0]][obj.oldPosition[cell][1]] = labels.ship;
    }
    updateReservedSpace(obj.table, obj.player);
}

function isPositionEmpty(obj) {
    let counter = 0;
    if (typeof obj.newPosition === "undefined") return false;
    for (let cell = 0; cell < obj.newPosition.length; cell++) {
        let index = obj.newPosition[cell];
        if (typeof obj.table[index[0]][index[1]] === "undefined") {
            return false;
        }
        if (obj.table[index[0]][index[1]] === labels.emptySpace)
            counter++;
    }
    return obj.newPosition.length === counter;
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

function addReservedSpace(table, cell) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (table[cell[0] + i] === undefined || table[cell[0] + i][cell[1] + j] === undefined) continue;
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
                addReservedSpace(table, [position[0], position[1]]);
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