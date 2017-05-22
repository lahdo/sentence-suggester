import React, {Component} from 'react';
import {debounce} from 'lodash';

import Layout from '../components/Layout.js';
import NavigationBar from '../components/NavigationBar.js';
import Content from '../components/Content.js';
import Footer from '../components/Footer.js';

import * as api from '../utils/api.js'

import '../App.css';

export default class SentenceSuggester extends Component {
    constructor(props) {
        super(props);

        this.jargons = [
            'IT',
            'Lovers',
            'Formal',
            'Trump-like'
        ];

        this.state = {
            caretCoordinates: {
                top: 0,
                left: 0
            },
            suggestions: [],
            jargons: this.jargons,
            cachedSelection: {},
            firstCharCaretCoordinates: {},
            selectedJargon: this.jargons[0],
            selectedSuggestion: '',
            cardVisibility: false,
            numberOfWords: 2
        };

        this.setCaretCoordinates = this.setCaretCoordinates.bind(this);
        this.setCardVisibility = this.setCardVisibility.bind(this);
        this.selectSuggestion = this.selectSuggestion.bind(this);
        this.setFirstCharCaretCoordinates = this.setFirstCharCaretCoordinates.bind(this);
        this.setCachedSelection = this.setCachedSelection.bind(this);
        this.selectStyle = this.selectStyle.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.getJargons = this.getJargons.bind(this);
        this.doSearchRequest = debounce(this.doSearchRequest, 300, {
            trailing: true
        });
    }

    componentDidMount() {
        this.getJargons();
        this.getDefaultJargon();
    }

    componentDidUpdate() {
        //console.log(this.state.caretCoordinates)
    }

    setCaretCoordinates(caretCoordinates) {
        this.setState({'caretCoordinates': caretCoordinates});
    }

    setCardVisibility(cardVisibility) {
        this.setState({'cardVisibility': cardVisibility});
    }

    selectSuggestion(selectedSuggestion) {
        this.setState({'selectedSuggestion': selectedSuggestion});
    }

    selectStyle(selectedStyle) {
        this.setState({"selectedJargon": selectedStyle});
    }

    setFirstCharCaretCoordinates(firstCharCaretCoordinates) {
        this.setState({'firstCharCaretCoordinates': firstCharCaretCoordinates});
    }

    setCachedSelection(cachedSelection) {
        this.setState({'cachedSelection': cachedSelection});
    }

    doSearchRequest(searchObject) {
        api.getSuggestions(searchObject).then(
            response => response.json()
        ).then(
            suggestions => {
                this.setState({'suggestions': suggestions})
            }
        );
    }

    getJargons() {
        api.getJargons().then(
            response => response.json()
        ).then(
            jargons => {
                this.setState({'jargons': jargons.models})
            }
        );
    }

    getDefaultJargon() {
        api.getDefaultJargon().then(
            response => response.json()
        ).then(
            defaultJargon => {
                this.setState({'selectedJargon': defaultJargon})
            }
        );
    }

    handleSearch(arrayOfWords, jargon = 'default') {
        const selectedJargon = jargon !== 'default' ? jargon : this.state.selectedJargon;

        const searchObject = {
            words: arrayOfWords,
            jargon: selectedJargon
        };

        this.doSearchRequest(searchObject);
    }

    render() {
        return (
            <Layout>
                <NavigationBar />
                <Content jargons={ this.state.jargons }
                         selectedJargon={ this.state.selectedJargon }
                         selectStyle={ this.selectStyle }

                         firstCharCaretCoordinates={ this.state.firstCharCaretCoordinates }
                         setFirstCharCaretCoordinates={ this.setFirstCharCaretCoordinates }

                         cachedSelection={ this.state.cachedSelection }
                         setCachedSelection={ this.setCachedSelection }

                         cardVisibility={ this.state.cardVisibility }
                         setCardVisibility={ this.setCardVisibility }

                         cardStyles={ this.state.caretCoordinates }

                         selectSuggestion={ this.selectSuggestion }
                         selectedSuggestion={ this.state.selectedSuggestion }
                         suggestions={ this.state.suggestions }

                         onSearch={ this.handleSearch }
                         numberOfWords={ this.state.numberOfWords }

                         caretCoordinates={ this.state.caretCoordinates }
                         setCaretCoordinates={ this.setCaretCoordinates }/>
                <Footer />
            </Layout>
        );
    }
}