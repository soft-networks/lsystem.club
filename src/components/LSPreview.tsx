import LSystem from "@bvk/lsystem";
import React from "react";
import { Link } from "react-router-dom";
import P5Turtle from "./P5Turtle";
import { encodeParams, GFXProps } from "./utils";
import VizSensor from "react-visibility-sensor"

interface LSPreviewProps {
  axiomText: string,
  productionsText: string[],
  iterations: number,
  gfxprops?: GFXProps
}
interface LSPreviewState {
  currentLS: LSystem | undefined,
  iterations: number,
  hasBeenVisible: boolean
}
export class LSPreview extends React.Component<LSPreviewProps, LSPreviewState>{
  state: LSPreviewState = {
    currentLS: undefined,
    iterations: this.props.iterations,
    hasBeenVisible: false
  }
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNum = parseFloat(e.target.value);
    if (this.state.currentLS) {
      this.state.currentLS.setIterations(newNum);
      this.setState({ currentLS: this.state.currentLS, iterations: newNum });
    } else {
      this.setState({iterations: newNum});
    }
  }
  createLS = (isVisible:boolean) => {
    if (isVisible && this.state.currentLS === undefined) {
      console.log("Creating LSystem")
      let ls = new LSystem(this.props.axiomText, this.props.productionsText, this.props.iterations)
      this.setState({currentLS: ls, hasBeenVisible: true});
    }
  }
  render = () => {
    return (
      <VizSensor onChange={this.createLS} partialVisibility={true}>
          <div className={`side-by-side ${this.state.hasBeenVisible === false ? '' : 'become-visible'}`}  >
          <div>
            <div> axiom {this.props.axiomText} and productions: {this.props.productionsText} </div>
            <div>
              <label>
                iterations: {this.state.iterations}
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
        </div>
      </VizSensor>)
  }
}