let tableSetup = {
    createTargetProperties: function (event) {
        let targetProperties;
        if (event.target !== event.currentTarget) {
            for (let shipNumber in player1.shipsPosition) {
                if (player1.shipsPosition.hasOwnProperty(shipNumber)){
                    let ship = player1.shipsPosition[shipNumber];
                    for (let shipElement of ship.position) {
                        if (shipElement.toString() === event.target.id.split("_").toString()) {
                            targetProperties = {
                                oldPosition: ship.position,
                                oldDirection: ship.direction,
                                newPosition: 0,
                                shipNumber: shipNumber,
                                lengthOfShip: ship.position.length,
                                indexOfElement: ship.position.indexOf(shipElement)
                            };
                        }
                    }
                }
            }
        }
        this.colorSelectedShip(player1.table, targetProperties, "on");
        return targetProperties;
    },

    colorSelectedShip: function (table, targetProperties, turnOnOrOff) {
        let type,
            myTable = table;
        turnOnOrOff === "on" ? type = labels.selectedShip : type = labels.ship;
        let selectedShip = player1.shipsPosition[targetProperties.shipNumber].position;
        for (let field = 0; field < selectedShip.length; field++) {
            for (let index = 0; index < selectedShip[field].length; index++) {
                myTable[selectedShip[field][0]][selectedShip[field][1]] = type;
            }
        }
        player1.table = myTable;
    },

    rotateOrMoveShip: function (event, targetProperties, rotateOrMove) {
        if (rotateOrMove === "rotate" ){
            targetProperties.newPosition = this.createNewRotatedPosition(targetProperties)
        } else if(rotateOrMove === "move") {
            targetProperties.newPosition = this.createNewMovedPosition(event, targetProperties);
        }
        this.removeOldPosition(targetProperties);
        if (this.isPositionEmpty(targetProperties) === true) {
            this.addTranslatedShip(targetProperties, rotateOrMove);
        } else {
            this.returnOldPosition(targetProperties);
        }
        this.colorSelectedShip(player1.table, targetProperties, "off");
    },

    doSomething: function (event, targetProperties) {
        let rotateOrMove;
        if (event.button === 0) {
            rotateOrMove = "move";
        } else if (event.button === 2) {
            rotateOrMove = "rotate";
        }
        this.rotateOrMoveShip(event, targetProperties, rotateOrMove);
    },

    createNewMovedPosition: function (event, targetProperties) {
        let newPosition = [],
            newPlace = event.target.id.split("_"),
            moveVertical = newPlace[0] - targetProperties.oldPosition[targetProperties.indexOfElement][0],
            moveHorizontal = newPlace[1] - targetProperties.oldPosition[targetProperties.indexOfElement][1];

        for (let index = 0; index < targetProperties.oldPosition.length; index++) {
            newPosition[index] = [targetProperties.oldPosition[index][0] + moveVertical, targetProperties.oldPosition[index][1] + moveHorizontal];
        }
        return newPosition;
    },

    createNewRotatedPosition: function (obj) {
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
    },

    addTranslatedShip: function (obj, rotateOrMove) {
        let table = player1.table;
        let newDirection;
        if (rotateOrMove === "rotate") {
            obj.oldDirection === "vertical" ? newDirection = "horizontal" : newDirection = "vertical";
        } else {
            newDirection = obj.oldDirection;
        }
        player1.shipsPosition[obj.shipNumber] = {
            position: obj.newPosition,
            direction: newDirection
        };
        for (let cell = 0; cell < obj.newPosition.length; cell++) {
            table[obj.newPosition[cell][0]][obj.newPosition[cell][1]] = labels.ship;
        }
        player1.table = table;
        this.updateReservedSpace(player1.table);
    },

    removeOldPosition: function (obj) {
        delete player1.shipsPosition[obj.shipNumber];
        for (let cell = 0; cell < obj.oldPosition.length; cell++) {
            player1.table[obj.oldPosition[cell][0]][obj.oldPosition[cell][1]] = labels.emptySpace;
        }
        this.updateReservedSpace(player1.table);

    },

    updateReservedSpace: function (table) {
        for (let row = 0; row < table.length; row++) { //remove old reserved space
            for (let column = 0; column < table[row].length; column++) {
                if (table[row][column] === labels.selectedShip) table[row][column] = labels.ship;
                if (table[row][column] !== labels.ship) table[row][column] = labels.emptySpace;
            }
        }
        for (let ship in player1.shipsPosition) { //add new reserved space
            let shipPosition = player1.shipsPosition[ship]["position"];
            for (let position = 0; position < shipPosition.length; position++) {
                this.addReservedSpace(table, shipPosition[position]);
            }
        }
    },

    returnOldPosition: function (obj) {
        let myTable = player1.table;
        player1.shipsPosition[obj.shipNumber] = {
            position: obj.oldPosition,
            direction: obj.oldDirection
        };
        for (let cell = 0; cell < obj.oldPosition.length; cell++) {
            myTable[obj.oldPosition[cell][0]][obj.oldPosition[cell][1]] = labels.ship;
        }
        player1.table = myTable;
        this.updateReservedSpace(player1.table);
    },

    isPositionEmpty: function (obj) {
        let counter = 0;
        if (typeof obj.newPosition === "undefined") return false;
        for (let cell = 0; cell < obj.newPosition.length; cell++) {
            let index = obj.newPosition[cell];
            if (typeof player1.table[index[0]][index[1]] === "undefined") {
                return false;
            }
            if (player1.table[index[0]][index[1]] === labels.emptySpace)
                counter++;
        }
        return obj.newPosition.length === counter;
    },

    addReservedSpace: function (table, cell) {
        let myTable = table;
        for (let verticalPosition = -1; verticalPosition < 2; verticalPosition++) {
            for (let horizontalPosition = -1; horizontalPosition < 2; horizontalPosition++) {
                if (myTable[cell[0] + verticalPosition] === undefined || myTable[cell[0] + verticalPosition][cell[1] + horizontalPosition] === undefined) continue;
                if (myTable[cell[0] + verticalPosition][cell[1] + horizontalPosition] !== labels.ship) {
                    myTable[cell[0] + verticalPosition][cell[1] + horizontalPosition] = labels.reservedSpace;
                }
            }
        }
    },

    randomShipsPosition: function (table) {
        let myTable = createTable(),
            shipsOnTable = [];

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
                if (myTable[shipPosition[index][0]][shipPosition[index][1]] === labels.emptySpace) {
                    counter++;
                }
            }
            if (counter === shipPosition.length) {
                for (index = 0; index < shipPosition.length; index++) {
                    let position = shipPosition[index];
                    shipsOnTable["ship" + ship] = {
                        position: shipPosition,
                        direction: direction
                    };
                    myTable[position[0]][position[1]] = labels.ship;
                    this.addReservedSpace(myTable, [position[0], position[1]]);
                }
            } else {
                ship--;
            }
        }
        return {myTable: myTable, shipsOnTable: shipsOnTable}
    }
};