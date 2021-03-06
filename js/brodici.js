const labels = {emptySpace: 0, ship: 1, reservedSpace: 2, selectedShip: 3};

let player1 = {
        name: "",
        table: createTable(),
        shipsPosition: {}
    },
    player2 = {
        name: "enemy",
        table: createTable(),
        hits: {}
    },
    ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
    input = document.getElementById("start");

input.addEventListener("submit", (event) => {
    player1.name = document.getElementById("username").value;
    input.style.display = "none";
    document.getElementById("table").style.display = "flex";
    document.getElementById("playerOne").textContent = player1.name;
    positionSetting();
    event.preventDefault();
});

let allListeners = {
    settingPosition: {
        mouseDown: function (event) {
            let targetProperties = tableSetup.createTargetProperties(event);
            localStorage.setItem("property", JSON.stringify(targetProperties));
            player1.table = tableSetup.colorSelectedShip(player1.table, player1.shipsPosition, targetProperties, "on");
        },
        mouseUp: function (event) {
            let targetProperties = JSON.parse(localStorage.getItem("property")),
                newTableAndPosition = tableSetup.doSomething(player1.table, player1.shipsPosition, event, targetProperties);
            player1.table = tableSetup.colorSelectedShip(player1.table, player1.shipsPosition, targetProperties, "off");
            player1.table = newTableAndPosition.table;
            player1.shipsPosition = newTableAndPosition.shipPosition;
            localStorage.removeItem("property");
        },
        newRandomPosition: function () {
            let random = tableSetup.randomShipsPosition(player1.table);
            player1.table = random.myTable;
            player1.shipsPosition = random.shipsOnTable;
        },
        confirmPosition: function () {
            /*ajaxStorage.set(player1.name, player1.table, function () {
            console.log("set table", player1.table);
        });*/
            startTheBattle();
        }
    }
};

function startTheBattle() {

}

function positionSetting() {
    let random = tableSetup.randomShipsPosition(player1.table);
    player1.table = random.myTable;
    player1.shipsPosition = random.shipsOnTable;
    setInterval(() => {
        document.getElementById("player1").innerHTML = drawOnPage(player1.table, "Player1").outerHTML;
        document.getElementById("player2").innerHTML = drawOnPage(player2.table, "Player2").outerHTML;
    }, 100);
    listenersForPositionSetting("player1");
}

function listenersForPositionSetting(id) {
    let player = document.getElementById(id);
    player.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    }, false);
    player.addEventListener("mousedown", allListeners.settingPosition.mouseDown);
    player.addEventListener("mouseup", allListeners.settingPosition.mouseUp);
    document.getElementById("newRandom").addEventListener("click", allListeners.settingPosition.newRandomPosition);
    document.getElementById("confirmPosition").addEventListener("click", allListeners.settingPosition.confirmPosition);
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
            if (table[row][cell] === labels.emptySpace || table[row][cell] === labels.reservedSpace) cellInRow.style.backgroundColor = "white";
            if (table[row][cell] === labels.ship) cellInRow.style.backgroundColor = "black";
            if (table[row][cell] === labels.selectedShip) cellInRow.style.border = "solid blue 1px";
            if (table[row][cell] === labels.selectedShip) cellInRow.style.backgroundColor = "yellow";
            cellInRow.setAttribute("id", row + "_" + cell);
            rowInTable.appendChild(cellInRow);
        }
        tabla.appendChild(rowInTable);
    }
    return tabla;
}

function koIgraPrvi() {
    let prviIgra = Math.ceil(Math.random() * 2);
    if (prviIgra === 1) {
        return player1;
    } else {
        return player2;
    }
}

