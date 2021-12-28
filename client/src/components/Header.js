import React from 'react';
import logo from '../img/logo.png';

const Header = () => {
    return (
        <header>
            <img src={logo} alt="jsNoteApp Logo" height="40"/>
            <h1>jsNoteApp</h1>
        </header>
    );
};

export default Header;