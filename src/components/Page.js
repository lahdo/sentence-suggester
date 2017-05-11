import React, {Component} from 'react';

export default class Page extends Component {
    constructor(props) {
        super(props);

        this.getCaretCoordinates = this.getCaretCoordinates.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.insertCaretIndicator = this.insertCaretIndicator.bind(this);
        this.insert = this.insert.bind(this);
        this.insertTextAtCursor = this.insertTextAtCursor.bind(this);
        this.removeCaretIndicator = this.removeCaretIndicator.bind(this);
        this.getCaretRelativePosition = this.getCaretRelativePosition.bind(this);
        this.getCurrentSelection = this.getCurrentSelection.bind(this);

    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.selectedSuggestion !== nextProps.selectedSuggestion) {
            this.insertTextAtCursor(nextProps.selectedSuggestion);
        }
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

        let offsetTop = 150;
        let offsetLeft = offsets.left - ((window.innerWidth - this.refs.page.offsetWidth) / 2);

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
        var caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode == editableDiv) {
                    caretPos = range.endOffset;
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() == editableDiv) {
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
        let sel, range, html;
        sel = this.props.cachedSelection;
        if (window.getSelection) {
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else if (document.selection && document.selection.createRange) {
            sel.createRange().text = text;
        }
    }

    getCurrentSelection() {
        if (window.getSelection) {
            return window.getSelection();
        } else if (document.selection && document.selection.createRange) {
            return document.selection;
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

    insert(html) { // http://stackoverflow.com/a/6691294/3959662
        let selection, range;
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

    handleChange(e) {
        let caretCoordinates = this.getCaretCoordinates();
        this.props.setCaretCoordinates(caretCoordinates);

        this.props.setCachedSelection(this.getCurrentSelection());
        // if (this.refs.page.textContent.length === 1) {
        //     this.props.setFirstCharCaretCoordinates(caretCoordinates);
        // }
    }

    onClick(e) {
        e.preventDefault();
        this.handleChange(e);
    }

    onInput(e) {
        e.preventDefault();
        this.refs.page.textContent ? this.props.setCardVisibility(true) : this.props.setCardVisibility(false);
        this.handleChange(e);
    }

    onKeyDown(e) {
        this.handleChange(e);
        // if (e.keyCode === 37) { // LEFT
        //     this.handleChange(e);
        //     console.log('LEFT');
        // }
        // if (e.keyCode === 39) { // RIGHT
        //     this.handleChange(e);
        //     console.log('RIGHT');
        // }
        // if (event.keyCode === 38) { // UP
        //     console.log('UP');
        // }
        // if (event.keyCode === 40) { // DOWN
        //     console.log('DOWN');
        // }
    }

    render() {
        return (
            <div ref="page"
                 className="page"
                 onKeyDown={this.onKeyDown}
                 onClick={this.onClick}
                 onInput={this.onInput}
                 contentEditable="true">
            </div>
        );
    }
}