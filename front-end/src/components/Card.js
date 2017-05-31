import React, {Component} from 'react';
import {findIndex} from 'lodash';

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.isFocused = this.isFocused.bind(this);
        this.renderSentences = this.renderSentences.bind(this);
        this.renderWords = this.renderWords.bind(this);
    }

    calculateCardStyle() {
        return {
            top: this.props.cardStyles.top + 27,
            left: this.props.cardStyles.left - 10
        };
    }

    isFocused(row, column) {
        if (this.props.cardSelections.selections.length) {
            return this.props.cardSelections.selections[row][column];
        }
        else {
            return false;
        }
    }

    renderWords(word, row, column) {
        return (
            <div key={column} className="word">
              <span onClick={() => this.props.selectSuggestion(row, column)}
                    className={this.isFocused(row, column) ? 'selection single-word' : 'single-word'}>
                  {word}
             </span>
            </div>
        );
    }

    renderSentences(suggestion, row) {
        return (
            <div key={row}>
                <li className="suggestion">
                    {
                        suggestion.map(
                            (word, column) => this.renderWords(word, row, column)
                        )
                    }
                </li>
                {/*<hr />*/}
            </div>
        );
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
                                    this.props.suggestions.map(
                                        (suggestion, row) => this.renderSentences(suggestion, row)
                                    )
                                }
                            </ul>
                        </div> : null
                }
            </div>
        );
    }
}


