import React, {Component} from 'react';
import {findIndex} from 'lodash';

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.isFocused = this.isFocused.bind(this);
        this.renderSentences = this.renderSentences.bind(this);
        this.renderWords = this.renderWords.bind(this);
        this.renderWord = this.renderWord.bind(this);
        this.renderBeginning = this.renderBeginning.bind(this);
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
        let beginning = '';
        let ending = word;
        let last = this.props.inputtedWords.length - 1;
        let lastButOne = this.props.inputtedWords.length - 2;
        let inputtedWord = this.props.inputtedWords[last] !== ""
            ? this.props.inputtedWords[last]
            : this.props.inputtedWords[lastButOne];
        let isInputIncluded = word.indexOf(inputtedWord) === 0;

        if (isInputIncluded) {
            beginning = inputtedWord;
            ending = word.slice(inputtedWord.length);
        }

        return (
            <div key={column} className='words noselect'>
              <span onClick={() => this.props.selectSuggestion(row, column)}
                    onMouseOver={ () => this.props.onMouseOver(row, column) }
                    className={this.isFocused(row, column) ? 'selection single-word' : 'single-word'}>
                  {this.renderWord(beginning, ending, row)}
             </span>
            </div>
        );
    }

    renderWord(beginning, ending, row) {
        return (
            <div className='word'>
                <span className='beginning'
                      onClick={() => this.props.selectSuggestion(row, 0)}
                      onMouseOver={ () => this.props.onMouseOver(row, 0) }
                >{beginning}</span>
                <span className='ending'>{ending}</span>
            </div>
        );
    }

    renderBeginning(words, row) {
        if (words.length) {
            return (
                words.map((word,index) =>
                    <div key={index} className='words noselect'>
                                <span
                                    className={this.isFocused(row, 0) ? 'selection single-word' : 'single-word'}>
                                    {this.renderWord(word, "", row)}
                                </span>
                    </div>
                )
            );
        }
    }

    renderSentences(suggestion, row) {
        return (
            <div key={row}>
                <li className='suggestion'>
                    <span>{ this.renderBeginning(suggestion.beginning, row) }</span>
                    {
                        suggestion.ending.map(
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


