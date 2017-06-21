import React, {Component} from 'react';
import {Button, Col, Grid, Row} from "react-bootstrap";
import ReactDOM from 'react-dom';

import TextInput from '../components/TextInput';
import Sentences from '../components/Sentences';
import * as api from '../utils/api.js'

import styles from '../App.css';

export default class SimilarityChecker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            generalScore: {},
            sentiments: [],
            inputtedText: ''
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleSearch(text) {
        this.setState({'inputtedText': text});

        const searchObject = {
            text: text
        };

        this.setState({"sentiments": []});
        this.setState({"generalScore": {}});
        this.doSearchRequest(searchObject);
    }

    doSearchRequest(searchObject) {
        api.getSentiments(searchObject).then(
            response => response.json()
        ).then(
            data => {
                this.setState({'sentiments': data['sentiments']});
                this.setState({'generalScore': data['general_score']});
            }
        )
    }

    onClick() {
        let text = ReactDOM.findDOMNode(this.refs.textForKeywords).textContent;
        this.setState({"inputtedText": text});
        this.handleSearch(text);
    }

    render() {
        console.log(styles);
        return (
            <div >
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className={ styles.appTitle }>
                                Similarity Checker
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <div className={ styles.styleSelector }>
                                <Button bsStyle="primary"
                                        onClick={this.onClick}>
                                    Analyze Sentiment
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            {
                                this.state.sentiments.length ? <Sentences sentiments={this.state.sentiments}/> : null
                            }
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
