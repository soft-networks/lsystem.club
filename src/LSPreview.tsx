import LSystem from "@bvk/lsystem";
import React from "react";
import { Link } from "react-router-dom";
import P5Turtle from "./P5Turtle";
import { encodeParams, GFXProps } from "./utils";

interface LSPreviewProps {
  LSystem: LSystem,
  axiomText: string,
  productionsText: string[],
  gfxprops?: GFXProps
}
interface LSPreviewState {
  currentLS: LSystem,
  iterations: number
}
export class LSPreview extends React.Component<LSPreviewProps, LSPreviewState>{
  state: LSPreviewState = {
    currentLS: this.props.LSystem,
    iterations: this.props.LSystem.iterations
  }
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNum = parseFloat(e.target.value);
    this.state.currentLS.setIterations(newNum);
    this.setState({ currentLS: this.state.currentLS, iterations: newNum });
  }
  render = () => {
    return (
      <div className="side-by-side">
        <div>
          <div> axiom {this.props.axiomText} and productions: {this.props.productionsText} </div>
          <div>
            <label>
              iterations: {this.state.currentLS.iterations}
            </label>
            <input type="number"
              value={this.state.iterations}
              onChange={this.updateIterations}
            />
          </div>
          <div className="clickable">
            <Link to={`/edit${encodeParams(this.props.axiomText, this.props.productionsText, this.props.gfxprops)}`}>
              edit
            </Link>
          </div>
        </div>
        <P5Turtle LSystem={this.state.currentLS} GFXProps={this.props.gfxprops} />
      </div>)
  }

}