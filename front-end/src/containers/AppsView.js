import React, {Component} from 'react';

import '../App.css';
import {Col, Grid, Panel, Row} from "react-bootstrap";
import {Link} from "react-router-dom";


export default class AppsView extends Component {
    constructor(props) {
        super(props);

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

                    <Row>
                        <Col md={3} mdOffset={3}>
                            <Panel >
                                <Link to="sentence-suggester">Sentence Suggester</Link>
                                <br/>
                                <span>Write 10 times faster thanks to Markov Chain like model</span>
                            </Panel>
                        </Col>
                        <Col md={3}>
                            <Panel >
                                <Link to="keywords-extractor">Keywords Extractor</Link>
                                <br/>
                                <span>Extract the most probable keywords for the given text</span>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} mdOffset={3}>
                            <Panel >
                                <Link to="sentiment-analyzer">Sentiment Analyzer</Link>
                                <br/>
                                <span>Analyze sentiment of each sentence in your text</span>
                            </Panel>
                        </Col>
                        <Col md={3}>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}