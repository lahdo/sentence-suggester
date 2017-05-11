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

        this.state = {
            caretCoordinates: {
                top: 0,
                left: 0
            },
            suggestions: [
                'Please note that this library is',
                'Please take a note',
                'Please make sure'
            ],
            styles: [
                'IT',
                'Lovers',
                'Formal',
                'Trump-like'
            ],
            selectedStyle: 0,
            selectedSuggestion: '',
            cardVisibility: false
        };

        this.setCaretCoordinates = this.setCaretCoordinates.bind(this);
        this.setCardVisibility = this.setCardVisibility.bind(this);
        this.selectSuggestion = this.selectSuggestion.bind(this);
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

    render() {
        return (
            <Layout>
                <NavigationBar />
                <Content styles={this.state.styles}
                         selectedStyle={this.state.selectedStyle}
                         selectStyle={this.selectStyle}
                         cardVisibility={this.state.cardVisibility}
                         setCardVisibility={this.setCardVisibility}
                         cardStyles={this.state.caretCoordinates}
                         selectSuggestion={this.selectSuggestion}
                         selectedSuggestion={this.props.selectedSuggestion}
                         suggestions={this.state.suggestions}
                         caretCoordinates={this.state.caretCoordinates}
                         setCaretCoordinates={this.setCaretCoordinates}/>
                <Footer />
            </Layout>
        );
    }
}