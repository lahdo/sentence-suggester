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
                <div className='sentences-list'
                     style={cardStyles}>
                    <ul className='sentences'>
                        {
                            this.props.suggestions.map(function (suggestion, i) {
                                return (
                                    <li className="suggestion"
                                                   onClick={() => this.props.selectSuggestion(suggestion)}
                                                   key={i}>
                                        {suggestion}
                                    </li>
                                );
                            }, this)
                        }
                    </ul>
                </div>
            </div>
        );
    }
}


