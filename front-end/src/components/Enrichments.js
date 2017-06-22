import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import Rating from 'react-rating';

import {Thumbnail, Label} from 'react-bootstrap';
import * as utils from '../utils/sentimentsUtils';

export default class Enrichments extends Component {
    constructor(props) {
        super(props);

        this.renderPolarity = this.renderPolarity.bind(this);
        this.renderSubjectivity = this.renderSubjectivity.bind(this);
    }

    renderPolarity(polarity) {
        const [rating, result] = utils.normalizePolarity(polarity);
        let value = utils.normalizeValue(polarity);

        let empty = `fa fa-circle-o sentiment-icon sentiment-icon-${ result }`;
        let full = `fa fa-circle sentiment-icon sentiment-icon-${ result }`;

        return (
            <div>
                <Rating
                    empty={ empty }
                    full={ full }
                    initialRate={ Number(rating) }
                    readonly
                />
                <p>{ result } ({ value })</p>
            </div>
        )
    }

    renderSubjectivity(subjectivity) {
        const [rating, result] = utils.normalizeSubjectivity(subjectivity);
        let value = utils.normalizeValue(subjectivity);

        let empty = `fa fa-circle-o sentiment-icon sentiment-icon-${ result }`;
        let full = `fa fa-circle sentiment-icon sentiment-icon-${ result }`;

        return (
            <div>
                <Rating
                    empty={ empty }
                    full={ full }
                    initialRate={ Number(rating) }
                    readonly
                />
                <p>{ result } ({ value })</p>
            </div>
        )
    }

    render() {
        return (
            <div>
                {
                    this.props.enrichments.map((enrichment, i) => {
                            if (enrichment) {
                                return (
                                    <Row key={i}>
                                        <Col md={6} mdOffset={3}>
                                            <h3>{ enrichment.title }</h3>
                                            <p><i>{ enrichment.url }</i></p>
                                            <p>{ enrichment.summary }</p>
                                            <Thumbnail src={ enrichment.images[0] } />
                                        </Col>
                                    </Row>
                                );
                            }
                            else {
                                return '';
                            }
                        }
                    )
                }
            </div>
        );
    }
}
