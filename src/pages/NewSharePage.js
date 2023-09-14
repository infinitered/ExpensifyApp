import React from 'react';
import NewChatPage from './NewChatPage';

function NewSharePage(props) {
    return (
        <NewChatPage
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            isGroupChat
            allowRooms
        />
    );
}

NewSharePage.displayName = 'NewSharePage';

export default NewSharePage;
