'use strict'

const BOOM = '💣'
const FLAG = '🚩'

var gBoard;
var gTimerInterval;
var gGame;
var gLevel;
var gCell = 0;

gLevel = {
    SIZE: 4,
    MINES: 2
};

gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

gBoard = buildBoard();
renderBoard(gBoard);
console.table(gBoard)


function buildBoard() {
    // Builds the board 
    var board = createMat(4)
    // Set mines at random locations
    locateMines(board, 2)
    // Call setMinesNegsCount()
    setMinesNegsCount(board)
    // Return the created board
    return board
}

// Step1 – the seed app:
// 1. Create a 4x4 gBoard Matrix containing Objects.
function createMat(num) {
    var mat = []
    gCell = 0;
    for (var i = 0; i < num; i++) {
        var row = []
        for (var j = 0; j < num; j++) {
            var cell = createCellObject();
            row.push(cell);
            //add 1 cell for count cells
            gCell++;
        }
        mat.push(row)
    }
    return mat
}

//manually when each cell’s isShown set to true. 
function createCellObject() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

// 2. Present the mines using renderBoard() function.
function renderBoard(gBoard) {
    var strHTML = '<table border= 1><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = `cell cell${i}-${j}`;
            strHTML += `<td onMousedown = "cellClicked(event,this, ${i},${j})" class = "${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


// Step2 – counting neighbors:
// 1. Create setMinesNegsCount() and store the numbers 
// (isShown is still true)
// Count mines around each cell 
// and set the cell's minesAroundCount.

function setMinesNegsCount(board) {
    var mineCount = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // get the object {mine, is show...}
            mineCount = findMinesNegs(board, i, j);
            board[i][j].minesAroundCount = mineCount;
            // shownCell(board[i][j], i, j);
        }
    }
}

function findMinesNegs(mat, rowIdx, colIdx) { // done
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        // not outside mat
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // not outside mat
            if (j < 0 || j > mat[0].length - 1) continue;
            // not on selected pos
            if (i === rowIdx && j === colIdx) continue;

            if (mat[i][j].isMine) count++;
        }
    }
    return count;
}

// 2. Present the board with the neighbor count and the mines 
// using renderBoard() function.

function shownCell(board, cell, i, j) {
    if (cell.isShown) {
        var elCell = document.querySelector(`.cell${i}-${j}`);
        if (board[i][j].isMine) {
            elCell.innerText = BOOM;
        } else elCell.innerText = cell.minesAroundCount;
    }

    if (board[i][j].isMine) {
        var elCell = document.querySelector(`.cell${i}-${j}`)
        elCell.innerText = BOOM;
    }
}


// Step3 – click to reveal:
// 3. Implement that clicking a cell with “number” reveals the 
// number of this cell
function cellClicked(ev, elCell, i, j) {
    //MODEL obj 
    var cell = gBoard[i][j];
    cell.isShown = true;

    
    // Show a timer that starts on first click (right / left) and stops 
    // when game is over.
    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        setTimer()
    }

    //left
    if (ev.which === 1) {
        //(cannot reveal a flagged cell)
        if(cell.isMarked) return;
        gGame.shownCount++
        // Left click reveals the cell’s content
        cell.isShown = true;
        elCell.innerText = (cell.isMine) ? BOOM : cell.minesAroundCount;


    } else if (ev.which === 3) { // right
        // ev.stopPropagation();
        gGame.markedCount++
        //Right click flags/unflags a suspected cell 
        cellMarked(elCell,cell);

    }
}

// Step4 – randomize mines' location:
// 1. Randomly locate the 2 mines on the board
// 2. Present the mines using renderBoard() function.

function locateMines(board, num) {
    for (var i = 0; i < num; i++) {
        var rowIdx = getRandomInt(0, board.length - 1);
        var cellIdx = getRandomInt(0, board.length - 1);
        board[rowIdx][cellIdx].isMine = true;
    }
}


function cellMarked(elCell, cell) {
    // Called on right click to mark a cell (suspected to be a mine)
    if (elCell.innerHTML === FLAG) {
        cell.isMarked = false;
        gGame.markedCount--;
        elCell.innerHTML = '';
    } else {
        cell.isMarked = true;
        elCell.innerHTML = FLAG;
    }
    // Search the web (and implement) how to hide the context menu on right click

}


// gGame = {
//     isOn: false,
//     shownCount: 0,
//     markedCount: 0,
//     secsPassed: 0
// }

// gLevel = {
//     SIZE: 4,
//     MINES: 2
// };

function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells are shown
    // Game ends when:


    // LOSE: when clicking a mine, all mines should be revealed


    // WIN: all the mines are flagged, and all the other cells are 
    // shown


    gTimerInterval;
}



function expandShown(board, elCell, i, j) {
    // When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors. 
    // NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors

    // BONUS: if you have the time later, try to work more like the real algorithm (see description at the Bonuses section below)

}





//////////utils

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setTimer() {
    var gStartTime = Date.now();
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        var seconds = (Date.now() - gStartTime) / 1000;
        elTimer.innerText = seconds.toFixed(3);
    }, 100);
}








