const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// comment colby see
// setup 2

function draw() {}

function update() {}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

console.log("colby");