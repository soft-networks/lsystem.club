import p5 from "p5";
import LSImageViewer2D from "./LSImageViewer2D";
import { draw3DChar } from "./drawChar";

export default class LSImageViewer3D extends LSImageViewer2D {
  canvasType : "webgl" | "p2d" = "webgl";
  models : p5.Geometry[] = [];
  canvasID = "CANVAS-P53D"
  drawCharFunct = draw3DChar;

  rotateToUp = () => {
    let p = this.p5Context;
    if (p) p.rotate(-180);
  }
  preload = (p: p5) => {
   
  }
  moveToCanvasCenter = () => {
    let p = this.p5Context;
    if (!p) return;
  }
 
}
