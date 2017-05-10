import React, {Component} from 'react';
import Card from './Card.js';
import Page from './Page.js';

export default class Content extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Page setCardVisibility={this.props.setCardVisibility}
                      setCaretCoordinates={this.props.setCaretCoordinates}
                      caretCoordinates={this.props.caretCoordinates}/>
                {
                    this.props.cardVisibility ?
                        <Card cardStyles={this.props.cardStyles}/> : null
                }
            </div>
        );
    }
}