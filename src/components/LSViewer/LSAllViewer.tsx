import LSystem from "@bvk/lsystem";
import React from "react";
import { completeGfxProps, GFXProps } from "../utils";
import LSImageViewer from "./LSImageViewer";
import LSTextViewer from "./LSTextViewer";

/* LSViewer.ts
 * This class shows a given LSystem and GFXProps (through Props) in every renderer
 * It is used primarily by LSEditor.
 * */
interface myProps {
  LSystem: LSystem | undefined;
  gfxProps?: GFXProps;
}
export default class LSAllViewer extends React.Component<myProps> {
  render() {
    return this.props.LSystem ? (
      <div className="canvas-border stack border">
        <LSImageViewer key="image-viewer" lSystem={this.props.LSystem} gfxProps={this.props.gfxProps} />
        <div key="text-viewer" className="black-border" style={{ width: "600px", height: "600px" }}>
          {LSTextViewer(this.props.LSystem)}
        </div>
      </div>
    ) : (
      "No L-System activated yet"
    );
  }
}
