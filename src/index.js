"use strict";

const React = require("react");
const ReactDOM = require("react-dom");

const injectTapEventPlugin = require("react-tap-event-plugin")();

const App = require("./app");

ReactDOM.render(<App />, document.getElementById("root"));

