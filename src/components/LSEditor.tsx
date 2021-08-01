import React from "react";
import LSystem from "@bvk/lsystem";
import LSCustomizer from "./LSCustomizer";
import { GFXProps, LSProps } from "./utils";
import LSAllViewer from "./LSViewer";


/* LSEditor.ts
* This class is a combination of an LSCustomizer and an LSViewer
* It manages updates from the customizer, and mantains LS/GFXProps to pass into the viewer.
* */
interface LSEditorState {
  LSystem: LSystem | undefined,
  gfxProps?: GFXProps
}
interface LSEditorProps {
  initLSProps: LSProps
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
      <div className="side-by-side">
          <LSCustomizer
          onLSIterated={this.onLSIterated}
          onLSReset={this.onLSReset}
          onGFXPropsUpdate={this.onGFXPropsUpdated}
          initLSProps={this.props.initLSProps}
          initGFXProps={this.props.initGFXProps}
          key="LSCustomizer"
          />
          <LSAllViewer LSystem={this.state.LSystem} gfxProps={this.state.gfxProps}/>
      </div >
      )
    }
}

