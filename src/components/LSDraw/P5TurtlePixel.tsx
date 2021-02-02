
import { ParamsValue } from "@bvk/lsystem";
import P5Turtle from "./P5Turtle";

const pixelWidth = 5;


export default class P5TurtlePixel extends P5Turtle {
  canvasType : "webgl" | "p2d" = "p2d";

  rotationStack : number[] = [0];
  currentAngle: number = 0;

  private cameraPos: number[] | undefined;
  private cameraNum = 0;

  
  currentAsRadians = () => {
    return this.currentAngle * (Math.PI/180);
  }
  rotateToUp = () => {
    this.currentAngle = 0;
    this.rotationStack = [];
    let p = this.p5Context;
    this.currentAngle = -90;
  }
  moveToCenter = () => {
    //Do nothing, were already there
    let p = this.p5Context;
    if (p) p.translate(p.width / 2, p.height / 2);
  }
  
  drawChar = (char: string, l: number, a: number, params: ParamsValue | undefined) => {
    let p = this.p5Context;
    if (!p) return
    switch (char) {
      case "F":
        let numPixels = Math.ceil(l  / pixelWidth);
        let eachAngle = this.currentAsRadians()
        console.log(eachAngle);
        for (let i=0; i< numPixels ; i++){
          p.translate(pixelWidth * Math.cos(eachAngle),  pixelWidth * Math.sin(eachAngle));
          p.rect(0,0, pixelWidth, pixelWidth);
          
        }
        break;
      case "f":
        p.translate(0, l * Math.sin(this.currentAsRadians()));
        break;
      case "[":
        p.push();
        this.rotationStack.push(this.currentAngle);
        this.currentAngle = 0;
        break;
      case "]":
        p.pop();
        let current = this.rotationStack.pop();
        if (current) {
          console.log("****** Resetting current");
          this.currentAngle = current;
          console.log(this.currentAngle)
        }
        break;
      case "+":
        this.currentAngle += a;
        break;
      case "-":
        this.currentAngle -= a;
        break;
      case "E":
        if (params && params[1]) {
          p.fill(parseFloat(params[1] as string), 100,100 );
        }
        p.ellipse(0, 0, l, l);
        break;
      case "!":
        //p.strokeWeight(l)
        break;
      case "~":
        //p.rotate(Math.random() * a);
        this.currentAngle += (Math.random() * a);
        break;
      case "#":
        p.stroke(l, 100, 100);
        p.fill(l,100,100);
        break;
      default:
        //console.log(char + " isn't turtle command");
        break;
      }
    }

}
