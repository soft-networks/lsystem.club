import LSystem, { ParamsValue } from "@bvk/lsystem";
import p5 from "p5";
import LSImageViewer2D from "../../components/LSViewer/LSImageViewer/LSImageViewer2D";
import { CompleteLSExample, completeGfxProps } from "../../lib/utils";


export default function WebPage() {
  <div>todo</div>
}

// const text = ["dog"]

// const defaultText = "";


// function drawText(p: p5, params: ParamsValue | undefined) {
//   let index =  params && params.length == 1 ? parseInt(params[0]  as string) : -1;
//   let textObj = index > -1 ? text[index] : defaultText;
//   p.push();
//   p.noStroke();
//   p.fill(230,100,100);
//   p.textSize(12);
//   p.textStyle()
//   p.text(textObj, 0,0);
//   p.pop();
// }

// const t2 = ["m",
// "y",
// " ",
// "f",
// "a",
// "v",
// "o",
// "r",
// "i",
// "t",
// "e",
// " ",
// "r",
// "e",
// "f",
// "e",
// "r",
// "e",
// "n",
// "c",
// "e",
// "s", ]

// function drawText2(p: p5, params: ParamsValue | undefined) {
//   let index =  params && params.length == 1 ? parseInt(params[0]  as string) : -1;
//   let textObj = index > -1 && index < t2.length ? t2[index] : defaultText;
//   p.push();
//   p.noStroke();
//   p.fill(0,0,0);
//   p.textSize(14);
//   p.textStyle()
//   p.text(textObj, 0,0);
//   p.pop();
// }

// class WebTurtle extends LSImageViewer2D {

//   animationSpeed = 1000;
//   preload = (p:p5) => { 
//     //p.textFont("consolas");
//   }
//   customRules = {
//     "T": drawText,
//     "P": drawText2
//   }

//   render() {
//     return (
//     <div className="full-bleed"  >
//       <div ref={this.containerRef} style={{display: "inline-block", marginLeft: "50%", transform: "translate(-50%, 0)"}}/>
//     </div>)
//   }
// }

