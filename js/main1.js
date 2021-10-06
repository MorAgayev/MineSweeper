'use strict'

const BOOM = '💣';
const FLAG = '🚩';
const DEFAULT_SMILE = '😀';
const LOSE_EMOJI = '🤕';
const WIN_EMOJI = '🤩'
const LIVE = '💗'
const HINT = '💡'

var gBoard;
var gTimerInterval;
var gGame;
var gLevel;
var gIsHint = false;
gLevel = {
    SIZE: 4,
    MINES: 2
};

function init() {
    var elSmile = document.querySelector('.smile');
    elSmile.innerText = DEFAULT_SMILE;
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hint: 3,
        safeClick: 3,
        boom7: false
    }
    gBoard = createMat(gLevel.SIZE);
    renderBoard(gBoard);
    renderLives();
    // renderHint();
}

function createMat(num) {
    var mat = []
    for (var i = 0; i < num; i++) {
        var row = []
        for (var j = 0; j < num; j++) {
            var cell = createCellObject();
            row.push(cell);
        }
        mat.push(row)
    }
    return mat
}

function createCellObject() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function renderCell(cell, elCell) {
    if (cell.isMine) {
        elCell.innerText = BOOM;
    } else {
        elCell.innerText = cell.minesAroundCount;
    }
    elCell.classList.add('cell-color');
    cell.isShown = true;
    gGame.shownCount++;
}

function renderBoard(gBoard) {
    var strHTML = '<table border= 1><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = `cell${gBoard.length} cell${i}-${j}`;
            strHTML += `<td onMousedown = "cellClicked(event,this, ${i},${j})" class = "${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    var mineCount = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            mineCount = countMinesNegs(board, i, j);
            board[i][j].minesAroundCount = mineCount;
        }
    }
}

function countMinesNegs(mat, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (mat[i][j].isMine) count++;
        }
    }
    return count;
}

function cellClicked(ev, elCell, i, j) {
    var cell = gBoard[i][j];
    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        setTimer();
        if (!gGame.boom7) {
            locateMines(gBoard, cell, gLevel.MINES);
            setMinesNegsCount(gBoard);
        }
        gGame.isOn = true;
    }
    if (!gGame.isOn) return;

    if (ev.which === 1) {
        if (cell.isMarked) return;
        renderCell(cell, elCell);
        expandShown(gBoard, elCell, i, j);
        checkGameOver(1,elCell);
        if (gIsHint) {
            showNegs(i, j);

        }

    } else if (ev.which === 3) {
            cellMarked(elCell, cell);
            checkGameOver(3,elCell);
            ev.preventDefault();
    }
   
}

function locateMines(board, cell, num) {
    for (var i = 0; i < num; i++) {
        var rowIdx = getRandomInt(0, board.length - 1);
        var cellIdx = getRandomInt(0, board.length - 1);
        if (cell === board[rowIdx][cellIdx]) {
            i--
        } else {
            board[rowIdx][cellIdx].isMine = true;
        }
    }
}

function cellMarked(elCell, cell) {
    if (elCell.innerHTML === FLAG) {
        console.log('1');
        gGame.markedCount--;
        elCell.innerHTML = '';
        cell.isMarked = false;
    } else if (elCell.innerHTML !== FLAG) {
        console.log('2');
        gGame.markedCount++
        elCell.innerHTML = FLAG;
        cell.isMarked = true;
    }
   
}

function checkGameOver( num , elCell) {
    var shownCells = (gLevel.SIZE ** 2) - gLevel.MINES;
    var markedCells = gLevel.MINES;
    var elWinLose = document.querySelector(`.win-lose-text`);
    var elModal = document.querySelector('.win-lose-modal');
    if (elCell.innerHTML === BOOM && num === 1) {
        gGame.lives--;
        renderLives();
        if (gGame.lives > 0) return
        else {
            gGame.isOn = false;
            var elSmile = document.querySelector('.smile');
            elSmile.innerText = LOSE_EMOJI;
            elWinLose.innerText = 'NEXT TIME...'
            elModal.style.visibility = 'visible';
            clearInterval(gTimerInterval);
        }
    }
   
    
    if (gGame.shownCount > shownCells && gGame.markedCount === markedCells) {
        var elSmile = document.querySelector('.smile');
        elSmile.innerText = WIN_EMOJI;
        elWinLose.innerText = 'WINNER!!'
        elModal.style.visibility = 'visible';
        clearInterval(gTimerInterval);
    }

}

function expandShown(board, elCell, rowIdx, colIdx) {
    if (elCell.innerText === '0') {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i > board.length - 1) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j > board[0].length - 1) continue;
                if (i === rowIdx && j === colIdx) {
                    elCell.innerText = '';
                    board[rowIdx][colIdx].isShown = true;
                }

                if (!board[i][j].isShown) {
                    var elNeg = document.querySelector(`.cell${i}-${j}`);
                    renderCell(board[i][j], elNeg);
                    if (board[i][j].minesAroundCount === 0) {
                        elNeg.innerText = ''
                    }
                }
            }
        }
    }
}

function selectLevel(size) {
    gLevel.SIZE = size;
    if (size === 4) gLevel.MINES = 2;
    if (size === 8) gLevel.MINES = 12;
    if (size === 12) gLevel.MINES = 30;
    resetGame();
}

function resetGame() {
    clearInterval(gTimerInterval);
    var elTimer = document.querySelector(`.timer`);
    elTimer.innerText = '00:00';
    var elModal = document.querySelector('.win-lose-modal');
    elModal.style.visibility = 'hidden';

    init();
}

function renderLives() {
    var elLives = document.querySelector('.lives');
    elLives.innerText = '';
    for (var i = 0; i < gGame.lives; i++) {
        elLives.innerText += LIVE
    }
}

function findSafeCells() {
    var safeCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isMine && !cell.isShown) {
                safeCells.push({ i: i, j: j });
            }
        }
    }
    shuffle(safeCells)
    return safeCells;
}

function safeClick() {
    if (gGame.safeClick === 0) return;
    gGame.safeClick--;
    var cells = findSafeCells()
    var safeCell = cells.pop();
    var elCell = document.querySelector(`.cell${safeCell.i}-${safeCell.j}`);
    var elCellCount = document.querySelector('.safe-remainder');
    elCellCount. innerHTML = `${gGame.safeClick} clicks available`
    elCell.classList.add('safe-cell');
    setTimeout(function () {
        elCell.classList.remove('safe-cell');
    }, 3000)
}

function addMinesMult7() {
    resetGame();
    gGame.boom7 = true;
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (count % 7 === 0) {
                gBoard[i][j].isMine = true;
            }
            count++;
        }
    }
}

    /// not done 
    function renderHint() {
        var strHTML = ''
        for (var i = 0; i < gGame.hint; i++) {
            strHTML += `<span onclick = "hint(this)" class="hint hint-shadow">💡</span>`
        }
        var elHintBox = document.querySelector('.hint-box');
        elHintBox.innerHTML = strHTML;
    }

    function hint(elHint) {
        gGame.hint--;
        gIsHint = true;
        setTimeout(function () {
            elHint.innerText = '❌'
            gIsHint = false;
        }, 3000)
    }

    function showNegs(rowIdx, colIdx) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j > gBoard[0].length - 1) continue;
                if (i === rowIdx && j === colIdx) continue;

                var elNeg = document.querySelector(`.cell${i}-${j}`);
                elNeg.innerText = gBoard[i][j].minesAroundCount;
            }
        }
    }








