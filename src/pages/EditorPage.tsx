import React from "react"
import { decodeParams, GFXProps} from "../components/utils"
import { RouteComponentProps } from "react-router-dom";
import LSEditAndView from "../components/LSEditAndView";
import PageLayout from "../components/PageLayout";


interface PathParams {
  LSStr: string
}
interface PathState {
  initCode?: string
  gfxProps?: GFXProps,
}
export default class InteractiveEditor extends React.Component<RouteComponentProps<PathParams>, PathState> {
  state: PathState = {
  }
  componentDidMount= ()=> {
    this.setStateFromURL();
  }
  componentDidUpdate = (prevProps: RouteComponentProps<PathParams>) => {
    if(this.props.location.search !== prevProps.location.search && this.props.location.search !== "") {
      this.setStateFromURL();
    }
  }
  setStateFromURL = () => {
    let paramState = decodeParams(this.props.location.search);
    //console.log("SETTING STATE FROM URL", paramState);
    this.setState(paramState)
    this.props.history.replace("/edit");
  }
  render() {
    return (
      <PageLayout>
        <LSEditAndView
          initCode={this.state.initCode}
          initGFXProps={this.state.gfxProps}
          saveToLocalStorage={"editorPage"}
        />
      </PageLayout>
    );
  }
}


