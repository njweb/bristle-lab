import {focusedTransformTool, splitBezierTakeStart} from "./util";
import {vec2, mat2d} from "gl-matrix";

const pointySeq = ctx => {
  ctx.line([0.4, 0])
    .line([0.4, 1])
    .line([0.5, 0.2])
    .line([0.6, 1])
    .line([0.6, 0])
    .line([1, 0]);
};

export const spikyTriangleSeq = ctx => {
  const adj = ((Date.now() - ctx.state.timestamp)) / 1000;

  ctx.move([-8, 0])
    .action(focusedTransformTool([0, 1 + adj], pointySeq()))
    .line([8, 0]);
};

export const crazyCurvySeq = ctx => {
  const adj = (((Date.now() - ctx.state.timestamp)) / 1000 / 6);
  const bezierStorage = [[0, 0], [0, 0], [0, 0], [0, 0]];
  splitBezierTakeStart(bezierStorage, [-20, 8], [-5, -8], [5, 38], [20, 8], adj);

  ctx.move([-20, 0])
    .line([-20, 8])
    .bezier(bezierStorage[1], bezierStorage[2], bezierStorage[3])
    .line([20, 8])
    .line([20, 0]);
};

export const edgeRectangleSeq = ctx => {
  ctx.move([-48, -48])
    .line([-48, 48])
    .line([48, 48])
    .line([48, -48]);
};

export const wobblyTriSeq = (() => {
  const cachePoint = vec2.create();
  const cacheMat2d = mat2d.create();

  const triPointControls = [
    { point: [-20, -8], length: 3, rotOffset: (Math.PI * 2) / 3 },
    { point: [0, 24], length: 1, rotOffset: ((Math.PI * 2) / 3) * 2 },
    { point: [20, -8], length: 2, rotOffset: 0 }
  ];

  const calcTriPoint = (out, triPoint, rot) => {
    cachePoint[0] = Math.cos(rot + triPoint.rotOffset) * triPoint.length;
    cachePoint[1] = Math.sin(rot + triPoint.rotOffset) * triPoint.length;

    vec2.add(out, triPoint.point, cachePoint);
    return out;
  };

  const computeTimeAdj = timestamp => ((Date.now() - timestamp)) / 1000;

  return ctx => {
    const adj = computeTimeAdj(ctx.state.timestamp) * 2;

    ctx.transform = mat2d.fromRotation(cacheMat2d, adj * 0.1);
    ctx
      .line(calcTriPoint(cachePoint, triPointControls[0], -adj))
      .line(calcTriPoint(cachePoint, triPointControls[1], -adj))
      .line(calcTriPoint(cachePoint, triPointControls[2], -adj));
  }
})();