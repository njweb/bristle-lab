const commander = require('commander');

const splitToInstructionGroups = /[mMcCqQlL][\s\d.\-,]+/g;
const splitToInstructionWithPoints = /([mMcClL]|[\d.\-]+\s*,\s*[\d.\-]+)/g;

const copyPoint = p => [p[0], p[1]];
const addPoints = (a, b) => [a[0] + b[0], a[1] + b[1]];

const parseInstructionChunk = chunk => {
  const [commandLetter, ...rawPointData] = chunk;
  const points = rawPointData.map(rawPoint => (
    rawPoint.split(',').map(str => parseFloat(str))
  ));
  return {
    commandLetter,
    points
  };
};
const parseMoveInstruction = ({points, isRelative, tipPoint}) => {
  let localTipPoint = tipPoint;
  let output = {
    instructions: points.reduce((acc, point) => {
      const instruction = {command: 'move'};
      instruction.point = isRelative ? addPoints(localTipPoint, point) : point;
      localTipPoint = instruction.point;
      acc.push(instruction);
      return acc;
    }, [])
  };
  output.tipPoint = localTipPoint;
  return output;
};

const parseLineInstruction = ({points, isRelative, tipPoint}) => {
  let localTipPoint = tipPoint;
  let output = {
    instructions: points.reduce((acc, point) => {
      const instruction = {command: 'line'};
      instruction.point = isRelative ? addPoints(localTipPoint, point) : point;
      localTipPoint = instruction.point;
      acc.push(instruction);
      return acc;
    }, [])
  };
  output.tipPoint = localTipPoint;
  return output;
};

const mapInstructionCodeToCommandInfo = {
  'm': {commandName: 'move', relative: true, pointCount: 1},
  'M': {commandName: 'move', relative: false, pointCount: 1},
  'l': {commandName: 'line', relative: true, pointCount: 1},
  'L': {commandName: 'line', relative: false, pointCount: 1},
  'q': {commandName: 'quad', relative: true, pointCount: 2},
  'Q': {commandName: 'quad', relative: false, pointCount: 2},
  'c': {commandName: 'bezier', relative: true, pointCount: 3},
  'C': {commandName: 'bezier', relative: false, pointCount: 3}
};

const parseRawInstructions = rawInstructions => {
  const makeCommandStructure = commandName => ({
    commandName,
    points: []
  });
  let tipPoint = [0, 0];

  return rawInstructions.map(instruction => {
    const commandInfo = mapInstructionCodeToCommandInfo[instruction.commandLetter];

    let pointIndex = 0;
    return instruction.points.reduce((acc, point) => {
      console.log('TIPPOINT: ', tipPoint);
      if (pointIndex === 0) acc = [...acc, makeCommandStructure(commandInfo.commandName)];
      const currentCommandStructure = acc.slice(-1)[0];
      currentCommandStructure.points = [
        ...currentCommandStructure.points,
        commandInfo.relative ? addPoints(tipPoint, point) : point,
      ];

      pointIndex += 1;
      if ((pointIndex % commandInfo.pointCount) === 0) {
        pointIndex = 0;
        tipPoint = copyPoint(currentCommandStructure.points.slice(-1)[0]);
      }
      return acc;
    }, []);
  });
};

const precisionRound = (num, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};

const computePathNumber = (value, fixedPrecision, multiplier = 1) => {
  const multipliedValue = value * multiplier;
  return fixedPrecision ? precisionRound(multipliedValue, fixedPrecision) : multipliedValue;
};

const stringifyCommands = commands => (
  commands.reduce((commandStr, c) => {
    const fixedPrecision = commander.fixed;
    const xMultiplier = commander.xmultiplier;
    const yMultiplier = commander.ymultiplier;
    const stringifyPoints = points => {
      return points.map(point => {
        const x = computePathNumber(point[0], fixedPrecision, xMultiplier);
        const y = computePathNumber(point[1], fixedPrecision, yMultiplier);
        return `[${x},${y}]`
      }).join(',');
    };
    commandStr = `${commandStr}\n.${c.commandName}(${stringifyPoints(c.points)})`;
    return commandStr;
  }, '')
);

commander
  .version('0.1.0')
  .option('-p, --path <p>', 'The svg path ("d" attribute) to parse', /^[\s\dmMlLqQcCzZ.\-,]+$/g)
  .option('-f, --fixed <f>', 'The fixed point notation to output floating-point numbers with', parseInt)
  .option('-x, --xmultiplier <x>', 'The multiplier for x values', parseFloat, 1)
  .option('-y, --ymultiplier <y>', 'The multiplier for y values', parseFloat, 1)
  .parse(process.argv);

const svgPath = (typeof commander.path === 'string') ? commander.path : '';

const instructionChunks = svgPath.match(splitToInstructionGroups)
  .map(chunk => chunk.match(splitToInstructionWithPoints));
const rawInstructions = instructionChunks.map(parseInstructionChunk);
rawInstructions.map(rI => console.log('POINTS: ', rI.points));
const commandChunks = parseRawInstructions(rawInstructions);
console.log('COMMANDCHUNKS: ');
commandChunks.map(chunk => console.log('POINTS: ', chunk.map(c => c.points)));
const commands = commandChunks.reduce((acc, chunk) => ([...acc, ...chunk]), []);

const bristleStr = `ctx${stringifyCommands(commands)};`;

console.log('OUTPUT CTX COMMANDS:');
console.log(bristleStr);