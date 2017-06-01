import React, {Component} from 'react';
import Card from './Card.js';
import Page from './Page.js';
import StyleSelector from './StyleSelector.js';
import {Grid, Row, Col} from 'react-bootstrap';
import * as SentenceParser from '../lib/SentenceParser';
import * as ReactDOM from "react-dom";

export default class Content extends Component {
    constructor(props) {
        super(props);

        this.moveCardCursor = this.moveCardCursor.bind(this);
        this.recalculateCardSelections = this.recalculateCardSelections.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.getCaretCoordinates = this.getCaretCoordinates.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.insertCaretIndicator = this.insertCaretIndicator.bind(this);
        this.insertTextAtCursor = this.insertTextAtCursor.bind(this);
        this.removeCaretIndicator = this.removeCaretIndicator.bind(this);
        this.getCaretRelativePosition = this.getCaretRelativePosition.bind(this);
        this.getCurrentSelection = this.getCurrentSelection.bind(this);
        this.getWordsAndSearch = this.getWordsAndSearch.bind(this);
        this.normalizeCardCursor = this.normalizeCardCursor.bind(this);
        this.moveAndNormalizeCardCursor = this.moveAndNormalizeCardCursor.bind(this);
        this.isCardFocused = this.isCardFocused.bind(this);
        this.resetSelectionArray = this.resetSelectionArray.bind(this);

        this.processKeyUp = this.processKeyUp.bind(this);
        this.processKeyDown = this.processKeyDown.bind(this);
        this.processKeyLeft = this.processKeyLeft.bind(this);
        this.processKeyRight = this.processKeyRight.bind(this);
        this.processKeyEnter = this.processKeyEnter.bind(this);
        this.processCardSelections = this.processCardSelections.bind(this);

        this.getSelectedWords = this.getSelectedWords.bind(this);
        this.placeCaretAtEnd = this.placeCaretAtEnd.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            let textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }


    componentDidMount() {
    }

    moveCardCursor(increaseRow, increaseColumn) {
        let row = 0;
        let column = this.props.cardSelections.selections[row].length - 1;

        if (this.props.cardSelections.cursorPosition.length) {
            row = this.props.cardSelections.cursorPosition[0] + increaseRow;
        }

        if (this.props.cardSelections.cursorPosition.length) {
            column = this.props.cardSelections.cursorPosition[1] + increaseColumn;
        }

        return [row, column];
    }

    moveAndNormalizeCardCursor(increaseRow, increaseColumn) {
        let cursorPosition = this.moveCardCursor(increaseRow, increaseColumn);
        return this.normalizeCardCursor(cursorPosition[0], cursorPosition[1]);
    }

    normalizeCardCursor(row, column) {
        let lastRow = this.props.cardSelections.selections.length - 1;

        row = row > lastRow ? lastRow : row;
        row = row > 0 ? row : 0;

        let lastColumn = this.props.cardSelections.selections[row].length - 1;

        column = column > lastColumn ? lastColumn : column;
        column = column > 0 ? column : 0;

        return [row, column]
    }

    resetSelectionArray(selections) {
        return selections.map(
            (row) => {
                return row.map(() => {
                    return false;
                })
            });
    }

    recalculateCardSelections(cursorPosition) {
        let selections = this.resetSelectionArray(this.props.cardSelections.selections);

        if (cursorPosition[0] > -1) {
            selections[cursorPosition[0]] = selections[cursorPosition[0]].map((_, index) => {
                return (index <= cursorPosition[1]);
            });
        }

        return selections;
    }

    processKeyUp(e, cursorPosition, cardFocus) {
        cursorPosition = this.moveCardCursor(-1, 0);
        cardFocus = this.isCardFocused(cursorPosition);
        if (cardFocus) {
            cursorPosition = this.normalizeCardCursor(cursorPosition[0], cursorPosition[1]);
            e.preventDefault();
        }
        if (cursorPosition[0] === -1) { // When card in not focused for the first time, prevent moving the caret
            e.preventDefault();
        }
        return [cursorPosition, cardFocus];
    }

    processKeyDown(e, cursorPosition, cardFocus) {
        cursorPosition = this.moveCardCursor(1, 0);
        cardFocus = this.isCardFocused(cursorPosition);
        if (cardFocus) {
            cursorPosition = this.normalizeCardCursor(cursorPosition[0], cursorPosition[1]);
            e.preventDefault();
        }
        return [cursorPosition, cardFocus];
    }

    processKeyLeft(e, cursorPosition, cardFocus) {
        cursorPosition = this.moveAndNormalizeCardCursor(0, -1);
        cardFocus = true;
        e.preventDefault();

        return [cursorPosition, cardFocus];
    }

    processKeyRight(e, cursorPosition, cardFocus) {
        cursorPosition = this.moveAndNormalizeCardCursor(0, 1);
        cardFocus = true;
        e.preventDefault();

        return [cursorPosition, cardFocus];
    }

    processKeyEnter(e) {
        let cursorPosition = this.props.cardSelections.cursorPosition;
        this.props.selectSuggestion(cursorPosition[0], cursorPosition[1]);
        let cardFocus = true;
        e.preventDefault();

        return cardFocus;
    }

    processCardSelections(updated, cursorPosition, cardFocus) {
        if (updated) {
            let selections = this.recalculateCardSelections(cursorPosition);

            this.props.setCardSelections({
                cursorPosition: cursorPosition,
                selections: selections,
                focused: cardFocus
            });
        }
    }

    onKeyDown(e) {
        let cursorPosition = false;
        let cardFocus = false;
        let updated = false;

        let canNavigateInCard = this.props.cardSelections.focused && this.props.cardVisibility;

        if (e.keyCode === 38) { // UP
            [cursorPosition, cardFocus] = this.processKeyUp(e, cursorPosition, cardFocus);
            updated = true;
        }
        else if (e.keyCode === 40) { // DOWN
            [cursorPosition, cardFocus] = this.processKeyDown(e, cursorPosition, cardFocus);
            updated = true;
        }

        if (canNavigateInCard) {
            if (e.keyCode === 37) { // LEFT
                [cursorPosition, cardFocus] = this.processKeyLeft(e, cursorPosition, cardFocus);
                updated = true;
            }
            else if (e.keyCode === 39) { // RIGHT
                [cursorPosition, cardFocus] = this.processKeyRight(e, cursorPosition, cardFocus);
                updated = true;
            }
            else if (e.keyCode === 13) { // ENTER
                cardFocus = this.processKeyEnter(e);
                updated = true;
            }
        }

        this.processCardSelections(updated, cursorPosition, cardFocus);
    }

    isCardFocused(cursorPosition) {
        let row = cursorPosition[0];
        return !(row < 0);
    }

    handleChange() {
        let caretCoordinates = this.getCaretCoordinates();
        this.props.setCaretCoordinates(caretCoordinates);
        this.props.setCachedSelection(this.getCurrentSelection());
        this.getWordsAndSearch();
    }

    getWordsAndSearch() {
        const range = window.getSelection().getRangeAt(0);
        const words = SentenceParser.getWords(
            range.startContainer.textContent,
            this.props.numberOfWords
        );

        this.props.onSearch(words);

        // console.log(
        //     "startContainer.nodeValue: ", range.startContainer.nodeValue +
        //     ', startContainer.textContent: ' + range.startContainer.textContent +
        //     ', startContainer.wholeText: ' + range.startContainer.wholeText
        // );
        // console.log(
        //     "endContainer.nodeValue: ", range.endContainer.nodeValue +
        //     ', endContainer.textContent: ' + range.endContainer.textContent +
        //     ', endContainer.wholeText: ' + range.endContainer.wholeText
        // );
        //
        // console.log(
        //     "startOffset: ", range.startOffset +
        //     ', endOffset: ' + range.endOffset +
        //     ', collapsed: ' + range.collapsed
        // );
    }

    onMouseOver(row, column) {
        console.log("Row, col: ", row, " ", column);
        this.processCardSelections(true, [row, column], true);
    }

    onClick(e) {
        // e.preventDefault();
        this.handleChange();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.selectedSuggestion !== nextProps.selectedSuggestion) {
            let words = this.getSelectedWords(nextProps.selectedSuggestion[0], nextProps.selectedSuggestion[1]);
            this.insertTextAtCursor(' ' + words.join(' '));
            this.placeCaretAtEnd(ReactDOM.findDOMNode(this.refs.page));
            this.handleChange();
        }
    }

    getSelectedWords(row, column) {
        let words = [];

        this.props.suggestions[row].forEach((word, index) => {
            if(index <= column) {
                words.push(word);
            }
        });

        return words;
    }

    getCaretCoordinates() {
        let caretCoordinates = {};
        let offsets = {};
        const minOffsets = {
            top: 234,
            left: 78
        };

        this.removeCaretIndicator();
        this.insertCaretIndicator();

        offsets = document.getElementById('caretIndicator').getBoundingClientRect();

        let offsetTop = 165;
        let offsetLeft = offsets.left - ((window.innerWidth - ReactDOM.findDOMNode(this.refs.page).offsetWidth) / 2) + 15;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        console.log('offsets.top: ', offsets.top);

        // if (this.getCaretRelativePosition(this.refs.page) === 0
        //     && this.props.firstCharCaretCoordinates.hasOwnProperty('top')) {
        //     caretCoordinates.top = this.props.firstCharCaretCoordinates.top;
        // }
        // else {
        //     caretCoordinates.top = offsets.top - offsetTop + scrollTop;
        // }
        caretCoordinates.top = offsets.top - offsetTop + scrollTop;
        caretCoordinates.left = offsetLeft > minOffsets.left ? offsetLeft : minOffsets.left;

        console.log('scrollTop', scrollTop);

        return caretCoordinates;
    }

    getCaretRelativePosition(editableDiv) {
        let caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode === editableDiv) {
                    caretPos = range.endOffset;
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() === editableDiv) {
                var tempEl = document.createElement("span");
                editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                var tempRange = range.duplicate();
                tempRange.moveToElementText(tempEl);
                tempRange.setEndPoint("EndToEnd", range);
                caretPos = tempRange.text.length;
            }
        }
        return caretPos;
    }


    insertTextAtCursor(text) {
        let selection, range, html;
        range = this.props.cachedSelection;
        if (range) {
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
        }
    }

    getCurrentSelection() {
        if (window.getSelection) {
            return window.getSelection().getRangeAt(0);
        }
    }

    removeCaretIndicator() {
        let caretIndicator = document.getElementById('caretIndicator');

        if (caretIndicator && caretIndicator.parentNode) {
            caretIndicator.parentNode.removeChild(caretIndicator);
        }
    }

    insertCaretIndicator() { // http://stackoverflow.com/a/6691294/3959662
        let selection, range;
        let html = '<span id="caretIndicator"></span>';
        let element = document.createElement('div');
        element.innerHTML = html;

        if (window.getSelection) {
            selection = window.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                range = selection.getRangeAt(0);

                let fragment = document.createDocumentFragment(), node, lastNode;

                while ((node = element.firstChild)) {
                    lastNode = fragment.appendChild(node);
                }
                range.insertNode(fragment);
            }
        } else if (document.selection && document.selection.type !== "Control") {
            document.selection.createRange().pasteHTML(html); // IE < 9
        }
    }

    onInput(e) {
        // e.preventDefault();
        ReactDOM.findDOMNode(this.refs.page).textContent ? this.props.setCardVisibility(true) : this.props.setCardVisibility(false);
        this.handleChange();
    }

    render() {
        return (
            <div >
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
                            <Page ref="page"
                                  onKeyDown={this.onKeyDown}
                                  onClick={ this.onClick }
                                  onInput={ this.onInput }
                                  onKeyUp={ this.onKeyUp }
                                  firstCharCaretCoordinates={this.props.firstCharCaretCoordinates}
                                  setFirstCharCaretCoordinates={this.props.setFirstCharCaretCoordinates}
                                  setCardVisibility={this.props.setCardVisibility}
                                  setCaretCoordinates={this.props.setCaretCoordinates}
                                  selectedSuggestion={this.props.selectedSuggestion}
                                  cachedSelection={this.props.cachedSelection}
                                  setCachedSelection={this.props.setCachedSelection}
                                  onSearch={this.props.onSearch}
                                  numberOfWords={ this.props.numberOfWords }

                                  cardSelections={ this.props.cardSelections }
                                  setCardSelections={ this.setCardSelections }

                                  caretCoordinates={this.props.caretCoordinates}/>
                            {
                                this.props.cardVisibility ?
                                    <Card
                                        cardSelections={ this.props.cardSelections }
                                        setCardSelections={ this.setCardSelections }
                                        onMouseOver={ this.onMouseOver }

                                        cardStyles={this.props.cardStyles}
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