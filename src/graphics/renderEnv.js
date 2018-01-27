import bristle from 'bristle'

import {printBlobTriangle, printBlueFrame} from "./printing";
import {buildRenderer} from "./renderer";

import {crazyCurvySeq, edgeRectangleSeq, wobblyTriSeq} from "./sequences";

const buildEnv = context2d => {
  const renderer = buildRenderer(context2d);
  const trianglePrinter = printBlobTriangle(context2d, renderer);
  const blueStrokePrinter = printBlueFrame(context2d, renderer);

  const triangleInstructions = [];
  const frameInstructions = [];

  const pathA = bristle.path(triangleInstructions);
  const pathB = bristle.path(frameInstructions);

  let isRunning = false;
  let state = { timestamp: Date.now() };

  const clearContext = () => {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
  };
  const doRender = () => {
    trianglePrinter(pathA(wobblyTriSeq, null, state));
    blueStrokePrinter(pathB(edgeRectangleSeq));
  };
  const renderLoop = () => {
    if(isRunning) {
      window.requestAnimationFrame(() => {
        renderLoop();
        clearContext();
        doRender();
      })
    }
  };

  return {
    start: () => {
      isRunning = true;
      state = { timestamp: Date.now() };
      renderLoop();
    },
    stop: () => {
      isRunning = false;
    }
  }
};

export default buildEnv