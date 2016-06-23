function GameOfLife(width, height) {
	// INPUTS
	this.width = width;
	this.height = height;

	// INIT
	// create the <table> and append it to the #table-container
	// each <td> receives a cell class, a row-col ID, a data-status
	// and an onclick function to toggle each <td>'s alive state
	var golScope = this;
	var clickFunction = function() {
		// in this context, 'this' is bound to the HTML element
		golScope.coordinateHash[this.id] = 'alive';
		this.classList.toggle('alive');
	};

	var table = document.createElement('table');
	for (var row = 0; row < this.height; row++) {
		var tr = document.createElement('tr');
		for (var col = 0; col < this.width; col++) {
			var td = document.createElement('td');
			td.id = row + '-' + col;
			td.className = 'cell';
			td.onclick = clickFunction;
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	document.getElementById('table-container').appendChild(table);

	// PROPERTIES AND METHODS

	this.evolve = function() {
		var cells = document.getElementsByClassName('cell');
		var newCoordinateHash = {};
		var golScope = this;
		Array.from(cells).forEach(function(cell) {
			var coordinates = cell.id.split('-'); // ex: [15, 34]
			var row = Number(coordinates[0]);
			var column = Number(coordinates[1]);

			var isAlive = golScope.coordinateHash[cell.id] == 'alive';
			var isDead = !isAlive;
			var numberOfLiveNeighbors = golScope.getNumberOfAdjacentAliveCells(row, column);
			if (isAlive && numberOfLiveNeighbors < 2) {
				// Any live cell with fewer than two live neighbors dies, as if caused by under population
				cell.setAttribute('data-status', null);
			} else if (isAlive && numberOfLiveNeighbors <= 3) {
				// Any live cell with two or three live neighbors lives on to the next generation
				cell.setAttribute('data-status', 'alive');
				newCoordinateHash[cell.id] = 'alive'; //update the newCoordinateHash
			} else if (isAlive && numberOfLiveNeighbors > 3) {
				// Any live cell with more than three neighbors dies as if by overcrowding
				cell.setAttribute('data-status', null);
			} else if (isDead && numberOfLiveNeighbors == 3) {
				// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction
				cell.setAttribute('data-status', 'alive');
				newCoordinateHash[cell.id] = 'alive'; //update the newCoordinateHash
			}
		});

		this.coordinateHash = newCoordinateHash;

		this.updateNumberOfGenerations(this.numberOfGenerations + 1);
	};
	this.generateRandomCoordinateHash = function() {
		var obj = {};
		for (var row = 0; row < this.height; row++) {
			for (var column = 0; column < this.width; column++) {
				if (Math.round(Math.random())) {
					obj[row + '-' + column] = 'alive';
				}
			}
		}
		return obj;
	};
	this.getNumberOfAdjacentAliveCells = function(row, column) {
		var directions = [
			{rowOffset: -1, columnOffset: 0},  // top
			{rowOffset: -1, columnOffset: 1},  // top-right
			{rowOffset: 0, columnOffset: 1},   // right
			{rowOffset: 1, columnOffset: 1},   // bottom-right
			{rowOffset: 1, columnOffset: 0},   // bottom
			{rowOffset: 1, columnOffset: -1},  // bottom-left
			{rowOffset: 0, columnOffset: -1},  // left
			{rowOffset: -1, columnOffset: -1}, // top-left
		];

		var num = 0;
		var golScope = this;
		directions.forEach(function(direction) {
			var cellCoordinate = (row + direction.rowOffset) + '-' + (column + direction.columnOffset);
			if (golScope.coordinateHash[cellCoordinate] == 'alive') {
				num++;
			}
		});
		return num;
	};
	this.isRunning = false;
	this.numberOfGenerations = 0;
	this.coordinateHash = this.generateRandomCoordinateHash();
	this.resetAllCellDataStatus = function() {
		var cells = document.getElementsByClassName('cell');
		Array.from(cells).forEach(function(cell) {
			cell.setAttribute('data-status', null);
		});
	};
	this.resetCoordinateHash = function() {
		this.coordinateHash = {};
	};
	this.revertToInitialState = function() {
		// this is called on init() and on #reset.click
		this.updateNumberOfGenerations(0);
		document.getElementById('run-pause').innerText = 'Run';
		this.resetAllCellDataStatus(); // resets the visuals
		this.coordinateHash = this.generateRandomCoordinateHash();
	};
	this.updateNumberOfGenerations = function(num) {
		this.numberOfGenerations = num;
		document.getElementById('generations').innerHTML = num;
	};
}


/* ----------------- */

var gol = new GameOfLife(50, 50);

var executionId;
document.getElementById('run-pause').onclick = function() {
	if (gol.isRunning) {
		// User clicked "Pause"
		gol.isRunning = false;
		clearInterval(executionId);
		this.innerText = 'Run';
	} else {
		// User clicked "Run"
		gol.isRunning = true;
		executionId = setInterval(function() {
			gol.evolve();
		}, 100);
		this.innerText = 'Pause'
	}
};

document.getElementById('reset').onclick = function() {
	// User clicked "Reset"
	gol.isRunning = false;
	clearInterval(executionId);
	gol.revertToInitialState();
};
