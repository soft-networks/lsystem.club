import React from "react"
import lsystem, { Axiom, parseAxiom, Production } from "@bvk/lsystem"
import { axiomToStr } from "@bvk/lsystem/dist/parser";
import LSystem from "@bvk/lsystem";
import P5Draw from "./P5Draw";
import LSCustomizer from "./LSCustomizer";


interface InteractiveCreatorState {
  currentlyDrawing: Axiom | undefined
}
export default class InteractiveCreator extends React.Component<{}, InteractiveCreatorState> {
  state = {
    currentlyDrawing: undefined
  }
  LSIterated = (LS: LSystem) => {
    console.log("LS Iterated");
    this.setState({ currentlyDrawing: LS.getIterationAsObject() })
  }
  LSReset = (LS: LSystem) => {
    console.log("LS Reset");
    this.setState({ currentlyDrawing: LS.getIterationAsObject() })
  }

  render() {
    return (
      <div>
        <LSCustomizer
          onLSIterated={this.LSIterated}
          onLSReset={this.LSReset}
        />
        <P5Draw commandString={this.state.currentlyDrawing} />
      </div>
    )
  }
}