// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Grid, Card, CardContent, CardMedia, CardActions,
  CircularProgress, Alert, Button, IconButton, Accordion, AccordionSummary,
  AccordionDetails, TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchServices, likeService, addComment, 
  likeComment, updateComment, deleteComment 
} from '../redux/serviceSlice.js';
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
import BookingModal from '../components/BookingModal.jsx';
import { toast } from 'react-toastify';
import { createBooking } from '../redux/bookingSlice.js';

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
        {/* On utilise la photo de profil de l'auteur du commentaire */}
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

// ... (Le reste du fichier HomePage.jsx reste inchangé)

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

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: services, loading, error } = useSelector((state) => state.services);
  
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);
  
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Bienvenue, {user?.username} !</Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>Nos Services</Typography>
        <Grid container spacing={4}>
          {(services || []).map((service) => (
            <Grid item key={service._id} xs={12} sm={6} md={4}>
              <ServiceCard service={service} onBook={handleOpenBookingModal} />
            </Grid>
          ))}
        </Grid>
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

export default HomePage;