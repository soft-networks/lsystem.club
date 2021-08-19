import p5 from "p5";
import { ParamsValue } from "@bvk/lsystem";

export const draw2DChar = (p : p5, char: string, l: number, a: number, params: ParamsValue | undefined) => {
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
      console.log(char + " isn't turtle command");
  }
}

export const draw3DChar = (p: p5, char: string, l: number, a: number, params: ParamsValue | undefined) => {
  if (!p) return
  switch (char) {
    case "F":
      p.line(0, 0, 0, l);
      p.translate(0, l);
      break;
    case "f":
      p.translate(0, l);
      break;
    case "[":
      p.push();
      break;
    case "]":
      p.pop();
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
      p.rotateY(-a);
      break;
    case "E":
      if (params && params[1]) {
        p.fill(parseFloat(params[1] as string), 100,100 );
      }
      p.ellipse(0, 0, l, l);
      p.noFill();
      break;
    case "!":
      p.strokeWeight(l)
      break;
    case "~":
      p.rotateX(Math.random() * a);
      p.rotateY(Math.random() * a);
      p.rotateZ(Math.random() * a);
      break;
    case "#":
      p.stroke(l, 100, 100);
      break;
    case "M":
      draw3DModel(p, params)
      break;
    default:
      //console.log(char + " isn't turtle command");
      break;
    }
  }

const draw3DModel = (p:p5, params: ParamsValue | undefined) => {
  let scaleValue = params && params[0] ? parseFloat(params[0] as string) : 0.1;
  p.push();
  //p.specularMaterial(255);
  p.scale(scaleValue);
  p.box(100);
  p.pop();
}