import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Col, Grid, Row} from "react-bootstrap";
import Unsplash from 'unsplash-js';

import TextInput from '../components/TextInput';
import Keywords from '../components/Keywords';
import ImageGrid from '../components/ImageGrid';
import * as api from '../utils/api.js'
import {unsplashConfig} from '../constants.js';

import styles from '../App.css';

export default class KeywordExtractor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keywords: [],
            images: [],
            inputtedText: '',
            haveResults: false
        };

        this.unsplash = new Unsplash(unsplashConfig);
        this.maxKeywords = 4;

        this.handleSearch = this.handleSearch.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getImages = this.getImages.bind(this);
    }

    handleSearch(text, ratio = 0.1) {
        this.setState({'inputtedText': text});

        const searchObject = {
            text: text,
            ratio: ratio
        };

        this.setState({"images": []});
        this.doSearchRequest(searchObject);
    }

    doSearchRequest(searchObject) {
        api.getKeywords(searchObject).then(
            response => response.json()
        ).then(
            keywords => {
                this.setState({'keywords': keywords});
                keywords.slice(0, this.maxKeywords).map(keyword => {
                        this.getImages(keyword);
                    }
                )
            }
        )
    }

    getImages(keyword) {
        let pageNumber = 1;

        this.unsplash.search.photos(keyword, pageNumber)
            .then(response => response.json())
            .then(data =>
                this.setImages(data.results, keyword)
            );
    }

    setImages(images, keyword) {
        images.forEach((image) =>
            image.keyword = keyword
        );
        this.setState({ "images": this.state.images.concat(images) });

        if(images.length) {
            this.setState({"haveResults": true})
        }
        else {
            this.setState({"haveResults": false})
        }
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
                            <h1 className={ styles.appTitle }>
                                Keywords Extractor
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <div className={ styles.styleSelector }>
                                <Button bsStyle="primary"
                                        onClick={this.onClick}>
                                    Extract Keywords
                                </Button>
                                <Keywords keywords={ this.state.keywords }/>
                            </div>
                        </Col>
                    </Row>
                    <ImageGrid images={this.state.images}
                               keywords={this.state.keywords}
                               haveResults={this.state.haveResults}/>
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