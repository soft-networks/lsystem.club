import React from "react"
import p5 from "p5"
import { Axiom, Letter } from "@bvk/lsystem";

interface myProps {
  commandString: string | Axiom,
  length?: number
  angle?: number
  center?: number[],
  width?: number,
  height?: number,
  strokeWeight?: number
}
export default class P5Draw extends React.Component<myProps> {
  private p5Context: p5 | undefined;
  private containerRef = React.createRef<HTMLDivElement>();
  componentDidMount() {
    let node = this.containerRef.current;
    if (node) {
      this.p5Context = new p5(this.sketch, node);
    }
  }
  sketch = (p: p5) => {
    p.setup = () => {
      let ctx = p.createCanvas(this.props.width || 800, this.props.height || 800, p.WEBGL);
      p.angleMode(p.DEGREES);
    };
    p.draw = () => {
      p.translate(-p.width / 2, -p.height / 2);
      let center = this.props.center !== undefined ? [p.width * this.props.center[0], p.height * this.props.center[1]] : [0, 0];
      p.push();
      p.background(255, 255, 255);
      p.translate(center[0], center[1]);
      p.noFill();
      p.stroke(0, 0, 0);
      let sw = this.props.strokeWeight || p.width / 1000;
      p.strokeWeight(sw);
      if ((this.props.commandString[0] as Letter).symbol) {
        this.drawAxiom(p, this.props.commandString as Axiom);
      } else {
        this.drawString(p, this.props.commandString as string);
      }
      p.noLoop();
      p.pop();
    };
  };
  drawString = (p: p5, cS: string) => {
    let length = this.props.length ? this.props.length * p.height : 0.01 * p.height;
    let angle = this.props.angle ? this.props.angle : Math.PI / 2;
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
    let defaultAngle = this.props.angle ? this.props.angle : Math.PI / 2;
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
      case "+":
        p.rotate(a)
        break;
      case "-":
        p.rotate(-a)
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
        console.log(char + " isn't turtle command");
    }
  }

  render = () => {
    return (<div ref={this.containerRef} />)
  }

}

