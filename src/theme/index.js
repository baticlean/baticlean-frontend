import { createTheme } from '@mui/material/styles';

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
    // Style pour les boutons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Bords très arrondis pour un effet "pilule"
          color: 'white',
          // Le dégradé de fond
          background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%, #F27121 100%)',
          // Style du texte
          textTransform: 'none', // Empêche le texte de se mettre en majuscules
          fontWeight: 'bold',
          padding: '10px 20px',
        },
      },
    },
    // Style pour les champs de texte
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Applique les bords arrondis aux champs de texte
        },
      },
    },
  },
});

export default theme;