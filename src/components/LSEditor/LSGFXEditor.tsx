//GFXPropsCustomizer.js
import { completeGfxProps, GFXProps, GFXPropsComplete } from "../utils";
import React from  "react";

export class GFXPropsCustomizer extends React.Component<
  { gfxProps: GFXPropsComplete; GFXPropsUpdated(gfxProps: GFXProps): void },
  GFXProps
> {
  state: GFXProps = {
    length: this.props.gfxProps.length,
    angle: this.props.gfxProps.angle,
    iterations: this.props.gfxProps.iterations,
  };
  updateAngle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAngle = parseFloat(e.target.value);
    const newState = { ...this.state, ...{ angle: newAngle } };
    this.setState(newState);
    this.props.GFXPropsUpdated(newState);
  };
  updateLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newLength = parseFloat(e.target.value);
    const newState = { ...this.state, ...{ length: newLength } };
    this.setState(newState);
    this.props.GFXPropsUpdated(newState);
  };
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newIterations = parseInt(e.target.value);
    const newState = { ...this.state, ...{ iterations: newIterations } };
    this.setState(newState);
    this.props.GFXPropsUpdated(newState);
  };
  getControls = () => {
    let angleControl = (
      <div key="customize-angle">
        {" "}
        <label> Angle </label>
        <input value={this.state.angle} onChange={this.updateAngle} type="number" />
      </div>
    );
    let lengthControl = (
      <div key="customize-length">
        {" "}
        <label> Length </label>
        <input value={this.state.length} onChange={this.updateLength} type="number" />
      </div>
    );
    let iterationController = (
      <div key="iteration-control">
        {" "}
        <label> Iterations </label>{" "}
        <input type="number" onChange={this.updateIterations} value={this.state.iterations} min={0} />
      </div>
    );
    return [iterationController, angleControl, lengthControl];
  };
  render = () => {
    return this.getControls();
  };
}