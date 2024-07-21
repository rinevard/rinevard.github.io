const boardSize = 18;
const expansionDelay = 500; // 0.5 seconds delay
let board = [];
let currentPlayer = 0;
const players = ['AI', '玩家'];
const playerColors = ['red', 'blue'];
let aiNextMove = -1;
let humanMoved = false;
let lastState = null;
let expansionTimeout = null;
let gameEnded = false;

function initBoard() {
  const boardElement = document.getElementById('board');
  board = Array(boardSize * boardSize).fill('');
  boardElement.innerHTML = board.map(() => '<div class="cell"></div>').join('');
  document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.onclick = () => humanMove(index);
  });
  document.getElementById('endTurnBtn').onclick = endHumanTurn;
  document.getElementById('undoBtn').onclick = undoMove;
  document.getElementById('restartBtn').onclick = restartGame;
  document.getElementById('toggleInstructions').onclick = toggleInstructions;
  generateAiPreview();
  updateBoard();
  updateStatus();
  setTimeout(aiMove, expansionDelay);
}

function humanMove(index) {
  if (!gameEnded && currentPlayer === 1 && !board[index] && !humanMoved) {
    lastState = {
      board: [...board],
      aiNextMove: aiNextMove
    };
    placePiece(index);
    updateBoard();
    humanMoved = true;
    updateStatus();
    expansionTimeout = setTimeout(expandPieces, expansionDelay);
  }
}

function endHumanTurn() {
  if (!gameEnded && currentPlayer === 1 && humanMoved) {
    currentPlayer = 0;
    humanMoved = false;
    lastState = null;
    updateStatus();
    setTimeout(aiMove, expansionDelay);
  }
}

function undoMove() {
  if (!gameEnded && currentPlayer === 1 && humanMoved && lastState) {
    clearTimeout(expansionTimeout);
    board = lastState.board;
    aiNextMove = lastState.aiNextMove;
    humanMoved = false;
    updateBoard();
    updateStatus();
  }
}

function aiMove() {
  if (!gameEnded && currentPlayer === 0) {
    if (aiNextMove !== -1 && !board[aiNextMove]) {
      placePiece(aiNextMove);
      updateBoard();
      setTimeout(() => {
        expandPieces();
        generateAiPreview();
        currentPlayer = 1;
        updateBoard();
        updateStatus();
      }, expansionDelay);
    } else {
      generateAiPreview();
      aiMove();
    }
  }
}

function placePiece(index) {
  if (index >= 0 && index < boardSize * boardSize) {
    board[index] = playerColors[currentPlayer];
  }
}

function expandPieces() {
  const newBoard = [...board];
  board.forEach((color, idx) => {
    if (color && color !== 'neutral') {
      const neighbors = getNeighbors(idx);
      if (neighbors.length) {
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (!board[randomNeighbor]) {
          newBoard[randomNeighbor] = color;
        } else if (board[randomNeighbor] !== color && board[randomNeighbor] !== 'neutral') {
          newBoard[randomNeighbor] = 'neutral';
        }
      }
    }
  });
  board = newBoard;
  updateBoard();
  checkGameEnd();
}

function generateAiPreview() {
  const emptyCells = board.reduce((acc, cell, index) => {
    if (!cell) acc.push(index);
    return acc;
  }, []);
  
  aiNextMove = emptyCells.length > 0 ? 
    emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
}

function getNeighbors(index) {
  const neighbors = [];
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);
  if (x > 0) neighbors.push(index - 1);
  if (x < boardSize - 1) neighbors.push(index + 1);
  if (y > 0) neighbors.push(index - boardSize);
  if (y < boardSize - 1) neighbors.push(index + boardSize);
  return neighbors;
}

function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, idx) => {
    cell.className = 'cell';
    if (board[idx]) {
      cell.classList.add(board[idx]);
    } else if (idx === aiNextMove && currentPlayer === 1) {
      cell.classList.add('ai-preview');
    }
  });
}

function updateStatus() {
  const counts = board.reduce((acc, cell) => {
    acc[cell] = (acc[cell] || 0) + 1;
    return acc;
  }, {});

  let status = `当前操作者: ${players[currentPlayer]}<br>`;
  players.forEach((player, i) => {
    status += `${player}细胞数量: ${counts[playerColors[i]] || 0}<br>`;
  });
  document.getElementById('gameStatus').innerHTML = status;

  const endTurnBtn = document.getElementById('endTurnBtn');
  const undoBtn = document.getElementById('undoBtn');
  endTurnBtn.disabled = gameEnded || !(currentPlayer === 1 && humanMoved);
  undoBtn.disabled = gameEnded || !(currentPlayer === 1 && humanMoved && lastState);
}

function checkGameEnd() {
  if (!board.includes('')) {
    gameEnded = true;
    const counts = board.reduce((acc, cell) => {
      acc[cell] = (acc[cell] || 0) + 1;
      return acc;
    }, {});
    const aiCount = counts['red'] || 0;
    const humanCount = counts['blue'] || 0;
    const winner = aiCount > humanCount ? 'AI' : '玩家';
    document.getElementById('gameResult').textContent = `${winner}胜利！`;
    updateStatus();
  }
}

function restartGame() {
  gameEnded = false;
  currentPlayer = 0;
  humanMoved = false;
  lastState = null;
  document.getElementById('gameResult').textContent = '';
  initBoard();
}

function toggleInstructions() {
  const instructions = document.getElementById('instructions');
  const toggleBtn = document.getElementById('toggleInstructions');
  if (instructions.classList.contains('hidden')) {
    instructions.classList.remove('hidden');
    toggleBtn.textContent = '隐藏游戏说明';
  } else {
    instructions.classList.add('hidden');
    toggleBtn.textContent = '显示游戏说明';
  }
}

document.addEventListener('keydown', function(event) {
  const endTurnBtn = document.getElementById('endTurnBtn');
  const undoBtn = document.getElementById('undoBtn');
  if (event.code === 'Space' && !endTurnBtn.disabled) {
    event.preventDefault();
    endTurnBtn.click();
  } else if (event.code === 'KeyZ' && !undoBtn.disabled) {
    event.preventDefault();
    undoBtn.click();
  }
});

initBoard();

// 在HTML中添加游戏说明
document.getElementById('instructions').innerHTML = `
  <h3>欢迎来到"细胞战争"！</h3>
  <p>准备好与AI展开一场惊心动魄的领地争夺战了吗？</p>
  <h4>操作指南：</h4>
  
  <ul>
    <li>左键点击空格子来放置你的细胞。</li>
    <li>用"结束回合"按钮或按空格键结束你的回合。</li>
    <li>犯错了？别担心！用"撤销"按钮或按Z键来悔棋。</li>
    <li>游戏结束时，点击"重新开始"来开始新的挑战！</li>
  </ul>

  <h4>游戏规则：</h4>
  <ul>
    <li>你是蓝色细胞，AI是红色细胞。</li>
    <li>AI的下一步会有半透明的预览，利用这个信息来制定你的策略！</li>
    <li>每回合结束时，所有细胞都会向周围随机扩散！</li>
    <li>如果扩散到空格子，就占领该格子。</li>
    <li>如果扩散到对方的格子，双方细胞会同归于尽，变成中立的灰色格子。</li>
  </ul>

  <p>胜利条件：当棋盘被填满时，拥有最多格子的一方获胜！</p>    
`;