import LSystem from "@bvk/lsystem";
import React from "react"
import { GFXProps } from "../utils";
import LSImageViewer2D from "./LSImageViewer2D";
import LSImageViewer3D from "./LSImageViewer3D";
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
        <LSImageViewer2D key="gfx-viewer" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps} />        
        <LSImageViewer3D key="gfx-3d-viewer" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps}/>
        <div key="text-viewer" className="black-border" style={{width: "600px", height: "600px"}} > {LSTextViewer(this.props.LSystem)} </div>
      </div>
    )
  }
}

