import React, {Component} from 'react';

export default class Card extends Component {

    calculateCardStyle() {
        return {
            top: this.props.cardStyles.top + 27,
            left: this.props.cardStyles.left - 10
        };
    }

    render() {
        const cardStyles = this.calculateCardStyle();

        return (
            <div>
                {
                    this.props.suggestions.length ?
                        <div className='sentences-list'
                             style={cardStyles}>
                            <ul className='sentences'>
                                {
                                    this.props.suggestions.map(function (suggestion, i) {
                                        return (
                                            <div key={i}>
                                                <li className="suggestion"
                                                    onClick={() => this.props.selectSuggestion(suggestion)}>
                                                    {suggestion}
                                                </li>
                                                {/*<hr />*/}
                                            </div>
                                        );
                                    }, this)
                                }
                            </ul>
                        </div> : null
                }
            </div>
        );
    }
}


