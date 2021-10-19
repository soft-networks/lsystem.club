import LSystem, { ParamsValue } from "@bvk/lsystem";
import p5 from "p5";
import LSImageViewer2D from "../../components/LSViewer/LSImageViewer/LSImageViewer2D";
import { CompleteLSExample, completeGfxProps } from "../../lib/utils";


const textFlower: CompleteLSExample = {
  name: "textFlower",
  lsProps: {
    axiom: "[S] ",
    productions: [
      "S: A(rnd(5,10))",
      "A(a) {a>=1}: F B(0) B(1) + A(a-1)",
      "B(b) {b==0}: [+(75) F(20) f(10) T(0)]",
      "B(b) {b==1}: [-(75) F(20) f(50) +(180) T(1)]",
      "A(a) {a<1}: FFFF -(120) P(rnd(8,19))",
      "P(p) {p>0}: [F(40) f(10) T(2)] [+(rnd(40,60)) P(p-1)]",
      "P(p) {p==0}: X"
    ],
    iterations: 30,
  },
  gfxProps: {
    length: 40,
    renderType: ["2d"],
    width: 600,
    height: 760,
    angle: 5,
    center: [0,0.4],
  },
};

const text = [{t:"you", s: 16},{t:"thank", s:16}, {t:"☼", s: 18}]
const defaultText = {t: "", s: 12};

export default function textGarden() {
  let ls = new LSystem(textFlower.lsProps.axiom, textFlower.lsProps.productions, textFlower.lsProps.iterations);
  let gfxProps = textFlower.gfxProps
  console.log(ls.getAllIterationsAsString());

  return (<TextTurtle axiom={ls.getIterationAsObject()} gfxProps={completeGfxProps(gfxProps)} />)
}
function drawText(p: p5, params: ParamsValue | undefined) {
  let index =  params && params.length == 1 ? parseInt(params[0]  as string) : -1;
  let textObj = index > -1 ? text[index] : defaultText;
  p.push();
  p.noStroke();
  p.fill(0,0,0);
  p.textSize(textObj.s);
  p.text(textObj.t, 0,0);
  p.pop();
}

class TextTurtle extends LSImageViewer2D {
  xPercent = 1;
  preload = (p:p5) => { 
    p.textFont("helvetica");
  }
  customRules = {
    "T": drawText 
  }
  mouseMove = (e: React.MouseEvent) => {
    let mouseX = e.pageX;
    let mousePercentage = e.pageX / window.innerWidth - 0.5;
    console.log(mousePercentage);
    this.xPercent = mousePercentage;
    this.redraw();
  }
  render() {
    return (
    <div onMouseMove={this.mouseMove} className="full-bleed" style={{backgroundImage: "linear-gradient(white 80%, rgba(140,255,100,0.6))"}} >
      <div ref={this.containerRef} style={{display: "inline-block", marginLeft: "50%", transform: "translate(-50%, 0)"}}/>
    </div>)
  }
}

