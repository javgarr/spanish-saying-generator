import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, TextareaAutosize, Typography, Box } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

function InputArea({ onGenerate }) {
  const [input, setInput] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault(); // Prevent the default action (new line) 
      onGenerate(input);
    }
  };

  return (
    <Box my={4}>
      <TextareaAutosize
        minRows={5}
        style={{ width: '100%', padding: '1em' }}
        placeholder="I swear there was a Spanish saying for..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => onGenerate(input)}>
          Generate Saying
        </Button>
      </Box>
    </Box>
  );
}


function OutputArea({ saying, loading, onFeedback }) {
  return (
    <Box my={4}>
      {loading && <Typography variant="h6">Loading...</Typography>}
      {saying && !loading && (
        <div>
          <Typography variant="h5">{saying}</Typography>
          <Box mt={2}>
            <Button startIcon={<ThumbUp />} onClick={() => onFeedback(true)}>Relevant</Button>
            <Button startIcon={<ThumbDown />} onClick={() => onFeedback(false)}>Not Relevant</Button>
          </Box>
        </div>
      )}
    </Box>
  );
}

function App() {
  const [saying, setSaying] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (input) => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [{
          role: "user",
          content: `your job is to give me an existing short traditional Spanish saying that can portray the following scenario: "${input}"`
        }],
        temperature: 0.7,
        max_tokens: 50
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      console.log()
      const generatedText = response.data.choices?.[0]?.message.content;
      setSaying(generatedText);
    } catch (error) {
      console.error("Error generating saying:", error);
      setSaying("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (isRelevant) => {
    if (isRelevant) {
      console.log("User found the saying relevant.");
    } else {
      console.log("User found the saying irrelevant.");
    }
    // Handle feedback as needed, e.g., send to analytics or database.
  };

  return (
    <Container maxWidth="sm">
      <Box my={6} textAlign="center">
        <Typography variant="h4" gutterBottom>Spanish Saying Generator</Typography>
        <InputArea onGenerate={handleGenerate} />
        <OutputArea saying={saying} loading={loading} onFeedback={handleFeedback} />
      </Box>
    </Container>
  );
}

export default App;
