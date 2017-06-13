import React, {Component} from 'react';
import {Label} from 'react-bootstrap';

export default class Keyword extends Component {

    render() {
        return (
            <div className="keywords">
                {
                    this.props.keywords.map(function (keyword, i) {
                        return (
                            <div className="one-label">
                            <Label key={i} bsStyle="success">{ keyword }</Label>
                            </div>
                        );
                    }, this)
                }
            </div>
        );
    }
}


