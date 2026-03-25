import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const knowledgeBase = {
  "What is Fithub?": "Fithub is your ultimate fitness companion, featuring over 1,000 carefully categorized exercises with GIFs, target muscles, and equipment details to help you crush your fitness goals!",
  "How do I find a specific workout?": "It's easy! You can use the 'Search Exercises' bar on the homepage, or simply browse by clicking on the body part categories like Back, Cardio, Chest, or Shoulders to quickly filter the list.",
  "Are there video tutorials?": "Yes! When you click on any exercise card, you'll be taken to a details page that automatically pulls related YouTube video tutorials so you can perfect your form safely."
};

const predefinedQuestions = Object.keys(knowledgeBase);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am the Fithub Offline Assistant. Please choose a question below:' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const handleQuestionClick = (question) => {
    const userMsg = { role: 'user', content: question };
    const botReply = { role: 'assistant', content: knowledgeBase[question] };
    
    // Add user question, then simulate a slight delay for the bot response
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, botReply]);
    }, 600);
  };

  return (
    <>
      {/* Chat Window */}
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
          {/* Header */}
          <Box sx={{ bgcolor: '#FF2625', color: '#fff', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Fithub AI</Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
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
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested Questions Area */}
          <Box sx={{ p: 1.5, bgcolor: '#fff', borderTop: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mb: 0.5 }}>Suggested Questions:</Typography>
            {predefinedQuestions.map((q, idx) => (
              <Button 
                key={idx} 
                variant="outlined" 
                size="small" 
                onClick={() => handleQuestionClick(q)}
                sx={{ 
                  textTransform: 'none', 
                  borderRadius: '12px',
                  color: '#FF2625',
                  borderColor: '#FF2625',
                  fontSize: '0.75rem',
                  lineHeight: '1.2',
                  '&:hover': {
                    backgroundColor: '#fff2f2',
                    borderColor: '#FF2625'
                  }
                }}
              >
                {q}
              </Button>
            ))}
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
            right: 20,
            bgcolor: '#FF2625',
            color: '#fff',
            zIndex: 9998,
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: '#d32121',
            },
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
