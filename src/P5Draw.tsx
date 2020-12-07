import React from "react"
import p5 from "p5"

interface myProps {
  commandString: string,
  length?: number
  angle?: number
  center?: number[]
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
      let ctx = p.createCanvas(800, 800);
    };
    p.draw = () => {
      let length = this.props.length ? this.props.length * p.height : 0.01 * p.height;
      let angle = this.props.angle ? this.props.angle : Math.PI / 2;
      let center = this.props.center !== undefined ? [p.width * this.props.center[0], p.height * this.props.center[1]] : [0, 0];
      let lString = this.props.commandString;
      let steps = lString.length;

      p.push();
      p.background(255, 255, 255);
      //p.ellipse(10, 10, 50, 50);
      p.translate(center[0], center[1]);
      p.noFill();
      p.strokeWeight(0.8);
      p.colorMode(p.HSB);

      for (let i = 0; i < steps; i++) {
        let char = lString[i];
        //p.stroke(i % 255, 100, 100);
        p.stroke(0, 0, 0);
        switch (char) {
          case "F":
            p.line(0, 0, length, 0);
            p.translate(length, 0);
            break;
          case "f":
            p.translate(length, 0);
            break;
          case "+":
            p.rotate(angle)
            break;
          case "-":
            p.rotate(-angle)
            break;
          default:
            console.log(char + " isn't turtle command");
        }
      }
      p.colorMode(p.RGB);
      p.noLoop();
      p.pop();
    };
  };

  render = () => {
    return (<div ref={this.containerRef} />)
  }

}

