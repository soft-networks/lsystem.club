import React from "react"
import {  GFXPropsComplete, P5CanvasType } from "../utils";
import {Axiom} from "@bvk/lsystem"
import p5 from "p5";

//Props should control all the things coming into the viewer
export interface LSImageViewerBasicProps {
  axiom: Axiom | undefined,
  gfxProps: GFXPropsComplete
}

//State should control anything needed for the panning + zooming 
export interface LSImageViewerBasicState {

}


export default class LSImageViewerBasic extends React.Component<LSImageViewerBasicProps, LSImageViewerBasicState> {

  p5Context: p5 | undefined
  containerRef = React.createRef<HTMLDivElement>();
  canvasType : P5CanvasType = "p2d"
  canvasID : string = "P5-BASIC-CANVAS" 

  constructor(props: LSImageViewerBasicProps) {
    super(props);
    //TODO: When to bind
    this.state = {

    }
  }
  componentDidMount() {
    if (this.containerRef.current) 
      new p5(this.sketch, this.containerRef.current);
  }
  componentDidUpdate() {
    this.redraw();
  }

  defaultSetup = (p: p5) => {
    let cnv = p.createCanvas(this.props.gfxProps.width, this.props.gfxProps.height, this.canvasType);
    cnv.id(this.canvasID);
    p.angleMode(p.DEGREES);
    p.colorMode(p.HSB);
    p.noLoop();
    p.textFont("monospace ", 12);
    p.strokeCap("butt")
  }
  preload = (p: p5) => {
    //Do nothing in the base case
  }
  redraw = () => {
    console.log("Redrawing graphic");
    if (this.p5Context !== undefined) {
      this.p5Context.clear();
      this.p5Context.background(this.props.gfxProps.backgroundColor);
      this.drawCurrentGraphic(this.p5Context);
      this.p5Context?.noLoop();
    } else {
      console.log("Couldnt redraw");
      console.log(this.p5Context);
    }
  }
  moveToCanvasCenter = (p: p5) => {
    if (!p) return
    p.translate(p.width / 2, p.height / 2);
  }
  rotateToUp = (p : p5) => {
    if (p) p.rotate(-90);
  }
  drawCurrentGraphic = (p:p5) => {
    p.push();
    this.moveToCanvasCenter(p);
    p.translate(this.props.gfxProps.center[0] * p.width, this.props.gfxProps.center[1] * p.height);
    this.rotateToUp(p);
    this.drawCurrentAxiom(p);
    p.pop();
  }
  drawCurrentAxiom = (p: p5) => {
    p.fill(Math.random() * 100 , 100 , 100);
    p.ellipse(0,0,100,100);
  }
  startIterationAnimation = () => {
    //TODO
  }
  sketch = (p: p5) => {
 
    p.setup = () => {
      this.defaultSetup(p);
      this.preload(p);
      this.p5Context = p;
      this.redraw();
    };
    p.draw = () => {

    }
  };
  render() {
    return (
          <div ref={this.containerRef} />
    );
  }
}