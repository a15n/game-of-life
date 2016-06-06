"use strict";

window.coordinateHash = {
  '0-0': 'alive',
  '0-1': 'alive',
  '1-0': 'alive',
};

var randomCoordinateHash = function() {
	var obj = {};
	for (var row = 0; row < 50; row++) {
		for (var column = 0; column < 50; column++) {
			if (Math.round(Math.random())) {
				obj[row + '-' + column] = 'alive';
			}
		}
	}
	coordinateHash = obj;
}();

var createBoardAndPopulateCoordinateHash = function() {
	var tableHtml = '<table>';
	for (var x = 0; x < 50; x++) {
		tableHtml += '<tr>';
		for (var y = 0; y < 50; y++) {
			let coordinate = x + '-' + y;
			tableHtml += '<td id="' + x + '-' + y + '" class="cell"></td>';
		}
		tableHtml += '</tr>';
	}
	tableHtml += '</table>';

	document.getElementById('board').innerHTML = tableHtml;
};

var assignClickEvents = function() {
	var cells = document.getElementsByClassName('cell');
	var clickFunction = function() {
		// debugger;
		coordinateHash[this.id] = 'alive';
		this.classList.toggle('alive');
	};
	Array.from(cells).forEach(function(cell) {
		cell.onclick = clickFunction;
	});
};

var getNumberOfAdjacentAliveCells = function(row, column) {
	var directions = [
		{row: -1, column: 0},  // top
		{row: -1, column: 1},  // top-right
		{row: 0, column: 1},   // right
		{row: 1, column: 1},   // bottom-right
		{row: 1, column: 0},   // bottom
		{row: 1, column: -1},  // bottom-left
		{row: 0, column: -1},  // left
		{row: -1, column: -1}, // top-left
	];

	var num = 0;
	directions.forEach(function(direction) {
		var cellCoordinate = (row + direction.row) + '-' + (column + direction.column);
		if (coordinateHash[cellCoordinate] == 'alive') {
			num++;
		}
	});
	return num;
};

// check EVERYTHING by the hash. Update cell.className accordingly

var runSimulation = function() {
	var cells = document.getElementsByClassName('cell');
	var newCoordinateHash = {};
	Array.from(cells).forEach(function(cell) {
		if (cell.id == '1-1') {
			debugger;
		}

		var coordinates = cell.id.split('-'); // 0, 0 -> 0, 1 -> 0, 2
		var row = Number(coordinates[0]);
		var column = Number(coordinates[1]);

		var isAlive = coordinateHash[cell.id] == 'alive';
		var isDead = !isAlive;
		var numberOfLiveNeighbors = getNumberOfAdjacentAliveCells(row, column);
		if (isAlive && numberOfLiveNeighbors < 2) {
			// Any live cell with fewer than two live neighbors dies, as if caused by under population
			cell.className = 'cell';
		} else if (isAlive && numberOfLiveNeighbors <= 3) {
			// Any live cell with two or three live neighbors lives on to the next generation
			cell.className = 'cell alive';
			newCoordinateHash[cell.id] = 'alive'; //update the newCoordinateHash
		} else if (isAlive && numberOfLiveNeighbors > 3) {
			// Any live cell with more than three neighbors dies as if by overcrowding
			cell.className = 'cell';
		} else if (isDead && numberOfLiveNeighbors == 3) {
			// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction
			cell.className = 'cell alive';
			newCoordinateHash[cell.id] = 'alive'; //update the newCoordinateHash
		}
	});

	coordinateHash = newCoordinateHash;
};

var populateBoardWith = function(hash) {
	for (var key in hash) {
		var element = document.getElementById(key);
		element.className = 'cell alive';
	};
};

// action
createBoardAndPopulateCoordinateHash();
assignClickEvents();
populateBoardWith(coordinateHash);

var executionId;

document.getElementById('run').onclick = function() {
	executionId = setInterval(function() {
		// console.log('hello');
		runSimulation();
	}, 100);
};

document.getElementById('stop').onclick = function() {
	clearInterval(executionId);
};


