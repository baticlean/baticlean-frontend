// src/components/MaintenancePage.jsx (Mis à jour)

import React, { useState } from 'react';
import { 
    Box, Typography, Button, Container, Dialog, DialogTitle, 
    DialogContent, IconButton, Link, DialogActions 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// NOUVEAU : Importation des icônes pour le contact
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

function MaintenancePage() {
  const navigate = useNavigate();
  
  // NOUVEAU : État pour contrôler l'ouverture du modal de contact
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContactModal = () => setContactModalOpen(true);
  const handleCloseContactModal = () => setContactModalOpen(false);

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: '4rem', marginBottom: '16px' }}
            >
              🛠️
            </motion.div>

            <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Page En Maintenance
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Cette page est en maintenance pour améliorations. Veuillez réessayer plus tard ou contacter l'administration si le problème est d'une urgence extrême.
              <br/><br/>
              BATIClean s'excuse pour les désagréments occasionnés.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  fullWidth
                  variant="contained"
                  // MODIFIÉ : Ouvre le modal au lieu de naviguer
                  onClick={handleOpenContactModal} 
                >
                  Contacter l'administration
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(-1)}
                >
                  Retour
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* NOUVEAU : Le Modal de Contact */}
      <Dialog open={contactModalOpen} onClose={handleCloseContactModal}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Nous contacter</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2, gap: 4 }}>
            <Link href={import.meta.env.VITE_FACEBOOK_URL} target="_blank">
              <IconButton sx={{ color: '#1877F2' }}>
                <FacebookIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Link>
            <Link href={import.meta.env.VITE_WHATSAPP_URL} target="_blank">
              <IconButton sx={{ color: '#25D366' }}>
                <WhatsAppIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Link>
            {/* IMPORTANT : Remplacez le lien placeholder par votre vrai lien Telegram */}
            <Link href={import.meta.env.VITE_TELEGRAM_URL} target="_blank">
              <IconButton sx={{ color: '#2AABEE' }}>
                <TelegramIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Link>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactModal}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MaintenancePage;