import React from "react";
import LSystem from "@bvk/lsystem";
import {GFXProps } from "./utils";
import { LSEditor } from "./LSEditor/LSEditor";
import { LSViewer } from "./LSViewer";


/* LSEditor.ts
* This class is a combination of an LSCustomizer and an LSViewer
* It manages updates from the customizer, and mantains LS/GFXProps to pass into the viewer.
* */
interface LSEditorState {
  LSystem: LSystem | undefined,
  gfxProps?: GFXProps
  
}
interface LSEditorProps {
  initCode?: string
  initGFXProps?: GFXProps
  saveToLocalStorage?: string
}
export default class LSEditAndView extends React.Component<LSEditorProps, LSEditorState> {
  viewerContainer : HTMLDivElement | null = null;
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
        <div className="side-by-side" style={{ height: "100%", maxHeight: "100%" }}>
          <LSEditor
            onLSReset={this.onLSReset}
            onLSIterated={this.onLSIterated}
            onGFXPropsUpdate={this.onGFXPropsUpdated}
            initCode={this.props.initCode}
            initGFXProps={this.props.initGFXProps}
            key={this.props.initCode || "default-editor"}
            saveToLocalStorage={this.props.saveToLocalStorage}
            className="border-right"
          />
          {this.state.LSystem ? (
            <LSViewer
              key="image-viewer"
              lSystem={this.state.LSystem}
              gfxProps={this.state.gfxProps}
              autoResize
              style={{flex: "0 1", flexBasis: "100%", position: "relative"}} 
              className="hide-overflow"
            />
          ) : (
            <div>No-LSystem yet</div>
          )}
        </div>
      );
    }
}

