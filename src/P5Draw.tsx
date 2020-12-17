import React from "react"
import p5 from "p5"
import { Axiom, Letter } from "@bvk/lsystem";
import { Dw } from "./lib/easyCam";
import { Console } from "console";


interface myProps {
  commandString: string | Axiom;
  length?: number;
  angle?: number;
  center?: number[];
  width?: number;
  height?: number;
  strokeWeight?: number;
  threeD?: boolean
}
export default class P5Draw extends React.Component<myProps> {
  private p5Context: p5 | undefined;
  private containerRef = React.createRef<HTMLDivElement>();
  componentDidMount() {
    let node = this.containerRef.current;
    if (!node)
      throw Error("Reference node doesnt exist");
    this.p5Context = new p5(this.sketch, node);
  }
  componentWillUnmount() {
    if (this.p5Context) {
      this.p5Context.remove()
    }
  }
  sketch = (p: p5) => {
    p.setup = () => {
      console.log("A NEW canvas WAS CREATED")
      let ctx = p.createCanvas(this.props.width || 800, this.props.height || 800, p.WEBGL);
      if (this.props.threeD)
        var camera = new Dw.EasyCam(ctx, { distance: 1000 });
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
    };
    p.draw = () => {
      p.background(0, 0, 100);
      if (this.props.threeD)
        drawAxis(p);
      this.drawCS();
      if (!this.props.threeD)
        p.noLoop();
    };
  };
  updateCS = (cs: string) => {
    this.setState({ commandString: cs });
  }
  drawCS = () => {
    let cS = this.props.commandString;
    let p = this.p5Context as p5;
    let center = this.props.center !== undefined ? [p.width * this.props.center[0], p.height * this.props.center[1]] : [0, 0];
    p.push();
    p.noFill();
    p.stroke(0, 0, 0);
    let sw = this.props.strokeWeight ? this.props.strokeWeight : 1;
    p.strokeWeight(sw);
    p.translate(center[0], center[1], 0);
    if (cS && cS[0]) {
      if ((cS[0] as Letter).symbol) {
        this.drawAxiom(p, cS as Axiom);
      } else {
        this.drawString(p, cS as string);
      }
    }
    p.pop();
  }
  drawString = (p: p5, cS: string) => {
    let length = this.props.length ? this.props.length * p.height : 0.01 * p.height;
    let angle = this.props.angle ? this.props.angle : 90;
    let lString = cS;
    let steps = lString.length;

    for (let i = 0; i < steps; i++) {
      p.stroke(0, 0, 0);
      let char = lString[i];
      this.drawChar(p, char, length, angle)
    }
  }
  drawAxiom = (p: p5, cS: Axiom) => {
    let defaultLength = this.props.length ? this.props.length * p.height : 0.01 * p.height;
    let defaultAngle = this.props.angle ? this.props.angle : 90;
    let lString = cS;
    let steps = lString.length;
    for (let i = 0; i < steps; i++) {
      let letter = lString[i];
      let char = letter.symbol;
      let param = letter.params && letter.params.length == 1 ? letter.params[0] + "" : undefined;
      let val = param && !isNaN(parseFloat(param)) ? parseFloat(param) : undefined
      this.drawChar(p, char, val || defaultLength, val || defaultAngle);
    }
  }

  drawChar = (p: p5, char: string, l: number, a: number) => {
    switch (char) {
      case "F":
        p.line(0, 0, l, 0);
        p.translate(l, 0);
        break;
      case "f":
        p.translate(l, 0);
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
        p.rotateY(a);
        break;
      case "[":
        p.push()
        break;
      case "]":
        p.pop();
        break;
      case "E":
        p.ellipse(0, 0, l, l);
        break;
      default:
      //console.log(char + " isn't turtle command");
    }
  }

  render = () => {
    return (<div ref={this.containerRef} style={{ width: this.props.width || 800, height: this.props.height || 800, backgroundColor: "white" }} />)
  }

}



function drawAxis(p: p5) {
  let brightness = 100;
  p.strokeWeight(1);
  p.push();

  let l = p.height / 3;
  //The XZ PLANE 
  p.push();
  p.translate(0, l);
  p.rotateX(90);
  p.fill(50, 0, brightness);
  p.stroke(50, 0, brightness + 10);
  p.plane(l, l, 1, 1);
  p.pop();
  //Z axis = green 
  p.push();
  p.rotateX(90);
  p.stroke(110, 100, brightness);
  p.line(0, -l, 0, l);
  p.pop();
  //X axis = blue
  p.push();
  p.rotateZ(90);
  p.stroke(225, 100, brightness);
  p.line(0, -l, 0, l);
  p.pop();
  p.pop();
  //Y axis = UP = red 
  p.push();
  p.rotateY(90);
  p.stroke(360, 100, brightness);
  p.line(0, -l, 0, l);
  p.pop();
}

