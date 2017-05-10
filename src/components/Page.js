import React, {Component} from 'react';

export default class Page extends Component {
    constructor(props) {
        super(props);

        this.getCaretCoordinates = this.getCaretCoordinates.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onInput = this.onInput.bind(this);
        this.insertCaretIndicator = this.insertCaretIndicator.bind(this);
        this.removeCaretIndicator = this.removeCaretIndicator.bind(this);
    }

    getCaretCoordinates() {
        let caretCoordinates = {};
        let offsets = {};
        const minOffsets = {
            top: 181,
            left: (window.innerWidth - 793) / 2 + 78
        };

        this.removeCaretIndicator();
        this.insertCaretIndicator();

        offsets = document.getElementById('caretIndicator').getBoundingClientRect();
        caretCoordinates.top = offsets.top > minOffsets.top ? offsets.top : minOffsets.top;
        caretCoordinates.left = offsets.left > minOffsets.left  ? offsets.left  : minOffsets.left;

        console.log('Caret has new coordinates: ', caretCoordinates.top + ', ' + caretCoordinates.left);
        console.log('Caret possible coordinates: ', offsets.top + ', ' + offsets.left);

        return caretCoordinates;
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

    handleChange(e) {
        e.preventDefault();
        let caretCoordinates = this.getCaretCoordinates();
        this.props.setCaretCoordinates(caretCoordinates);
    }

    onClick(e) {
        this.handleChange(e);
    }

    onInput(e) {
        this.refs.page.textContent ? this.props.setCardVisibility(true) : this.props.setCardVisibility(false);
        this.handleChange(e);
    }

    render() {
        return (
            <div ref="page"
                 className="page"
                 onClick={this.onClick}
                 onInput={this.onInput}
                 contentEditable="true">
            </div>
        );
    }
}