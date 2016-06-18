"use strict";

function GameOfLife(width, height, customCoordinateHash) {
	this.width = width;
	this.height = height;
	this.customCoordinateHash = customCoordinateHash || null;
	this.numberOfGenerations = 0;

	var tableHtml = '<table>';
	for (var row = 0; row < this.height; row++) {
		tableHtml += '<tr>';
		for (var col = 0; col < this.width; col++) {
			tableHtml += '<td id="' + row + '-' + col + '" class="cell"></td>';
		}
		tableHtml += '</tr>';
	}
	tableHtml += '</table>';
	this.blankBoard = tableHtml;

	this.randomCoordinateHash = function() {
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
	this.coordinateHash = this.customCoordinateHash || this.randomCoordinateHash();

	this.showBoardAndAssignClickFunctions = function() {
		document.getElementById('board').innerHTML = this.blankBoard;
		var cells = document.getElementsByClassName('cell');
		var _this = this;
		var clickFunction = function() {
			// in this context, 'this' is bound to the HTML element
			_this.coordinateHash[this.id] = 'alive';
			this.classList.toggle('alive');
		};
		Array.from(cells).forEach(function(cell) {
			cell.onclick = clickFunction;
		});
	};
	this.getNumberOfAdjacentAliveCells = function(row, column) {
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
		var _this = this;
		directions.forEach(function(direction) {
			var cellCoordinate = (row + direction.row) + '-' + (column + direction.column);
			if (_this.coordinateHash[cellCoordinate] == 'alive') {
				num++;
			}
		});
		return num;
	};
	this.runSimulation = function() {
		var cells = document.getElementsByClassName('cell');
		var newCoordinateHash = {};
		var _this = this;
		Array.from(cells).forEach(function(cell) {
			var coordinates = cell.id.split('-'); // ex: [15, 34]
			var row = Number(coordinates[0]);
			var column = Number(coordinates[1]);

			var isAlive = _this.coordinateHash[cell.id] == 'alive';
			var isDead = !isAlive;
			var numberOfLiveNeighbors = _this.getNumberOfAdjacentAliveCells(row, column);
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

		this.coordinateHash = newCoordinateHash;

		this.updateNumberOfGenerations()
	};
	this.updateNumberOfGenerations = function() {
		this.numberOfGenerations++;
		var generationsElement = document.getElementById('generations');
		generationsElement.innerHTML = this.numberOfGenerations;
	};
	this.resetCoordinateHash = function() {
		this.coordinateHash = {};
	};
	this.removeAllAliveClasses = function() {
		// if I use jquery replace with $(".alive").removeClass("alive")
		var cells = document.getElementsByClassName('cell');
		Array.from(cells).forEach(function(cell) {
			cell.className = '';
		});
	};
}


/* ----------------- */

var gol = new GameOfLife(50, 50);
gol.showBoardAndAssignClickFunctions();

var executionId;
document.getElementById('run').onclick = function() {
	executionId = setInterval(function() {
		gol.runSimulation();
	}, 100);
};

document.getElementById('pause').onclick = function() {
	clearInterval(executionId);
};

document.getElementById('reset').onclick = function() {
	clearInterval(executionId);
	gol.resetCoordinateHash();
	gol.removeAllAliveClasses();
	gol.numberOfGenerations = 0;

	gol = new GameOfLife(50, 50);
	gol.showBoardAndAssignClickFunctions();
	console.log('reset');
};
