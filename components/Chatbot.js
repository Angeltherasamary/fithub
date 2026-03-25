import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi there! I am the Fithub AI Assistant. How can I help you reach your fitness goals today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: `Error: ${data.error || "I'm having trouble connecting right now."}` }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: "Server Error: Unable to connect to the AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
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
            height: 450,
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
                    maxWidth: '80%',
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
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ maxWidth: '80%', p: 1.5, borderRadius: 2, bgcolor: '#e0e0e0' }}>
                   <CircularProgress size={20} color="inherit" />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 1, bgcolor: '#fff', borderTop: '1px solid #ddd', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
            />
            <IconButton color="primary" onClick={handleSend} disabled={loading || !input.trim()} sx={{ color: '#FF2625' }}>
              <SendIcon />
            </IconButton>
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
