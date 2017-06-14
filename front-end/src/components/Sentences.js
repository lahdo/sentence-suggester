import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class Sentences extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.sentiments.map(function (item, i) {
                        return (
                        <Row key={i}>
                            <Col md={4} mdOffset={3}>
                                <span>{ item.sentence }</span>
                            </Col>
                            <Col md={2} mdOffset={3}>
                                <span>{ item.sentiment }</span>
                            </Col>
                        </Row>
                        );
                    }, this)
                }
            </div>

        );
    }
}