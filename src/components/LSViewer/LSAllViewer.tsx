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
        <LSImageViewer key="image-viewer" lSystem={this.props.LSystem} gfxProps={this.props.gfxProps} />
    ) : (
      "No L-System activated yet"
    );
  }
}
