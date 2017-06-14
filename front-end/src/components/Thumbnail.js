import React, {Component} from 'react';

import {Thumbnail, Label} from "react-bootstrap";

export default class CustomThumbnail extends Component {
    constructor(props) {
        super(props);

        this.unsplash = "https://unsplash.com/";
        this.utm = "?utm_source=elfinite&utm_medium=referral&utm_campaign=api-credit";

        this.downloadImage = this.downloadImage.bind(this);
        this.getUserNameAndSurname = this.getUserNameAndSurname.bind(this);
        this.getImageLink = this.getImageLink.bind(this);
        this.getUnsplashLink = this.getUnsplashLink.bind(this);
        this.getImageDescription = this.getImageDescription.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    downloadImage(event, image) {
        event.preventDefault();
        window.open(image.links.download);
    }

    getUserNameAndSurname(image) {
        return image.user.first_name + image.user.last_name
    }

    getImageLink(image) {
        return `${ this.unsplash }@${ image.user.username }${ this.utm }`
    }

    getUnsplashLink() {
        return `${ this.unsplash }${ this.utm }`
    }

    getImageDescription(image) {
        return (
            <div>
                <p>
                    <span>Photo by: </span>
                    <a target="_blank"
                       href={ this.getImageLink(image) }>
                        { this.getUserNameAndSurname(image) }
                    </a>
                    <span> / </span>
                    <a target="_blank"
                       href={ this.getUnsplashLink() }>
                        Unsplash
                    </a>
                </p>
                <Label bsStyle="success">{ image.keyword }</Label>
            </div>
        );
    }

    onClick(event) {
        this.downloadImage(event, this.props.image)
    }

    render() {
        return (
            <Thumbnail src={ this.props.image.urls.small }
                       onClick={ this.onClick }>
                {
                    this.getImageDescription(this.props.image)
                }
            </Thumbnail>
        );
    }
}



