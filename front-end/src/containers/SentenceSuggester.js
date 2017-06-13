import React, {Component} from 'react';
import {debounce} from 'lodash';

import Layout from '../components/Layout.js';
import NavigationBar from "../components/NavigationBar";
import Content from '../components/Content.js';
import Footer from '../components/Footer.js';

import * as api from '../utils/api.js'

import '../App.css';


export default class SentenceSuggester extends Component {
    constructor(props) {
        super(props);

        this.jargons = [];

        this.state = {
            caretCoordinates: {
                top: 0,
                left: 0
            },
            cardSelections: {
                cursorPosition: [],
                selections: [],
                focused: false
            },
            inputtedWords: [],
            suggestions: [],
            jargons: this.jargons,
            cachedSelection: {},
            firstCharCaretCoordinates: {},
            selectedJargon: '',
            selectedSuggestion: [],
            cardVisibility: false,
            numberOfWords: 2
        };

        this.setCaretCoordinates = this.setCaretCoordinates.bind(this);
        this.setCardVisibility = this.setCardVisibility.bind(this);
        this.selectSuggestion = this.selectSuggestion.bind(this);
        this.setFirstCharCaretCoordinates = this.setFirstCharCaretCoordinates.bind(this);
        this.setCachedSelection = this.setCachedSelection.bind(this);
        this.selectStyle = this.selectStyle.bind(this);
        this.setCardSelections = this.setCardSelections.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.getJargons = this.getJargons.bind(this);
        this.reinitializeCardSelections = this.reinitializeCardSelections.bind(this);
        this.cleanSuggestions = this.cleanSuggestions.bind(this);
        this.doSearchRequest = debounce(this.doSearchRequest, 200, {
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

    setCardSelections(cardSelections) {
        this.setState({'cardSelections': cardSelections});
    }

    setCardVisibility(cardVisibility) {
        this.setState({'cardVisibility': cardVisibility});
    }

    selectSuggestion(row, column) {
        this.setState({'selectedSuggestion': [row, column]});
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
                this.reinitializeCardSelections(suggestions);
                suggestions = this.cleanSuggestions(suggestions);
                this.setState({'suggestions': suggestions});
            }
        );
    }

    cleanSuggestions(suggestions) {
        suggestions.map( suggestion => {
            if(suggestion == 1) {

            }
        });

        return suggestions;
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

    reinitializeCardSelections(suggestions) {
        let cardSelections = [];
        if(suggestions.length) {
            suggestions.map((sentence) => {
                let row = [];
                sentence.ending.map(() => row.push(false));
                cardSelections.push(row);
            });
            this.setCardSelections({
                cursorPosition: [],
                selections: cardSelections,
                focus: false
            });
        }
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

        this.setState({'inputtedWords': arrayOfWords});

        const searchObject = {
            words: arrayOfWords,
            jargon: selectedJargon
        };

        this.doSearchRequest(searchObject);
    }

    render() {
        return (
                <Content jargons={ this.state.jargons }
                         selectedJargon={ this.state.selectedJargon }
                         selectStyle={ this.selectStyle }

                         firstCharCaretCoordinates={ this.state.firstCharCaretCoordinates }
                         setFirstCharCaretCoordinates={ this.setFirstCharCaretCoordinates }

                         cachedSelection={ this.state.cachedSelection }
                         setCachedSelection={ this.setCachedSelection }

                         cardSelections={ this.state.cardSelections }
                         setCardSelections={ this.setCardSelections }

                         cardVisibility={ this.state.cardVisibility }
                         setCardVisibility={ this.setCardVisibility }

                         cardStyles={ this.state.caretCoordinates }

                         selectSuggestion={ this.selectSuggestion }
                         selectedSuggestion={ this.state.selectedSuggestion }
                         suggestions={ this.state.suggestions }

                         onSearch={ this.handleSearch }
                         numberOfWords={ this.state.numberOfWords }

                         inputtedWords={ this.state.inputtedWords }

                         caretCoordinates={ this.state.caretCoordinates }
                         setCaretCoordinates={ this.setCaretCoordinates }/>
        );
    }
}