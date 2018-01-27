import bristle from 'bristle'

const projection = (out, point) => {
  out[0] = (point[0] * 5) + 250;
  out[1] = (point[1] * -5) + 250;
  return out;
};

export const buildRenderer = (canvasContext2d) => {
  return bristle.renderToCanvas({canvasContext2D: canvasContext2d, projection})
};