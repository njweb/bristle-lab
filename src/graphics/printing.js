export const printBlobTriangle = (context2d, renderer) => instructions => {
  context2d.beginPath();
  renderer(instructions);
  context2d.closePath();

  context2d.fillStyle = '#557722';
  context2d.fill();
};

export const printBlueFrame = (context2d, renderer) => instructions => {
  context2d.beginPath();
  renderer(instructions);
  context2d.closePath();

  context2d.strokeStyle = '#2233AA';
  context2d.stroke()
};
