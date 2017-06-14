import React, {Component} from 'react';
import {Label} from 'react-bootstrap';

export default class Keywords extends Component {

    render() {
        return (
            <div>
                {
                    this.props.keywords.length ?
                        <div className="keywords">
                        {
                            this.props.keywords.map(function (keyword, i) {
                                return (
                                    <div className="one-label" key={i}>
                                        <Label bsStyle="success">{ keyword }</Label>
                                    </div>
                                );
                            }, this)
                        }
                    </div> : null
                }
            </div>
        );
    }
}