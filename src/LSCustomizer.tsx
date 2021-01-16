
import LSystem, { Axiom, parseAxiom, parseProduction, Production } from "@bvk/lsystem";
import { axiomToStr } from "@bvk/lsystem/dist/parser";
import React from "react"
import { updateParenthesizedType } from "typescript";

interface CustomizerProps {
  onLSReset(LS: LSystem): void;
  onLSIterated(LS: LSystem): void;
  initProductions?: string[],
  initAxiom?: string,
  initIterations?: number
}

interface CustomizerState {
  iterations: number,
  errorMessage: string,
}

/**
 * LSCustomizer stores the LSystem that is updated by the UI.
 * When the LSCustomizer updates the LSystem, or the iterations, it uses callback functions to update its parent
 */
export default class LSCustomizer extends React.Component<CustomizerProps, CustomizerState> {
  LSystem: LSystem | undefined;
  axiom: Axiom | undefined;
  productions: Production[] | undefined;

  state: CustomizerState = {
    iterations: this.props.initIterations || 1,
    errorMessage: ""
  }
  //Receive state from children, and update LSystem
  updateAxiom = (ax: Axiom) => {
    this.axiom = ax;
    this.resetLS();
  }
  updateProductions = (productions: Production[]) => {
    this.productions = productions;
    this.resetLS();
  }
  resetLS = () => {
    if (this.axiom && this.productions && this.productions.length > 0) {
      try {
        let newLS = new LSystem(this.axiom, this.productions);
        //TODO: ASYNC AWAIT
        newLS.iterate();
        this.setState({ errorMessage: "" });
        this.props.onLSReset(newLS);
        this.LSystem = newLS;
      } catch (e) {
        this.setState({ errorMessage: e.message });
      }
    } else {
      this.setState({ errorMessage: "Not recreating LSystem, axiom or productions didn't exist" })
    }
  }
  updateIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value);
    this.setState({ iterations: newValue });
    if (!this.LSystem) {
      this.setState({ errorMessage: "cant iterate an LSystem doesnt exist yet" });
      return;
    }
    //TODO: ASYNC/AWAIT
    this.LSystem.setIterations(newValue);
    this.LSystem.iterate();
    this.props.onLSIterated(this.LSystem);
  }

  //Generate UI
  getControls = () => {
    let controls = [];
    let axiomControl = <AxiomCustomizer didUpdate={this.updateAxiom} key={"axiom-controls"} initAxiom={this.props.initAxiom} />
    controls.push(axiomControl);
    let productionsControl = <ManyProductionCustomizer didUpdate={this.updateProductions} key={"production-controls"} initProductions={this.props.initProductions} />
    controls.push(productionsControl);
    let iterationControl = this.getIterationController();
    controls.push(iterationControl);
    return <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}> {controls} </div>;
  }
  getIterationController = () => {
    return (
      <div key="iterations">
        <label> Iterations </label>
        <input type="range" min={1} max={20} onChange={this.updateIterations} value={this.state.iterations} />
      </div>
    )
  }
  render = () => {
    return (
      <div>
        <div> LSystem </div>
        <div className="subtext">{this.state.errorMessage}</div>
        <div> {this.getControls()} </div>
      </div>)
  }
}


/**
 * AxiomCustomizer controls updating of the Axiom
*/
interface AxiomProps {
  initAxiom?: string;
  didUpdate(ax: Axiom): void;
}
interface AxiomState {
  axiomString: string;
  errorMessage: string;
  axiomParses: boolean;
}
export class AxiomCustomizer extends React.Component<AxiomProps, AxiomState> {
  state: AxiomState = {
    axiomString: this.props.initAxiom || "",
    axiomParses: false,
    errorMessage: ""
  }
  componentDidMount = () => {
    this.parseAxiom(this.state.axiomString);
  }
  parseAxiom = (axiomString: string) => {
    this.setState({ axiomString: axiomString });
    try {
      let axiomObj = parseAxiom(axiomString);
      this.setState({ axiomParses: true, errorMessage: "" });
      this.props.didUpdate(axiomObj);
    } catch (e) {
      this.setState({ axiomParses: false, errorMessage: e.message });
    }
  }
  render() {
    return (
      <div>
        <label> Axiom </label>
        <input className={`padded border-bottom ${this.state.axiomParses ? 'green-border' : 'red-border'}`}
          onChange={(e) => this.parseAxiom(e.target.value)}
          value={this.state.axiomString} />
        <div className="red subtext"> {this.state.errorMessage} </div>
      </div>)
  }
}

/**
 * ManyProductionCustomizer controls updating of the Axiom
*/
interface ManyProductionProps {
  initProductions?: string[],
  didUpdate(productions: Production[]): void
}
interface ManyProductionState {
  productionStrDict: { [key: string]: string },
  errorMessages: { [key: string]: string }
}
export class ManyProductionCustomizer extends React.Component<ManyProductionProps, ManyProductionState> {
  productionObjDict: { [key: string]: Production } = {};
  constructor(props: ManyProductionProps) {
    super(props);
    let productionDict: { [key: string]: string } = {};
    if (this.props.initProductions) {
      this.props.initProductions.forEach((initProduction, index) => {
        let pKey = index + "-production" as string;
        productionDict[pKey] = initProduction;
      })
    }
    this.state = {
      productionStrDict: productionDict,
      errorMessages: {}
    }
  }
  //Updating and syncing state
  componentDidMount = () => {
    if (this.props.initProductions) {
      let productionKeys = Object.keys(this.state.productionStrDict);
      productionKeys.forEach((pKey) => {
        let pString = this.state.productionStrDict[pKey];
        this.updateProduction(pString, pKey);
      })
    }
  }
  updateParent = () => {
    let productions = { ...this.productionObjDict };
    let productionValues = Object.values(productions);
    //TODO: Copying them over here, but this should happen in LSystem instead. Remove later
    let copiedvalues: Production[] = [];
    productionValues.forEach((pv) => {
      let npv = { ...pv };
      copiedvalues.push(npv);
    })
    console.log("ProductionCuztomizer sending back to parent");
    console.log(productions);
    this.props.didUpdate(copiedvalues);
  }
  updateProduction = (productionString: string, productionKey: string) => {
    console.log("Updating: " + productionString + " with key " + productionKey);
    let productionStrings = this.state.productionStrDict;
    productionStrings[productionKey] = productionString;
    this.setState({ productionStrDict: productionStrings });
    try {
      let productionObj = parseProduction(productionString);
      this.productionObjDict[productionKey] = productionObj;
      console.log(this.productionObjDict);
      this.updateParent();
      let errorMessages = this.state.errorMessages;
      delete errorMessages[productionKey];
      this.setState({ errorMessages: errorMessages });
    } catch (e) {
      let errorMessages = this.state.errorMessages;
      errorMessages[productionKey] = e.message;
      this.setState({ errorMessages: errorMessages });
    }
  }
  //Altering number of productions
  removeProduction = (productionKey: string) => {
    let productionStrings = this.state.productionStrDict;
    delete productionStrings[productionKey];
    let errorStrings = this.state.errorMessages;
    delete errorStrings[productionKey];
    this.setState({ productionStrDict: productionStrings, errorMessages: errorStrings });
    delete this.productionObjDict[productionKey];
    this.updateParent();
  }
  addProduction = () => {
    let numKeys = Object.keys(this.state.productionStrDict).length;
    let nextKey = numKeys + 1 + "-production";
    let productionStrings = this.state.productionStrDict;
    productionStrings[nextKey] = "";
    this.setState({ productionStrDict: productionStrings });
  }
  //Generating UI 
  getProductions = () => {
    let productionKeys = Object.keys(this.state.productionStrDict);
    return productionKeys.map((pKey, index) => {
      let pString = this.state.productionStrDict[pKey];
      let productionInput = (
        <div key={pKey} >
          <label> Production {index} </label>
          <input key={pKey + "-input"}
            className={`padded border-bottom ${this.state.errorMessages[pKey] ? 'red-border' : 'green-border'}`}
            onChange={(e) => this.updateProduction(e.target.value, pKey)}
            value={pString} />
          <div className="clickable right-button"
            onClick={(e) => this.removeProduction(pKey)}> (-) </div>
          <div className="red subtext"> {this.state.errorMessages[pKey]} </div>
        </div>);
      return productionInput;
    })
  }
  render() {
    return (<div>
      {this.getProductions()}
      <div className="clickable" onClick={this.addProduction}>Add production</div>
    </div>)
  }
}