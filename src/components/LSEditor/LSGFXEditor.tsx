//GFXPropsCustomizer.js
import {  GFXProps, GFXPropsComplete } from "../utils";
import React from  "react";

interface GFXPropsCustomizerState {
  length: string,
  angle: string,
  iterations: string
}
export class GFXPropsCustomizer extends React.Component<
  { gfxProps: GFXPropsComplete; GFXPropsUpdated(gfxProps: GFXProps): void; className?: string },
  GFXPropsCustomizerState
> {
  state = {
    length: "" + this.props.gfxProps.length,
    angle: "" + this.props.gfxProps.angle,
    iterations: "" + this.props.gfxProps.iterations,
  };
  updateAngle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAngle = e.target.value;
    const newState = { ...this.state, ...{ angle: newAngle } };
    this.setState(newState);

    this.props.GFXPropsUpdated({ angle: parseFloat(newAngle) || 1 });
  };
  updateLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newLength = e.target.value;
    const newState = { ...this.state, ...{ length: newLength } };
    this.setState(newState);

    this.props.GFXPropsUpdated({ length: parseFloat(newLength) || 0.1 });
  };
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newIterations = e.target.value;
    const newState = { ...this.state, ...{ iterations: newIterations } };
    this.setState(newState);
    this.props.GFXPropsUpdated({ iterations: parseInt(newIterations) || 1 });
  };
  getControls = () => {
    let angleControl = (
      <div key="customize-angle">
        <label> Angle </label>
        <input value={this.state.angle} onChange={this.updateAngle} type="number" />
      </div>
    );
    let lengthControl = (
      <div key="customize-length">
        <label> Length </label>
        <input value={this.state.length} onChange={this.updateLength} type="number" />
      </div>
    );
    let iterationController = (
      <div key="iteration-control">
        <label> Iterations </label>
        <input type="number" onChange={this.updateIterations} value={this.state.iterations} />
      </div>
    );
    return [iterationController, angleControl, lengthControl];
  };
  render = () => {
    return <div className={this.props.className}> {this.getControls()} </div>
  };
}