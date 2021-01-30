import React from "react"
import { decodeParams, GFXProps, LSProps, defaultLSData, flattenLSProps} from "../components/utils"
import { RouteComponentProps } from "react-router-dom";
import LSEditor from "../components/LSEditor";

interface PathParams {
  LSStr: string
}
interface PathState {
  lsProps: LSProps,
  gfxProps?: GFXProps,
}
export default class InteractiveEditor extends React.Component<RouteComponentProps<PathParams>, PathState> {
  state: PathState = {
    lsProps: {
      axiom: defaultLSData.axiom,
      productions: defaultLSData.productionText,
      iterations: defaultLSData.iterations
    }
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
    let { lsProps, gfxProps } = decodeParams(this.props.location.search);
    let newState = this.state;
    if (lsProps) newState.lsProps = lsProps;
    console.log("State from URL");
    console.log(lsProps);
    if (gfxProps) newState.gfxProps = gfxProps;
    this.setState(newState)
  }
  render() {
    return <LSEditor initLSProps={this.state.lsProps} initGFXProps={this.state.gfxProps} key={flattenLSProps(this.state.lsProps, "-")}/>
  }
}

