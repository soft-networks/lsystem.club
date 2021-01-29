import LSystem from "@bvk/lsystem";
import React from "react";
import { Link } from "react-router-dom";
import P5Turtle from "./P5Turtle";
import { encodeParams, flattenText, GFXProps } from "./utils";
import VizSensor from "react-visibility-sensor";
import P5Turtle3D from "./P5Turtle3D";
import { LSText } from "./LSViewer";

interface LSPreviewProps {
  axiomText: string;
  productionsText: string[];
  iterations: number;
  gfxprops?: GFXProps;
  renderType?: "2d" | "str" | "3d",
  name?: string
}
interface LSPreviewState {
  currentLS: LSystem | undefined;
  iterations: number;
  hasBeenVisible: boolean;
}
export class LSPreview extends React.Component<LSPreviewProps, LSPreviewState> {
  state: LSPreviewState = {
    currentLS: undefined,
    iterations: this.props.iterations,
    hasBeenVisible: false,
  };
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNum = parseFloat(e.target.value);
    if (this.state.currentLS) {
      this.state.currentLS.setIterations(newNum);
      this.setState({ currentLS: this.state.currentLS, iterations: newNum });
    } else {
      this.setState({ iterations: newNum });
    }
  };
  createLS = (isVisible: boolean) => {
    if (isVisible && this.state.currentLS === undefined) {
      let ls = new LSystem(
        this.props.axiomText,
        this.props.productionsText,
        this.props.iterations
      );
      this.setState({ currentLS: ls, hasBeenVisible: true });
    }
  };
  refreshLS = () => {
    let ls = new LSystem(
      this.props.axiomText,
      this.props.productionsText,
      this.props.iterations
    );
    this.setState({ currentLS: ls });
  };
  getRenderer = () => {
    if (!this.props.renderType || this.props.renderType == "2d") {
      return     (<P5Turtle
        LSystem={this.state.currentLS}
        GFXProps={this.props.gfxprops}
        />)
    } 
    if (this.props.renderType == "3d") {
      return (<P5Turtle3D 
      LSystem={this.state.currentLS}
      GFXProps={this.props.gfxprops}
      />)
    } else {
      return LSText(this.state.currentLS)
    }
  }
  render = () => {
    return (
      <VizSensor onChange={this.createLS} partialVisibility={true}>
        <div
          className={`side-by-side ${
            this.state.hasBeenVisible === false ? "" : "become-visible"
          }`}
        >
          <div>
            <div>
              Lystem: {this.props.name} <br />
              <ul>
                <li> {this.props.axiomText} </li>{" "}
                {this.props.productionsText.map((pT) => (
                  <li> {pT}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="horizontal-stack">
                <div className="clickable">
                  <Link
                    to={`/edit${encodeParams(
                      this.props.axiomText,
                      this.props.productionsText,
                      this.props.gfxprops
                    )}`}
                  >
                    edit
                  </Link>
                </div>
                <div className="clickable" onClick={this.refreshLS}>
                  refresh
                </div>
              </div>
              <label>iterations: {this.state.iterations}</label>
              <input
                type="number"
                value={this.state.iterations}
                onChange={this.updateIterations}
                min={0}
                max={this.props.iterations}
              />
            </div>
          </div>
          {this.getRenderer()}
        </div>
      </VizSensor>
    );
  };
}
