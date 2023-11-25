import "./App.css";
import React from "react";
import InputRange from "./InputRange.jsx/InputRange";

function App() { 
  return (
    <div className="app">
      <div className="container">
        <InputRange maxValue={1584}/>
      </div>
    </div>
  );
}

export default App;
