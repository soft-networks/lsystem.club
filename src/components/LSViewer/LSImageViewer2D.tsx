import p5 from "p5"
import '../../styles/resizable.css'
import LSImageViewerBasic from "./LSImageViewerBasic";
import { draw2DChar } from "./drawChar";

export default class LSImageViewer2D extends LSImageViewerBasic {
  drawCharFunct = draw2DChar;
 
  drawCurrentAxiom = (p : p5) => {
    if (this.props.axiom !== undefined) {
      let cS = this.props.axiom
      p.background(100,0,100);
      p.noFill();
      p.stroke(0, 0, 0);
      p.strokeWeight(this.props.gfxProps.strokeWeight);
      let steps = cS.length;
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


