import React from "react"
import p5 from "p5"
import LSystem, { Axiom, Letter, ParamsValue } from "@bvk/lsystem";
import { Dw } from "./lib/easyCam";
import { Console } from "console";
import { textSpanIntersectsWithTextSpan } from "typescript";
import { GFXProps } from "./utils";


interface myProps {
  LSystem: LSystem | undefined;
  GFXProps?: GFXProps
}
export default class P5Turtle extends React.Component<myProps> {
  private p5Context: p5 | undefined;
  private containerRef = React.createRef<HTMLDivElement>();
  constructor(props: myProps) {
    super(props);
    this.drawCS = this.drawCS.bind(this);
    this.drawChar = this.drawChar.bind(this);
    this.redraw = this.redraw.bind(this);
  }
  componentDidMount() {
    if (this.containerRef.current)
      new p5(this.sketch, this.containerRef.current);
  }
  componentDidUpdate() {
    this.redraw();
  }
  sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(this.props.GFXProps?.width || 800, this.props.GFXProps?.height || 800);
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
      p.noLoop();
      this.p5Context = p;
      this.redraw();
    };
    p.draw = () => {

    }
  };
  componentWillUnmount = () => {
    this.p5Context?.remove();
    this.p5Context = undefined;
  }
  redraw() {
    if (this.p5Context !== undefined) {
      this.p5Context?.clear();
      this.p5Context?.background(0, 0, 90);
      this.drawCS();
      this.p5Context?.noLoop();
    } else {
      console.log("Couldnt redraw");
      console.log(this.p5Context);
    }
  }
  drawCS() {
    if (this.props.LSystem !== undefined) {
      //Setup drawing
      let cS = this.props.LSystem.getIterationAsObject();
      let p = this.p5Context as p5;

      //Setup default values 
      let center = this.props.GFXProps?.center !== undefined ? [p.width * this.props.GFXProps?.center[0], p.height * this.props.GFXProps?.center[1]] : [0, 0];
      let sw = this.props.GFXProps?.strokeWeight ? this.props.GFXProps?.strokeWeight : 1;
      let defaultLength = this.props.GFXProps?.length ? this.props.GFXProps?.length * p.height : 0.01 * p.height;
      let defaultAngle = this.props.GFXProps?.angle ? this.props.GFXProps?.angle : 90;

      //Begin drawing
      p.push();
      p.translate(p.width / 2, p.height / 2);
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
  drawChar(char: string, l: number, a: number) {
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
      case "!":
        p.strokeWeight(l)
        break;
      case "@":
        p.stroke(l, 100, 100);
        break;
      default:
      //console.log(char + " isn't turtle command");
    }
  }

  render() {
    return <div ref={this.containerRef} style={{ width: this.props.GFXProps?.width || 800, height: this.props.GFXProps?.height || 800, backgroundColor: "white" }} />;
  }

}
