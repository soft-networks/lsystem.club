import LSystem from "@bvk/lsystem";
import React from "react";
import { Link } from "react-router-dom";
import { encodeParams, GFXProps, LSProps } from "./utils";
import VizSensor from "react-visibility-sensor";
import { createLSInWorker } from "./worker";
import {LSImageViewer2D, LSImageViewer3D, LSTextViewer} from "./LSViewer";

interface LSPreviewProps {
  LSProps: LSProps;
  gfxProps?: GFXProps;
  name?: string
}
interface LSPreviewState {
  currentLS: LSystem | undefined;
  iterations: number;
  hasBeenVisible: boolean;
}

/* LSViewer.ts
* This class is a simple class to view an LSystem in one or more renderers.
* The LSystem cannot be customizer, *but* it can be iterated on. The iterating and updating is all handled here.
* TODO: We could simplify this as a sub-case of the LSEditor component, but we leave it as is for clarity for now :) 
* */
export class LSPreview extends React.Component<LSPreviewProps, LSPreviewState> {
  state: LSPreviewState = {
    currentLS: undefined,
    iterations: this.props.LSProps.iterations,
    hasBeenVisible: false,
  };
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNum = parseFloat(e.target.value);
    if (this.state.currentLS) {
      this.state.currentLS.setIterations(newNum);
      //TODO: Move to worker :)
      this.setState({ currentLS: this.state.currentLS, iterations: newNum });
    } else {
      this.setState({ iterations: newNum });
    }
  };
  createLS = (isVisible: boolean) => {
    if (isVisible && this.state.currentLS === undefined) {
      console.log("Starting LS creating...")
      createLSInWorker(this.props.LSProps).then((ls) => {
        this.setState({ currentLS: ls, hasBeenVisible: true });
        console.log("LS Creating stopped", ls);  
      });
    }
  };
  refreshLS = () => {
    let ls = new LSystem(
      this.props.LSProps.axiom,
      this.props.LSProps.productions,
      this.props.LSProps.iterations
    );
    this.setState({ currentLS: ls });
  };
  getRenderers = () => {
    if (!this.props.gfxProps || !this.props.gfxProps.renderType) {
      return [<LSImageViewer2D LSystem={this.state.currentLS} GFXProps={this.props.gfxProps}/>]
    }
    let renderers = [];
    if(this.props.gfxProps.renderType.includes("2d")) {
      renderers.push( <LSImageViewer2D LSystem={this.state.currentLS} GFXProps={this.props.gfxProps}/>)
    } 
    if (this.props.gfxProps.renderType.includes("3d")) {
      renderers.push(<LSImageViewer3D  LSystem={this.state.currentLS} GFXProps={this.props.gfxProps}/>);
    }
    if (this.props.gfxProps.renderType.includes("text")) {
      renderers.push(LSTextViewer(this.state.currentLS));
    }
    return renderers;
  }
  render = () => {
    return (
      <VizSensor onChange={this.createLS} partialVisibility={true}>
        <div
          className={`side-by-side ${
            this.state.hasBeenVisible === false ? "" : "become-visible"
          }`}
        >
          <div className="stack small">
            <div>
              <em> {this.props.name} </em>
              <ul>
                <li> {this.props.LSProps.axiom} </li>
                {this.props.LSProps.productions.map((pT: string) => (
                  <li> {pT}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="horizontal-stack">
                <div className="clickable">
                  <Link
                    to={`/edit${encodeParams(
                      this.props.LSProps,
                      this.props.gfxProps
                    )}`}
                  >
                    edit
                  </Link>
                </div>
                <div className="clickable" onClick={this.refreshLS}>
                  refresh
                </div>
              </div>
            </div>
            <div>
              <label>iterations: {this.state.iterations}</label>
              <input
                type="number"
                value={this.state.iterations}
                onChange={this.updateIterations}
                min={0}
                max={this.props.LSProps.iterations}
              />
            </div>
          </div>
          <div className="canvas-border">{this.getRenderers()}</div>
        </div>
      </VizSensor>
    );
  };
}
