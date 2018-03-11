import bristle from './localBristle'
import {mat2d} from "gl-matrix";

import {printBlobTriangle, printBlueFrame} from "./printing";
import {buildCanvasContext2dProjector} from "./util";

import {crazyCurvySeq, edgeRectangleSeq, wobblyTriSeq, sillyGhostSeq} from "./sequences";

const buildEnv = context2d => {
  // const renderer = buildRenderer(context2d);
  const renderer = bristle.renderToCanvas({canvasContext2d: context2d});
  const trianglePrinter = printBlobTriangle(context2d, renderer);
  const blueStrokePrinter = printBlueFrame(context2d, renderer);

  const triangleInstructions = [];
  const frameInstructions = [];

  const pathA = bristle.createPath(triangleInstructions);
  const pathB = bristle.createPath(frameInstructions);

  let isRunning = false;
  let state = { timestamp: 0 };

  // const projScaleMat = mat2d.fromScaling([], [5, -5]);
  // const projTransformMat = mat2d.fromTranslation([], [250, 250]);
  // const projMat = mat2d.mul([], projTransformMat, projScaleMat);
  const projMat = buildCanvasContext2dProjector(context2d, {
    flipY: true,
    sourceWidth: 100
  });
  const pathMat = mat2d.fromTranslation([], [10, -8]);

  const clearContext = () => {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
  };
  const doRender = () => {
    // trianglePrinter(pathA(wobblyTriSeq, projMat, state));
    trianglePrinter(pathA(sillyGhostSeq, projMat, state));
    // trianglePrinter(pathA(crazyCurvySeq, mat2d.mul([], projMat, pathMat), state));
    blueStrokePrinter(pathB(edgeRectangleSeq, projMat));
  };
  const renderLoop = () => window.requestAnimationFrame(onAnimationFrame);

  const onAnimationFrame = (ts) => {
    if(isRunning) {
      state.timestamp = ts;
      clearContext();
      doRender();
      renderLoop();
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