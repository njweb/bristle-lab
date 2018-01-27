import {h, render, Component} from 'preact'
import renderEnv from './graphics/renderEnv'

import {createBezierNode, computeBezierNode, renderContinuousCurve} from "./graphics/util";

const bNode = createBezierNode();
bNode.width = 4;
bNode.offset = 0.8;
bNode.rotation = Math.PI * 0.25;
bNode.point = [1, 2];
// const output = computeBezierNode([[], [], []], bNode);
const mockStorage = [];
const mockCtx = {
  bezier: (a, b, p) => {
    mockStorage.push([a, b, p]);
  }
};
renderContinuousCurve(mockCtx, [1, 0], [bNode], [5, 0], [6, 0]);
// console.log('OUTPUT: ', output[0], output[1], output[2]);
console.log('OUTPUT: ', mockStorage);

// console.log('FTT', focusedTransformTool);
// focusedTransformTool([15, 10], () => {})({ pathTip: [10, 5]});

class Root extends Component {
  componentDidMount() {
    const context = this.canvasEl.getContext('2d');

    const myRenderEnv = renderEnv(context);
    myRenderEnv.start();
    setTimeout(() => {
      console.log('STOPING');
      myRenderEnv.stop();
    }, 6000);
  }

  render() {
    return <div id="root" className="global-centered root">
      <div>HERE</div>
      <canvas ref={e => this.canvasEl = e} width="500" height="500"/>
    </div>
  }
}

const state = {};

const bootstrap = () => {
  render(< Root appState={state}/>, document.body, document.querySelector('#root'));
};
bootstrap();
