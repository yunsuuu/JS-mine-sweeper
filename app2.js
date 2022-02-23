// 이차원배열로 table 만들 때 데이터 표현이 핵심!
// 데이터 표현 -> 데이터를 바탕으로 화면 그리기
// table 각 cell에 올바른 데이터가 들어가야함(단순히 화면에 table을 그리는 것 아님)
const $form = document.querySelector("#form");
const $timer = document.querySelector("#timer");
const $tbody = document.querySelector("table tbody");
const row = 5;
const cell = 5;
const mine = 5;
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
    const horizontal = Math.floor(shuffle[k] / cell); // 행(가로) - 몫
    const vertical = shuffle[k] % cell; // 열(세로) - 나머지
    data[horizontal][vertical] = CODE.MINE;
    console.log(horizontal, vertical);
  }
  console.log(shuffle);
  console.log(data);
}
plantMine();


