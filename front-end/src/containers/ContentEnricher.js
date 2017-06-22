import React, {Component} from 'react';
import {Button, Col, Grid, Row} from "react-bootstrap";
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';

import Spinner from "../components/Spinner";
import TextInput from '../components/TextInput';
import * as api from '../utils/api.js'
import {entitiesForEnrichment} from '../constants.js';

import styles from '../App.css';
import Enrichments from "../components/Enrichments";

export default class ContentEnricher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enrichments: [],
            entities: '',
            inputtedText: '',
            showSpinner: false,
            haveResults: false
        };

        this.maxKeywords = 50;

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getEnrichments = this.getEnrichments.bind(this);
        this.setEnrichments = this.setEnrichments.bind(this);
        this.processEntities = this.processEntities.bind(this);
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
            entities => {
                this.setState({"entities": entities});
                const keywords = this.processEntities(entities);

                return keywords.slice(0, this.maxKeywords).map(keyword => {
                        this.getEnrichments(keyword);
                    }
                )
            }
        )
    }

    processEntities(entities) {
        let keywords = [];

        Object.keys(entities).forEach(entity => {
                if (entity in entitiesForEnrichment) {
                    keywords = keywords.concat(entities[entity]);
                }
            }
        );

        keywords = [...new Set(keywords)]; //Make keywords unique

        return keywords;
    }

    getEnrichments(keyword) {
        const searchObject = {
            keyword: keyword
        };
        api.fetchContentEnrichment(searchObject)
            .then(response => response.json())
            .then(data => {
                    this.setState({"showSpinner": false}); //WRONG PLACE!!!
                    return this.setEnrichments(data, keyword);
                }
            );
    }

    setEnrichments(enrichments, keyword) {
        if (enrichments) {
            enrichments.forEach((enrichment) =>
                enrichment.keyword = keyword
            );
            this.setState({"enrichments": this.state.enrichments.concat(enrichments)});

            if (enrichments.length) {
                this.setState({"haveResults": true})
            }
            else {
                this.setState({"haveResults": false})
            }
        }
    }

    onClick() {
        let text = ReactDOM.findDOMNode(this.refs.textForKeywords).textContent;
        this.setState({"inputtedText": text});
        this.handleSearch(text);
    }

    render() {
        return (
            <div>
                <Spinner showSpinner={ this.state.showSpinner }/>
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <h1 className={ styles.appTitle }>
                                Content Enricher
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <div className={ styles.styleSelector }>
                                <Button bsStyle="primary"
                                        onClick={this.onClick}>
                                    Enrich Content
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {
                        this.state.enrichments.length ?
                            <div className="entityText">
                                <Enrichments
                                    enrichments={ this.state.enrichments }
                                />
                            </div>
                            : null
                    }
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
