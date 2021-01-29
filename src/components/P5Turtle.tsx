import React from "react"
import p5 from "p5"
import LSystem, { Axiom, ParamsValue } from "@bvk/lsystem";
import { GFXProps } from "./utils";

interface myProps {
  LSystem: LSystem | undefined;
  GFXProps?: GFXProps
}
export default class P5Turtle extends React.Component<myProps> {
  p5Context: p5 | undefined;
  containerRef = React.createRef<HTMLDivElement>();
  canvasType : "webgl" | "p2d" = "p2d";
  iterateAnimationIndex : undefined | number;
  walkthroughAnimationIndex: undefined | number;
  currentDrawCommand: Axiom | undefined;
  

  constructor(props: myProps) {
    super(props);
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
      p.createCanvas(this.props.GFXProps?.width || 600, this.props.GFXProps?.height || 600, this.canvasType);
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
      p.noLoop();
      p.textFont("monospace ", 12);
      p.strokeCap("butt")
      //p.strokeCap(p.SQUARE)
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
      this.p5Context?.background(255, 0, 255);
      this.drawCS();
      this.p5Context?.noLoop();
    } else {
      console.log("Couldnt redraw");
      console.log(this.p5Context);
    }
  }
  animateIterations = () => {
    if (this.props.LSystem?.iterations === undefined || this.iterateAnimationIndex === undefined) {
      console.log("Cant animate");
      return;
    }
    if (this.iterateAnimationIndex > this.props.LSystem?.iterations) {
      console.log("Animation finished");
      this.iterateAnimationIndex = undefined;
      return;
    }
    
    let allIterations = this.props.LSystem.getAllIterationsAsObject();
    let currentIteration = allIterations[this.iterateAnimationIndex];
    this.currentDrawCommand = currentIteration;
    this.redraw();
    this.iterateAnimationIndex++;
    setTimeout(this.animateIterations, 100);
  }
  startIterationAnimation = () => {
    this.walkthroughAnimationIndex = undefined;
    this.iterateAnimationIndex = 0;
    this.animateIterations();
  }
  drawCS = () => {
    if (this.props.LSystem !== undefined) {
      //Setup drawing
      let cS = this.currentDrawCommand || this.props.LSystem.getIterationAsObject();
      let p = this.p5Context as p5;

      //Setup default values 
      let center = this.props.GFXProps?.center !== undefined ? [p.width * this.props.GFXProps?.center[0], p.height * this.props.GFXProps?.center[1]] : [0, 0];
      let sw = this.props.GFXProps?.strokeWeight ? this.props.GFXProps?.strokeWeight : 1;
      let defaultLength = this.props.GFXProps?.length ? this.props.GFXProps?.length : 0.01 * p.height;
      let defaultAngle = this.props.GFXProps?.angle ? this.props.GFXProps?.angle : 90;

      //Begin drawing
      p.push();
      this.moveToCenter()
      p.translate(center[0], center[1], 0);

      this.rotateToUp();
      p.noFill();
      p.stroke(0, 0, 0);
      p.strokeWeight(sw);
      
      let steps = cS.length;
      for (let i = 0; i < steps; i++) {
        let letter = cS[i];
        let char = letter.symbol;
        let params = letter.params;
        let param = letter.params && letter.params.length == 1 ? letter.params[0] + "" : undefined;
        let val = param && !isNaN(parseFloat(param)) ? parseFloat(param) : undefined
        this.drawChar(char, val || defaultLength, val || defaultAngle, params);
      }
      p.pop();
      p.noLoop();
    }
  }
  rotateToUp = () => {
    let p = this.p5Context;
    if (p) p.rotate(-90);
  }
  moveToCenter = () => {
    let p = this.p5Context;
    if (p) p.translate(p.width / 2, p.height / 2);
  }
  drawChar(char: string, l: number, a: number, params: ParamsValue | undefined) {
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
      case "~":
        p.rotate(Math.random() * a);
        break;
      case "#":
        if (!l || l==0)  p.stroke(0,0,0);
        else p.stroke(l, 100, 100);
        break;
      // case "T":
      //   let txtvalue = "text";
      //   if (params) {
      //     txtvalue = params[Math.floor(Math.random() * params.length)] as string;
      //   }
      //   p.text(txtvalue,0,0);
      //   break;
      default:
      //console.log(char + " isn't turtle command");
    }
  }

  render() {
    return (<div>
      <span className="clickable" onClick={() => this.startIterationAnimation()}> animate growth </span>
      <div ref={this.containerRef} />
    </div>)
  }

}
