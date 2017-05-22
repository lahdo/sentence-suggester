import React, {Component} from 'react';
import Card from './Card.js';
import Page from './Page.js';
import StyleSelector from './StyleSelector.js';
import {Grid, Row, Col} from 'react-bootstrap';

export default class Content extends Component {

    componentDidMount() {
    }

    onKeyDown(event) {
        if (event.keyCode === 38) { // UP
            // event.preventDefault();
            // const inputs =
            //     Array.prototype.slice.call(document.querySelectorAll("input"));
            // const index =
            //     (inputs.indexOf(document.activeElement) + 1) % inputs.length;
            // const input = inputs[index];
            // input.focus();
            // input.select();
            console.log('UP');
        }
        if (event.keyCode === 40) { // DOWN
            // event.preventDefault();
            console.log('DOWN');
        }
    }

    render() {
        return (
            <div onKeyDown={this.onKeyDown.bind(this)}>
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <StyleSelector jargons={this.props.jargons}
                                           selectedJargon={this.props.selectedJargon}
                                           selectStyle={this.props.selectStyle}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3}>
                            <Page firstCharCaretCoordinates={this.props.firstCharCaretCoordinates}
                                  setFirstCharCaretCoordinates={this.props.setFirstCharCaretCoordinates}
                                  setCardVisibility={this.props.setCardVisibility}
                                  setCaretCoordinates={this.props.setCaretCoordinates}
                                  selectedSuggestion={this.props.selectedSuggestion}
                                  cachedSelection={this.props.cachedSelection}
                                  setCachedSelection={this.props.setCachedSelection}
                                  onSearch={this.props.onSearch}
                                  numberOfWords={ this.props.numberOfWords }
                                  caretCoordinates={this.props.caretCoordinates}/>
                            {
                                this.props.cardVisibility ?
                                    <Card cardStyles={this.props.cardStyles}
                                          selectSuggestion={this.props.selectSuggestion}
                                          suggestions={this.props.suggestions}/> : null
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}