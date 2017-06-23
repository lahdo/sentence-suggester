import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Col, Grid, Row} from "react-bootstrap";
import Unsplash from 'unsplash-js';

import MainButtons from "../components/MainButtons";
import TextInput from '../components/TextInput';
import Keywords from '../components/Keywords';
import ImageGrid from '../components/ImageGrid';
import Spinner from "../components/Spinner";
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
        this.onMainButtonClick = this.onMainButtonClick.bind(this);
        this.getImages = this.getImages.bind(this);
        this.setSpinner = this.setSpinner.bind(this);
        this.setInputtedText = this.setInputtedText.bind(this);
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
        this.setState({"showSpinner": true});
        api.fetchKeywords(searchObject).then(
            response => response.json()
        ).then(
            keywords => {
                this.setState({'keywords': keywords});
                return keywords.slice(0, this.maxKeywords).map(keyword => {
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
            .then(data => {
                    this.setState({"showSpinner": false}); //WRONG PLACE!!!
                    return this.setImages(data.results, keyword);
                }
            );
    }

    setImages(images, keyword) {
        images.forEach((image) =>
            image.keyword = keyword
        );
        this.setState({"images": this.state.images.concat(images)});

        if (images.length) {
            this.setState({"haveResults": true})
        }
        else {
            this.setState({"haveResults": false})
        }
    }

    onMainButtonClick() {
        let text = ReactDOM.findDOMNode(this.refs.page).textContent;
        if(text.length) {
            this.setState({"inputtedText": text});
            this.handleSearch(text);
        }
    }

    setSpinner(value) {
        this.setState({"showSpinner": value});
    }

    setInputtedText(value) {
        ReactDOM.findDOMNode(this.refs.page).textContent = value;
        this.setState({"inputtedText": value});
    }

    render() {
        return (
            <div>
                <Spinner showSpinner={ this.state.showSpinner }/>
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
                            <MainButtons mainButtonText="Extract Keywords"
                                         setInputtedText={ this.setInputtedText }
                                         setSpinner={ this.setSpinner }
                                         onMainButtonClick={ this.onMainButtonClick } />
                            <Keywords keywords={ this.state.keywords }/>
                        </Col>
                    </Row>
                    <ImageGrid images={this.state.images}
                               keywords={this.state.keywords}
                               haveResults={this.state.haveResults}/>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <TextInput ref="page"/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}