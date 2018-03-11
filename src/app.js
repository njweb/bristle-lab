import {h, render, Component} from 'preact'
import renderEnv from './graphics/renderEnv'
// import renderEnv from './performance/renderEnv'
import {buildCanvasContext2dProjector} from "./graphics/util";
import {vec2} from 'gl-matrix'

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Starting'
    };
  }
  componentDidMount() {

    // if(process.env.NODE_ENV === 'development') {
    //   console.log('PRINT DEV');
    // }
    // if(process.env.NODE_ENV === 'production') {
    //   console.log('PRINT PROD');
    // }
    // console.log('node env:', process.env.NODE_ENV);

    const context = this.canvasEl.getContext('2d');

    // const myMat2d = buildCanvasContext2dProjector(context, {
    //   flipY: true,
    //   xLeftRatio: 0.5,
    //   yTopRatio: 2,
    //   widthRatio: 100
    // });

    const myMat2d = buildCanvasContext2dProjector(context, {
      flipY: true,
      xLeftPercentage: 0.5,
      yTopPercentage: 0.6,
      sourceWidth: 2
    });

    console.log('OUT POINT: ', vec2.transformMat2d([], [0.1, 0.9], myMat2d));

    const myRenderEnv = renderEnv(context);
    myRenderEnv.start();
    setTimeout(() => {
      console.log('STOPING');
      this.setState({title: 'Stopping'});
      myRenderEnv.stop();
    }, 6000);
  }

  render() {
    return <div id="root" className="global-centered root">
      <div>{this.state.title}</div>
      <canvas ref={e => this.canvasEl = e} width="500" height="500"/>
    </div>
  }
}

const state = {};

const bootstrap = () => {
  render(< Root appState={state}/>, document.body, document.querySelector('#root'));
};
bootstrap();
