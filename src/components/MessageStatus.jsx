// src/components/MessageStatus.jsx

import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const MessageStatus = ({ isRead }) => {
    if (isRead) {
        // Double coche bleue si le message est lu
        return <DoneAllIcon sx={{ fontSize: '1rem', color: '#4fc3f7' }} />;
    } else {
        // Coche simple grise si le message est juste envoyé
        return <DoneIcon sx={{ fontSize: '1rem', color: 'grey.500' }} />;
    }
};

export default MessageStatus;