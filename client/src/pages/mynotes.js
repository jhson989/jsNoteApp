import React, {useEffect} from 'react';

import Header from '../components/Header';
import Navigation from '../components/Navigation';


const MyNotes = () => {

    useEffect(()=>{
        document.title = "MyNotes";
    })

    return (
        <div>
            <Header />
            <Navigation />
            <h1>jsNoteApp</h1>
            <p>This is the MyNotes page</p>
        </div>
    )
};

export default MyNotes;