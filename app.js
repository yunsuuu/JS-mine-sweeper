// 이차원배열에선 몇번째 줄, 몇번째 칸을 클릭했는데 index 알아내는 것이 핵심!
// false 를 반환하는 것: 문자열, 빈 문자열, 0, false, null, undefined, NaN

const $form = document.querySelector("#form");
const $tbody = document.querySelector("#table tbody");
const $result = document.querySelector("#result");
const row = 10; // 줄
const cell = 10; // 칸
const mine = 10; // 지뢰

const CODE = { // 아래 값들을 이차원 배열 안에 넣고, 화면에 그림
  NORMAL: -1, // 닫힌 칸(지뢰x)
  QUESTION: -2, // 물음표 칸(지뢰x)
  FLAG: -3, // 깃발 칸(지뢰x)
  QUESTION_MINE: -4, // 물음표 칸(지뢰o)
  FLAG_MINE: -5, // 깃발 칸(지뢰o)
  MINE: -6, // 닫힌 칸(지뢰o)
  OPENED: 0, // 0 이상이면 모두 다 열린 칸 (0-8까지 숫자를 표시, 주변 지뢰 갯수)
}

// 데이터에 따라 화면 바꿔주기(데이터를 먼저 만들고, 해당 값에 따라 화면 조정)
let data;
let openCount = 0;

 // 지뢰심기
function plantMine() {
  // map 메서드는 배열을 1:
  // 0-99까지 숫자가 담긴 배열 1로 짝지음
  // index와 짝지으니까 0-99까지 
  const candidate = Array(row * cell).fill().map((arr, i) => { 
    return i;
  });
  const shuffle = [];
  while(candidate.length > (row * cell) - mine){ 
    // 90개가 될 때까지(=10개를 뽑겠다)
   const randomNum = Math.floor(Math.random() * candidate.length);
   const chosenNum = candidate.splice(randomNum, 1)[0];
   shuffle.push(chosenNum);
  }

  // 이차원배열
  const data = []; // 큰 배열
  for(let i = 0; i < row; i++){
    const rowData = [];
    data.push(rowData);
    for(let j = 0; j < cell; j++){
     rowData.push(CODE.NORMAL);
    }
  }

  // 랜덤칸에 지뢰 넣기(mine = -6으로 데이터 표현)
  // shuffle = [85, 19, 93]
  for(let k = 0; k < shuffle.length; k++){
    const ver = Math.floor(shuffle[k] / cell); // 몇번째 줄
    // 85는 몇번째 줄? - 85 / 10 -> 8.5 // 8번째 줄(몫)
    const hor = shuffle[k] % cell;
    // 85는 몇번째 칸? - 85 % 10 -> 8.5 // 5번째 칸(나머지)
    data[ver][hor] = CODE.MINE;
  }
  return data;
}

// 우클릭으로 깃발 꼽기
function onRightClick(e) {
  e.preventDefault();
  const target = e.target; // <td>
  const rowIndex = target.parentElement.rowIndex; // <tr>의 rowIndex
  const cellIndex = target.cellIndex; // <td>의 cellIndex
  const cellData = data[rowIndex][cellIndex]; // 우클릭한 칸의 데이터 불러오기(-1, -6)
  // 지뢰인 경우
  if(cellData === CODE.MINE){ // 지뢰면
    data[rowIndex][cellIndex] = CODE.QUESTION_MINE; // 물음표 지뢰로
    target.className = "question";
    target.innerText = "?";
  } else if(cellData === CODE.QUESTION_MINE){ // 물음표 지뢰면
    data[rowIndex][cellIndex] = CODE.FLAG_MINE; // 깃발 지뢰로
    target.className = "flag";
    target.innerText = "!";
  } else if(cellData === CODE.FLAG_MINE){ // 깃발 지뢰면
    data[rowIndex][cellIndex] = CODE.MINE; // 지뢰로
    target.className = "";
    target.innerText = "X";
    // 지뢰가 아닌 경우
  } else if(cellData === CODE.NORMAL){ // 지뢰가 없는 닫힌 칸
    data[rowIndex][cellIndex] = CODE.QUESTION; // 지뢰가 없는 물음표 칸
    target.className = "question";
    target.innerText = "?";
  } else if(cellData === CODE.QUESTION){ // 지뢰가 없는 물음표 칸이면
    data[rowIndex][cellIndex] = CODE.FLAG; // 지뢰가 없는 깃발 칸
    target.className = "flag";
    target.innerText = "!";
  } else if(cellData === CODE.FLAG){ // 지뢰가 없는 깃발 칸이면
    data[rowIndex][cellIndex] = CODE.NORMAL; // 지뢰가 없는 닫힌 칸
    target.className = "";
    target.innerText = "";
  }
}

// 1 2 3
// 4 5 6
// 7 8 9
// 주변 지뢰 갯수 세기
function countMine(rowIndex, cellIndex) {
  const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE]; // [-6, -4, -5]
  let i = 0; // 값 하나씩 증가
  // 자기자신을 기준으로 상하좌우로 둘러싸인 숫자 8개 표시
  // data[0][0] = 5 라고 가정
  // 테이블 첫줄, 첫칸 5를 기준으로 주변 숫자 위치 파악
  // && 앞 값이 존재하면 i++ 실행(존재하지 않으면 i++ 실행x)
  // ?. (optional chaining) = ?. 앞의 평가 대상이 undefined나 null이면 평가를 멈추고 undefined를 반환(에러를 방지)
  mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++; // 1
  mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++; // 2
  mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++; // 3
  mines.includes(data[rowIndex][cellIndex - 1]) && i++; // 4
  mines.includes(data[rowIndex][cellIndex + 1]) && i++; // 6
  mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++; // 7
  mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++; // 8
  mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++; // 9
  return i;
}

// 클릭한 칸을 중심으로 주변 8칸의 지뢰가 0일 때 해당 8칸 한번에 열기
function open(rowIndex, cellIndex) {
  // 무한반복으로 칸 열리는 거 방지
  // 한번 연 칸은 열지 않음
  // CODE.OPENED = 0
  // 클릭하면 data[rowIndex][cellIndex] = 0-8까지 수(지뢰갯수)
  // data[rowIndex][cellIndex] >= CODE.OPENED -> 0보다 크거나 같다 = 열린 적이 있다
  if(data[rowIndex]?.[cellIndex] >= CODE.OPENED) return; // 한번 열었으면 함수 종료
  const target = $tbody.children[rowIndex]?.children[cellIndex]; // 클릭한 칸의 <tr> -> <td> 태그 찾기
  if(!target){
    return; // 해당되는 태그가 없으면 종료
  }
  const count = countMine(rowIndex, cellIndex); // 지뢰 세는 함수를 count 변수에 저장
  data[rowIndex][cellIndex] = count;
  console.log(data[rowIndex][cellIndex]);
  target.className = "opened";
  target.innerText = count ?? "" 
  // undefined, null이 이면 "" / 아니면 count(숫자 0도 표현 가능)
  // target.innerText = count || ""; 
  // count가 없으면 "" 반환 (= 숫자 0 일 때 "" 반환)
  openCount++;
  if(openCount === (row * cell) - mine){
    $tbody.removeEventListener("contextmenu", onRightClick);
    $tbody.removeEventListener("click", onLeftClick);
    setTimeout(() => {
      alert("승리!");
    }, 500);
  }
  return count;
}

// 지뢰 갯수 센 후 0이면 주변 칸 한꺼번에 열기
function openAround(rI, cI) {
  setTimeout(() => {
    const count = open(rI, cI);
    if(count === 0){ // 지뢰 = 0
      // data[0][0] = 5라고 가정(첫줄,첫칸)
      // 재귀함수
      openAround(rI - 1, cI - 1); // 1
      openAround(rI - 1, cI); // 2
      openAround(rI - 1, cI + 1); // 3
      openAround(rI, cI - 1); // 4
      openAround(rI, cI + 1); // 6
      openAround(rI + 1, cI - 1); // 7
      openAround(rI + 1, cI); // 8
      openAround(rI + 1, cI + 1); // 9
    }
  }, 0);
}

// 좌클릭으로 주변 지뢰 갯수 세기
function onLeftClick(e) {
  const target = e.target; // <td>
  const rowIndex = target.parentElement.rowIndex;
  const cellIndex = target.cellIndex;
  const cellData = data[rowIndex][cellIndex];
  if(cellData === CODE.NORMAL){ // 닫힌 칸이면
    openAround(rowIndex, cellIndex);
  } else if(cellData === CODE.MINE){ // 지뢰면
    target.className = "opened";
    target.innerText = "펑";
    $tbody.removeEventListener("contextmenu", onRightClick);
    $tbody.removeEventListener("click", onLeftClick);
  }
}

// 10x10 테이블 만들기 (데이터를 먼저 만들고 데이터 값에 따라 화면 전환)
function printTable() {
  data = plantMine(); // 데이터로 지뢰심기
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
printTable();