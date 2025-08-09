// src/components/FilePreview.jsx

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FilePreview = ({ file, onRemove }) => {
    // Crée une URL locale pour afficher l'aperçu de l'image
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    return (
        <Box
            sx={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #ddd',
                flexShrink: 0,
            }}
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt={file.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    // Libère la mémoire quand le composant est détruit
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1, textAlign: 'center' }}>
                    <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                    <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                        {file.name}
                    </Typography>
                </Box>
            )}

            <IconButton
                size="small"
                onClick={() => onRemove(file)}
                sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default FilePreview;