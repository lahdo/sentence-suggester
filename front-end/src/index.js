import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AppsView from "./containers/AppsView";
import SentenceSuggester from './containers/SentenceSuggester.js';
import KeywordExtractor from './containers/KeywordExtractor.js';
import SentimentAnalyzer from './containers/SentimentAnalyzer.js';
import SimilarityChecker from './containers/SimilarityChecker.js';
import NamedEntityRecognizer from './containers/NamedEntityRecognizer.js';
import TextSummarizer from './containers/TextSummarizer.js';
import ContentEnricher from './containers/ContentEnricher.js';

import Layout from "./components/Layout";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";

import './index.css';
import './bootstrap.css';
import 'font-awesome/css/font-awesome.css';

ReactDOM.render((
        <Router>
            <Layout>
                <NavigationBar />
                <Route exact
                       name="appsView"
                       path="/"
                       component={AppsView}/>
                <Route name="sentenceSuggester"
                       path="/sentence-suggester"
                       component={SentenceSuggester}/>
                <Route name="sentimentAnalyzer"
                       path="/sentiment-analyzer"
                       component={SentimentAnalyzer}/>
                <Route name="keywordsExtractor"
                       path="/keywords-extractor"
                       component={KeywordExtractor}/>
                <Route name="similarityChecker"
                       path="/similarity-checker"
                       component={SimilarityChecker}/>
                <Route name="NamedEntityRecognizer"
                       path="/named-entity-recognizer"
                       component={NamedEntityRecognizer}/>
                <Route name="TextSummarizer"
                       path="/text-summarizer"
                       component={TextSummarizer}/>
                <Route name="ContentEnricher"
                       path="/content-enricher"
                       component={ContentEnricher}/>
                <Footer />
            </Layout>
        </Router>
    ),
    document.getElementById('root')
);
