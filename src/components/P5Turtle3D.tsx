import React from "react"
import p5 from "p5"
import LSystem, { ParamsValue } from "@bvk/lsystem";
import { GFXProps } from "./utils";
import P5Turtle from "./P5Turtle";



export default class P5Turtle3D extends P5Turtle {
  canvasType : "webgl" | "p2d" = "webgl";

  private cameraPos: number[] | undefined;
  private cameraNum = 0;

  rotateToUp = () => {
    let p = this.p5Context;
    if (p) p.rotate(-180);
  }
  moveToCenter = () => {
    //Do nothing, were already there
    let p = this.p5Context;
    if (!p) return;
    if (!this.cameraPos)  this.cameraPos = [0, 0, p.height/2];
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
      default:
        //console.log(char + " isn't turtle command");
        break;
      }
    }

  moveCamera = () => {
    if (!this.p5Context) return;
    let displacement = this.p5Context.height / 2;
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
      <div>
        <span className="clickable" onClick={(e) => {this.moveCamera(); this.redraw()}}> rotate me </span> 
        <div ref={this.containerRef} style={{ width: this.props.GFXProps?.width || 800, height: this.props.GFXProps?.height || 800, backgroundColor: "white" }} />
      </div>
    )
  }

}
