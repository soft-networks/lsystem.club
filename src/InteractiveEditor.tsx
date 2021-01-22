import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import LSystem from "@bvk/lsystem";
import P5Turtle from "./P5Turtle";
import LSCustomizer from "./LSCustomizer";
import { decodeParams, flattenText } from "./utils"
import { RouteComponentProps } from "react-router-dom";

interface InteractiveCreatorState {
  currentlyDrawing: LSystem | undefined,
  axiomOverride: string,
  productionOverrides: string[]
  pasteOpen: boolean;
}
interface PathParams {
  LSStr: string
}
export default class InteractiveEditor extends React.Component<RouteComponentProps<PathParams>, InteractiveCreatorState> {
  copyText: string = "";
  state = {
    currentlyDrawing: undefined,
    axiomOverride: "A",
    productionOverrides: ["A:FA"],
    pasteOpen: false
  }
  componentDidMount() {
    console.log("HEYYYYY we're in the location section");
    console.log(this.props.location.search);
    let { axiom, productions } = decodeParams(this.props.location.search);
    let newState = this.state;
    if (axiom) newState.axiomOverride = axiom;
    if (productions) newState.productionOverrides = productions;
    this.setState(newState)
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
  setTextFromPaste = (t: string) => {
    let stringArray = t.split("\n").filter(r => r != "");
    let axiomOverride = stringArray[0];
    let productionOverrides = stringArray.slice(1);
    this.setState({ axiomOverride: axiomOverride, productionOverrides: productionOverrides, pasteOpen: false })
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
            {this.state.pasteOpen &&
              <TextInput onSubmit={this.setTextFromPaste} />}
          </div>
        </div>
        <LSCustomizer
          onLSIterated={this.LSIterated}
          onLSReset={this.LSReset}
          initAxiom={this.state.axiomOverride}
          initProductions={this.state.productionOverrides}
          key={flattenText([this.state.axiomOverride, ...this.state.productionOverrides], "-")}
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

