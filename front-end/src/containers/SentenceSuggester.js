import React, {Component} from 'react';
import {each} from 'lodash';
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
            cardVisibility: false
        };

        this.setCaretCoordinates = this.setCaretCoordinates.bind(this);
        this.setCardVisibility = this.setCardVisibility.bind(this);
        this.selectSuggestion = this.selectSuggestion.bind(this);
        this.setFirstCharCaretCoordinates = this.setFirstCharCaretCoordinates.bind(this);
        this.setCachedSelection = this.setCachedSelection.bind(this);
        this.selectStyle = this.selectStyle.bind(this);
        this.doSearchRequest = this.doSearchRequest.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
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

    doSearchRequest() {
        const base = 'http://127.0.0.1:8000/api/v1/suggestions/';

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`${base}`, {
                method: 'POST',
                body: JSON.stringify({ words: ['the', 'other']}),//this.state.words
                headers: myHeaders
            }
        ).then(
            response => response.json()
        ).then(
            data => this.setState({'suggestions': data})
        )
    }

    handleSearch(value) {
        // const [language] = this.state.direction;
        // let cursor = store.trie[language];
        //
        // Array.prototype.forEach.call(value, char => (
        //     cursor = cursor ? cursor[char] : null
        // ));
        //
        // this.setState({
        //     suggestions: uniq([
        //         value,
        //         ...suggestions(cursor, value),
        //     ].map(
        //         word => word.trim()
        //     )),
        //     keyword: value,
        // });

        this.doSearchRequest(value);
    }

    render() {
        return (
            <Layout>
                <NavigationBar />
                <Content styles={this.state.styles}
                         selectedStyle={this.state.selectedStyle}
                         selectStyle={this.selectStyle}

                         firstCharCaretCoordinates={this.state.firstCharCaretCoordinates}
                         setFirstCharCaretCoordinates={this.setFirstCharCaretCoordinates}

                         cachedSelection={this.state.cachedSelection}
                         setCachedSelection={this.setCachedSelection}

                         cardVisibility={this.state.cardVisibility}
                         setCardVisibility={this.setCardVisibility}

                         cardStyles={this.state.caretCoordinates}

                         selectSuggestion={this.selectSuggestion}
                         selectedSuggestion={this.state.selectedSuggestion}
                         suggestions={this.state.suggestions}

                         onSearch={this.handleSearch}

                         caretCoordinates={this.state.caretCoordinates}
                         setCaretCoordinates={this.setCaretCoordinates}/>
                <Footer />
            </Layout>
        );
    }
}