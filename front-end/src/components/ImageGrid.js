import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap';

import Thumbnail from '../components/Thumbnail';

export default class ImageGrid extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.haveResults || !this.props.keywords.length ?
                        <div>
                            {
                                this.props.images.map(
                                    (image, index, images) => {
                                        if (index % 2 === 0) {
                                            let firstImage = images[index];
                                            let secondImage = images[index + 1];
                                            return (
                                                <Row key={index}>
                                                    <Col md={3} mdOffset={3}>
                                                        <Thumbnail image={ firstImage }/>
                                                    </Col>

                                                    <Col md={3}>
                                                        {
                                                            secondImage ?
                                                                <Thumbnail image={ secondImage }/> :
                                                                null
                                                        }
                                                    </Col>
                                                </Row>
                                            );
                                        }
                                    }
                                )
                            }
                        </div> :
                        <div>
                            {
                                <Row>
                                    <Col md={6} mdOffset={3}>
                                        <span>Sorry we couldn't find any images for this article.</span>
                                    </Col>
                                </Row>
                            }
                        </div>
                }
            </div>
        );
    }
}