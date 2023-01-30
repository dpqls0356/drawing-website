const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
var lineWidth = document.querySelector(".line-width").value;
ctx.lineCap = "round";
canvas.width = document.querySelector(".paint-box").clientWidth;
canvas.height = document.querySelector(".paint-box").clientHeight;
var color = "black";
let isPainting = false;
var usermode = "pencil";
var count = 0;
// 창 크기 변화시킬때마다 canvas크기 바꿔줘야함
window.addEventListener("resize", handleWindowResize);
function handleWindowResize() {
  canvas.width = document.querySelector(".paint-box").clientWidth;
  canvas.height = document.querySelector(".paint-box").clientHeight;
  ctx.lineWidth = changeWidth();
}
// 새로고침하면 선 굵기가 자꾸 얇아져서 함수로 굵기 변경시켜줌
window.addEventListener("load", setLineWidth);
function setLineWidth() {
  count = 0;
  ctx.lineWidth = lineWidth;
  document.querySelector(".show-line-width").innerHTML = lineWidth;
}
// 새로고침 시 굵기가 변하는 문제 해결하기 //

// 모드 변경 함수 //
const mode = [
  "pencil",
  "background-color",
  "eraser-btn",
  "clean-btn",
  "add-photo-l",
  "add-text-l",
  "fill",
];
const addPhotoBtn = document.querySelector(".add-photo-l");
addPhotoBtn.addEventListener("click", modeChange);
const addTextBtn = document.querySelector(".add-text-l");
addTextBtn.addEventListener("click", modeChange);
const pencilSetting = document.querySelector(".pencil-setting");
const imageSetting = document.querySelector(".image-setting");
const textSetting = document.querySelector(".text-setting");
function modeChange(event) {
  var currentmode = event.target.className;

  for (var i = 0; i < mode.length; i++) {
    if (currentmode === mode[i]) {
      usermode = currentmode;
      changeColor();
      if (
        usermode === "pencil" ||
        usermode === "background-color" ||
        usermode == "fill"
      ) {
        pencilSetting.style.display = "flex";
        imageSetting.style.display = "none";
        textSetting.style.display = "none";
        if (usermode === "background-color") {
          count++;
        }
      } else if (usermode === "add-photo-l") {
        imageSetting.style.display = "flex";
        pencilSetting.style.display = "none";
        textSetting.style.display = "none";
      } else if (usermode === "add-text-l") {
        textSetting.style.display = "flex";
        pencilSetting.style.display = "none";
        imageSetting.style.display = "none";
      }
      return;
    }
  }
  changeColor();
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
  } else if (isPainting && usermode === "fill") {
    ctx.lineTo(event.offsetX, event.offsetY);
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
  if (isPainting && (usermode === "pencil" || usermode === "eraser-btn")) {
    ctx.beginPath();
    isPainting = false;
  } else if (usermode === "fill" && isPainting) {
    ctx.fillStyle = fillcolor;
    ctx.fill();
    ctx.beginPath();
    isPainting = false;
  }
}
canvas.addEventListener("mouseleave", onMouseUp);

// 선 굵기 변경 시키기 //
function changeWidth() {
  lineWidth = document.querySelector(".line-width").value;
  ctx.lineWidth = lineWidth;
  document.querySelector(".show-line-width").innerHTML = lineWidth;
}

// 선 색상 변경 시키기 //
var backgroundcolor = "#FFFFFFF";
var fillcolor = document.querySelector(".line-color").value;
function changeColor() {
  color = document.querySelector(".line-color").value;

  if (usermode === "pencil") {
    ctx.strokeStyle = color;
  } else if (usermode === "background-color") {
    ctx.fillStyle = color;
    backgroundcolor = color;
  } else if (usermode === "eraser-btn") {
    if (count === 0) {
      ctx.strokeStyle = "#FFFFFF";
      backgroundcolor = "#FFFFFF";
    } else {
      ctx.strokeStyle = backgroundcolor;
    }
    ctx.beginPath();
  } else if (usermode === "fill") {
    ctx.fillStyle = color;
    fillcolor = color;
  }
  console.log(ctx.fillStyle);
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
    backgroundcolor = ctx.fillStyle;
  } else if (usermode === "fill") {
    ctx.fillStyle = event.target.dataset.color;
    fillcolor = ctx.fillStyle;
  }
  document.querySelector(".line-color").value = event.target.dataset.color;
}

canvas.addEventListener("click", onClickCanvas);
function onClickCanvas() {
  if (usermode === "background-color") {
    ctx.beginPath();
    ctx.fillStyle = backgroundcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
  }
}

const backgroundColorBtn = document.querySelector(".background-color");
backgroundColorBtn.addEventListener("click", modeChange);

// 지우개 //
var eraser = document.querySelector(".eraser-btn");
eraser.addEventListener("click", modeChange);

// 전부 지우기 //
var clean = document.querySelector(".clean-btn");
clean.addEventListener("click", cleanCanvas);
function cleanCanvas() {
  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.restore();
}

// 사진 업로드하여 화면에 띄우기 //

const fileupload = document.querySelector(".upload-file");
fileupload.addEventListener("change", uploadFile);

function uploadFile(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  img.classList = "preview-img";

  document.querySelector(".preview-box").innerHTML = "";
  document.querySelector(".preview-box").appendChild(img);
  const showimg = document.querySelector(".preview-img");
  showimg.addEventListener("dragend", moveImg);
  const dragnotice = document.querySelector(".drag-notice");
  dragnotice.style.display = "flex";
  // img.onload = function () {
  //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //   fileupload.value = null;
  // };
}

var fontSize = "16";
var fontShape = "serif";
var fontsetting = `${fontSize}px ${fontShape}`;
ctx.font = fontsetting;
var fontColor = "#FFFFFF";
// 텍스트 추가 //
const textInput = document.querySelector(".text-box");
canvas.addEventListener("dblclick", addText);
function addText(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}
// 텍스트 설정 변경 //
function changefontsize() {
  fontSize = document.querySelector(".fontsize").value;
  fontsetting = `${fontSize}px ${fontShape}`;
  ctx.font = fontsetting;
}
function changefontshape() {
  let pickshape = document.querySelector(".select-word-shape");
  fontShape = pickshape.options[pickshape.selectedIndex].value;
  fontsetting = `${fontSize}px ${fontShape}`;
  ctx.font = fontsetting;
}
function changefontcolor() {
  ctx.fillStyle = document.querySelector(".word-color").value;
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

// 이미지 드래그
function moveImg() {
  const img = document.querySelector(".preview-img");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  fileupload.value = null;
}

//
const circlebrush = document.querySelector(".brush-mode div:nth-child(1)");
const rectbrush = document.querySelector(".brush-mode div:nth-child(2)");
circlebrush.addEventListener("click", changeCircleBrush);
rectbrush.addEventListener("click", changeRectBrush);

function changeCircleBrush() {
  ctx.lineCap = "round";
  usermode = "pencil";
  // ctx.beginPath();
}
function changeRectBrush() {
  ctx.lineCap = "square";
  usermode = "pencil";
  // ctx.beginPath();
}

const fill = document.querySelector(".brush-mode div:last-child");
fill.addEventListener("click", modeChange);
