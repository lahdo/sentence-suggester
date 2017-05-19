import React, {Component} from 'react';
import { debounce } from 'lodash';
import fetch from 'isomorphic-fetch';

import Layout from '../components/Layout.js';
import NavigationBar from '../components/NavigationBar.js';
import Content from '../components/Content.js';
import Footer from '../components/Footer.js';

import '../App.css';

export default class SentenceSuggester extends Component {
    constructor(props) {
        super(props);

        this.styles = [
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
            styles: this.styles,
            cachedSelection: {},
            firstCharCaretCoordinates: {},
            selectedStyle: this.styles[0],
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
        this.doSearchRequest = debounce(this.doSearchRequest, 300, {
            trailing: true
        });
    }

    componentDidMount() {
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
        this.setState({'selectedStyle': selectedStyle});
    }

    setFirstCharCaretCoordinates(firstCharCaretCoordinates) {
        this.setState({'firstCharCaretCoordinates': firstCharCaretCoordinates});
    }

    setCachedSelection(cachedSelection) {
        this.setState({'cachedSelection': cachedSelection});
    }

    doSearchRequest(searchObject) {
        const base = 'http://127.0.0.1:8000/api/v1/suggestions/';

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`${base}`, {
                method: 'POST',
                body: JSON.stringify(searchObject),//this.state.words
                headers: myHeaders
            }
        ).then(
            response => response.json()
        ).then(
            data => this.setState({'suggestions': data})
        )
    }

    handleSearch(arrayOfWords, jargon='default') {
        const searchObject = {
            words: arrayOfWords,
            jargon: jargon
        };

        this.doSearchRequest(searchObject);
    }

    render() {
        return (
            <Layout>
                <NavigationBar />
                <Content styles={ this.state.styles }
                         selectedStyle={ this.state.selectedStyle }
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