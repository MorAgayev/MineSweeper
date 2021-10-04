'use strict'

// create emogi const
const BOOM = '💣'
const FLAG = '🚩'

var gBoard;
// timer intervel
var gTimerInterval;
// game control : show : shownCount, merked, secsPadd
var gGame;
// count how ment cells on board;
var gCell = 0;

var gLevel;   


function init() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gLevel = {
        SIZE: 4,
        MINES: 2 
       }; 
       gBoard = createMat(gLevel.SIZE);
       renderBoard(gBoard);    
       locateMines(gLevel.MINES);
       setMinesNegsCount(gBoard);
}

function selectLevel(size) {
    restartGame();
    gBoard = createMat(size);
    renderBoard(gBoard);
    var mines; 
    if (gBoard.length === 4) var mines =  2;
    if (gBoard.length === 8) var mines = 12;
    if (gBoard.length === 12) var mines = 30;
    gLevel = {
        SIZE: size,
        MINES: mines 
       }; 
       locateMines(mines)   
}

function createCellObject() {
    var cellObject = {
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cellObject;
}

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

function renderBoard(gBoard) {
    var strHTML = '<table border= 1><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = `cell cell${i}-${j}`;
            strHTML += `<td onclick = "leftClicked(this, ${i}, ${j})" oncontextmenu= "rightClicked(this, ${i}, ${j})" class = "${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    // render board
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function locateMines(minesCount) { 
    for (var i = 0; i < minesCount; i++) { 
        var rowIdx = getRandomInt(0, gBoard.length - 1);
        var cellIdx = getRandomInt(0, gBoard.length - 1);
        
        gBoard[rowIdx][cellIdx].isMine = true;
    }
}

function setMinesNegsCount(board) {
    var mineCount;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // get the object {mine, is show...}
            var cell = board[i][j];
            mineCount = findMinesNegs(gBoard, i, j);
            cell.minesAroundCount = mineCount;
            console.log('mineCount', mineCount);
        }
    }
   
}

function findMinesNegs(mat, rowIdx, colIdx) {
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

function leftClicked(elCell, i, j) {
    // debugger
    //get the obj
    var cell = gBoard[i][j];
    if (cell.isMarked) return;

    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        // addMines(gLevel.MINES);
        // setMinesNegsCount(gBoard);
        setTimer();
        gGame.isOn = true;
    }
    // MODEL - up shownCount 
    if (!cell.isShown) {
        gGame.shownCount++;
    }
    //MODEL - cell is shown
    cell.isShown = true;

    // check if cell is mine - if true show curr BOOM + all Booms 
    if (cell.isMine) {
        var elCell = document.querySelector(`.cell${i}-${j}`)
        elCell.innerHTML = BOOM;
        showAllBooms();
    }


    if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
    } else {
        ////
        // showNegs(i, j);
        expandShown(elCell, i, j);
    }

    checkVictory();
}

function rightClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (cell.isShown) return;

    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        // addMines(gLevel.MINES);
        // setMinesNegsCount(gBoard);
        setTimer();
        gGame.isOn = true;
    }

    gGame.markedCount++;
    
    if (elCell.innerHTML === FLAG) {
        //un flag
        cell.isMarked = false;
        gGame.markedCount--;
        elCell.innerHTML = '';
    } else {
        //flag
        cell.isMarked = true;
        // gGame.markedCount++;
        elCell.innerHTML = FLAG;
    }

    checkVictory();
}

function expandShown(elCell, rowIdx, colIdx) {
    elCell.innerText = '';
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        // not outside mat
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // not outside mat
            if (j < 0 || j > gBoard[0].length - 1) continue;
            // not on selected pos
            if (i === rowIdx && j === colIdx) continue;

            //MODEL
            var cell = gBoard[i][j];
            if (!cell.isShown) {
                gGame.shownCount++;
            }
            cell.isShown = true;
            var elCurrCell = document.querySelector(`.cell${i}-${j}`);
            elCurrCell.innerHTML = cell.minesAroundCount;
        }
    }
}
//********************PART 2***************** *//

function setTimer() {
    var gStartTime = Date.now();
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        var seconds = (Date.now() - gStartTime) / 1000;
        elTimer.innerText = seconds.toFixed(3);
    }, 100);
}

function gameOver() {
    clearInterval(gTimerInterval);
    // setTimeout(init, 5000);
}

function restartGame() {
    clearInterval(gTimerInterval);
    init();
}

function checkVictory() {
    if (gGame.shownCount === gCell- gLevel.MINES && gGame.markedCount === gLevel.MINES) {
        console.log('victory');
        gameOver();
    }
    console.log('gGame.markedCount', gGame.markedCount);
    console.log('gGame.shownCount', gGame.shownCount);
    console.log('continue..');
}

function showAllBooms() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell${i}-${j}`)
                elCell.innerText = BOOM;
            }
        }
    }
    gameOver();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// cellMarked(elCell) 
// expandShown(gBoard, elCell, i, j)
    