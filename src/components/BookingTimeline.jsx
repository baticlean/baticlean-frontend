import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CancelIcon from '@mui/icons-material/Cancel';

const steps = ['En attente', 'Confirmée', 'Terminée'];

// On améliore l'icône pour gérer tous les cas
const CustomStepIcon = (props) => {
  const { active, completed, error } = props;

  if (error) {
    return <CancelIcon color="error" />;
  }

  if (completed) {
    return <CheckCircleIcon color="success" />;
  }

  if (active) {
    // Animation pour l'étape en cours
    return <RadioButtonCheckedIcon color="primary" sx={{ 
      animation: 'pulse 1.5s infinite',
      borderRadius: '50%',
    }} />;
  }

  return <RadioButtonUncheckedIcon color="disabled" />;
};

function BookingTimeline({ timeline, currentStatus }) {
  let activeStep = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === 'Annulée';

  // Si la réservation est terminée, toutes les étapes sont complétées
  if (currentStatus === 'Terminée') {
    activeStep = steps.length;
  }

  return (
    <Box sx={{ width: '100%', my: 3 }}>
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
            100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
          }
        `}
      </style>
      <Stepper activeStep={isCancelled ? -1 : activeStep} orientation="vertical">
        {steps.map((label, index) => {
          const event = timeline.find(e => e.status === label);
          const isError = isCancelled && index >= steps.indexOf('Confirmée');

          return (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => <CustomStepIcon {...props} error={isError} />}
              >
                <Typography variant="h6">{label}</Typography>
                {event && (
                  <Typography variant="caption">
                    {new Date(event.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {isCancelled && (
         <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
            ❌ Réservation Annulée
         </Typography>
      )}
    </Box>
  );
}

export default BookingTimeline;