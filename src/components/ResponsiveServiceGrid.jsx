import React, { useState, useEffect, useRef } from 'react';
import {
    Typography, Box, Card, CardContent, CardMedia, CardActions,
    Button, IconButton, Accordion, AccordionSummary,
    AccordionDetails, TextField, List, ListItem, ListItemText, 
    ListItemAvatar, Avatar, Rating, Chip // ✅ MODIFICATION : Import de Chip
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addComment, likeComment, updateComment, deleteComment, likeService } from '../redux/serviceSlice.js';
import { createBooking } from '../redux/bookingSlice.js';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { toast } from 'react-toastify';
import BookingModal from './BookingModal.jsx';

// --- COMPOSANT FORMULAIRE (INCHANGÉ) ---
const CommentForm = ({ serviceId, parentId = null, onCommentPosted, autoFocus = false, placeholder = "Votre commentaire..." }) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            dispatch(addComment({ serviceId, text, parentId }));
            setText('');
            if (onCommentPosted) {
                onCommentPosted();
            }
        }
    };
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
            <TextField size="small" fullWidth placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} autoFocus={autoFocus} />
            <Button type="submit" variant="contained" size="small">Envoyer</Button>
        </Box>
    );
};

// --- COMPOSANT COMMENTAIRE (MODIFIÉ) ---
const Comment = ({ comment, serviceId, isReply = false }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(isReply);

    // ✅ MODIFICATION : Objet pour styliser les badges de rôle
    const roleStyles = {
        superAdmin: { color: 'error', variant: 'filled' },
        admin: { color: 'warning', variant: 'outlined' },
        // Ajoutez d'autres rôles et styles ici si besoin
    };

    const handleLike = () => dispatch(likeComment({ serviceId, commentId: comment._id }));
    const handleDelete = () => {
        if (window.confirm('Supprimer ce commentaire ?')) {
            dispatch(deleteComment({ serviceId, commentId: comment._id }));
        }
    };
    const handleUpdate = () => {
        if (editText.trim()) {
            dispatch(updateComment({ serviceId, commentId: comment._id, text: editText }));
            setIsEditing(false);
        }
    };

    const isAuthor = user?._id === comment.user?._id;
    const isLikedByCurrentUser = comment.likes?.includes(user?._id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <Box sx={{
            position: 'relative',
            pl: isReply ? { xs: 2, sm: 3 } : 0,
            pt: isReply ? 2 : 0,
            mt: 1
        }}>
            {isReply && (
                <Box component="span" sx={{
                    position: 'absolute',
                    top: 0,
                    left: { xs: '12px', sm: '20px' },
                    height: '28px',
                    width: { xs: '12px', sm: '15px' },
                    borderBottom: '1px solid',
                    borderLeft: '1px solid',
                    borderColor: 'grey.300',
                    borderBottomLeftRadius: '8px',
                }} />
            )}

            <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                <ListItemAvatar sx={{ minWidth: 'auto', mr: 1.5 }}>
                    <Avatar src={comment.user?.profilePicture} sx={{ width: 32, height: 32 }} />
                </ListItemAvatar>
                <Box sx={{ flexGrow: 1 }}>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField size="small" fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                            <Button size="small" variant="contained" onClick={handleUpdate}>OK</Button>
                            <Button size="small" variant="text" onClick={() => setIsEditing(false)}>Annuler</Button>
                        </Box>
                    ) : (
                        <>
                            <ListItemText
                                  // ✅ MODIFICATION : Remplacement du simple texte par un Box pour inclure le nom et le badge
                                primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {comment.user?.username || 'Utilisateur'}
                                            </Typography>
                                            {comment.user?.role && (
                                                <Chip
                                                    label={comment.user.role}
                                                    size="small"
                                                    color={roleStyles[comment.user.role]?.color || 'default'}
                                                    variant={roleStyles[comment.user.role]?.variant || 'outlined'}
                                                    sx={{ 
                                                        height: 'auto', 
                                                        fontSize: '0.65rem', 
                                                        fontWeight: 'bold',
                                                        lineHeight: 1.4,
                                                        p: '1px 5px'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    }
                                secondaryTypographyProps={{ variant: 'body2', color: 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                secondary={comment.text}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                <IconButton size="small" onClick={handleLike} sx={{ p: 0.5 }}><> {isLikedByCurrentUser ? <FavoriteIcon sx={{ fontSize: '1rem' }} color="error" /> : <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />} </></IconButton>
                                <Typography variant="caption">{comment.likes?.length || 0}</Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setIsReplying(!isReplying)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        p: '2px 6px',
                                        minWidth: 'auto'
                                    }}>
                                    Répondre
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
                {isAuthor && !isEditing && (
                    <Box sx={{ display: 'flex' }}>
                        <IconButton size="small" onClick={() => setIsEditing(true)}><EditIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
                        <IconButton size="small" onClick={handleDelete}><DeleteIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
                    </Box>
                )}
            </ListItem>
            
            <Box sx={{ pl: { xs: 4, sm: 5 } }}>
                {isReplying && (
                    <CommentForm serviceId={serviceId} parentId={comment._id} onCommentPosted={() => setIsReplying(false)} autoFocus={true} placeholder={`En réponse à ${comment.user?.username || 'Utilisateur'}`} />
                )}
                {hasReplies && (
                    <Box>
                        <Button size="small" sx={{ textTransform: 'none' }} startIcon={<ExpandMoreIcon sx={{ transform: showReplies ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}/>} onClick={() => setShowReplies(!showReplies)}>
                            {showReplies ? 'Masquer les réponses' : `Afficher les ${comment.replies.length} réponse(s)`}
                        </Button>
                        {showReplies && (
                            <Box>
                                {comment.replies.map(reply => (
                                    <Comment key={reply._id} comment={reply} serviceId={serviceId} isReply={true} />
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};


// --- COMPOSANT CARTE DE SERVICE (INCHANGÉ) ---
const ServiceCard = ({ service, onBook }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const handleLikeService = () => dispatch(likeService(service._id));
    
    const likes = service?.likes || [];
    const comments = service?.comments || [];
    const isLikedByCurrentUser = likes.includes(user?._id);

    const reviews = service?.reviews || [];
    const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
    
    const nestComments = (commentList = []) => {
        const commentMap = new Map(commentList.map(c => [c._id, {...c, replies: []}]));
        const topLevelComments = [];
    
        for (const comment of commentMap.values()) {
            if (comment.parent && commentMap.has(comment.parent)) {
                const parent = commentMap.get(comment.parent);
                if (!parent.replies) parent.replies = [];
                parent.replies.push(comment);
            } else {
                topLevelComments.push(comment);
            }
        }

        const sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
        topLevelComments.sort(sortFn);
        for (const comment of commentMap.values()) {
            if(comment.replies) comment.replies.sort(sortFn);
        }
        
        return topLevelComments;
    };

    const nestedComments = nestComments(comments);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Swiper modules={[Navigation, Pagination, Autoplay]} slidesPerView={1} navigation pagination={{ clickable: true }} autoplay={{ delay: 3000, disableOnInteraction: false }} style={{ height: '200px', width: '100%' }}>
                {service.images?.length > 0 ? (service.images.map((img, index) => (<SwiperSlide key={index}><CardMedia component="img" image={img} alt={`${service.title}-${index}`} sx={{ height: '200px', objectFit: 'cover' }} /></SwiperSlide>))) : (<SwiperSlide><CardMedia component="img" image="https://via.placeholder.com/400x250?text=Image+Indisponible" alt="Image par défaut" sx={{ height: '200px', objectFit: 'cover' }} /></SwiperSlide>)}
            </Swiper>
            <CardContent>
                <Typography gutterBottom variant="h6" component="h2">{service.title}</Typography>
                {reviews.length > 0 && (<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><Rating value={averageRating} precision={0.5} readOnly size="small" /><Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>({reviews.length} avis)</Typography></Box>)}
                <Typography variant="body2" color="text.secondary">{service.description?.substring(0, 100)}...</Typography>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleLikeService}><> {isLikedByCurrentUser ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />} </></IconButton>
                    <Typography variant="body2">{likes.length}</Typography>
                    <IconButton><CommentIcon /></IconButton>
                    <Typography variant="body2">{comments.length}</Typography>
                </Box>
                <Button variant="contained" onClick={() => onBook(service)}>Réserver</Button>
            </CardActions>
            <Accordion sx={{ boxShadow: 'none', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">Afficher {comments.length > 0 ? `les ${comments.length} commentaire(s)` : 'les commentaires'}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: {xs: 1, sm: 2} }}>
                    <Box sx={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        pr: 1,
                         '&::-webkit-scrollbar': { width: '6px' },
                         '&::-webkit-scrollbar-thumb': { backgroundColor: 'grey.400', borderRadius: '3px' }
                    }}>
                        <List dense>
                            {nestedComments.map(comment => (
                                <Comment key={comment._id} comment={comment} serviceId={service._id} />
                            ))}
                        </List>
                    </Box>
                    <CommentForm serviceId={service._id} />
                </AccordionDetails>
            </Accordion>
        </Card>
    );
};


// --- COMPOSANT GRILLE (INCHANGÉ) ---
function ResponsiveServiceGrid({ services }) {
    const containerRef = useRef(null);
    const [showScrollHint, setShowScrollHint] = useState(false);
    const dispatch = useDispatch();
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    useEffect(() => {
        const checkScroll = () => {
            const container = containerRef.current;
            if (container) { setShowScrollHint(container.scrollWidth > container.clientWidth); }
        };
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [services]);
    const handleOpenBookingModal = (service) => { setSelectedService(service); setBookingModalOpen(true); };
    const handleCloseBookingModal = () => { setBookingModalOpen(false); setSelectedService(null); };
    const handleBookingSubmit = (bookingData) => { toast.promise(dispatch(createBooking(bookingData)).unwrap(), { pending: 'Envoi de votre réservation...', success: 'Réservation envoyée ! Nous vous recontacterons. (Pensez à vérifier vos spams pour la confirmation).', error: 'Erreur lors de la réservation.' }) };
    return (
        <>
            {showScrollHint && (<motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, }}><Typography sx={{ bgcolor: 'black', color: 'yellow', p: 1, borderRadius: 1, textAlign: 'center', mb: 2 }}>Vous pouvez Scroller comme ça ➡ pour voir plus de cartes</Typography></motion.div>)}
            <Box ref={containerRef} sx={{ display: 'flex', overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'primary.main', borderRadius: '4px' } }}>
                <Box sx={{ display: 'flex', gap: 4, minWidth: 'max-content' }}>
                    {services.map((service) => (
                        <Box key={service._id} sx={{ width: { xs: '280px', sm: '320px' }, flexShrink: 0 }}>
                            <ServiceCard service={service} onBook={handleOpenBookingModal} />
                        </Box>
                    ))}
                </Box>
            </Box>
            {selectedService && (<BookingModal open={bookingModalOpen} onClose={handleCloseBookingModal} onSubmit={handleBookingSubmit} service={selectedService} />)}
        </>
    );
}

export default ResponsiveServiceGrid;