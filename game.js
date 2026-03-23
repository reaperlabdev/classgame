const canvas = document.getElementById("gameCanvas");
const renderContext = canvas.getContext("2d");

let game = {
  fps: 0,
};

let lastFrameTime = performance.now();
function draw() {
  lastFrameTime = performance.now();
  renderContext.clearRect(0, 0, canvas.width, canvas.height);
  renderContext.fillText("FPS: " + game.fps, 10, 10);
}

function update() {
  game.fps = Math.round(1000 / (performance.now() - lastFrameTime));
  lastFrameTime = performance.now();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
