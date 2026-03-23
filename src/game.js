const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// comment colby see

function draw() {}

function update() {}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

console.log("kys");
