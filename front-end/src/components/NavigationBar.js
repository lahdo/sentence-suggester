import React, {Component} from 'react';
import {Navbar} from 'react-bootstrap';

export default class NavigationBar extends Component {
    render() {
        return (
            <Navbar fixedTop className="nav-bar">
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/"><strong>Sentence Suggester</strong> - write 10x faster with a jargon you like</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
            </Navbar>
        );
    }
}

