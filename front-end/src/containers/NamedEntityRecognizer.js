import React, {Component} from 'react';
import {Button, Col, Grid, Row} from "react-bootstrap";
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';
import TextInput from '../components/TextInput';
// import EntityText from '../components/EntityText';
import * as api from '../utils/api.js'

import styles from '../App.css';

export default class NamedEntityRecognizer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entities: [],
            selectedEntity: '',
            inputtedText: ''
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onEntityButtonClick = this.onEntityButtonClick.bind(this);
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
        api.getEntities(searchObject).then(
            response => response.json()
        ).then(
            data => {
                this.setState({"entities": data});
            }
        )
    }

    onClick() {
        let text = ReactDOM.findDOMNode(this.refs.textForKeywords).textContent;
        this.setState({"inputtedText": text});
        this.handleSearch(text);
    }

    onEntityButtonClick(e, entity) {
        this.setState({"selectedEntity": entity});
    }

    render() {
        console.log(styles);
        return (
            <div >
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
                            <div className={ styles.styleSelector }>
                                <Button bsStyle="primary"
                                        onClick={this.onClick}>
                                    Analyze Entities
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            {
                                Object.keys(this.state.entities).map((entity) => {
                                    return (
                                        <Button bsStyle="secondary"
                                                className="entityButton"
                                                onClick={ (e) => this.onEntityButtonClick(e, entity)}>
                                            { entity }
                                        </Button>
                                    );
                                })
                            }
                        </Col>

                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <div className="entityText">
                                {
                                    Object.keys(this.state.entities).length ?
                                        <Highlighter
                                            className=""
                                            highlightClassName='entityHighlight'
                                            searchWords={ this.state.selectedEntity ? this.state.entities[this.state.selectedEntity] : [] }
                                            textToHighlight={ this.state.inputtedText }
                                        />
                                        : null
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <TextInput ref="textForKeywords"/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}
