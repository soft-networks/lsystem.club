import LSystem from "@bvk/lsystem";
import React from "react"
import { findAllInRenderedTree } from "react-dom/test-utils";
import P5Turtle from "./P5Turtle";
import P5Turtle3D from "./P5Turtle3D";
import {GFXProps} from "./utils"

interface myProps {
  LSystem: LSystem | undefined;
  gfxProps?: GFXProps
}
export default class LSViewer extends React.Component<myProps>{
  
  render() {
    return (<div> 
      <P5Turtle key="gfx-viewer" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps} />
      <div>
        <P5Turtle3D key="gfx-3d-viewer" LSystem={this.props.LSystem} GFXProps={this.props.gfxProps}/>
      </div>
      <div key="text-viewer"> {LSText(this.props.LSystem)} </div>
      </div>)
  }
}

function LSText(LSystem: LSystem | undefined) {
  if (!LSystem) return "LSystem doesnt exist"
  let text = LSystem.getAllIterationsAsString();
  let textDivs = text.map((val, index) => (
    <li>  {val}  </li>
  ));
  return <ol> {textDivs} </ol>
}