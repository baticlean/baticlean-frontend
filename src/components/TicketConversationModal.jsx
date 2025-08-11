import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessageToTicket, editMessage, deleteMessage, reactToMessage } from '../redux/ticketSlice.js';
// ✅ Ajout de Avatar et Divider
import { Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, Paper, IconButton, Link, Menu, MenuItem, Popover, Chip, Avatar, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import MicIcon from '@mui/icons-material/Mic';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import FilePreview from './FilePreview';
import './FileUpload.css';
import { emitMarkMessagesAsRead } from '../socket/socket.js';
import MessageStatus from './MessageStatus';
import EmojiPicker from 'emoji-picker-react';
import { useAudioRecorder } from './useAudioRecorder';
import AudioPlayer from './AudioPlayer';

const useLongPress = (callback = () => {}, ms = 1000) => {
    const [startLongPress, setStartLongPress] = useState(false);
    const timerRef = useRef();
    useEffect(() => {
        if (startLongPress) { timerRef.current = setTimeout(callback, ms); } else { clearTimeout(timerRef.current); }
        return () => clearTimeout(timerRef.current);
    }, [callback, ms, startLongPress]);
    return {
        onMouseDown: () => setStartLongPress(true), onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false), onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
};

// --- Mini-composant pour un seul message (INCHANGÉ) ---
function MessageItem({ msg, ticket, currentUser, isAdmin, onEdit, onDelete, onReact }) {
    const dispatch = useDispatch();
    const isMe = msg.sender?._id === currentUser._id;
    const [anchorEl, setAnchorEl] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongMessage = msg.text && msg.text.length > 350;
    const handleMenuClick = (event) => { if (isMe && !msg.isDeleted) setAnchorEl(event.currentTarget); };
    const handleCloseMenu = () => setAnchorEl(null);
    const handleEditClick = () => { onEdit(msg); handleCloseMenu(); };
    const handleDeleteClick = () => { onDelete(msg); handleCloseMenu(); };
    const longPressProps = useLongPress(() => handleMenuClick({ currentTarget: document.getElementById(`msg-paper-${msg._id}`) }), 1000);
    const otherParticipantId = isMe ? (isAdmin ? ticket.user._id : ticket.assignedAdmin?._id) : null;
    const isRead = otherParticipantId ? msg.readBy?.includes(otherParticipantId) : false;
    const isVoiceMessage = msg.attachments?.length > 0 && msg.attachments.some(file => file.fileType.startsWith('audio/'));
    let bgColor;
    if (isMe) { bgColor = isVoiceMessage ? 'success.main' : 'primary.main'; } 
    else { bgColor = isVoiceMessage ? '#e0e0e0' : '#f0f0f0'; }

    return (
        <ListItem key={msg._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', pb: 3, px: 0 }}>
            <Box onDoubleClick={(e) => onReact(e, msg)} sx={{ position: 'relative', cursor: msg.isDeleted ? 'default' : 'pointer' }}>
                <Paper id={`msg-paper-${msg._id}`} elevation={2} sx={{ p: 1.5, maxWidth: '100%', bgcolor: bgColor, color: isMe ? 'white' : 'black', borderRadius: '20px' }} {...(isMe && !msg.isDeleted ? longPressProps : {})}>
                    {msg.isDeleted ? ( <Typography variant="body2" sx={{ fontStyle: 'italic', color: isMe ? '#eeeeee' : 'text.secondary' }}>Ce message a été supprimé</Typography> ) : (
                        <>
                            {isVoiceMessage && msg.attachments.map((file, i) => file.fileType.startsWith('audio/') ? (<AudioPlayer key={i} src={file.url} isMe={isMe} />) : null)}
                            {msg.text && (
                                <ListItemText 
                                    primary={isLongMessage && !isExpanded ? `${msg.text.substring(0, 145)}...` : msg.text} 
                                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} 
                                />
                            )}
                            {isLongMessage && (
                                <Button size="small" onClick={() => setIsExpanded(!isExpanded)} sx={{ color: isMe ? 'white' : 'primary.main', textTransform: 'none', p: 0, mt: 1 }}>
                                    {isExpanded ? 'Voir moins' : 'Voir plus...'}
                                </Button>
                            )}
                            {msg.attachments?.length > 0 && (
                                <Box sx={{ mt: msg.text || isVoiceMessage ? 1 : 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {msg.attachments.map((file, fileIndex) => !file.fileType.startsWith('audio/') && (
                                        <Link href={file.url} target="_blank" rel="noopener noreferrer" key={fileIndex} sx={{ display: 'flex', alignItems: 'center', color: isMe ? 'white' : 'primary.main', textDecoration: 'underline' }}>
                                            <InsertDriveFileIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                            <Typography variant="caption">{file.fileName}</Typography>
                                        </Link>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </Paper>
                {msg.reactions && msg.reactions.length > 0 && (
                    <Box sx={{ position: 'absolute', bottom: -15, left: isMe ? 'auto' : 10, right: isMe ? 10 : 'auto', display: 'flex', gap: 0.5, zIndex: 1 }}>
                        {msg.reactions.map((reaction, i) => (
                            <Chip key={i} label={`${reaction.emoji} ${reaction.users.length}`} size="small" 
                                sx={{ cursor: 'pointer', bgcolor: reaction.users.includes(currentUser._id) ? 'primary.light' : 'grey.300' }}
                                onClick={() => dispatch(reactToMessage({ ticketId: ticket._id, messageId: msg._id, emoji: reaction.emoji }))} 
                            />
                        ))}
                    </Box>
                )}
            </Box>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {msg.sender?.username || 'Support'} - {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {msg.isEdited && !msg.isDeleted && ' (modifié)'}
                </Typography>
                {isMe && !msg.isDeleted && <MessageStatus isRead={isRead} />}
                {isMe && !msg.isDeleted && (<IconButton size="small" onClick={handleMenuClick}><MoreVertIcon fontSize="small" /></IconButton>)}
            </Box>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleEditClick}><EditIcon sx={{ mr: 1 }} fontSize="small" /> Modifier</MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1 }} fontSize="small"/> Supprimer</MenuItem>
            </Menu>
        </ListItem>
    );
}

// ✅ On ajoute l'objet de style pour les badges de rôle
const roleStyles = {
    superAdmin: { color: 'error', variant: 'filled' },
    admin: { color: 'warning', variant: 'outlined' },
    user: { color: 'success', variant: 'outlined' },
};

function TicketConversationModal({ ticketId, open, onClose, isAdmin }) {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const ticket = useSelector((state) => (isAdmin ? [...state.tickets.adminTickets, ...state.tickets.archivedAdminTickets] : [...state.tickets.userTickets, ...state.tickets.archivedUserTickets]).find(t => t._id === ticketId));
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [reactionMenuAnchor, setReactionMenuAnchor] = useState(null);
    const [emojiPickerAnchor, setEmojiPickerAnchor] = useState(null);
    const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);
    const messagesEndRef = useRef(null);
    const { isRecording, startRecording, stopRecording, audioBlob, resetAudio } = useAudioRecorder();
    
    // ✅ On définit qui sont les interlocuteurs pour l'en-tête
    const ticketUser = ticket?.user;
    const assignedAdmin = ticket?.assignedAdmin;
    const otherParticipant = isAdmin ? ticketUser : (assignedAdmin || { username: 'Support BATIClean', role: 'admin' });

    const handleEdit = (message) => { setEditingMessage({ _id: message._id, text: message.text }); setNewMessage(message.text); };
    const handleDelete = (message) => { dispatch(deleteMessage({ ticketId, messageId: message._id })); };
    const handleDoubleClick = (event, message) => { if (message.isDeleted) return; setSelectedMessageForReaction(message); setReactionMenuAnchor(event.currentTarget); };
    const handleReact = (emoji) => { if (!selectedMessageForReaction) return; dispatch(reactToMessage({ ticketId, messageId: selectedMessageForReaction._id, emoji })); setReactionMenuAnchor(null); setEmojiPickerAnchor(null); };
    const handleOpenEmojiPicker = (event) => setEmojiPickerAnchor(event.currentTarget);
    const onEmojiClick = (emojiObject) => handleReact(emojiObject.emoji);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    useEffect(() => { scrollToBottom(); }, [ticket?.messages]);

    useEffect(() => {
        if (open) {
            setTimeout(scrollToBottom, 100);
            if (ticketId && currentUser?._id) emitMarkMessagesAsRead({ ticketId, readerId: currentUser._id });
        } else {
            setFiles([]); setEditingMessage(null); setNewMessage(''); resetAudio();
        }
    }, [open, ticketId, currentUser, resetAudio]);

    useEffect(() => {
        if (audioBlob) {
            handleSendMessage();
        }
    }, [audioBlob]);

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        if (files.length + acceptedFiles.length > 5) toast.error("Vous ne pouvez envoyer que 5 fichiers à la fois.");
        else {
            const newFiles = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
            setFiles(currentFiles => [...currentFiles, ...newFiles]);
            fileRejections.forEach(({ file, errors }) => errors.forEach(err => toast.error(err.code === "file-too-large" ? `"${file.name}" est trop volumineux (max 15Mo).` : err.message)));
        }
    }, [files]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, maxSize: 15 * 1024 * 1024, maxFiles: 5, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'], 'application/pdf': ['.pdf'], 'application/zip': ['.zip'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } });
    const removeFile = (fileToRemove) => setFiles(currentFiles => currentFiles.filter(file => file !== fileToRemove));

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() && files.length === 0 && !audioBlob) return;
        if (editingMessage) {
            dispatch(editMessage({ ticketId, messageId: editingMessage._id, text: newMessage }));
            setEditingMessage(null);
        } else {
            const formData = new FormData();
            formData.append('text', newMessage);
            files.forEach(file => formData.append('files', file));
            if (audioBlob) formData.append('files', audioBlob, `message-vocal-${Date.now()}.webm`);
            dispatch(addMessageToTicket({ ticketId, formData }));
        }
        setNewMessage('');
        setFiles([]);
        resetAudio();
    };

    const style = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 800, bgcolor: 'background.paper', boxShadow: 24, p: 2, display: 'flex', flexDirection: 'column', height: '85vh', borderRadius: '8px' };
    const DEFAULT_REACTIONS = ['✅', '🙏', '👍', '👊', '👎'];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                    <Typography variant="h6">Conversation - Ticket #{ticketId?.slice(-6)}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
                
                {/* ✅ DÉBUT DE LA NOUVELLE EN-TÊTE DE CONVERSATION */}
                {otherParticipant && ticket && (
                    <Box>
                        <Box sx={{ px: 1, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={otherParticipant.profilePicture} />
                            <Box>
                                <Typography variant="body1" fontWeight="bold">{otherParticipant.username}</Typography>
                                {otherParticipant.role && (
                                    <Chip
                                        label={otherParticipant.role}
                                        size="small"
                                        color={roleStyles[otherParticipant.role]?.color || 'default'}
                                        variant={roleStyles[otherParticipant.role]?.variant || 'outlined'}
                                    />
                                )}
                            </Box>
                        </Box>
                        <Divider />
                    </Box>
                )}
                {/* ✅ FIN DE LA NOUVELLE EN-TÊTE */}

                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, mt: 1 }}>
                    {!ticket ? <CircularProgress /> : (
                        <List>{ticket.messages.map((msg) => (<MessageItem key={msg._id} msg={msg} ticket={ticket} currentUser={currentUser} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} onReact={handleDoubleClick}/>))}
                            <div ref={messagesEndRef} />
                        </List>
                    )}
                </Box>
                <Box component="form" onSubmit={handleSendMessage} sx={{ mt: 2, borderTop: 1, borderColor: 'divider', pt: 2 }}>
                    {files.length > 0 && ( <div className="preview-container"> {files.map((file, i) => <FilePreview key={i} file={file} onRemove={removeFile} />)} </div> )}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: files.length > 0 ? 1 : 0 }}>
                        <div {...getRootProps({style:{padding: 0, border: 'none', background: 'none'}})}>
                            <input {...getInputProps()} />
                            <IconButton color="primary" component="span" disabled={isRecording}><AttachFileIcon /></IconButton>
                        </div>
                        <TextField fullWidth multiline maxRows={4} variant="outlined" placeholder={isRecording ? "Enregistrement en cours..." : "Écrivez votre message..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} size="small" disabled={isRecording}/>
                        {newMessage.trim() || files.length > 0 ? (
                             <Button type="submit" variant="contained" endIcon={<SendIcon />}>{editingMessage ? 'Modifier' : 'Envoyer'}</Button>
                        ) : (
                            <IconButton color={isRecording ? "error" : "primary"} onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}><MicIcon /></IconButton>
                        )}
                        {editingMessage && <Button size="small" onClick={() => { setEditingMessage(null); setNewMessage(''); }}>Annuler</Button>}
                    </Box>
                </Box>
                <Popover open={Boolean(reactionMenuAnchor)} anchorEl={reactionMenuAnchor} onClose={() => setReactionMenuAnchor(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Box sx={{ display: 'flex', p: 0.5 }}>
                        {DEFAULT_REACTIONS.map(emoji => ( <IconButton key={emoji} onClick={() => handleReact(emoji)}>{emoji}</IconButton> ))}
                        <IconButton onClick={handleOpenEmojiPicker}><AddReactionIcon /></IconButton>
                    </Box>
                </Popover>
                <Popover open={Boolean(emojiPickerAnchor)} anchorEl={emojiPickerAnchor} onClose={() => setEmojiPickerAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </Popover>
            </Box>
        </Modal>
    );
}

export default TicketConversationModal;