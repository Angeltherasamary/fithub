import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, TextField, Button, InputAdornment } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const BmiCalculator = () => {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBmi = () => {
    if (!weight || !height) return;
    
    // Height in cm to meters
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);
      
      let cat = '';
      if (calculatedBmi < 18.5) cat = 'Underweight';
      else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) cat = 'Normal Weight';
      else if (calculatedBmi >= 25 && calculatedBmi < 29.9) cat = 'Overweight';
      else cat = 'Obese';
      
      setCategory(cat);
    }
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Underweight': return '#ffb74d'; // Orange
      case 'Normal Weight': return '#4caf50'; // Green
      case 'Overweight': return '#f44336'; // Red
      case 'Obese': return '#d32f2f'; // Dark Red
      default: return '#000';
    }
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory('');
  };

  return (
    <>
      {/* BMI Window */}
      {open && (
        <Paper
          elevation={5}
          sx={{
            position: 'fixed',
            bottom: 80,
            left: 20,
            width: 320,
            zIndex: 9999,
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: '#02e9bb', color: '#fff', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FitnessCenterIcon />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>BMI Calculator</Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Form Area */}
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#f9f9f9' }}>
            <TextField
              label="Weight"
              variant="outlined"
              size="small"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
            <TextField
              label="Height"
              variant="outlined"
              size="small"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={calculateBmi}
                sx={{ bgcolor: '#FF2625', '&:hover': { bgcolor: '#d32121' } }}
              >
                Calculate
              </Button>
              <Button 
                variant="outlined" 
                onClick={reset}
                sx={{ color: '#FF2625', borderColor: '#FF2625', '&:hover': { borderColor: '#d32121' } }}
              >
                Reset
              </Button>
            </Box>

            {/* Result Area */}
            {bmi && (
              <Box sx={{ mt: 2, p: 2, textAlign: 'center', bgcolor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                <Typography variant="body2" color="textSecondary">Your BMI Result</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: getCategoryColor(category), my: 1 }}>
                  {bmi}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: '600', color: getCategoryColor(category) }}>
                  {category}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Floating Action Button */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            bgcolor: '#02e9bb',
            color: '#fff',
            zIndex: 9998,
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: '#02c7a0',
            },
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          <CalculateIcon />
        </IconButton>
      )}
    </>
  );
};

export default BmiCalculator;
