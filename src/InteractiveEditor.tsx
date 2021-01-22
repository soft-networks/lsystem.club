import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import LSystem from "@bvk/lsystem";
import P5Turtle from "./P5Turtle";
import LSCustomizer from "./LSCustomizer";
import { decodeParams, flattenText, GFXProps } from "./utils"
import { RouteComponentProps } from "react-router-dom";

interface InteractiveCreatorState {
  currentlyDrawing: LSystem | undefined,
  axiomOverride: string,
  productionOverrides: string[],
  gfxProps?: GFXProps,
  pasteOpen: boolean;
}
interface PathParams {
  LSStr: string
}
export default class InteractiveEditor extends React.Component<RouteComponentProps<PathParams>, InteractiveCreatorState> {
  copyText: string = "";
  initGfxProps: GFXProps | undefined; //TODO: This is messy, and the solution is to "lift" the param -> Customizer + Renderer conversion into its own thingy...
  state: InteractiveCreatorState = {
    currentlyDrawing: new LSystem("A", ["A:FA"], 2),
    axiomOverride: "A",
    productionOverrides: ["A:FA"],
    pasteOpen: false
  }
  componentDidMount() {
    let { axiom, productions, gfxProps } = decodeParams(this.props.location.search);
    let newState = this.state;
    if (axiom) newState.axiomOverride = axiom;
    if (productions) newState.productionOverrides = productions;
    if (gfxProps) {
      newState.gfxProps = gfxProps;
      this.initGfxProps = gfxProps;
    }
    this.setState(newState)
  }
  LSIterated = (LS: LSystem) => {
    this.setState({ currentlyDrawing: LS })
  }
  LSReset = (LS: LSystem, axString: string, productionString: string[]) => {
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
          onGFXPropsUpdate={(newprops) => this.setState({ gfxProps: newprops })}
          initAxiom={this.state.axiomOverride}
          initProductions={this.state.productionOverrides}
          initGFXProps={this.initGfxProps}
          key={flattenText([this.state.axiomOverride, ...this.state.productionOverrides], "-")}
          initIterations={2}
        />
        <P5Turtle LSystem={this.state.currentlyDrawing} GFXProps={this.state.gfxProps} />
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

