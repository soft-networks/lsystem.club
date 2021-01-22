import "./global.css";
import staticExamples from './staticExamples';
import InteractiveEditor from './InteractiveEditor';
import { BrowserRouter as Router, Route, useLocation } from "react-router-dom"


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function Home(): JSX.Element {

  return (
    <div>
      <Route path="/edit" component={InteractiveEditor} />
      <Route exact path="/" render={staticExamples} />
    </div>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
