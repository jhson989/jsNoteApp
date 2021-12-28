import React, {useEffect} from 'react';

import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Favorites = () => {

    useEffect(()=>{
        document.title = "Favorites";
    })

    return (
        <div>
            <Header />
            <Navigation />
            <h1>jsNoteApp</h1>
            <p>This is the Favorites page</p>
        </div>
    )
};

export default Favorites;