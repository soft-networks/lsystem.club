import InteractiveEditor from './EditorPage';
import { Route } from "react-router-dom"
import LSystem from "@bvk/lsystem";
import { LSPreview } from "../components/LSPreview";
import { GFXProps } from "../components/utils"

export default function Home(): JSX.Element {
  return (
    <div>
      <Route path="/edit" component={InteractiveEditor} />
      <Route exact path="/" render={staticExamples} />
    </div>
  )
}


//staticExamples.js

interface LExample {
  name: string;
  axiom: string;
  productions: string[]
  iterations?: number;
  gfxprops?: GFXProps
}

function staticExamples() {

  const examples: LExample[] = [
    {
      name: "Koch Curve",
      axiom: "F", productions: [" F:F+F--F+F"], iterations: 5,
      gfxprops: { angle: 60, length: 0.003, center: [-0.4, -0.1] }
    },
    {
      name: "Spiral",
      axiom: "A", productions: ["A:FB + A", "B:[-(90)FF]"], iterations:36 ,
      gfxprops: { angle: 5 }
    },
    {
      name: "Beautiful octopus",
      axiom: "A(10,50)", productions: ["A(a,w){w>0}: F @(w) !(w) +(a) C(w) A(a,w-0.5)", "B(b): @(b) F B(b+1)", "C(w): [!(w/2) -B(w)]", "A(a,w){w<0}:X"], iterations: 30
    },
    {
      name: "Plant Gradient",
      axiom: "- [A(5)]", productions: ["A(a): @(a*1.5) FFF I(40) +(rnd(0,10))  A(a+1) E(4)", "I(a): [-(a)B] [+(a)B]", "B:FBE(4)", "B:I(rnd(0,10))"], iterations: 11
    },
    {
      name: "Fern leaf",
      axiom: "-A(0,1)",iterations: 13,
      productions: ["A(d,D){d>0}: A(d-1,D)", "A(d,D){d==0}: F(1)[+(45)A(D,D)][-(45)A(D,D)]F(1)A(0,D)", "F(a): F(a*1.48)"],
      gfxprops: {length: 2, center: [0,0.4]}
    },
    {
      name: "Simple tree",
      axiom: `-(90)A(10)`,
      productions: ["A(x):F[+(x)FA(0.9*x)][-(x)FA(0.9*x)]"],
      iterations: 5,
      gfxprops: { angle: 22.5, length: 0.08, center: [0, 0.4] }
    }, {
      name: "Graphic tree",
      axiom: "-(90)A(25)",
      productions: ["A(x):!(1.5)F(4.1)Y(x)[+(x)E(4.1)A(0.9*x)][-(x)E(4.1)A(0.9*x)]", "F(x):@(10) F(x*1.55)", "!(x){x>=1.5}:!(x*1.44)", "E(x):{5} @(rnd(0,300)) F(x)", "E(x):{1} @(250) E(x)", "Y(x): [-(rnd(-45,45)) A(x)]"],
      iterations: 9, 
      gfxprops: {center: [0, 0.4]}
    },
    {
      name: "Plants with flowers",
      axiom: `-(90)A(8)`,
      productions: ["A(x){x>1}:F[-B][+B]A(x-1)", "A(x){x<=1}: BE", "B: FF"], iterations: 10,
      gfxprops: { angle: 30, length: 0.05, center: [0, 0.4] }
    }
  ]
  function drawExamples() {
    let examplesDOM: JSX.Element[] = [];
    examples.forEach((example, index) => {
      //let lS = new LSystem(example.axiom, example.productions, example.iterations);
      let preview = (<LSPreview
        axiomText={example.axiom}
        productionsText={example.productions}
        iterations={example.iterations || 1}
        gfxprops={example.gfxprops}
        key={"eg" + example.name}
      />);
      examplesDOM.push(preview);
    });
    return (<div style={{ display: "flex", flexDirection: "column", gap: "32px" }}> {examplesDOM} </div>)
  }
  return drawExamples()
}
