import LSystem from "@bvk/lsystem";
import React from "react"
import P5Turtle from "./LSDraw/P5Turtle";
import P5Turtle3D from "./LSDraw/P5Turtle3D";
import P5TurtlePixel from "./LSDraw/P5TurtlePixel";
import {GFXProps} from "./utils"

/* LSViewer.ts
* This class shows a given LSystem and GFXProps (through Props) in every renderer
* It is used primarily by LSEditor.
* */
interface myProps {
  LSystem: LSystem | undefined;
  gfxProps?: GFXProps
}
export default class LSViewer extends React.Component<myProps>{
  
  render() {
    return (
      <div className="canvas-border stack border"> 
        <P5Turtle key="gfx-viewer" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps} />        
        {/* <P5Turtle3D key="gfx-3d-viewer" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps}/> */}
        {/* <P5TurtlePixel key="gfx-pixel-view" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps}/> */}
        <div key="text-viewer" className="black-border" style={{width: "600px", height: "600px"}} > {LSText(this.props.LSystem)} </div>
      </div>
    )
  }
}

export function LSText(LSystem: LSystem | undefined) {
  if (!LSystem) return "LSystem doesnt exist"
  let text = LSystem.getAllIterationsAsString();
  let textDivs = text.map((val, index) => (
    <li>  {val}  </li>
  ));
  return <ol style={{width: "100%", height: "100%", overflow: "scroll"}}> {textDivs} </ol>
}