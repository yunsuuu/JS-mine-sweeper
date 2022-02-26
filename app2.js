// 이차원배열로 table 만들 때 데이터 표현이 핵심!
// 데이터 표현 -> 데이터를 바탕으로 화면 그리기
// table 각 cell에 올바른 데이터가 들어가야함(단순히 화면에 table을 그리는 것 아님)
const $form = document.querySelector("#form");
const $timer = document.querySelector("#timer");
const $tbody = document.querySelector("table tbody");
let row;
let cell;
let mine;
// 이차원 배열 안에 들어갈 값들을 객체로 만들어줌
const CODE = {
  NORMAL: -1, // 닫힌칸(지뢰x)
  QUESTION: -2, // 물음표칸(지뢰x)
  FLAG: -3, // 깃발칸(지뢰x)
  QUESTION_MINE: -4, // 물음표칸(지뢰o)
  FLAG_MINE: -5, // 깃발칸(지뢰o)
  MINE: -6, // 닫힌칸(지뢰o)
  OPENED: 0, // 0 이상이면 열린 칸 (0-8까지 숫자를 표시, 클릭한 cell을 둘러싸고 있는 8개 칸)
}

let data;
let openCount;
let startTime;

// input value 받아서 table 그리기
function onSubmit(e) {
  e.preventDefault();
  // e.target = form
  // e.target.row = form에서 id가 row인 태그
  row = parseInt(e.target.row.value);
  cell = parseInt(e.target.cell.value);
  mine = parseInt(e.target.mine.value);
  openCount = 0;
  $tbody.innerHTML = ""; // submit 할 때마다 table 초기화
  printTable();
  startTime = new Date();
  interval = setInterval(() => {
    const time = Math.floor((new Date() - startTime) / 1000);
    $timer.innerText = `${time}초`;
    // new Date() - new Date() / 1000 = 0
  }, 1000);
}
$form.addEventListener("submit", onSubmit);

// 지뢰 클릭시 남은 지뢰 표시
function showMines() {
  const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
  data.forEach((row, rI) => {
    row.forEach((cell, cI) => {
      if(mines.includes(cell)){
        $tbody.children[rI].children[cI].innerText = "X";
      }
    })
  })
}

// // 주변 지뢰 갯수 세기
function countMine(rowIndex, cellIndex) {
  const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
  let i = 0; // 값이 증가할 때 변수 지정법
  mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++;
  mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++;
  mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
  mines.includes(data[rowIndex][cellIndex - 1]) && i++;
  mines.includes(data[rowIndex][cellIndex + 1]) && i++;
  mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
  mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
  mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;
  return i;
}

function open(rowIndex, cellIndex) {
  if(data[rowIndex]?.[cellIndex] >= CODE.OPENED) return;
  // 무한으로 칸 열리는 거 방지하기 위해 한번 열린 칸을 확인하여 return 으로 함수종료
  const target = $tbody.children[rowIndex]?.children[cellIndex];
  if(!target){
    return;
  }
  const count = countMine(rowIndex, cellIndex);
  data[rowIndex][cellIndex] = count; // 지뢰갯수를 세서 칸에 표시
  target.className = "opened";
  target.innerText = count ?? ""
  openCount++;
  if(openCount === (row * cell) - mine){
    $tbody.removeEventListener("contextmenu", onRightClick);
    $tbody.removeEventListener("click", onLeftClick);
    setTimeout(() => {
      alert("승리!");
    }, 500);
    clearInterval(interval); // 타이머 인터벌 삭제
  }
  return count;
}

// normal칸을 클릭했을 때 주변 지뢰 갯수 펼쳐셔 보여주기
function openAround(rI, cI) {
  setTimeout(() => {
    const count = open(rI, cI);
    if(count === 0){
      openAround(rI - 1, cI - 1);
      openAround(rI - 1, cI);
      openAround(rI - 1, cI + 1);
      openAround(rI, cI - 1);
      openAround(rI, cI + 1);
      openAround(rI + 1, cI - 1);
      openAround(rI + 1, cI);
      openAround(rI + 1, cI + 1);
    }
  }, 0);
}

let normalCellFound = false // 닫힌칸(빈칸)찾기
let searched; // 이미 찾은 칸
let firstClick;

// 첫클릭이 지뢰가 되지 않게, 주변 닫힌칸(빈칸)으로 지뢰 옮겨주기
function transferMine(rI, cI) {
  if(normalCellFound) return; 
  // 닫힌칸(빈칸)을 찾았으면 함수종료(불필요한 반복을 방지하기 위해)
  if(rI < 0 || rI >= row || cI < 0 || cI >= cell) return;
  // 위의 경우 4개는 undefined를 반환 -> 발생하면 함수종료(에러방지)
  if(searched[rI][cI]) return;
  if(data[rI][cI] === CODE.NORMAL){
    normalCellFound = true;
    data[rI][cI] = CODE.MINE; // 빈칸이면 지뢰심기
  } else { // 주변 닫힌 칸을 탐색
    searched[rI][cI] = true; // 함수종료
    transferMine(rI - 1, cI - 1);
    transferMine(rI - 1, cI);
    transferMine(rI - 1, cI + 1);
    transferMine(rI, cI - 1);
    transferMine(rI, cI + 1);
    transferMine(rI + 1, cI - 1);
    transferMine(rI + 1, cI);
    transferMine(rI + 1, cI + 1);
  }
}

function onLeftClick(e) {
  const target = e.target; // <td>
  const rowIndex = target.parentElement.rowIndex;
  const cellIndex = target.cellIndex;
  let cellData = data[rowIndex][cellIndex];
  if(firstClick){ // firstClick = true이면
    firstClick = false; // firstClick 상태에서 클릭이 일어나면 더 이상 firstClick = true가 아님
    searched = Array(row).fill().map(() => []);
    // row 수만큼 빈 배열을 추가로 만듦
    // row = 10 , 아래와 같이 [ ]가 10개가 만들어짐
    // [ ]
    // [ ]
    // [ ]
    if(cellData === CODE.MINE){ // 첫클릭이 지뢰이면
      transferMine(rowIndex, cellIndex);
      data[rowIndex][cellIndex] = CODE.NORMAL;
      cellData = CODE.NORMAL;
    }
  }
  if(cellData === CODE.NORMAL){
    openAround(rowIndex, cellIndex);
  } else if(cellData === CODE.MINE){
    showMines();
    target.className = "opened";
    target.innerText = "펑!";
    setTimeout(() => {
      alert("펑! 지뢰가 터졌습니다!");
    }, 500);
    $tbody.removeEventListener("contextmenu", onRightClick);
    $tbody.removeEventListener("click", onLeftClick);
  }
}

function onRightClick(e) {
  e.preventDefault();
  const target = e.target; // <td>
  const rowIndex = target.parentElement.rowIndex;
  const cellIndex = target.cellIndex;
  const cellData = data[rowIndex][cellIndex];
  if(cellData === CODE.MINE){
    data[rowIndex][cellIndex] = CODE.QUESTION_MINE;
    target.className = "question";
    target.innerText = "?";
  } else if(cellData === CODE.QUESTION_MINE){
    data[rowIndex][cellIndex] = CODE.FLAG_MINE;
    target.className = "flag";
    target.innerText = "!";
  } else if(cellData === CODE.FLAG_MINE){
    data[rowIndex][cellIndex] = CODE.MINE;
    target.className = "";
    target.innerText = "X";
  } else if(cellData === CODE.NORMAL){
    data[rowIndex][cellIndex] = CODE.QUESTION;
    target.className = "question";
    target.innerText = "?";
  } else if(cellData === CODE.QUESTION){
    data[rowIndex][cellIndex] = CODE.FLAG;
    target.className = "flag";
    target.innerText = "!";
  } else if(cellData === CODE.FLAG){
    data[rowIndex][cellIndex] = CODE.NORMAL;
    target.className = "";
    target.innerText = "";
  }
}

// 데이터를 활용하여 랜덤하게 지뢰 심기
function plantMine() {
  const candidate = Array(row * cell).fill().map((arr, i) => {
    return i; // 0-24까지
  });
  const shuffle = [];
  // while문 사용하는 경우 - 특정 조건에 만족할 때까지 반복
  while(candidate.length > (row * cell) - mine){
     // candidate.length = 21, 22, 23, 24, 25 => 5번 반복
     const randomNum = Math.floor(Math.random() * candidate.length);
     const chosenNum = candidate.splice(randomNum, 1)[0];
     shuffle.push(chosenNum);
  }

  // [ -1 -1 -1 -1 -1 ] // -1 = NORMAL(지뢰X)
  // [ -1 -1 -1 -1 -1 ]
  // [ -1 -1 -1 -1 -1 ]
  // [ -1 -1 -1 -1 -1 ]
  // [ -1 -1 -1 -1 -1 ]

  // 이차원 배열(배열 안에 배열)
  const data = []; // 큰 배열
  for(let i = 0; i < row; i++){
    const rowData = [];
    data.push(rowData);
    for(let j = 0; j < cell; j++){
      rowData.push(CODE.NORMAL); // -1
    }
  }

  // shuffle = [20, 8, 16, 10, 23];
  // 랜덤하게 지뢰 심기(MINE = -6)
  for(let k = 0; k < shuffle.length; k++){ // shuffle.length = 5
    // shuffle[0] = 20은 몇번째 줄, 몇번째 칸에 있나
    const horizontal = Math.floor(shuffle[k] / cell); // 행(가로, 줄) - 몫
    const vertical = shuffle[k] % cell; // 열(세로, 칸) - 나머지
    data[horizontal][vertical] = CODE.MINE;
  }
  return data;
}

// 테이블 만들기(input value를 바탕으로
function printTable() {
  data = plantMine(); 
  data.forEach((row) => {
    const $tr = document.createElement("tr");
    row.forEach((cell) => {
      const $td = document.createElement("td");
      if(cell === CODE.MINE){
        $td.innerText = "X";
      }
      $tr.append($td);
    })
    $tbody.append($tr);
    $tbody.addEventListener("contextmenu", onRightClick);
    $tbody.addEventListener("click", onLeftClick);
  })
}
