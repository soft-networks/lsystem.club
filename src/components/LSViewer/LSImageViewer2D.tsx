import React from "react"
import p5 from "p5"
import LSystem, { Axiom, Params, ParamsValue } from "@bvk/lsystem";
import { GFXProps } from "../utils";
import {Resizable, ResizeCallbackData} from "react-resizable";
import '../../styles/resizable.css'

interface myProps {
  LSystem: LSystem | undefined;
  drawFrame?: boolean
  GFXProps?: GFXProps
}
interface myState {
  centerPoints: number[],
  isRecording: boolean,
  canvasSize: number[],
  animationTimeoutSpeed: number,
}

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

export default class LSImageViewer2D extends React.Component<myProps, myState> {
  p5Context: p5 | undefined;
  containerRef = React.createRef<HTMLDivElement>();
  canvasType : "webgl" | "p2d" = "p2d";
  iterateAnimationIndex : undefined | number;
  walkthroughAnimationIndex: undefined | number;
  currentDrawCommand: Axiom | undefined;
  customRules: {[key: string]: (p:p5, params: ParamsValue | undefined) => void} = {};
  mediaRecorder: MediaRecorder | undefined;
  recordedChunks: BlobPart[] = [];
  canvasID = "CANVAS-P52d"

  constructor(props: myProps) {
    super(props);
    this.drawChar = this.drawChar.bind(this);
    this.redraw = this.redraw.bind(this);
    this.state = {
      centerPoints: this.props.GFXProps?.center ? this.props.GFXProps?.center : [0,0],
      canvasSize: [this.props.GFXProps?.width || 600, this.props.GFXProps?.height || 600],
      animationTimeoutSpeed: 500,
      isRecording : false
    }

  }
  componentDidMount() {
    if (this.containerRef.current)
      new p5(this.sketch, this.containerRef.current);
  }
  componentDidUpdate(prevProps: myProps, prevState: myState) {
    if ( prevState.isRecording !== this.state.isRecording) {
      return; // ignore recording updates
    }
    this.iterateAnimationIndex = this.props.LSystem?.iterations;
    this.currentDrawCommand = this.props.LSystem?.getIterationAsObject();
    this.redraw();
  }
  preload = (p :p5) => {

  }
  sketch = (p: p5) => {
 
    p.setup = () => {
      let cnv = p.createCanvas(this.state.canvasSize[0], this.state.canvasSize[1], this.canvasType);
      cnv.id(this.canvasID);
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
      p.noLoop();
      p.textFont("monospace ", 12);
      p.strokeCap("butt")
      //p.strokeCap(p.SQUARE)
      this.preload(p);
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
      this.p5Context?.background(255, 0, 255,0);
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
    if (this.iterateAnimationIndex > this.props.LSystem?.iterations && !this.state.isRecording) {
      console.log("Animation finished");
      this.iterateAnimationIndex = undefined;
      return;
    }
    
    let allIterations = this.props.LSystem.getAllIterationsAsObject();
    let currentIteration = allIterations[this.iterateAnimationIndex];
    this.currentDrawCommand = currentIteration;
    this.redraw();
    this.iterateAnimationIndex++;
    setTimeout(this.animateIterations, this.state.animationTimeoutSpeed);
  }
  startIterationAnimation = () => {
    this.walkthroughAnimationIndex = undefined;
    this.iterateAnimationIndex = 0;
    this.animateIterations();
  }
  toggleRecording = () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
  startRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      return; //Already recording
    }
    let recordingCanvas = document.getElementById(this.canvasID) as CanvasElement;
    if (recordingCanvas) {
        let mediaStream = recordingCanvas.captureStream();
        console.log(mediaStream);
        let options = { mimeType: "video/webm; codecs=vp9" };
        this.mediaRecorder = new MediaRecorder(mediaStream, options);
        this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
          console.log("Data updated");
          if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
            download([...this.recordedChunks]);
            this.recordedChunks = [];
          } else {
            console.log("Empty!");
          }
        };
        this.mediaRecorder.start();
        this.setState({isRecording: true})
        this.animateIterations();
    }
  }
  stopRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      console.log("stopping recording");
      this.mediaRecorder.stop();
      this.setState({isRecording: false});
      //download(this.recordedChunks);
    }
  }
  setDefaults = (p: p5) => {
    //let center = this.props.GFXProps?.center !== undefined ? [p.width * this.props.GFXProps?.center[0], p.height * this.props.GFXProps?.center[1]] : [0, 0];
    let center = [this.state.centerPoints[0] * p.width, this.state.centerPoints[1] * p.height];
    let sw = this.props.GFXProps?.strokeWeight ? this.props.GFXProps?.strokeWeight : 1;
    let defaultLength = this.props.GFXProps?.length ? this.props.GFXProps?.length : 0.01 * p.height;
    let defaultAngle = this.props.GFXProps?.angle ? this.props.GFXProps?.angle : 90;
    return {center, sw, defaultLength, defaultAngle}
  }
  drawCS = () => {
    if (this.props.LSystem !== undefined) {
      //Setup drawing
      let cS = this.currentDrawCommand || this.props.LSystem.getIterationAsObject();
      let p = this.p5Context as p5;

      p.background(100,0,100);

      //Setup default values 
      let {center, sw, defaultLength, defaultAngle} = this.setDefaults(p);

      if (true)
        this.drawFrame(p);

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
  drawFrame = (p: p5) => {
    
    let baseFrameWidth = 0.01 * p.width;
    let oneRow = baseFrameWidth; 
    let halfRow = 0.5 * baseFrameWidth;
    let frameFactor  = 5;
    let sw = 1;
    let hw = 0.5;


    p.push();
  
    
    //Ground
    p.push();
    p.background("#A7ECFF");

    p.stroke(0,0,0);
    p.strokeWeight(1);
    p.fill("#41e85a");
    p.rect( -10, 0.8 * p.height ,p.width + 10, p.height);
    p.pop();


    p.push();
    p.noFill();
    let runningOffset = 0;

    //Dark yellow
    p.stroke("#ddb84f");
    p.strokeWeight(oneRow);
    p.rect(halfRow, halfRow, p.width - oneRow, p.height - oneRow);
    runningOffset +=  oneRow;
    p.stroke("#000000");
    p.strokeWeight(sw);
    p.rect(runningOffset + hw, runningOffset + hw , p.width - (2 * runningOffset + sw),  p.height - (2 * runningOffset + sw));
    runningOffset += sw;

    // //Light yellow
    p.stroke("#ffcb23");
    p.strokeWeight(oneRow);
    p.rect(halfRow + runningOffset, halfRow + runningOffset, p.width - (2 * runningOffset + oneRow),  p.height - (2 * runningOffset + oneRow));
    runningOffset += oneRow;
    p.stroke("#000000");
    p.strokeWeight(sw);
    p.rect(runningOffset + hw, runningOffset + hw , p.width - (2 * runningOffset + sw),  p.height - (2 * runningOffset + sw));
    runningOffset += sw;
    

    // // //orange, #ffb201
    p.stroke("#ffb201");
    p.strokeWeight(frameFactor * oneRow);
    p.rect(frameFactor * halfRow + runningOffset, frameFactor * halfRow + runningOffset, p.width - (2 * runningOffset + frameFactor * oneRow),  p.height - (2 * runningOffset + frameFactor * oneRow));
    runningOffset += frameFactor * oneRow;
    p.stroke("#000000");
    p.strokeWeight(sw);
    p.rect(runningOffset + hw, runningOffset + hw , p.width - (2 * runningOffset + sw),  p.height - (2 * runningOffset + sw));
    runningOffset += sw;

  
    // // //white
    p.stroke("#ffffff");
    p.strokeWeight(baseFrameWidth);
    p.rect(halfRow + runningOffset, halfRow + runningOffset, p.width - (2 * runningOffset + oneRow),  p.height - (2 * runningOffset + oneRow));
    runningOffset += oneRow;
    p.stroke("#000000");
    p.strokeWeight(sw);
    p.rect(runningOffset + hw, runningOffset + hw , p.width - (2 * runningOffset + sw),  p.height - (2 * runningOffset + sw));
    runningOffset += sw;

    p.pop();
    p.pop();
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
        if (!l || l == 0) p.stroke(0, 0, 0);
        else {
          let h = params && params[0] ? parseFloat(params[0] as string) : 0;
          let s = params && params[1] ? parseFloat(params[1] as string) : 100;
          let b = params && params[2] ? parseFloat(params[2] as string) : 100;
          p.stroke(h, s, b);
        }
        break;
      default:
        if (this.customRules[char]) {
          this.customRules[char](p,params);
        }
      //console.log(char + " isn't turtle command");
    }
  }
  moveCenterPoints = (xD: number,yD: number) => {
    const amount = 0.05;
    let x = xD * amount;
    let y = yD * amount;
    let newCenterPoints = [this.state.centerPoints[0] + x, this.state.centerPoints[1] + y];
    this.setState({centerPoints: newCenterPoints});
  }
  
  onResize = (event: React.SyntheticEvent<Element, Event>, data: ResizeCallbackData) => {
    this.setState({canvasSize: [data.size.width, data.size.height]});
    this.p5Context?.resizeCanvas(data.size.width, data.size.height);
    this.redraw();
  };

  render() {
    return (
      <div className="stack small">
        <div>
          <span className="clickable" onClick={() => this.startIterationAnimation()}>
            {" "}
            animate growth{" "}
          </span>
          <span className="clickable" onClick={() => this.toggleRecording()}>
            {" "}
            {this.state.isRecording ? "🔴 Stop recording" : "Start recording"}{" "}
          </span>
          <span className="clickable" onClick={() => this.moveCenterPoints(-1, 0)}>
            {" "}
            ←{" "}
          </span>
          <span className="clickable" onClick={() => this.moveCenterPoints(1, 0)}>
            {" "}
            ➝{" "}
          </span>
          <span className="clickable" onClick={() => this.moveCenterPoints(0, -1)}>
            {" "}
            ↑{" "}
          </span>
          <span className="clickable" onClick={() => this.moveCenterPoints(0, 1)}>
            {" "}
            ↓{" "}
          </span>
          <div >
            <input
              value={this.state.animationTimeoutSpeed}
              onChange={(e) => {
                let s = parseInt(e.target.value);
                this.setState({ animationTimeoutSpeed: s });
              }}
            ></input>
          </div>
        </div>
        <Resizable width={this.state.canvasSize[0]} height={this.state.canvasSize[1]} onResize={this.onResize}>
          <div ref={this.containerRef} />
        </Resizable>
      </div>
    );
  }

}



function download(recordedChunks: BlobPart[]) {
  console.log("Download triggered", recordedChunks);
  var blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = "test.webm";
  //console.log(a);
  a.click();
  // window.URL.revokeObjectURL(url);
}
