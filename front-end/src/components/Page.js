import React, {Component} from 'react';
// import * as SentenceParser from '../lib/SentenceParser';

export default class Page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div onKeyDown={this.props.onKeyDown.bind(this)}
                 onClick={ this.props.onClick.bind(this) }
                 onInput={ this.props.onInput.bind(this) }
                 onKeyUp={ this.props.onKeyUp .bind(this)}
                 className="page"
                 contentEditable="true">
            </div>
        );
    }
}