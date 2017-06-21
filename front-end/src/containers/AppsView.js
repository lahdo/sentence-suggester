import React, {Component} from 'react';

import Apps from '../components/Apps';

import '../App.css';
import {Col, Grid, Row} from "react-bootstrap";

export default class AppsView extends Component {
    constructor(props) {
        super(props);

        this.apps = [
            {
                name: 'Sentence Suggester',
                description: 'Write 10 times faster thanks to Markov Chain like model',
                link: 'sentence-suggester'
            },
            {
                name: 'Keywords Extractor',
                description: 'Extract the most probable keywords for the given text',
                link: 'keywords-extractor'
            },
            {
                name: 'Sentiment Analyzer',
                description: 'Analyze sentiment of each sentence in your text',
                link: 'sentiment-analyzer'
            },
            {
                name: 'Similarity Checker',
                description: 'Check how similar are two given texts',
                link: 'similarity-checker'
            },
            {
                name: 'Named Entity Recognizer',
                description: 'Find names of persons, organizations, locations, expressions of times etc.',
                link: 'named-entity-recognizer'
            },
        ];

        this.state = {};
    }

    render() {
        return (
            <div >
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className="appTitle">Text Tools</h1>
                        </Col>
                    </Row>
                    <Apps apps={this.apps}/>
                </Grid>
            </div>
        );
    }
}
