import React, {useEffect} from 'react';

const MyNotes = () => {

    useEffect(()=>{
        document.title = "MyNotes";
    })

    return (
        <div>
            <h1>jsNoteApp</h1>
            <p>This is the MyNotes page</p>
        </div>
    )
};

export default MyNotes;