import React, {Component} from 'react';
import {Button, Col, Grid, Row} from "react-bootstrap";
import ReactDOM from 'react-dom';

import TextInput from '../components/TextInput';
import Spinner from "../components/Spinner";
import * as api from '../utils/api.js'

import styles from '../App.css';

export default class TextSummarizer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            summary: [],
            inputtedText: '',
            showSpinner: false
        };

        this.numberOfSentences = 5;

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleSearch(text) {
        this.setState({'inputtedText': text});

        const searchObject = {
            text: text,
            numberOfSentences: this.numberOfSentences
        };

        this.setState({"summary": ''});
        this.doSearchRequest(searchObject);
    }

    doSearchRequest(searchObject) {
        this.setState({"showSpinner": true});
        api.fetchSummary(searchObject).then(
            response => response.json()
        ).then(
            data => {
                this.setState({"summary": data});
                this.setState({"showSpinner": false});
            }
        )
    }

    onClick() {
        let text = ReactDOM.findDOMNode(this.refs.textForKeywords).textContent;
        this.setState({"inputtedText": text});
        this.handleSearch(text);
    }

    render() {
        return (
            <div >
                <Spinner showSpinner={ this.state.showSpinner } />
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className={ styles.appTitle }>
                                Text Summarizer
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <div className={ styles.styleSelector }>
                                <Button bsStyle="primary"
                                        onClick={this.onClick}>
                                    Summarize Text
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            {
                                this.state.summary.length ?
                                    <div className="entityText summary">
                                        <ul>
                                            {
                                                this.state.summary.map((sentence, i) => {
                                                    return(<li key={ i }>{ sentence }</li>);
                                                })
                                            }
                                        </ul>
                                    </div>
                                    : null
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
