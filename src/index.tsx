import React from 'react';
import ReactDOM from 'react-dom';
import  Examples  from './pages/ExamplesPage';
import "./global.css"
import { BrowserRouter as Router, Route } from "react-router-dom";
import InteractiveEditor from './pages/EditorPage';
import Lilac from './components/Examples/Lilac';
import textGarden from './components/Examples/TextGarden';

ReactDOM.render(
  <Router>
    <Route path="/edit" component={InteractiveEditor} />
    <Route exact path="/" render={Examples} />
    <Route exact path="/examples/Lilac" component={Lilac} />
    <Route exact path="/examples/Text" component={textGarden} />
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

//Useful tings
//<P5Draw commandString="FFF+F" length={10} />