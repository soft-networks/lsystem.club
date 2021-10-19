//GFXPropsCustomizer.js
import {  GFXProps, GFXPropsComplete } from "../utils";
import React from  "react";
import RangeSlider from "../ui/RangeSlider";

interface GFXPropsCustomizerState {
  length: number,
  angle: number,
  iterations: string
}
export class GFXPropsCustomizer extends React.Component<
  { gfxProps: GFXPropsComplete; GFXPropsUpdated(gfxProps: GFXProps): void; className?: string },
  GFXPropsCustomizerState
> {
  state = {
    length: this.props.gfxProps.length,
    angle: this.props.gfxProps.angle,
    iterations: "" + this.props.gfxProps.iterations,
  };
  updateAngle = (newAngle: number) => {
    const newState = { ...this.state, ...{ angle: newAngle } };
    this.setState(newState);
    this.props.GFXPropsUpdated({ angle: newAngle || 1 });
  };
  updateLength = (newLength: number) => {
    const newState = { ...this.state, ...{ length: newLength } };
    this.setState(newState);
    this.props.GFXPropsUpdated({ length: newLength || 0.1 });
  };
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newIterations = e.target.value;
    const newState = { ...this.state, ...{ iterations: newIterations } };
    this.setState(newState);
    this.props.GFXPropsUpdated({ iterations: parseInt(newIterations) || 1 });
  };
  getControls = () => {
    let angleControl = (
      <div key="customize-angle" className="horizontal-stack">
        <label> Angle: {this.state.angle}° </label>
        <RangeSlider min={0} max={360} onChange={this.updateAngle} currentValue={this.state.angle} key={"angle-slider"}/>
      </div>
    );
    let lengthControl = (
      <div key="customize-length" className="horizontal-stack">
        <label> Length: {this.state.length}% </label>
        <RangeSlider min={0.1} max={100} onChange={this.updateLength} currentValue={this.state.length} key={"length-slider"}/>
      </div>
    );
    let iterationController = (
      <div key="iteration-control" className="horizontal-stack">
        <label> Max iterations </label>
        <input type="number" onChange={this.updateIterations} value={this.state.iterations}  />
      </div>
    );
    return [iterationController, angleControl, lengthControl];
  };
  render = () => {
    return <div className={this.props.className}> {this.getControls()} </div>
  };
}