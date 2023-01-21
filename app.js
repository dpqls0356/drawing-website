const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 800;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
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

// function onClick(event) {
//   ctx.lineTo(event.offsetX, event.offsetY);
//   ctx.stroke();
// }
// canvas.addEventListener("click", onClick);

var colors = [
  "#f19066",
  "#f5cd79",
  "#546de5",
  "#c44569",
  "#f78fb3",
  "#3dc1d3",
  "#7bed9f",
];
var color;
var precolor = "";
//1초마다 색 변경
changeColor();
setInterval(changeColor, 1000);
function changeColor() {
  color = colors[parseInt(Math.random() * colors.length)];
  console.log(color);
}
//마우스 움직일때마다 그림 그리기
canvas.addEventListener("mousemove", moveMouse);
function moveMouse(event) {
  if (precolor !== color) {
    ctx.beginPath();
    precolor = color;
  }
  ctx.strokeStyle = color;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}
