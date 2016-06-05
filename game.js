"use strict";

window.coordinateHash = {
/*
  '0-0': 'alive',
  '0-1': '',
  '0-2': 'alive',
*/
};

var createBoardAndPopulateCoordinateHash = function() {
	var tableHtml = '<table>';
	for (var x = 0; x < 50; x++) {
		tableHtml += '<tr>';
		for (var y = 0; y < 50; y++) {
			let coordinate = x + '-' + y;
			coordinateHash[coordinate] = '';
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

var getNumberOfAdjacentAliveCells = function(row, column) {
	/*


	*/
	var num = 0;

	/*
	// top
	var topCellCoordinate = (x - 1) + '-' + (y);
	var topCell = coordinateHash[topCellCoordinate];
	if (topCell == 'alive') {
		debugger;
	}
	*/

	// right
	var rightCellCoordinate = (row) + '-' + (column + 1);
	var rightCellState = coordinateHash[rightCellCoordinate];
	debugger;

	// bottom


	/*
	// left
	var leftCellCoordinate = (x - 1) + '-' + (y);
	var leftCell = coordinateHash[leftCellCoordinate];
	debugger;
	if (leftCell == 'alive') {
		debugger;
	}
	*/


	return num;
}

var runSimulation = function() {
	var cells = document.getElementsByClassName('cell');
	Array.from(cells).forEach(function(cell) {
		let [x, y] = cell.id.split('-'); // 0, 0 -> 0, 1 -> 0, 2
		var num = getNumberOfAdjacentAliveCells(Number(x), Number(y)); // num = 0 - 8
		// if (num < 2) {
		// 	cell.className = 'cell';
		// } else if (num < 4) {
		// 	cell.className = 'cell alive';
		// } else {
		// 	cell.className = 'cell';
		// }
	});
}

// action
createBoardAndPopulateCoordinateHash();
assignClickEvents();
document.getElementById('run').onclick = runSimulation;
