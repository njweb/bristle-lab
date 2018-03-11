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
  // const adj = (((Date.now() - ctx.state.timestamp)) / 1000 / 6);
  const adj = ctx.state.timestamp * 0.000165;
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
    {point: [-20, -8], length: 3, rotOffset: (Math.PI * 2) / 3},
    {point: [0, 24], length: 1, rotOffset: ((Math.PI * 2) / 3) * 2},
    {point: [20, -8], length: 2, rotOffset: 0}
  ];

  const calcTriPoint = (out, triPoint, rot) => {
    cachePoint[0] = Math.cos(rot + triPoint.rotOffset) * triPoint.length;
    cachePoint[1] = Math.sin(rot + triPoint.rotOffset) * triPoint.length;

    vec2.add(out, triPoint.point, cachePoint);
    return out;
  };

  const renderTri = (ctx) => {
    const adj = ctx.state.timestamp * 0.003;
    ctx
      .line(calcTriPoint(cachePoint, triPointControls[0], -adj))
      .line(calcTriPoint(cachePoint, triPointControls[1], -adj))
      .line(calcTriPoint(cachePoint, triPointControls[2], -adj));
  };

  return ctx => {
    const adj = ctx.state.timestamp * 0.002;
    ctx.branch(renderTri, mat2d.fromRotation(cacheMat2d, adj * 0.1));
  }
})();

export const sillyGhostSeq = (() => {
  return ctx => {
    ctx
      .move([2.24,3.51])
      .bezier([3.64,2.92],[4.03,2.39],[4.23,-0.45])
      .bezier([4.43,-3.29],[4.44,-5.7],[3.43,-5.82])
      .bezier([1.34,-6.06],[2.65,-3.17],[2.65,-3.17])
      .line([-1.79,-3.44])
      .bezier([-1.79,-3.44],[-0.6,-5.85],[-2.12,-5.84])
      .bezier([-3.59,-5.82],[-3.31,0.55],[-2.8,2.23])
      .bezier([-2.31,3.83],[0.83,4.1],[2.24,3.51]);
  }
})();