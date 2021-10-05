import p5 from "p5";
import { draw3DChar } from "./drawChar";
import LSImageViewerBasic, {LSImageViewerBasicProps, LSImageViewerBasicState} from "./LSImageViewerBasic";

interface RotationalState {
  lrRot: number,
  upRot: number
}
type LSImageViewer3DState = LSImageViewerBasicState & RotationalState

export default class LSImageViewer3D extends LSImageViewerBasic<LSImageViewer3DState> {
  canvasType : "webgl" | "p2d" = "webgl";
  models : p5.Geometry[] = [];
  canvasID = "CANVAS-P53D"
  drawCharFunct = draw3DChar;
  camera : undefined  | p5.Camera = undefined;

  constructor(props: LSImageViewerBasicProps)  {
    super(props);
    this.state = {
      ...this.state,
      lrRot: 0,
      upRot: 0
    }
  }
  
  preload = (p: p5) => {
  }
  rotateToUp = () => {
    let p = this.p5Context;
    if (!p) return
  }
  moveToCanvasCenter = () => {
    let p = this.p5Context;
    if (!p) return;
    let theta = this.state.lrRot;
    let phi = this.state.upRot;
    let x0 = 200 * 0.5;
    let z0 = 200;
    let y0 = 0;
    let x1 ,y1,z1;
    //Rotate around X axis
    z1 = z0 * Math.cos(phi) - y0 * Math.sin(phi);
    y1 = y0 * Math.cos(phi) + z0 * Math.sin(phi);
    //Rotate around Y axis
    x1 = x0 * Math.cos(theta) - z1 * Math.sin(theta);
    z1 = z1 * Math.cos(theta) + x0 * Math.sin(theta);
    p.camera(x1, y1, z1, 0,0,0,0,-1,0)
  } 
  getRotControls = (): JSX.Element => {
    const turnUnit = Math.PI / 4;
    return (
      <div key="rot-controls">
        <div className="clickable" onClick={() => this.setState({lrRot: this.state.lrRot + turnUnit})}> lr+ </div>
        <div className="clickable" onClick={() => this.setState({lrRot: this.state.lrRot - turnUnit})}> lr-</div>
        <div className="clickable" onClick={() => this.setState({upRot: this.state.upRot + turnUnit})}> e+ </div>
        <div className="clickable" onClick={() => this.setState({upRot: this.state.upRot - turnUnit})}> e- </div>
      </div>
    )
  }
  getCanvasControls = (): JSX.Element[] => {
    return [ this.getZoomControls(), this.getPanControls(), this.getRotControls()];
  }
  drawCurrentAxiom = (p : p5) => {

    if (this.props.axiom !== undefined) {
      let cS = this.props.axiom
      p.background(100,0,100);
      p.noFill();
      p.stroke(0, 0, 0);
      p.strokeWeight(this.props.gfxProps.strokeWeight);
      let steps = cS.length;
      p.push();
      for (let i = 0; i < steps; i++) {
        let letter = cS[i];
        let char = letter.symbol;
        let params = letter.params;
        let param = letter.params && letter.params.length === 1 ? letter.params[0] + "" : undefined;
        let val = param && !isNaN(parseFloat(param)) ? parseFloat(param) : undefined
        this.drawCharFunct(p, char, val || this.props.gfxProps.length, val || this.props.gfxProps.angle, params);
      }
      p.pop();
      p.noLoop();
    }
  } 
}
