const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function draw() {}

function update() {}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
