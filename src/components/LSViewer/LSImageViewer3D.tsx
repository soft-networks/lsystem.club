import { ParamsValue } from "@bvk/lsystem";
import p5 from "p5";
import LSImageViewer2D from "./LSImageViewer2D";
import '../../styles/resizable.css'
import {Resizable} from "react-resizable";

export default class LSImageViewer3D extends LSImageViewer2D {
  canvasType : "webgl" | "p2d" = "webgl";
  models : p5.Geometry[] = [];
  private cameraPos: number[] | undefined;
  private cameraNum = 0;
  canvasID = "CANVAS-P53D"


  rotateToUp = () => {
    let p = this.p5Context;
    if (p) p.rotate(-180);
  }
  preload = (p: p5) => {
   
  }
  moveToCenter = () => {
    //Do nothing, were already there
    let p = this.p5Context;
    if (!p) return;
    if (!this.cameraPos)  {this.cameraPos = [0, 0, 0]; this.moveCamera(); }
    p.camera(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2], 0, 0, 0, 0, 1, 0);
  }
  drawChar = (char: string, l: number, a: number, params: ParamsValue | undefined) => {
    let p = this.p5Context;
    if (!p) return
    switch (char) {
      case "F":
        p.line(0, 0, 0, l);
        p.translate(0, l);
        break;
      case "f":
        p.translate(0, l);
        break;
      case "[":
        p.push();
        break;
      case "]":
        p.pop();
        break;
      //Here: Yaw is around Z axis, giving you +/- on the YX plane 
      //What that means, is a 2d curve will be drawn on the YX plane  
      case "+":
        p.rotateZ(a);
        break;
      case "-":
        p.rotateZ(-a);
        break;
      //PITCH is around X axis, giving you &/^ (pitch down/up) 
      //So pitching up down gives you rotation "up/down" w.r.t to up axis 
      case "&":
        p.rotateX(a);
        break;
      case "^":
        p.rotateX(-a)
        break;
      //ROLL is around Y axis, gives you a roll around itself
      //Without any PITCH, Roll is meaningless for a line (just rolls around itself)
      case '\'':
        p.rotateY(a);
        break;
      case '/':
        p.rotateY(-a);
        break;
      case "E":
        if (params && params[1]) {
          p.fill(parseFloat(params[1] as string), 100,100 );
        }
        p.ellipse(0, 0, l, l);
        p.noFill();
        break;
      case "!":
        p.strokeWeight(l)
        break;
      case "~":
        p.rotateX(Math.random() * a);
        p.rotateY(Math.random() * a);
        p.rotateZ(Math.random() * a);
        break;
      case "#":
        p.stroke(l, 100, 100);
        break;
      case "M":
        this.drawModel(p, params)
        break;
      default:
        //console.log(char + " isn't turtle command");
        break;
      }
    }

  drawModel = (p:p5, params: ParamsValue | undefined) => {
    let scaleValue = params && params[0] ? parseFloat(params[0] as string) : 0.1;
    p.push();
    //p.specularMaterial(255);
    p.scale(scaleValue);
    p.box(100);
    p.pop();
  }
  moveCamera = () => {
    if (!this.p5Context) return;
    let displacement = this.p5Context.height * 0.9;
    if (this.cameraNum == 0) {
      this.cameraPos = [0, 0, displacement];
    }
    if (this.cameraNum == 1) {
      this.cameraPos = [displacement, 30, 0];
    }
    if (this.cameraNum == 2) {
      this.cameraPos = [0, 0, -displacement];
    }
    if (this.cameraNum == 3) {
      this.cameraPos = [-displacement, 0, 0];
    }
    this.cameraNum = this.cameraNum + 1;
    this.cameraNum = this.cameraNum > 3 ? 0 : this.cameraNum;
    //this.cameraPos[1] += 30;
  }

  render() {
    return (
      <div className="stack smaller">
        <div>
          <span className="clickable" onClick={(e) => {this.moveCamera(); this.redraw()}}> rotate me </span> 
          <span className="clickable" onClick={() => this.startIterationAnimation()}> animate growth </span>
          <span className="clickable" onClick={() => this.toggleRecording()}> {this.state.isRecording ? "🔴 Stop recording" : "Start recording" } </span>
          <span  className="clickable" onClick={() => this.moveCenterPoints(-1,0)}> ← </span>
          <span  className="clickable" onClick={() => this.moveCenterPoints(1,0)}> ➝ </span>
          <span  className="clickable" onClick={() => this.moveCenterPoints(0,-1)}> ↑ </span>
          <span  className="clickable" onClick={() => this.moveCenterPoints(0,1)}> ↓ </span>
        </div>
        <Resizable width={this.state.canvasSize[0]} height={this.state.canvasSize[1]} onResize={this.onResize} >
          <div ref={this.containerRef} />
        </Resizable>
      </div>
    )
  }

}
