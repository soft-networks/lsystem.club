import P5Draw from "./P5Draw";
import LSystem, { Axiom } from "@bvk/lsystem";


interface LExample {
  name: string;
  axiom: string;
  productions: string[];
  angle: number;
  length: number;
  iterations: number;
  center?: number[]
  strokeWeight?: number
}

export default function staticExamples() {

  const examples: LExample[] = [
    {
      name: "Koch Curve",
      axiom: "F", productions: [" F:F+F--F+F"],
      angle: 60, iterations: 5, length: 0.003,
      center: [-0.4, -0.1]
    },
    {
      name: "Koch Island",
      axiom: "F-F-F-F", productions: [" F:F-F+F+FF-F-F+F"],
      angle: 90, iterations: 4, length: 0.0021, center: [-0.25, 0.25], strokeWeight: 0.3
    },
    {
      name: "Simple tree",
      axiom: `-(90)FA(25)`,
      productions: ["A(x): F[+(x)FA(0.9*x)][-(x)FA(0.9*x)]"],
      angle: 22.5, iterations: 5, length: 0.07, center: [0, 0.4]
    }, {
      name: "Plants with flowers",
      axiom: `-(90)A(8)`,
      productions: ["A(x){x>1}:F[-B][+B]A(x-1)", "A(x){x<=1}: BE", "B: FF"],
      angle: 30, iterations: 10, length: 0.05, center: [0, 0.4]
    }
  ]
  function drawExamples() {
    let examplesDOM: JSX.Element[] = [];
    examples.forEach((example) => {
      let lS = new LSystem(example.axiom, example.productions, example.iterations);
      let output: Axiom = lS.getIterationAsObject();

      let egGraphic = (
        < div style={{ width: 500, height: 500, backgroundColor: "rgb(250,250,250)" }}>
          <P5Draw commandString={output}
            length={example.length} angle={example.angle}
            center={example.center} strokeWeight={example.strokeWeight}
            width={500} height={500} />
        </div >)

      let egInfo = (
        <div>
          <span className="bold">{example.name} </span><br />
          Axiom: {example.axiom} <br />
          Productions : {example.productions.reduce((str, p) => (str + p + "  ,"), "")} <br />
          Iterations: {example.iterations}, Angle: {example.angle}, Length: {example.length}
        </div>)
      let egOutput = (
        <div className='small' style={{ height: "40ch", overflowY: "scroll" }}>
          <span className="bold"> LSystem output: <br /> </span>
          {lS.getIterationAsString()}
        </div>
      )
      examplesDOM.push(
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderRight: "1px solid gray", paddingRight: "12px" }}>
          {egInfo}
          {egGraphic}
          {egOutput}
        </div>)
    });
    return (<div style={{ display: "flex", flexDirection: "row", gap: "12px" }}> {examplesDOM} </div>)
  }
  return drawExamples()
}
