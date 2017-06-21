import React, {Component} from 'react';
import {Panel, Row, Col} from 'react-bootstrap';
import {Link} from "react-router-dom";

export default class Apps extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.apps.map(
                        (app, index, apps) => {
                            if (index % 2 === 0) {
                                let firstApp = apps[index];
                                let secondApp = apps[index + 1];
                                return (
                                    <Row key={index}>
                                        <Col md={3} mdOffset={3}>
                                            <Panel >
                                                <Link to={ firstApp.link }>{ firstApp.name }</Link>
                                                <br/>
                                                <span>{ firstApp.description }</span>
                                            </Panel>
                                        </Col>
                                        <Col md={3}>
                                            {
                                                secondApp ?
                                                    <Panel >
                                                        <Link to={ secondApp.link }>{ secondApp.name }</Link>
                                                        <br/>
                                                        <span>{ secondApp.description }</span>
                                                    </Panel> : null
                                            }
                                        </Col>
                                    </Row>
                                );
                            }
                        }
                    )
                }
            </div>
        );
    }
}