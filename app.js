const $form = document.querySelector("#form");
const $timer = document.querySelector("#timer");
const $tbody = document.querySelector("#table tbody");
const $result = document.querySelector("#result");
const row = 10; // 줄
const cell = 10; // 칸
const mine = 10; // 지뢰

const CODE = { // 아래값들을 이차원 배열 안에 넣고, 화면에 그림
  NORMAL: -1, // 닫힌 칸(지뢰x)
  QUESTION: -2, // 물음표 칸(지뢰x)
  FLAG: -3, // 깃발 칸(지뢰x)
  QUESTIONG_MINE: -4, // 물음표 칸(지뢰o)
  FLAG_MINE: -5, // 깃발 칸(지뢰o)
  MINE: -6, // 닫힌 칸(지뢰o)
  OPENED: 0, // 0 이상이면 모두 다 열린 칸 (0-8까지 숫자를 표시, 주변 지뢰 갯수)
}

// 데이터에 따라 화면 바꿔주기(데이터를 먼저 만들고, 해당 값에 따라 화면 조정)
let data;

function plantMine() {
  const candidate = Array(row * cell).fill().map((arr, i) => {
    return i; 
    // 10x10의 테이블 각 칸에 숫자 데이터를 하나씩 넣어줌
    // candidate = [0, 1, 2, ... 99]
  })
}

// 테이블 만들기
function printTable() {
  for(let i = 0; i < 10; i++){
    const tr = document.createElement("tr");
    for(let j = 0; j < 10; j++){
      const td = document.createElement("td");
      td.className = "td";
      tr.append(td);
    }
    $tbody.append(tr);
  }

}
printTable();