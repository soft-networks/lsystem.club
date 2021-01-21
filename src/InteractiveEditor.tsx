import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import LSystem from "@bvk/lsystem";
import P5Turtle from "./P5Turtle";
import LSCustomizer from "./LSCustomizer";
import { flattenText } from "./utils"


interface InteractiveCreatorState {
  currentlyDrawing: LSystem | undefined,
  pasteOverrideText: string[],
  pasteOpen: boolean;
}
export default class InteractiveEditor extends React.Component<{}, InteractiveCreatorState> {
  copyText: string = "";
  state = {
    currentlyDrawing: undefined,
    pasteOverrideText: ["A", "A:FA"],
    pasteOpen: false
  }
  LSIterated = (LS: LSystem) => {
    console.log("LS Iterated");
    console.log(LS.getIterationAsString());
    this.setState({ currentlyDrawing: LS })
  }
  LSReset = (LS: LSystem, axString: string, productionString: string[]) => {
    console.log("LS Reset");
    console.log(LS.getIterationAsString());
    this.setState({ currentlyDrawing: LS });
    this.copyText = flattenText([axString, ...productionString], "\n");
  }
  render() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
          <div>
            <CopyToClipboard text={this.copyText} onCopy={() => alert("Copied!")}>
              <span className="clickable"> copy </span>
            </CopyToClipboard>
          </div>
          <div>
            <span className="clickable"
              onClick={(e) => this.setState({ pasteOpen: !this.state.pasteOpen })}>
              override {this.state.pasteOpen ? "-" : "+"}
            </span>
            {this.state.pasteOpen ?
              <TextInput onSubmit={(t) => this.setState({ pasteOverrideText: t.split("\n").filter(r => r != ""), pasteOpen: false })} />
              : ""}
          </div>
        </div>
        <LSCustomizer
          onLSIterated={this.LSIterated}
          onLSReset={this.LSReset}
          initAxiom={this.state.pasteOverrideText[0]}
          initProductions={this.state.pasteOverrideText.slice(1)}
          key={flattenText(this.state.pasteOverrideText, "-")}
          initIterations={5}
        />
        <P5Turtle LSystem={this.state.currentlyDrawing} />
      </div >
    )
  }
}

class TextInput extends React.Component<{ onSubmit(text: string): void }, { text: string }> {
  state = {
    text: ""
  }
  render() {
    return (
      <div>
        <textarea
          onChange={(e) => { this.setState({ text: e.target.value }) }}
          value={this.state.text} />
        <span className="clickable" onClick={() => this.props.onSubmit(this.state.text)}> submit </span>
      </div >
    )
  }
}

