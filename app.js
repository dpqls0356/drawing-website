const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 800;
const ctx = canvas.getContext("2d");

//////  집만들기  ///////
// ctx.fillRect(200, 350, 50, 200);
// ctx.fillRect(400, 350, 50, 200);
// ctx.strokeRect(300, 450, 50, 100);
// ctx.beginPath();
// ctx.moveTo(325, 200);
// ctx.lineTo(200, 350);
// ctx.lineTo(450, 350);
// ctx.fillStyle = "green";
// ctx.fill();

// ctx.beginPath();
// ctx.fillStyle = "black";

//////  사람만들기  //////
// //팔
// ctx.fillRect(550, 380, 10, 65);
// ctx.fillRect(630, 380, 10, 65);
// //몸
// ctx.fillRect(570, 380, 50, 100);
// //다리
// ctx.fillRect(570, 480, 10, 70);
// ctx.fillRect(610, 480, 10, 70);
// //얼굴
// ctx.arc(595, 340, 30, 0, 2 * 3.14);
// ctx.fill();
// ctx.beginPath();
// ctx.fillStyle = "white";
// ctx.arc(585, 340, 6, 1 * 3.14, 2 * 3.14);
// ctx.arc(605, 340, 6, 1 * 3.14, 2 * 3.14);
// ctx.fill();

/// 마우스 움직임에 따라 선 그려지기 ///
// function onClick(event) {
//   ctx.lineTo(event.offsetX, event.offsetY);
//   ctx.stroke();
// }
// canvas.addEventListener("click", onClick);

// var colors = [
//   "#f19066",
//   "#f5cd79",
//   "#546de5",
//   "#c44569",
//   "#f78fb3",
//   "#3dc1d3",
//   "#7bed9f",
// ];
// var color;
// var precolor = "";

// //1초마다 색 변경
// changeColor();
// setInterval(changeColor, 1000);
// function changeColor() {
//   color = colors[parseInt(Math.random() * colors.length)];
//   console.log(color);
// }
// //마우스 움직일때마다 그림 그리기
// canvas.addEventListener("mousemove", moveMouse);
// function moveMouse(event) {
//   if (precolor !== color) {
//     ctx.beginPath();
//     precolor = color;
//   }
//   ctx.strokeStyle = color;
//   ctx.lineTo(event.offsetX, event.offsetY);
//   ctx.stroke();
// }

// 그림판 만들기 //
var color = "black";
ctx.lineWidth = 2;
let isPainting = false;
canvas.addEventListener("mousemove", onMove);
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    console.log("paint");
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
  //붓을 단순히 이동시키고 mousedown이 된다면 계속해서 moveTo로부터 lineTo까지 선을 그린다.
  //     ctx.moveTo(event.offsetX, event.offsetY);가 반복되다가
  //     isPainting이 true가 되면 75번라인부터 78번라인까지만 반복
  //     false로 바뀌면 다시 80번 라인만 반복됨
}
canvas.addEventListener("mousedown", onMouseDown);
function onMouseDown() {
  isPainting = true;
}
canvas.addEventListener("mouseup", onMouseUp);
function onMouseUp() {
  ctx.beginPath();
  isPainting = false;
}
canvas.addEventListener("mouseleave", onMouseUp);

// 선 굵기 변경 시키기 //
function changeWidth() {
  var lineWidth = document.querySelector(".line-width").value;
  document.querySelector(".line-width").value = "";

  ctx.lineWidth = lineWidth;
}

// 선 색상 변경 시키기 //
function changeColor() {
  console.log("hi");
  console.log(ctx.fillStyle, ctx.strokeStyle);
  color = document.querySelector(".line-color").value;
  if (isFilling) {
    ctx.fillStyle = color;
  } else {
    ctx.strokeStyle = color;
  }
  console.log(ctx.fillStyle, ctx.strokeStyle);
}

// var selectColorOption = document.querySelector(".color-option");
// ->이렇게하면 가장 먼저 나온 div만 가져오게된다.
// color-option이라는 이름을 가진 모든 div를 가져오기 위해서는 아래처럼 작성
// var selectColorOption = document.getElementsByClassName("color-option");
// 문제는 모든 요소에 이벤트를 걸어줘야하는데 foreach문은 배열에서만 가능하기에 배열로 변경
var selectColorOption = Array.from(
  document.getElementsByClassName("color-option")
);
//여기서 color는 배열 요소 하나를 뜻함.
selectColorOption.forEach((color) =>
  color.addEventListener("click", onSelectColorOption)
);
function onSelectColorOption(event) {
  if (isFilling) {
    ctx.fillStyle = event.target.dataset.color;
  } else {
    ctx.strokeStyle = event.target.dataset.color;
  }
  document.querySelector(".line-color").value = event.target.dataset.color;
}

// mode 변경 //
var isFilling = false;
var modeBtn = document.querySelector(".mode-btn");

modeBtn.addEventListener("click", onClickModeBtn);
function onClickModeBtn() {
  if (isFilling) {
    modeBtn.innerHTML = "Fill";
    isFilling = false;
  } else {
    modeBtn.innerHTML = "Draw";
    isFilling = true;
  }
  changeColor();
}
canvas.addEventListener("click", onClickCanvas);
function onClickCanvas() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// 지우개 //
var eraser = document.querySelector(".eraser-btn");
eraser.addEventListener("click", clickEraserBtn);
function clickEraserBtn() {
  if (ctx.fillStyle === "#000000") {
    ctx.strokeStyle = "#FFFFFF";
  } else {
    ctx.strokeStyle = ctx.fillStyle;
  }

  ctx.beginPath();
}

// 전부 지우기 //
var clean = document.querySelector(".clean-btn");
clean.addEventListener("click", cleanCanvas);
function cleanCanvas() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 사진 업로드하여 화면에 띄우기 //

const fileupload = document.querySelector(".upload-file");
fileupload.addEventListener("change", uploadFile);

function uploadFile(event) {
  console.dir(event.target);
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fileupload.value = null;
  };
}
