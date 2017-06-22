import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

import {entities} from '../constants.js';

export default class EntityButtons extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="entityButtons">
                {
                    Object.keys(this.props.entities).length ?
                        Object.keys(this.props.entities).map((entity, i) => {
                            return (
                                <Button key={ i }
                                        bsStyle="default"
                                        className="entityButton"
                                        onClick={ (e) => this.props.onEntityButtonClick(e, entity)}>
                                    { entities[entity] }
                                </Button>
                            );
                        })
                        : null
                }
            </div>
        );
    }
}

