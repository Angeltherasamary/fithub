import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, TextField, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const INITIAL_MESSAGE = `Welcome to Fithub 24/7 Care! 👋 
What would you like to do? (Type the number)

1️⃣ Find an Exercise
2️⃣ Get a quick Fitness Tip
3️⃣ Check BMI Category
4️⃣ Contact Support`;

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: INITIAL_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState('MAIN_MENU'); // MAIN_MENU, EXERCISE_PART, BMI_HEIGHT, BMI_WEIGHT
  const [tempData, setTempData] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const handleBotResponse = (userText) => {
    let responseText = "";
    let nextState = chatState;
    const textInfo = userText.trim().toLowerCase();

    if (textInfo === 'menu' || textInfo === '0' || textInfo === 'back') {
      nextState = 'MAIN_MENU';
      responseText = INITIAL_MESSAGE;
      return { responseText, nextState };
    }

    switch (chatState) {
      case 'MAIN_MENU':
        if (textInfo === '1') {
          responseText = "Select Body Part:\n1️⃣ Chest\n2️⃣ Back\n3️⃣ Legs\n4️⃣ Cardio\n\n(Type a number)";
          nextState = 'EXERCISE_PART';
        } else if (textInfo === '2') {
          responseText = "💡 Fitness Tip: Drink at least 3 liters of water a day and prioritize 7-8 hours of sleep for optimum muscle recovery!\n\n(Type 'menu' to go back)";
        } else if (textInfo === '3') {
          responseText = "Let's check your BMI!\nPlease enter your Height in Centimeters (e.g. 175):";
          nextState = 'BMI_HEIGHT';
        } else if (textInfo === '4') {
          responseText = "📞 Support Email: support@fithub.com\nPhone: +1 234-567-890\n\n(Type 'menu' to go back)";
        } else {
          responseText = "Invalid choice. Please type 1, 2, 3, or 4.";
        }
        break;

      case 'EXERCISE_PART':
        if (textInfo === '1') {
          responseText = "🏋️‍♂️ *Chest Exercises:*\n- Barbell Bench Press\n- Dumbbell Flys\n- Push-ups\n\n(Type 'menu' to go back)";
        } else if (textInfo === '2') {
          responseText = "🏋️‍♂️ *Back Exercises:*\n- Pull-ups\n- Deadlifts\n- Seated Cable Rows\n\n(Type 'menu' to go back)";
        } else if (textInfo === '3') {
          responseText = "🏋️‍♂️ *Leg Exercises:*\n- Squats\n- Leg Press\n- Calf Raises\n\n(Type 'menu' to go back)";
        } else if (textInfo === '4') {
          responseText = "🏃‍♀️ *Cardio:*\n- Treadmill Running\n- Jump Rope\n- Cycling\n\n(Type 'menu' to go back)";
        } else {
          responseText = "Invalid choice. Type 1, 2, 3, or 4. (Or type 'menu' to exit)";
        }
        break;

      case 'BMI_HEIGHT':
        const height = parseFloat(textInfo);
        if (isNaN(height) || height < 50 || height > 300) {
          responseText = "Please enter a valid height in cm (e.g. 175):";
        } else {
          setTempData({ ...tempData, height });
          responseText = "Great! Now enter your Weight in Kilograms (e.g. 70):";
          nextState = 'BMI_WEIGHT';
        }
        break;

      case 'BMI_WEIGHT':
        const weight = parseFloat(textInfo);
        if (isNaN(weight) || weight < 10 || weight > 400) {
          responseText = "Please enter a valid weight in kg (e.g. 70):";
        } else {
          const heightInMeters = tempData.height / 100;
          const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
          let category = "";
          if (bmi < 18.5) category = "Underweight 🔵";
          else if (bmi < 24.9) category = "Normal weight 🟢";
          else if (bmi < 29.9) category = "Overweight 🟡";
          else category = "Obese 🔴";

          responseText = `📊 *Your BMI Report:*\nHeight: ${tempData.height} cm\nWeight: ${weight} kg\n*BMI: ${bmi}*\nCategory: ${category}\n\n(Type 'menu' to go back to main menu)`;
          nextState = 'MAIN_MENU';
        }
        break;

      default:
        responseText = INITIAL_MESSAGE;
        nextState = 'MAIN_MENU';
        break;
    }

    return { responseText, nextState };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsgText = input.trim();
    const userMsg = { role: 'user', content: userMsgText };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Process State Machine Offline
    const { responseText, nextState } = handleBotResponse(userMsgText);
    setChatState(nextState);

    // Simulate delay for realistic typing
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {open && (
        <Paper
          elevation={5}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 320,
            height: 480,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ bgcolor: '#FF2625', color: '#fff', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Fithub 24/7 Care</Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#f9f9f9' }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <Box
                  sx={{
                    maxWidth: '85%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.role === 'user' ? '#FF2625' : '#e0e0e0',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line'
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 1, bgcolor: '#fff', borderTop: '1px solid #ddd', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type your reply (e.g. 1)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
            />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim()} sx={{ color: '#FF2625' }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: '#FF2625',
            color: '#fff',
            zIndex: 9998,
            width: 50,
            height: 50,
            '&:hover': { bgcolor: '#d32121' },
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          <ChatIcon />
        </IconButton>
      )}
    </>
  );
};

export default Chatbot;
