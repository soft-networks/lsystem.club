import React from "react"
import {  GFXPropsComplete, P5CanvasType } from "../../../lib/utils";
import {Axiom} from "@bvk/lsystem"
import p5 from "p5";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

//Props should control all the things coming into the viewer
export interface LSImageViewerBasicProps {
  axiom: Axiom | undefined,
  gfxProps: GFXPropsComplete
}

//State should control anything needed for the panning + zooming 
export interface LSImageViewerBasicState {
  localScale: number,
  localCenter: number[] 
}


export default class LSImageViewerBasic< S extends LSImageViewerBasicState = LSImageViewerBasicState> extends React.Component<LSImageViewerBasicProps,S> {

  p5Context: p5 | undefined
  containerRef = React.createRef<HTMLDivElement>();
  canvasType : P5CanvasType = "p2d"
  canvasID : string = "P5-BASIC-CANVAS" 

  constructor(props: LSImageViewerBasicProps) {
    super(props);
    //TODO: When to bind
    this.state = {
      localScale: props.gfxProps.width / 600,
      localCenter: props.gfxProps.center
    } as S
  }
  componentDidMount() {
    if (this.containerRef.current) 
      new p5(this.sketch, this.containerRef.current);
  }
  componentDidUpdate(prevProps: LSImageViewerBasicProps) {
    if (this.props.gfxProps.center !== prevProps.gfxProps.center) {
      this.setState({localCenter: this.props.gfxProps.center})
    }
    if (this.props.gfxProps.width !== prevProps.gfxProps.width || this.props.gfxProps.height !== prevProps.gfxProps.height ) {
      if (this.p5Context) {
        this.p5Context.resizeCanvas(this.props.gfxProps.width, this.props.gfxProps.height);
        this.setState({ localScale: this.props.gfxProps.width / 600})
      } else {
        console.log("⛔️⛔️⛔️⛔️ tried resizing canvas but p5 context doesnt exist yet")
      }
    }
    this.redraw();
  }

  defaultSetup = (p: p5) => {
    console.log("🦋🦋🦋🦋🦋🦋🦋🦋 creating canvas", this.props.gfxProps);
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
  scaleToZoomLevel = (p: p5) => {
    if (!p) return;
    p.scale(this.state.localScale);
  }
  rotateToUp = (p : p5) => {
    if (p) p.rotate(-90);
  }
  drawCurrentGraphic = (p:p5) => {
    p.push();
    this.moveToCanvasCenter(p);
    this.scaleToZoomLevel(p);
    p.translate(this.state.localCenter[0] * p.width, this.state.localCenter[1] * p.height);
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
      console.log("💖💖💖💖 RUNNING SETUP NOW FOR P5")
      this.defaultSetup(p);
      this.preload(p);
      this.p5Context = p;
      this.redraw();
    };
    p.draw = () => {

    }
  };
  handleZoom = (zoomAmount: number) => {
    if (zoomAmount && zoomAmount !== 0) {
      let scale = this.state.localScale;
      scale = scale + zoomAmount * scale;
      console.log("Setting new scale" + scale);
      this.setState({localScale: scale})
    }
  }
  handlePan = (panX: number, panY: number) => {
    let center = this.state.localCenter;
    center = [center[0] + panX, center[1] + panY];
    this.setState({localCenter: center})
  }
  getZoomControls = () => {
    return (
      <div key="zoom-controls">
        <div className="clickable" onClick={(e) => this.handleZoom(+0.1)}>
          +
        </div>
        <div className="clickable" onClick={(e) => this.handleZoom(-0.1)}>
          -
        </div>
      </div>);
  }
  getPanControls = () => {
    return ( <div key="pan-controls">
      <div className="clickable" onClick={(e) => this.handlePan(0, -0.01)}>
        up
      </div>
      <div className="clickable" onClick={(e) => this.handlePan(0, 0.01)}>
        dw
      </div>
      <div className="clickable" onClick={(e) => this.handlePan(0.01, 0)}>
        lf
      </div>
      <div className="clickable" onClick={(e) => this.handlePan(-0.01, 0)}>
        rt
      </div>
    </div>)
  }
  getCanvasControls = (): JSX.Element[] => {
    return [ this.getZoomControls(), this.getPanControls()];
  }
  render() {
    return (
      <div style={{ position: "absolute" }}>
        <div style={{ position: "absolute", right: 0, top: 0, zIndex: 2 }} className="padded" >
          {this.getCanvasControls()}
        </div>
        <div ref={this.containerRef} />
      </div>
    );
  }
}