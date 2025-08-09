import { createTheme } from '@mui/material/styles';
// 1. Importer l'image de fond
// Assurez-vous que le chemin relatif est correct par rapport à l'emplacement de ce fichier.
// Si votre dossier `theme` est dans `src`, le chemin '../assets/background.png' est correct.
import backgroundImage from '../assets/background.png';

const theme = createTheme({
  // Définition de la police de caractères principale
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
  // Forme globale des composants
  shape: {
    borderRadius: 12, // Bords arrondis pour tous les composants
  },
  // Personnalisation des composants spécifiques
  components: {
    // 2. Appliquer le style global au corps du site
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed', // L'image reste fixe pendant le défilement
          // Optionnel : une couleur de fond si l'image ne charge pas
          backgroundColor: '#f0f2f5', 
        },
      },
    },
    // Style pour les boutons (inchangé)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Bords très arrondis pour un effet "pilule"
          color: 'white',
          background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%, #F27121 100%)',
          textTransform: 'none', // Empêche le texte de se mettre en majuscules
          fontWeight: 'bold',
          padding: '10px 20px',
        },
      },
    },
    // Style pour les champs de texte (inchangé)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Applique les bords arrondis aux champs de texte
        },
      },
    },

    // ===================================================================
    // ## NOUVELLE SECTION AJOUTÉE POUR LES NOTIFICATIONS "TOAST" ##
    // ===================================================================
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          // Style par défaut pour toutes les notifications (forme de pilule)
          borderRadius: '50px',
          padding: '6px 20px',
          minWidth: 'auto',
          justifyContent: 'center',
          flexWrap: 'nowrap',
          
          // Style spécifique pour les notifications de chargement (cercle parfait)
          // en utilisant une classe CSS personnalisée que vous ajouterez lors de l'appel
          '&.loading-toast': {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            padding: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fond semi-transparent pour le cercle
          },
        },
      },
    },

  },
});

export default theme;