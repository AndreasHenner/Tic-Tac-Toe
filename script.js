let fields = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontale Reihen
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikale Reihen
  [0, 4, 8], [2, 4, 6] // diagonale Reihen
];


let currentPlayer = 'circle';

function init(){
  render();
}

function render() {
  let content = document.getElementById('content');

  let tableHTML = '<table>';

  for (let i = 0; i < 3; i++) {
    tableHTML += '<tr>';

    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = '';

      if (fields[index] === 'circle') {
        symbol = generateCircleSVG(index);
      } else if (fields[index] === 'cross') {
        symbol = generateCrossSVG(index);
      }

      tableHTML += `<td onclick="addSymbol(${index})" class="fixed-size-td">${symbol}</td>`;
    }

    tableHTML += '</tr>';
  }

  tableHTML += '</table>';
  content.innerHTML = tableHTML;
}

function addSymbol(index) {
  if (fields[index] !== null) {
    return; // Das Feld ist bereits belegt
  }

  const symbol = currentPlayer === 'circle' ? generateCircleSVG(index) : generateCrossSVG(index);

  const tdElement = document.getElementsByTagName('td')[index];
  tdElement.innerHTML = symbol;
  tdElement.onclick = null;

  fields[index] = currentPlayer; // Aktualisiere das Array fields

  checkGameOver();

  currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle'; // Wechsle den Spieler
}

function checkGameOver() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      // Spiel vorbei, Gewinner gefunden
      drawWinningLine(combination);
      return;
    }
  }
}


function getCoordinates(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const cellSize = 100; // Größe des Feldes in Pixeln
  const offsetX = 50; // X-Offset der Tabelle
  const offsetY = 50; // Y-Offset der Tabelle

  const x = col * cellSize + offsetX;
  const y = row * cellSize + offsetY;

  return [x, y];
}


function drawWinningLine(winningCombination) {
  const table = document.querySelector('table');
  const tableRect = table.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const [startCell, , endCell] = winningCombination;
  const [x1, y1] = getCoordinates(startCell);
  const [x2, y2] = getCoordinates(endCell);
  const borderWidth = 5;

  const width = Math.abs(x2 - x1) + borderWidth;
  const height = Math.abs(y2 - y1) + borderWidth;

  canvas.width = width;
  canvas.height = height;

  table.appendChild(canvas);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1 - Math.min(x1, x2) + borderWidth / 2, y1 - Math.min(y1, y2) + borderWidth / 2);
  ctx.lineTo(x2 - Math.min(x1, x2) + borderWidth / 2, y2 - Math.min(y1, y2) + borderWidth / 2);
  ctx.stroke();

  showDrawwinningLine(winningCombination, canvas);
}


function showDrawwinningLine(winningCombination, canvas){
 
  canvas.style.position = 'absolute';

  if (winningCombination.includes(0) && winningCombination.includes(1) && winningCombination.includes(2)) {
    canvas.style.left = '20px';
    canvas.style.top = '35px';
  } else if (winningCombination.includes(3) && winningCombination.includes(4) && winningCombination.includes(5)) {
    canvas.style.left = '20px';
    canvas.style.top = '117px';
  }
  else if (winningCombination.includes(6) && winningCombination.includes(7) && winningCombination.includes(8)) {
    canvas.style.left = '20px';
    canvas.style.top = '198px';
  }
  else if (winningCombination.includes(0) && winningCombination.includes(3) && winningCombination.includes(6)) {
    canvas.style.left = '35px';
    canvas.style.top = '20px';
  }
  else if (winningCombination.includes(1) && winningCombination.includes(4) && winningCombination.includes(7)) {
    canvas.style.left = '117px';
    canvas.style.top = '20px';
  }
  else if (winningCombination.includes(2) && winningCombination.includes(5) && winningCombination.includes(8)) {
    canvas.style.left = '198px';
    canvas.style.top = '20px';
  }
  else if (winningCombination.includes(0) && winningCombination.includes(4) && winningCombination.includes(8)) {
    canvas.style.left = '20px';
    canvas.style.top = '20px';
  }
  else if (winningCombination.includes(2) && winningCombination.includes(4) && winningCombination.includes(6)) {
    canvas.style.left = '17px';
    canvas.style.top = '16px';
  }

  canvas.style.pointerEvents = 'none';
}



function generateCircleSVG(index) {
  const fillColor = '#02AAE7';
  const width = 70;
  const height = 70;
  const animationDuration = '250ms';
  const circleRadius = width / 2 - 8; // Kleinerer Kreisdurchmesser

  const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${circleRadius}" fill="${fillColor}">
        <animate attributeName="r" values="0; ${circleRadius}" dur="${animationDuration}"/>
        <animate attributeName="opacity" values="0;1" dur="1ms" />
      </circle>
    </svg>
  `;

  return svgCode;
}

function generateCrossSVG(index) {
  const fillColor = '#FFC000';
  const width = 70;
  const height = 70;
  const lineWidth = 5;
  const tableLineOffset = 12; // Abstand zu den Tabellenlinien
  const animationDuration = '200ms';

  const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <line x1="${tableLineOffset}" y1="${tableLineOffset}" x2="${width - tableLineOffset}" y2="${height - tableLineOffset}" stroke="${fillColor}" stroke-width="${lineWidth}">
        <animate attributeName="stroke-dasharray" values="0, ${Math.sqrt((width - 2*tableLineOffset)**2 + (height - 2*tableLineOffset)**2)}; ${Math.sqrt((width - 2*tableLineOffset)**2 + (height - 2*tableLineOffset)**2)}, ${Math.sqrt((width - 2*tableLineOffset)**2 + (height - 2*tableLineOffset)**2)}" dur="${animationDuration}" begin="0s" fill="freeze" />
      </line>
      <line x1="${width - tableLineOffset}" y1="${tableLineOffset}" x2="${tableLineOffset}" y2="${height - tableLineOffset}" stroke="${fillColor}" stroke-width="${lineWidth}">
        <animate attributeName="stroke-dasharray" values="0, ${Math.sqrt((width - 2*tableLineOffset)**2 + (height - 2*tableLineOffset)**2)}; ${Math.sqrt((width - 2*tableLineOffset)**2 + (height - 2*tableLineOffset)**2)}, ${Math.sqrt((width - 2*tableLineOffset)**2 + (height - 2*tableLineOffset)**2)}" dur="${animationDuration}" begin="0s" fill="freeze" />
      </line>
    </svg>
  `;

  return svgCode;
}

