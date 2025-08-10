import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CancelIcon from '@mui/icons-material/Cancel';

const steps = ['En attente', 'Confirmée', 'Terminée'];

const CustomStepIcon = (props) => {
  const { active, completed, error } = props;

  if (error) {
    return <CancelIcon color="error" />;
  }
  if (completed) {
    return <CheckCircleIcon color="success" />;
  }
  if (active) {
    return <RadioButtonCheckedIcon color="primary" sx={{ 
      animation: 'pulse 1.5s infinite',
      borderRadius: '50%',
    }} />;
  }
  return <RadioButtonUncheckedIcon color="disabled" />;
};

function BookingTimeline({ timeline, currentStatus }) {
  let activeStep;
  const isCancelled = currentStatus === 'Annulée';

  if (isCancelled) {
    activeStep = -1;
  } else if (currentStatus === 'Confirmée') {
    activeStep = steps.indexOf('Terminée');
  } else if (currentStatus === 'Terminée') {
    activeStep = steps.length;
  } else {
    activeStep = steps.indexOf(currentStatus);
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
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => {
          const event = timeline.find(e => e.status === label);
          const isError = isCancelled && index >= steps.indexOf('Confirmée');

          return (
            <Step key={label} completed={index < activeStep}>
              <StepLabel
                StepIconComponent={(props) => <CustomStepIcon {...props} error={isError} />}
              >
                <Typography variant="h6">{label}</Typography>
                {event && (
                  <Typography variant="caption">
                    {/* ✅ MODIFIÉ : Affiche maintenant la date ET l'heure */}
                    {new Date(event.eventDate).toLocaleString('fr-FR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {isCancelled && (
        <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'error.main', ml: '12px'}}>
          <Typography color="error" sx={{ fontWeight: 'bold' }}>
            ❌ Réservation Annulée
          </Typography>
          {timeline.find(e => e.status === 'Annulée') && (
            <Typography variant="caption" color="error">
                {new Date(timeline.find(e => e.status === 'Annulée').eventDate).toLocaleString('fr-FR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default BookingTimeline;