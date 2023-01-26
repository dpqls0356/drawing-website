const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
var lineWidth = document.querySelector(".line-width").value;
ctx.lineCap = "round";
canvas.width = document.querySelector(".paint-box").clientWidth;
canvas.height = document.querySelector(".paint-box").clientHeight;
var color = "black";
let isPainting = false;
var usermode = "pencil";

// 창 크기 변화시킬때마다 canvas크기 바꿔줘야함
window.addEventListener("resize", handleWindowResize);
function handleWindowResize() {
  canvas.width = document.querySelector(".paint-box").clientWidth;
  canvas.height = document.querySelector(".paint-box").clientHeight;
  ctx.lineWidth = changeWidth();
  console.log(ctx.lineWidth);
}
// 새로고침하면 선 굵기가 자꾸 얇아져서 함수로 굵기 변경시켜줌
window.addEventListener("load", setLineWidth);
function setLineWidth() {
  ctx.lineWidth = lineWidth;
}
// 새로고침 시 굵기가 변하는 문제 해결하기 //

// 모드 변경 함수 //
const mode = [
  "pencil",
  "background-color",
  "eraser-btn",
  "cleanu-btn",
  "add-photo",
];
function modeChange(event) {
  var currentmode = event.target.className;
  for (var i = 0; i < mode.length; i++) {
    if (currentmode === mode[i]) {
      usermode = currentmode;
      changeColor();
      return;
    }
  }
}
// 그리기 모드 //
const pencil = document.querySelector(".pencil");
pencil.addEventListener("click", modeChange);
canvas.addEventListener("mousemove", onMove);
function onMove(event) {
  if (isPainting && (usermode === "pencil" || usermode === "eraser-btn")) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

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
  lineWidth = document.querySelector(".line-width").value;
  ctx.lineWidth = lineWidth;
}

// 선 색상 변경 시키기 //
function changeColor() {
  color = document.querySelector(".line-color").value;
  console.log(color, usermode);
  if (usermode === "pencil") {
    ctx.strokeStyle = color;
  } else if (usermode === "background-color") {
    ctx.fillStyle = color;
  } else if (usermode === "eraser-btn") {
    ctx.strokeStyle = ctx.fillStyle;
    console.log(ctx.strokeStyle, ctx.fillStyle);
  }
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
  if (usermode === "pencil") {
    ctx.strokeStyle = event.target.dataset.color;
  } else if (usermode === "background-color") {
    ctx.fillStyle = event.target.dataset.color;
  }
  document.querySelector(".line-color").value = event.target.dataset.color;
}

canvas.addEventListener("click", onClickCanvas);
function onClickCanvas() {
  if (usermode === "background-color") {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

const backgroundColorBtn = document.querySelector(".background-color");
backgroundColorBtn.addEventListener("click", modeChange);

// 지우개 //
var eraser = document.querySelector(".eraser-btn");
eraser.addEventListener("click", clickEraserBtn);
function clickEraserBtn() {
  usermode = "eraser-btn";
  ctx.strokeStyle = ctx.fillStyle;
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

// 텍스트 추가 //
const textInput = document.querySelector(".add-text");
canvas.addEventListener("dblclick", addText);
function addText(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.font = "30px serif";
    //   font로 사이즈와 글씨체 변경 가능
    ctx.fillStyle = document.querySelector(".line-color").value;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

// 만든 이미지 저장하기 //
const saveBtn = document.querySelector(".save-btn");
saveBtn.addEventListener("click", saveImage);
function saveImage() {
  var saveImageUrl = canvas.toDataURL();
  var a = document.createElement("a");
  a.href = saveImageUrl;
  a.download = "MyImage.jpg";
  a.click();
}
