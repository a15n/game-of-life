"use strict";

var coordinateHash = {};

var createBoard = function() {
	var tableHtml = '<table>';
	for (var x = 0; x < 50; x++) {
		tableHtml += '<tr>';
		for (var y = 0; y < 50; y++) {
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
		this.classList.toggle('alive');
	};
	Array.from(cells).forEach(function(cell) {
		cell.onclick = clickFunction;
	});
};

var getNumberOfAdjacentAliveCells = function() {
	return Math.floor(Math.random() * 9);
}

var runSimulation = function() {
	var cells = document.getElementsByClassName('cell');
	Array.from(cells).forEach(function(cell) {
		let [x, y] = cell.id.split('-');
		var num = getNumberOfAdjacentAliveCells();
		if (num < 2) {
			cell.className = 'cell';
		} else if (num < 4) {
			cell.className = 'cell alive';
		} else {
			cell.className = 'cell';
		}
	});
}

createBoard();
assignClickEvents();


document.getElementById('run').onclick = runSimulation;
