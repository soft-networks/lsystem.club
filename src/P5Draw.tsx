import React from "react"
import p5 from "p5"
import { Axiom, Letter } from "@bvk/lsystem";
import { Dw } from "./lib/easyCam";
import { Console } from "console";


interface myProps {
  commandString: Axiom | undefined;
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
      console.log("🤡🤡🤡🤡🤡 A NEW canvas WAS CREATED")
      let ctx = p.createCanvas(this.props.width || 800, this.props.height || 800);
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
    };
    p.draw = () => {
      p.background(0, 0, 100);
      this.drawCS();
      p.noLoop();

    };
  };

  drawCS = () => {
    if (this.props.commandString !== undefined && this.p5Context !== undefined) {
      console.log("🥴🥴🥴🥴🥴 DRAWING COMMAND STRING")
      //Setup values
      let cS = this.props.commandString;
      let p = this.p5Context as p5;
      let center = this.props.center !== undefined ? [p.width * this.props.center[0], p.height * this.props.center[1]] : [0, 0];
      let sw = this.props.strokeWeight ? this.props.strokeWeight : 1;
      let defaultLength = this.props.length ? this.props.length * p.height : 0.01 * p.height;
      let defaultAngle = this.props.angle ? this.props.angle : 90;
      p.translate(p.width / 2, p.height / 2);
      p.push();
      p.noFill();
      p.stroke(0, 0, 0);
      p.strokeWeight(sw);
      p.translate(center[0], center[1], 0);
      let steps = cS.length;
      for (let i = 0; i < steps; i++) {
        let letter = cS[i];
        let char = letter.symbol;
        let param = letter.params && letter.params.length == 1 ? letter.params[0] + "" : undefined;
        let val = param && !isNaN(parseFloat(param)) ? parseFloat(param) : undefined
        this.drawChar(char, val || defaultLength, val || defaultAngle);
      }
      p.pop();
      p.noLoop();

    }
  }
  drawChar = (char: string, l: number, a: number) => {
    let p = this.p5Context;
    if (!p) return;
    switch (char) {
      case "F":
        p.line(0, 0, l, 0);
        p.translate(l, 0);
        break;
      case "f":
        p.translate(l, 0);
        break;
      case "+":
        p.rotate(a);
        break;
      case "-":
        p.rotate(-a);
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
