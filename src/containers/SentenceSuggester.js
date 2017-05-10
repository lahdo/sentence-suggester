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
            cardVisibility: false
        };

        this.setCaretCoordinates = this.setCaretCoordinates.bind(this);
        this.setCardVisibility = this.setCardVisibility.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        console.log(this.state.caretCoordinates)
    }

    setCaretCoordinates(caretCoordinates) {
        this.setState({'caretCoordinates': caretCoordinates});
    }

    setCardVisibility(cardVisibility) {
        this.setState({'cardVisibility': cardVisibility});
    }

    render() {
        return (
            <Layout>
                <NavigationBar />
                <Content cardVisibility={this.state.cardVisibility}
                         setCardVisibility={this.setCardVisibility}
                         cardStyles={this.state.caretCoordinates}
                         caretCoordinates={this.state.caretCoordinates}
                         setCaretCoordinates={this.setCaretCoordinates}/>
                <Footer />
            </Layout>
        );
    }
}