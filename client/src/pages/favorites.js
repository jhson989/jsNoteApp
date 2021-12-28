import React, {useEffect} from 'react';

const Favorites = () => {

    useEffect(()=>{
        document.title = "Favorites";
    })

    return (
        <div>
            <h1>jsNoteApp</h1>
            <p>This is the Favorites page</p>
        </div>
    )
};

export default Favorites;