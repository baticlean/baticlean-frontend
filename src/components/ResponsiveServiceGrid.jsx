import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Box, Card, CardContent, CardMedia, CardActions,
  Button, IconButton, Accordion, AccordionSummary,
  AccordionDetails, TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { likeService, addComment, likeComment, updateComment, deleteComment } from '../redux/serviceSlice.js';
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

// --- COMPOSANT POUR UN SEUL COMMENTAIRE ---
const Comment = ({ comment, serviceId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

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

  return (
    <ListItem alignItems="flex-start" sx={{ pl: 0 }}>
      <ListItemAvatar>
        <Avatar src={comment.user?.profilePicture} sx={{ width: 32, height: 32 }} />
      </ListItemAvatar>
      <Box sx={{ width: '100%' }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} />
            <Button size="small" variant="contained" onClick={handleUpdate}>OK</Button>
          </Box>
        ) : (
          <ListItemText primary={comment.username} secondary={comment.text} />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <IconButton size="small" onClick={handleLike}>
          {isLikedByCurrentUser ? <FavoriteIcon fontSize="small" color="error" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
        <Typography variant="caption">{comment.likes?.length || 0}</Typography>
        {isAuthor && !isEditing && (
          <>
            <IconButton size="small" onClick={() => setIsEditing(true)}><EditIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={handleDelete}><DeleteIcon fontSize="small" /></IconButton>
          </>
        )}
      </Box>
    </ListItem>
  );
};


// --- COMPOSANT POUR LE FORMULAIRE DE COMMENTAIRE ---
const CommentForm = ({ serviceId }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addComment({ serviceId, text }));
      setText('');
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <TextField size="small" fullWidth placeholder="Votre commentaire..." value={text} onChange={(e) => setText(e.target.value)} />
      <Button type="submit" variant="contained" size="small">Envoyer</Button>
    </Box>
  );
};

// --- COMPOSANT POUR UNE CARTE DE SERVICE ---
const ServiceCard = ({ service, onBook }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLikeService = () => dispatch(likeService(service._id));
  
  const likes = service?.likes || [];
  const comments = service?.comments || [];
  const isLikedByCurrentUser = likes.includes(user?._id);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        style={{ height: '200px', width: '100%' }}
      >
        {service.images?.length > 0 ? (
          service.images.map((img, index) => (
            <SwiperSlide key={index}>
              <CardMedia component="img" image={img} alt={`${service.title}-${index}`} sx={{ height: '200px', objectFit: 'cover' }} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <CardMedia component="img" image="https://via.placeholder.com/400x250?text=Image+Indisponible" alt="Image par défaut" sx={{ height: '200px', objectFit: 'cover' }} />
          </SwiperSlide>
        )}
      </Swiper>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">{service.title}</Typography>
        <Typography variant="body2" color="text.secondary">{service.description?.substring(0, 100)}...</Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleLikeService}>
            {isLikedByCurrentUser ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{likes.length}</Typography>
          <IconButton><CommentIcon /></IconButton>
          <Typography variant="body2">{comments.length}</Typography>
        </Box>
        <Button variant="contained" onClick={() => onBook(service)}>Réserver</Button>
      </CardActions>
      <Accordion sx={{ boxShadow: 'none', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">Afficher les commentaires</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <List dense>
            {comments.map(comment => (
              <Comment key={comment._id} comment={comment} serviceId={service._id} />
            ))}
          </List>
          <CommentForm serviceId={service._id} />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};


// --- COMPOSANT DE GRILLE ---
function ResponsiveServiceGrid({ services }) {
  const containerRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const dispatch = useDispatch();
  
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const checkScroll = () => {
      const container = containerRef.current;
      if (container) {
        setShowScrollHint(container.scrollWidth > container.clientWidth);
      }
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [services]);

  const handleOpenBookingModal = (service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedService(null);
  };

  const handleBookingSubmit = (bookingData) => {
    toast.promise(
      dispatch(createBooking(bookingData)).unwrap(),
      {
        pending: 'Envoi de votre réservation...',
        success: 'Réservation envoyée ! Nous vous recontacterons.',
        error: 'Erreur lors de la réservation.'
      }
    )
  };

  return (
    <>
      {showScrollHint && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity, // On dit à l'animation de se répéter à l'infini
          }}
        >
          <Typography 
            sx={{ 
              bgcolor: 'black', 
              color: 'yellow', 
              p: 1, 
              borderRadius: 1, 
              textAlign: 'center',
              mb: 2 
            }}
          >
            Vous pouvez Scroller comme ça ➡ pour voir plus de cartes
          </Typography>
        </motion.div>
      )}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': { height: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'primary.main', borderRadius: '4px' }
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, minWidth: 'max-content' }}>
          {services.map((service) => (
            <Box key={service._id} sx={{ width: { xs: '280px', sm: '320px' }, flexShrink: 0 }}>
              <ServiceCard service={service} onBook={handleOpenBookingModal} />
            </Box>
          ))}
        </Box>
      </Box>

      {selectedService && (
        <BookingModal
          open={bookingModalOpen}
          onClose={handleCloseBookingModal}
          onSubmit={handleBookingSubmit}
          service={selectedService}
        />
      )}
    </>
  );
}

export default ResponsiveServiceGrid;