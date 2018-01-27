//-Math.atan2(p.y, p.x);
import {vec2, mat2d} from 'gl-matrix'

export const focusedTransformTool = (() => {
  let cachePoint = [0, 0];
  let transform = mat2d.create();
  let storedPredicate;

  const transformedBranch = (ctx) => {
    const vector = vec2.sub(cachePoint, cachePoint, ctx.pathTip);
    let rot = Math.atan2(vector[1], vector[0]);
    let scale = vec2.len(vector);

    mat2d.fromTranslation(transform, ctx.pathTip);
    mat2d.rotate(transform, transform, rot);
    mat2d.scale(transform, transform, [scale, scale]);

    const transformedPoint = vec2.transformMat2d([], [0.5, 0], transform);

    ctx.branch(storedPredicate, transform)
  };

  return (point, predicate) => {
   storedPredicate = predicate;
   vec2.copy(cachePoint, point);
   return transformedBranch;
  }
})();

export const createBezierNode = () => {
  return {
    point: [0, 0],
    rotation: 0,
    width: 0,
    offset: 0
  }
};

//bezier(a, b, p)
export const computeBezierNode = (out, node) => {
  const halfWidth  = node.width / 2;
  const offsetWidth = halfWidth * node.offset;

  const valueA = -halfWidth + offsetWidth;
  const valueB = halfWidth + offsetWidth;

  out[0][0] = (Math.cos(node.rotation) * valueA) + node.point[0];
  out[0][1] = (Math.sin(node.rotation) * valueA) + node.point[1];
  out[1] = vec2.copy(out[1], node.point);
  out[2][0] = (Math.cos(node.rotation) * valueB) + node.point[0];
  out[2][1] = (Math.sin(node.rotation) * valueB) + node.point[1];

  return out;
};

export const renderContinuousCurve = (() => {
  const cachePoint = [0, 0];
  const cacheComputed = [[0, 0], [0, 0], [0, 0]];

  return (ctx, controlA, bezierNodes, controlB, point) => {
    if (bezierNodes.length === 0) {
      ctx.bezier(controlA, controlB, point);
    } else {
      computeBezierNode(cacheComputed, bezierNodes[0]);
      ctx.bezier(controlA, cacheComputed[0], cacheComputed[1]);
      for (let i = 1; i < bezierNodes.length; i++) {
        vec2.copy(cachePoint, cacheComputed[2]);
        computeBezierNode(cacheComputed, bezierNodes[i]);
        ctx.bezier(cachePoint, cacheComputed[0], cacheComputed[1]);
      }
      ctx.bezier(cacheComputed[2], controlB, point);
    }
    return ctx;
  }
})();

export const splitBezier = (() => {
  const cachePoint = [0, 0];
  return (outBezierA, outBezierB, startPoint, controlA, controlB, endPoint, interpolation) => {
    vec2.copy(outBezierA[0], startPoint);
    vec2.lerp(outBezierA[1], startPoint, controlA, interpolation);
    vec2.lerp(cachePoint, controlA, controlB, interpolation);
    vec2.lerp(outBezierB[2], controlB, endPoint, interpolation);
    vec2.copy(outBezierB[3], endPoint);

    vec2.lerp(outBezierA[2], outBezierA[1], cachePoint, interpolation);
    vec2.lerp(outBezierB[1], cachePoint, outBezierB[2], interpolation);

    vec2.lerp(outBezierA[3], outBezierA[2], outBezierB[1], interpolation);
    vec2.copy(outBezierB[0], outBezierA[3]);
  }
})();

export const splitBezierTakeStart = (() => {
  const cachePointA = [0, 0];
  const cachePointB = [0, 0];

  return (outBezier, startPoint, controlA, controlB, endPoint, interpolation) => {
    vec2.copy(outBezier[0], startPoint);
    vec2.lerp(outBezier[1], startPoint, controlA, interpolation);

    vec2.lerp(cachePointA, controlA, controlB, interpolation);
    vec2.lerp(cachePointB, controlB, endPoint, interpolation);
    vec2.lerp(cachePointB, cachePointA, cachePointB, interpolation);

    vec2.lerp(outBezier[2], outBezier[1], cachePointA, interpolation);
    vec2.lerp(outBezier[3], outBezier[2], cachePointB, interpolation);
  }
})();

export const splitBezierTakeEnd = (() => {
  const cachePointA = [0, 0];
  const cachePointB = [0, 0];
  return (outBezier, startPoint, controlA, controlB, endPoint, interpolation) => {
    vec2.lerp(cachePointA, startPoint, controlA, interpolation);
    vec2.lerp(cachePointB, controlA, controlB, interpolation);
    vec2.lerp(cachePointA, cachePointA, cachePointB, interpolation);

    vec2.lerp(outBezier[2], controlB, endPoint, interpolation);
    vec2.lerp(outBezier[1], cachePointB, outBezier[2], interpolation);
    vec2.lerp(outBezier[0], cachePointA, outBezier[1], interpolation);
    vec2.copy(outBezier[3], endPoint);
  }
})();