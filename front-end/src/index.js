import React from 'react';
import ReactDOM from 'react-dom';
import SentenceSuggester from './containers/SentenceSuggester.js';
import KeywordExtractor from './containers/KeywordExtractor.js';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Layout from "./components/Layout";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";

import './index.css';
import './bootstrap.css';
import AppsView from "./containers/AppsView";

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
                <Route name="keywordsExtractor"
                       path="/keywords-extractor"
                       component={KeywordExtractor}/>
                <Footer />
            </Layout>
        </Router>
    ),
    document.getElementById('root')
);
