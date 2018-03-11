import {printBlobTriangle} from "../graphics/printing";
import {wobblyTriSeq} from "../graphics/sequences";

const buildEnv = context2d => {
  let isRunning = false;
  let state = {timestamp: Date.now()};

  const clearContext = () => {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
  };
  const doRender = () => {
    context2d.beginPath();
    context2d.moveTo(50, 50);
    context2d.lineTo(200, 50);
    context2d.lineTo(200, 200);
    context2d.lineTo(50, 200);
    context2d.closePath();
    context2d.fill();
  };

  const renderLoop = () => {
    window.requestAnimationFrame(onAnimationFrame)
  };

  const onAnimationFrame = () => {
    if (isRunning) {
      clearContext();
      doRender();
      renderLoop();
    }
  };

  return {
    start: () => {
      isRunning = true;
      state = {timestamp: Date.now()};
      context2d.fillStyle = '#3322CC';
      renderLoop();
    },
    stop: () => {
      isRunning = false;
    }
  }
};

export default buildEnv;