import React from "react"
import lsystem, { Axiom, parseAxiom, Production } from "@bvk/lsystem"
import { parsePredecessor, parseProduction } from "@bvk/lsystem/dist/parser";
import LSystem from "@bvk/lsystem";
import P5Draw from "./P5Draw";

interface myState {
  productions: Production[] | undefined,
  axiom: Axiom | undefined,
  iterations: number,
}

export default class InteractiveCreator extends React.Component<{}, myState> {
  state: myState = {
    productions: undefined,
    axiom: undefined,
    iterations: 1
  }
  updateAxiom = (ax: Axiom) => {
    this.setState({ axiom: ax });
  }
  updateProductions = (productions: Production[]) => {
    this.setState({ productions: productions });
  }
  getControls = () => {
    let controls = [];
    let axiomControl = <AxiomControl onUpdate={this.updateAxiom} key={"axiom-controls"} />
    controls.push(axiomControl);

    let productionsControl = <ProductionsControl onUpdate={this.updateProductions} key={"production-controls"} />
    controls.push(productionsControl);

    let iterationControl = this.getIterationController();
    controls.push(iterationControl);

    return <div style={{ display: "flex", flexDirection: "column" }}> {controls} </div>;
  }
  getOutput = () => {
    if (this.state.axiom && this.state.productions && this.state.productions.length > 0) {
      // console.log("***** STATE RESET, HERE'S WHAT WE HAVE ***");
      // console.log(this.state.axiom);
      // console.log(this.state.productions);
      // console.log(this.state.iterations);
      // //lS.resetStoredIterations();
      //lS.iterate();

      try {
        let lS = new LSystem(this.state.axiom, this.state.productions, this.state.iterations);
        let outputString = lS.getIterationAsString();
        let outputObjects = lS.getIterationAsObject();
        console.log("****Gonna try and create a drawing with:" + outputString);
        let outputGFX = (<div> <P5Draw
          commandString={outputObjects}
          key={"lS-" + outputString}
          length={0.1}
          center={[0.5, 0.5]} />
        </div>)
        return (<div style={{ display: "flex", flexDirection: "column" }}> {outputGFX} <div> {outputString} </div></div>)
      } catch (eR) {
        return <span className="fc-red">{eR.message} </span>
      }
    } else {
      return <span className="fc-red">Didnt draw LS, no axiom or productions </span>
    }
  }
  getIterationController = () => {
    return (
      <div key="iterations">
        <label>Iterations </label>
        <input type="range" min={0} max={10} step={1} value={this.state.iterations} onChange={this.updateIterationController} />
      </div>
    )
  }
  updateIterationController = (e: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseFloat(e.target.value);
    if (n) {
      this.setState({ iterations: n })
    }
  }
  render = () => {
    return (<div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {this.getControls()}
        {this.getOutput()}
      </div> </div>)
  }
}

///AXIOM CONTROLLER
interface axState {
  axiomString: string,
  myError: string
}
class AxiomControl extends React.Component<{ onUpdate: (ax: Axiom) => void }, axState> {
  state: axState = {
    axiomString: "",
    myError: ""
  }

  tryParseAxiom = (e: React.ChangeEvent<HTMLInputElement>) => {
    let str = e.target.value;
    if (str === "") {
      this.setState({ myError: 'axiom is empty', axiomString: str });
    }
    try {
      let axiom = parseAxiom(str);
      this.setState({ myError: "", axiomString: str });
      this.props.onUpdate(axiom);
    } catch (eR) {
      this.setState({ myError: eR.message, axiomString: str });
    }
  }

  isError = () => {
    return this.state.myError !== ""
  }
  render = () => {
    return (<div className={this.isError() ? "fc-red" : "fc-green"}>
      <label> Axiom </label>
      <input onChange={(e) => this.tryParseAxiom(e)} value={this.state.axiomString} />
      <div> {this.state.myError} </div>
    </div>)
  }
}

//PRODUCTION CONTROLLER
interface pS {
  productions: { [key: string]: Production | "not-created" },
  numProductions: number
}

interface pP {
  onUpdate: (productions: Production[]) => void
}
class ProductionsControl extends React.Component<pP, pS> {

  constructor(props: pP) {
    super(props);
    this.state = {
      productions: {},
      numProductions: 0
    }
  }
  componentDidMount() {
    this.addNewProduction();
  }
  addNewProduction = () => {
    let prods = this.state.productions;
    let pN = this.state.numProductions + 1;
    prods["PC-" + pN] = "not-created";
    this.setState({ numProductions: pN + 1, productions: prods })
  }
  renderProductions = () => {
    let productionControllers: JSX.Element[] = [];
    Object.keys((this.state.productions)).forEach((k) => {
      productionControllers.push(<ProductionControl onUpdate={this.updateProduction} destroyMe={this.removeProduction} id={k} key={k} />);
    });
    return productionControllers;
  }
  updateProduction = (p: Production, k: string) => {
    let prods = this.state.productions;
    prods[k] = p;
    this.setState({ productions: prods });
    let justProds = Object.values(prods).filter((p) => p != "not-created") as Production[];
    this.props.onUpdate(justProds);
  }

  removeProduction = (k: string) => {
    let prods = this.state.productions;
    delete prods[k];
    this.setState({ productions: prods });
  }
  render = () => {
    return (
      <div>
        <div> {this.renderProductions()} </div>
        <div onClick={(e) => this.addNewProduction()}> + </div>
      </div>)
  }

}

interface productionState {
  productionString: string,
  myError: string
}
interface productionProps {
  onUpdate: (p: Production, k: string) => void,
  id: string,
  destroyMe: (k: string) => void
}
class ProductionControl extends React.Component<productionProps, productionState> {

  state: productionState = {
    productionString: "",
    myError: ""
  }


  tryParseProduction = (e: React.ChangeEvent<HTMLInputElement>) => {
    let str = e.target.value;
    try {
      let production = parseProduction(str);
      this.setState({ myError: "", productionString: str });
      this.props.onUpdate(production, this.props.id);
    } catch (eR) {
      this.setState({ myError: eR.message, productionString: str });
    }
  }

  isError = () => {
    return this.state.myError !== ""
  }
  render = () => {
    return (<div className={this.isError() ? "fc-red" : "fc-green"} key={"PC-" + this.props.id} >
      <label> Production </label>
      <input onChange={(e) => this.tryParseProduction(e)} value={this.state.productionString} />
      <div onClick={(e) => this.props.destroyMe(this.props.id)}>remove</div>
      <div> {this.state.myError} </div>
    </div>)
  }
}



// tryParseProduction = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
//   let pstring = e.target.value;
//   let productions = this.state.productions;
//   let pC = this.state.productionsCorrect;
//   let erm = ""
//   try {
//     let prod = parseProduction(pstring);
//     if (i < productions.length) {
//       productions[i] = prod;
//       pC[i] = true;
//     }
//     else {
//       productions.push(prod);
//       pC.push(true);
//     }
//     this.setState({ productions: productions, productionsCorrect: pC, errorMessage: erm });
//   } catch (eR) {
//     erm = eR.message;
//     this.setState({ errorMessage: erm });
//   }
//   console.log(productions);
//   console.log(pC);
// }


// for (let i = 0; i < this.state.numProductions; i++) {
//   let productionControl = (
//     <div key={"p" + i}>
//       <label> Production {i + 1}</label>
//       <input onChange={(e) => this.tryParseProduction(e, i)} className={this.state.productionsCorrect[i] ? "fc-green" : "fc-red"}></input>
//     </div>
//   )
//   controls.push(productionControl);
// }

// let changeNum = (<div>
//   <div key="+" onClick={(e) => this.setState({ numProductions: this.state.numProductions + 1 })}>  + </div>
//   <div key="-" onClick={(e) => this.setState({ numProductions: Math.max(this.state.numProductions - 1, 0) })}> - </div>
// </div>)

// controls.push(changeNum);
