import React from "react"
import { decodeParams, flattenText, GFXProps } from "../components/utils"
import { RouteComponentProps } from "react-router-dom";
import LSEditor from "../components/LSEditor";

const defaultLSData = {
  axiom: "A",
  productionText: ["A:FA"],
  iterations: 2
}

interface PathParams {
  LSStr: string
}
interface PathState {
  axiomText: string,
  productionsText: string[],
  gfxProps?: GFXProps,
}
export default class InteractiveEditor extends React.Component<RouteComponentProps<PathParams>, PathState> {
  state: PathState = {
    axiomText: defaultLSData.axiom,
    productionsText: defaultLSData.productionText
  }
  componentDidMount= ()=> {
    this.setStateFromURL();
  }
  componentDidUpdate = (prevProps: RouteComponentProps<PathParams>) => {
    if(this.props.location.search !== prevProps.location.search) {
      this.setStateFromURL();
    }
  }
  setStateFromURL = () => {
    let { axiom, productions, gfxProps } = decodeParams(this.props.location.search);
    let newState = this.state;
    if (axiom) newState.axiomText = axiom;
    if (productions) newState.productionsText = productions;
    if (gfxProps) newState.gfxProps = gfxProps;
    this.setState(newState)
  }
  render() {
    return <LSEditor initAxiomString={this.state.axiomText} 
                    initProductionsString={this.state.productionsText} 
                    initGFXProps={this.state.gfxProps} 
                    key={flattenText([this.state.axiomText, ...this.state.productionsText], "-")}/>
  }
}

