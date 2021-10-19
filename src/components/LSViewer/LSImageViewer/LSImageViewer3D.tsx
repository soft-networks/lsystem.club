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
    p.rotateZ(180);
    p.rotateX( (this.state.upRot % 8) * 45);
    p.rotateY( (this.state.lrRot % 8) * 45);
    
  }
  moveToCanvasCenter = () => {
    let p = this.p5Context;
    if (!p) return;

  } 
  getRotControls = (): JSX.Element => {
    const turnUnit = 1;
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
