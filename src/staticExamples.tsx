import React from "react";
import P5Draw from "./P5Draw";
import lSystem from "@bvk/lsystem";
import { parseAxiom, parseProductions } from "@bvk/lsystem";

interface LExample {
  name: string;
  axiom: string;
  productions: string[];
  angle: number;
  length: number;
  iterations: number;
  center?: number[]
}

export default function staticExamples() {

  const examples: LExample[] = [
    {
      name: "Koch Curve",
      axiom: "F", productions: [" F:F+F--F+F"],
      angle: Math.PI / 3, iterations: 5, length: 0.003,
      center: [0.1, 0.4]
    },
    {
      name: "Koch Island",
      axiom: "F-F-F-F", productions: [" F:F-F+F+FF-F-F+F"],
      angle: Math.PI / 2, iterations: 4, length: 0.0021, center: [0.25, 0.75]
    }
  ]
  function drawExamples() {
    let examplesDOM: JSX.Element[] = [];
    examples.forEach((example) => {
      let exampleInfo = (<div> {example.name} {example.axiom} {example.productions} {example.angle} {example.iterations} {example.length}</div>)
      let lS = new lSystem(parseAxiom(example.axiom), parseProductions(example.productions), example.iterations);
      let finalString = lS.iterate();
      let examplePreview =
        (<P5Draw commandString={finalString}
          length={example.length} angle={example.angle} center={example.center} />)

      let exampleOutput = (
        <div className='small'> {finalString} </div>
      )
      examplesDOM.push(
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {exampleInfo}
          {examplePreview}
          {exampleOutput}
        </div>)
    });
    return (<div style={{ display: "flex", flexDirection: "row", gap: "12px" }}> {examplesDOM} </div>)
  }
  return drawExamples()
}
