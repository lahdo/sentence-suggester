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
            inputtedFirstText: '',
            inputtedSecondText: ''
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleSearch(firstText, secondText) {
        this.setState({"inputtedFirstText": firstText});
        this.setState({"inputtedSecondText": secondText});

        const searchObject = {
            firstText: firstText,
            secondText: secondText
        };

        this.setState({"sentiments": []});
        this.setState({"generalScore": {}});
        this.doSearchRequest(searchObject);
    }

    doSearchRequest(searchObject) {
        api.fetchSentiments(searchObject).then(
            response => response.json()
        ).then(
            data => {
                this.setState({'sentiments': data['entities']});
                this.setState({'generalScore': data['general_score']});
            }
        )
    }

    onClick() {
        let firstText = ReactDOM.findDOMNode(this.refs.firstText).textContent;
        let secondText = ReactDOM.findDOMNode(this.refs.secondText).textContent;
        this.setState({"inputtedFirstText": firstText});
        this.setState({"inputtedSecondText": secondText});
        this.handleSearch(firstText, secondText);
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
                                this.state.sentiments.length ? <Sentences sentiments={this.state.entities}/> : null
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h3>First Text:</h3>
                            <TextInput ref="firstText"/>
                        </Col>
                        <Col md={6} mdOffset={3}>
                            <h3>Second Text:</h3>
                            <TextInput ref="secondText"/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}
