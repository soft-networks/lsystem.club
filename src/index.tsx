import React from 'react';
import ReactDOM from 'react-dom';
import P5Draw from './P5Draw';
import "./global.css";
import staticExamples from './staticExamples';
import InteractiveCreator from './InteractiveCreator';


ReactDOM.render(
  <React.StrictMode>
    <InteractiveCreator />
    {/* {staticExamples()} */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

//Useful tings
//<P5Draw commandString="FFF+F" length={10} />