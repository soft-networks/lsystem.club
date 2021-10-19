import LSystem from "@bvk/lsystem";
import React from "react";
import { Link } from "react-router-dom";
import { codeToProps, encodeCodeParams, GFXProps, LSProps } from "../lib/utils";
import VizSensor from "react-visibility-sensor";
import { createLSInWorker } from "../lib/worker";
import { LSViewer } from "./LSViewer";
import { syntaxHighlight } from "./LSEditor/codeSyntax";
import RangeSlider from "./ui/RangeSlider";

interface LSPreviewProps {
  code: string;
  gfxProps?: GFXProps;
  name?: string;
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
  canvasContainer: HTMLDivElement | null = null;
  state: LSPreviewState = {
    currentLS: undefined,
    iterations: this.props.gfxProps && this.props.gfxProps.iterations ? this.props.gfxProps.iterations : 1,
    hasBeenVisible: false,
  };

  updateIterations = (newNum: number) => {
    //TODO: Move to worker :)
    if (this.state.currentLS) {
      this.state.currentLS.setIterations(newNum);
      this.setState({ currentLS: this.state.currentLS, iterations: newNum });
    } else {
      this.setState({ iterations: newNum });
    }
  };
  createLS = (isVisible: boolean) => {
    if (isVisible && this.state.currentLS === undefined) {
      console.log("🐸🐸🐸🐸 Starting LS creating...", this.props.gfxProps);
      const lsProps: LSProps = { ...codeToProps(this.props.code), iterations: this.state.iterations };
      createLSInWorker(lsProps)
        .then((ls) => {
          // console.log("🐸🐸🐸🐸 WORKER FINISHED, NOW WE'RE SETTING STATE", ls);
          this.setState({ currentLS: ls, hasBeenVisible: true });
          // console.log("🐸🐸🐸🐸 LS Creating stopped", ls);
        })
        .catch((e) => {
          this.setState({ currentLS: undefined, hasBeenVisible: true });
        });
    }
  };
  getRenderers = () => {
    if (this.state.currentLS === undefined || this.state.hasBeenVisible === false) {
      return "NO LS YET";
    }
    return  
  };
  render = () => {
    return (
      <VizSensor onChange={this.createLS} partialVisibility={true}>
        <div className="stack no-gap">
          <div
            className={`side-by-side  hide-overflow border ${
              this.state.hasBeenVisible === false ? "" : "become-visible"
            }`}
          >
            <div className="edit-surface-light-tone flex-1 padded:vertical padded:right padded:left:smallest border-right">
              <pre className=" wrap-text stack smallest code-text code-line-offset">
                {syntaxHighlight(this.props.code)}
              </pre>
            </div>
            <div>
              {this.state.currentLS ? (
                <LSViewer
                  lSystem={this.state.currentLS}
                  gfxProps={this.props.gfxProps}
                  key="image-viewer-all"
                  autoResize
                  hideControls
                  style={{ position: "relative", width: "100%", height: 340 }}
                />
              ) : (
                "No L-System yet"
              )}{" "}
            </div>
          </div>
          <div className="horizontal-stack no-gap border-left">
            <Link to={`/edit${encodeCodeParams(this.props.code, this.props.gfxProps)}`}>
              <span className="edit-surface clickable  padded border-bottom border-right">edit</span>
            </Link>
            <div className="edit-surface padded border-bottom border-right">
              <div style={{ width: "12ch" }}> Iterations: {this.state.iterations} </div>
              <div style={{ width: "10ch", marginTop: "1ch" }}>
                <RangeSlider
                  currentValue={this.state.iterations}
                  onChange={this.updateIterations}
                  min={0}
                  max={this.props.gfxProps && this.props.gfxProps.iterations ? this.props.gfxProps.iterations : 1}
                />
              </div>
            </div>
          </div>
        </div>
      </VizSensor>
    );
  };
}
