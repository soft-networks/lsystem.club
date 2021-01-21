import React from 'react';
import ReactDOM from 'react-dom';
import P5Draw from './P5Turtle';
import "./global.css";
import staticExamples from './staticExamples';
import InteractiveEditor from './InteractiveEditor';
import LSCustomizer from './LSCustomizer';


ReactDOM.render(
  <React.StrictMode>
    <InteractiveEditor />
    {staticExamples()}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

//Useful tings
//<P5Draw commandString="FFF+F" length={10} />