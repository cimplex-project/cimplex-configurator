"use strict";

const React = require("react");

const { default: Checkbox } = require("material-ui/Checkbox");
const { Step, Stepper, StepLabel, StepContent } = require("material-ui/Stepper");
const { default: RaisedButton } = require("material-ui/RaisedButton");
const { default: FlatButton } = require("material-ui/FlatButton");
const { default: FontIcon } = require("material-ui/FontIcon");
const { GridList, GridTile } = require("material-ui/GridList");

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            stepIndex: 0,
            views: new Set(),
            connectors: new Set()
        };
    }

    handleViewCheck(e) {
        const name = e.target.name;
        if (e.target.checked) {
            this.setState((oldState) => {
                return { views: new Set([...oldState.views, name]) };
            });
        } else {
            this.setState((oldState) => {
                const views = new Set([...oldState.views]);
                views.delete(name);
                return { views: views };
            });
        }
    }

    handleConnectorCheck(e) {
        const name = e.target.name;
        if (e.target.checked) {
            this.setState((oldState) => {
                return { connectors: new Set([...oldState.connectors, name]) };
            });
        } else {
            this.setState((oldState) => {
                const connectors = new Set([...oldState.connectors]);
                connectors.delete(name);
                return { connectors: connectors };
            });
        }
    }

    handleNext() {
        const { stepIndex } = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    };

    handlePrev() {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };

    renderStepActions(step) {
        const { stepIndex, finished } = this.state;

        return (
            <div style={{ margin: "12px 0" }}>
                <RaisedButton
                    label={stepIndex === 2 ? "Finish" : "Next"}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    onTouchTap={() => this.handleNext()}
                    style={{ marginRight: "12px" }}
                />
                {step > 0 && (
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onTouchTap={() => this.handlePrev()}
                    />
                )}
            </div>
        );
    }

    createViewCheckbox(name, label, img) {
        const checkedColor = "rgb(0, 188, 212)";
        const checkbox = <Checkbox
            checked={this.state.views.has(name)}
            name={name}
            onCheck={(e) => this.handleViewCheck(e)}
        />

        return <GridTile
                title={label}
                subtitle={<span><b>{label}</b></span>}
                actionIcon={checkbox}
                titleBackground="rgba(40, 96, 144, 0.9)"
            >
            <img src={`img/${img}`}/>
        </GridTile>
    }

    createConnectorCheckbox(name, label, imgName) {
        const checkbox = <div>
            <div style={{ position: "absolute", width: "auto", bottom: "21px", right: "0px"}}>
                <Checkbox
                    checked={this.state.connectors.has(name)}
                    name={name}
                    onCheck={(e) => this.handleConnectorCheck(e)}           
                />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "90px" }}> 
                <img src={`img/${imgName}`} style={{ height: "58px" }}/>
            </div>
        </div>

        return <GridTile
            title={label}
            subtitle={<span><b>{label}</b></span>}
            actionIcon={checkbox}
            actionPosition="left"
            titleBackground="rgba(40, 96, 144, 0.9)"
            >
           
        </GridTile>
    }

    render() {
        const { finished, stepIndex } = this.state;

        return (
            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Stepper activeStep={stepIndex} orientation={"vertical"} style={{ minWidth: "800px", maxWidth: "800px"}}>
                        <Step>
                            <StepLabel>Select Views to include</StepLabel>
                            <StepContent>
                                <GridList cellHeight={180}>
                                    {this.createViewCheckbox("globe", "Globe", "globe.png")}
                                    {this.createViewCheckbox("filterInfo", "Filter Info", "filter.png")}
                                    {this.createViewCheckbox("graph", "Graph", "graph.png")}
                                    {this.createViewCheckbox("map", "Map", "map.png")}
                                    {this.createViewCheckbox("matrix", "Matrix", "matrix.png")}
                                    {this.createViewCheckbox("scarfplot", "Scarfplot", "scarf.png")}
                                    {this.createViewCheckbox("timeline", "Timeline", "timeline.png")}
                                    {this.createViewCheckbox("wordCloud", "Word Cloud", "wordCloud.png")}
                                </GridList>
                                {this.renderStepActions(0)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>Select Data Services</StepLabel>
                            <StepContent>
                                <GridList cellHeight={80}>
                                    {this.createConnectorCheckbox("mobility", "Mobility Data", "ustutt.png")}
                                    {this.createConnectorCheckbox("author_network", "Author Network", "ustutt.png")}
                                    {this.createConnectorCheckbox("oag", "Flight Analytics Data", "ic_explore_black_48dp_2x.png")}
                                    {this.createConnectorCheckbox("nasa", "SEDAC", "ic_explore_black_48dp_2x.png")}
                                    {this.createConnectorCheckbox("grippenet", "GrippeNET Data", "grippenet.png")}
                                    {this.createConnectorCheckbox("eurostat", "Eurostat Data", "ic_explore_black_48dp_2x.png")}
                                    {this.createConnectorCheckbox("cnr_data", "CNR Mobility Data", "cnr.png")}
                                </GridList>
                                {this.renderStepActions(1)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>Select Simulation Services</StepLabel>
                            <StepContent>
                                <GridList cellHeight={68}>
                                    {this.createConnectorCheckbox("nds_isi", "Network Diffusion (ISI)", "isi.svg")}
                                    {this.createConnectorCheckbox("nds_cnr", "Network Diffusion Service (CNR)", "cnr.png")}
                                    {this.createConnectorCheckbox("abm_isifbk", "Agent Based Model (ISI+FBK)", "fbk.png")}
                                </GridList>
                                {this.renderStepActions(2)}
                            </StepContent>
                        </Step>
                    </Stepper>
                </div>
                {finished && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "50px" }}>
                        <RaisedButton
                            label={"Reset"}
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            primary={true}
                            onTouchTap={() => this.setState({ stepIndex: 0, finished: false })}
                        />
                        <RaisedButton
                            style={{ "marginLeft": "24px" }}
                            label={"Download"}
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            primary={true}
                            onTouchTap={() => this.props.onFinish(this.state.views, this.state.connectors)}
                        />
                    </div>
                )}
            </div>
        );
    }
}

exports = module.exports = Configurator;
