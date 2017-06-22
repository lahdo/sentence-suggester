import React, {Component} from 'react';
import {Button, Col, Grid, Row} from "react-bootstrap";
import ReactDOM from 'react-dom';

import TextInput from '../components/TextInput';
import Sentences from '../components/Sentences';
import Spinner from "../components/Spinner";

import * as api from '../utils/api.js';
import * as utils from '../utils/sentimentsUtils';

import styles from '../App.css';

export default class SentimentAnalyzer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            generalScore: {},
            sentiments: [],
            inputtedText: '',
            showSpinner: false
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getGeneralScore = this.getGeneralScore.bind(this);
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
        this.setState({"showSpinner": true});
        api.fetchSentiments(searchObject).then(
            response => response.json()
        ).then(
            data => {
                this.setState({'sentiments': data['sentiments']});
                this.setState({'generalScore': data['general_score']});
                this.setState({"showSpinner": false});
            }
        )
    }

    onClick() {
        let text = ReactDOM.findDOMNode(this.refs.textForKeywords).textContent;
        this.setState({"inputtedText": text});
        this.handleSearch(text);
    }

    getGeneralScore(polarity, subjectivity) {
        const [polarityRating, polarityResult] = utils.normalizePolarity(polarity);
        let polarityValue = utils.normalizeValue(polarity);

        const [subjectivityRating, subjectivityResult] = utils.normalizeSubjectivity(subjectivity);
        let subjectivityValue = utils.normalizeValue(subjectivity);

        return (
            <div className="sentiment-overview">
                <p>
                    <strong>General text polarity: </strong>
                    { polarityResult } ({ polarityValue })
                </p>
                <p>
                    <strong>General text subjectivity: </strong>
                    { subjectivityResult } ({ subjectivityValue })
                </p>
            </div>
        );
    }

    render() {
        console.log(styles);
        return (
            <div>
                <Spinner showSpinner={ this.state.showSpinner } />
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className={ styles.appTitle }>
                                Sentiment Analyzer
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
                                this.state.generalScore.polarity ?
                                    this.getGeneralScore(this.state.generalScore.polarity, this.state.generalScore.subjectivity)
                                    : null
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            {
                                this.state.sentiments.length ?
                                    <Sentences sentiments={this.state.sentiments}/>
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
