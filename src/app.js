"use strict";

const React = require("react");

const { MuiThemeProvider } = require("material-ui/styles");
const { default: AppBar } = require("material-ui/AppBar")
const { default: RaisedButton } = require("material-ui/RaisedButton");
const { default: CircularProgress } = require("material-ui/CircularProgress");
const { default: getMuiTheme } = require("material-ui/styles/getMuiTheme");
const {
    red500, grey400, grey500, grey600, grey700,
    transparent, lightWhite, white, darkWhite, lightBlack, black,
} = require("material-ui/styles/colors");
  
const saveAs = require("file-saver").saveAs;

const Configurator = require("./configurator");

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#f8f8f8",
        primary2Color: "#f8f8f8",
        primary3Color: "#f8f8f8",
        accent1Color: "#337ab7",
        accent2Color: "#337ab7",
        accent3Color: "#337ab7",
        textColor: black,
        alternateTextColor: "#777",
    },
    stepper: {
        iconColor: "#286090"
    },
    raisedButton: {
        primaryColor:  "#286090",
        primaryTextColor: white
    },
    flatButton: {
        color: "#f8f8f8",
        primaryTextColor: white
    },
    checkbox: {
        boxColor: white,
        checkedColor: white
    },
  });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            generating: false
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppBar title={"Configure your CIMPLEX Visualization"} iconElementLeft={<img src="img/cimplex.png" style={{ width: "48px"}}/>}/>
                    <div>
                        <Configurator onFinish={(views, connectors) => {
                            fetch(window.location.href + "generate?views=" + [...views.values()].join("&views=") + "&connectors=" + [...connectors.values()].join("&connectors=")).then((response) => {
                                const disposition = response.headers.get("content-disposition");
                                let filename = disposition.substring(disposition.indexOf("filename") + 9);
                                filename = filename.slice(1, filename.length - 1);
                                return response.blob().then((blob) => {
                                    return [filename, blob]
                                });
                            }).then(([filename, blob]) => {
                                this.setState({ generating: false })
                                saveAs(blob, filename);
                                {/* window.location.reload(true); */ }
                            });
                            this.setState({ generating: true })
                        }} />
                    </div>
                    <div style={{ display: "flex" , alignItems: "center", justifyContent: "center" }}>
                        {this.state.generating && <div style={{ display: "flex" }}>
                            <h2>Generating</h2>
                            <CircularProgress size={80} thickness={5} color="#286090" style={{marginLeft: "20px"}} />
                        </div>}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

exports = module.exports = App;
