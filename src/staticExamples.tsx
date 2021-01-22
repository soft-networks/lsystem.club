
import LSystem from "@bvk/lsystem";
import { LSPreview } from "./LSPreview";
import { flattenText, GFXProps } from "./utils"


interface LExample {
  name: string;
  axiom: string;
  productions: string[]
  iterations?: number;
  gfxprops?: GFXProps
}

export default function staticExamples() {

  const examples: LExample[] = [
    {
      name: "Koch Curve",
      axiom: "F", productions: [" F:F+F--F+F"], iterations: 5,
      gfxprops: { angle: 60, length: 0.003, center: [-0.4, -0.1] }
    },
    {
      name: "Koch Island",
      axiom: "F-F-F-F", productions: [" F:F-F+F+FF-F-F+F"], iterations: 2,
      gfxprops: { angle: 90, length: 0.0021, center: [-0.25, 0.25], strokeWeight: 0.3 }
    },
    {
      name: "Spiral",
      axiom: "A", productions: ["A:FB + A", "B:[-(90)FF]"], iterations: 4,
      gfxprops: { angle: 5 }
    },
    {
      name: "Simple tree",
      axiom: `-(90)FA(25)`,
      productions: ["A(x): F[+(x)FA(0.9*x)][-(x)FA(0.9*x)]"], iterations: 5,
      gfxprops: { angle: 22.5, length: 0.07, center: [0, 0.4] }
    }, {
      name: "Plants with flowers",
      axiom: `-(90)A(8)`,
      productions: ["A(x){x>1}:F[-B][+B]A(x-1)", "A(x){x<=1}: BE", "B: FF"], iterations: 10,
      gfxprops: { angle: 30, length: 0.05, center: [0, 0.4] }
    }
  ]
  function drawExamples() {
    let examplesDOM: JSX.Element[] = [];
    examples.forEach((example) => {
      let lS = new LSystem(example.axiom, example.productions, example.iterations);
      let preview = (<LSPreview
        LSystem={lS}
        axiomText={example.axiom}
        productionsText={example.productions}
        gfxprops={example.gfxprops}
      />);
      examplesDOM.push(preview);
    });
    return (<div style={{ display: "flex", flexDirection: "row", gap: "12px" }}> {examplesDOM} </div>)
  }
  return drawExamples()
}
