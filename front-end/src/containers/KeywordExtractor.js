import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Col, Grid, Row} from "react-bootstrap";

import '../App.css';
import TextInput from "../components/TextInput";
import Keywords from "../components/Keywords";
import * as api from '../utils/api.js'
import Unsplash from 'unsplash-js';

const unsplash = new Unsplash({
    applicationId: "398d7e71c384ba92212d51cc4317d90945ccdbaa093400cd2f445d3a564e6b93",
    secret: "4557138090cffb041fccfc64024f863b63340bde6ee887cfc76ece0cc229956a",
    callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
});

export default class SentenceSuggester extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keywords: [],
            inputtedText: ''
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
    }


    handleSearch(text, ratio = 0.1) {
        this.setState({'inputtedText': text});

        const searchObject = {
            text: text,
            ratio: ratio
        };

        this.doSearchRequest(searchObject);
    }

    doSearchRequest(searchObject) {
        api.getKeywords(searchObject).then(
            response => response.json()
        ).then(
            keywords => {
                this.setState({'keywords': keywords});

                keywords.map(keyword => {
                        unsplash.photos.searchPhotos(keyword)
                            .then(response => response.json())
                            .then(json => {
                                console.log(json)
                            });
                    }
                )
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
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className="appTitle">Keywords Extractor</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <div className="styleSelector">
                                <Button bsStyle="primary"
                                        onClick={this.onClick}>
                                    Extract Keywords
                                </Button>
                                <Keywords keywords={ this.state.keywords }/>
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
        );
    }
}