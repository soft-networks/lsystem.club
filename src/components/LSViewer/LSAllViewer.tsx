import LSystem from "@bvk/lsystem";
import React from "react"
import { completeGfxProps, GFXProps } from "../utils";
import LSImageViewer2D from "./LSImageViewer2D";
import LSImageViewer3D from "./LSImageViewer3D";
import LSImageViewerBasic from "./LSImageViewerBasic";
import LSImageViewerParent from "./LSImageViewerParent";
import LSTextViewer from "./LSTextViewer"

/* LSViewer.ts
* This class shows a given LSystem and GFXProps (through Props) in every renderer
* It is used primarily by LSEditor.
* */
interface myProps {
  LSystem: LSystem | undefined;
  gfxProps?: GFXProps
}
export default class LSAllViewer extends React.Component<myProps>{
  
  render() {
    return (
      <div className="canvas-border stack border">
        <LSImageViewerBasic
          key="test"
          axiom={this.props.LSystem?.getIterationAsObject()}
          gfxProps={completeGfxProps(this.props.gfxProps)}
        />
        <LSImageViewer2D
          key="gfx-viewer"
          axiom={this.props.LSystem?.getIterationAsObject()}
          gfxProps={completeGfxProps(this.props.gfxProps)}
        />
        <LSImageViewer3D
          key="gfx-3d-viewer"
          axiom={this.props.LSystem?.getIterationAsObject()}
          gfxProps={completeGfxProps(this.props.gfxProps)}
        />
        <div key="text-viewer" className="black-border" style={{ width: "600px", height: "600px" }}>
          {LSTextViewer(this.props.LSystem)}
        </div>
      </div>
    );
  }
}

