import React from "react";
import LSystem from "@bvk/lsystem";
import LSCustomizer from "./LSCustomizer";
import P5Turtle from "./P5Turtle";
import { GFXProps } from "./utils";

interface LSEditorState {
  LSystem: LSystem | undefined,
  gfxProps?: GFXProps
}
interface LSEditorProps {
  initAxiomString: string,
  initProductionsString: string[],
  initGFXProps?: GFXProps
}
export default class LSEditor extends React.Component<LSEditorProps, LSEditorState> {
  state: LSEditorState = {
      LSystem: undefined,
      gfxProps: this.props.initGFXProps || {}
  }
  onLSIterated = (LS: LSystem) => {
      this.setState({ LSystem: LS })
  }
  onLSReset = (LS: LSystem) => {
      this.setState({ LSystem: LS });
  }
  onGFXPropsUpdated = (gfxProps: GFXProps) => {
      this.setState({gfxProps: gfxProps});
  }
  render() {
      return (
      <div>
          <LSCustomizer
          onLSIterated={this.onLSIterated}
          onLSReset={this.onLSReset}
          onGFXPropsUpdate={this.onGFXPropsUpdated}
          initAxiom={this.props.initAxiomString}
          initProductions={this.props.initProductionsString}
          initGFXProps={this.props.initGFXProps}
          key="LSCustomizer"
          initIterations={2}
          />
          <P5Turtle LSystem={this.state.LSystem} GFXProps={this.state.gfxProps} />
      </div >
      )
    }
}

