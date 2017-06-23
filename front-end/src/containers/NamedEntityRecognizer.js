import React, {Component} from 'react';
import {Col, Grid, Row} from "react-bootstrap";
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';

import MainButtons from "../components/MainButtons";
import Spinner from "../components/Spinner";
import TextInput from '../components/TextInput';
import * as api from '../utils/api.js'

import styles from '../App.css';
import EntityButtons from "../components/EntityButtons";

export default class NamedEntityRecognizer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entities: [],
            selectedEntity: '',
            inputtedText: '',
            showSpinner: false
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onMainButtonClick = this.onMainButtonClick.bind(this);
        this.onEntityButtonClick = this.onEntityButtonClick.bind(this);
        this.setSpinner = this.setSpinner.bind(this);
        this.setInputtedText = this.setInputtedText.bind(this);
    }

    handleSearch(text) {
        this.setState({'inputtedText': text});

        const searchObject = {
            text: text
        };

        this.setState({"entities": []});
        this.doSearchRequest(searchObject);
    }

    doSearchRequest(searchObject) {
        this.setState({"showSpinner": true});
        api.fetchEntities(searchObject).then(
            response => response.json()
        ).then(
            data => {
                this.setState({"entities": data});
                this.setState({"showSpinner": false});
            }
        )
    }

    onMainButtonClick() {
        let text = ReactDOM.findDOMNode(this.refs.page).textContent;
        if(text.length) {
            this.setState({"inputtedText": text});
            this.handleSearch(text);
        }
    }

    setSpinner(value) {
        this.setState({"showSpinner": value});
    }

    setInputtedText(value) {
        ReactDOM.findDOMNode(this.refs.page).textContent = value;
        this.setState({"inputtedText": value});
    }

    onEntityButtonClick(e, entity) {
        this.setState({"selectedEntity": entity});
    }

    render() {
        return (
            <div>
                <Spinner showSpinner={ this.state.showSpinner } />
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className={ styles.appTitle }>
                                Named Entity Recognizer
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <MainButtons mainButtonText="Analyze Entities"
                                         setInputtedText={ this.setInputtedText }
                                         setSpinner={ this.setSpinner }
                                         onMainButtonClick={ this.onMainButtonClick } />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <EntityButtons entities={ this.state.entities }
                                           onEntityButtonClick={ this.onEntityButtonClick }/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            {
                                Object.keys(this.state.entities).length ?
                                    <div className="entityText">
                                        <Highlighter
                                            className=""
                                            highlightClassName='entityHighlight'
                                            searchWords={ this.state.selectedEntity ? this.state.entities[this.state.selectedEntity] : [] }
                                            textToHighlight={ this.state.inputtedText }
                                        />
                                    </div>
                                    : null
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <TextInput ref="page"/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}
