import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Container, TextareaAutosize, Typography, Box } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
placeholder="I bet you we have a saying in Spain for it..."
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
  {loading && <Typography variant="h5">Loading...</Typography>}
  {saying && !loading && (
    <div>
    <Typography variant="h5">{saying}</Typography>
    <Box mt={2}>
    <Button startIcon={<ThumbUp />} onClick={() => onFeedback(true)}>Love it</Button>
    <Button startIcon={<ThumbDown />} onClick={() => onFeedback(false)}>Yeah...nah</Button>
    </Box>
    </div>
    )}
  </Box>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#C60C30',  // Red color from the Spanish flag
    },
  },
});

function App() {
  const [saying, setSaying] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  const handleGenerate = async (input) => {
  if (textAreaRef.current) {
    textAreaRef.current.blur();
}
setLoading(true);
try {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `your job is to give me an existing short traditional Spanish saying that can portray the following scenario (and its translation): "${input}"`
    }],
    temperature: 0.7,
    max_tokens: 75
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
    copyToClipboard()
  } else {
    setCopySuccess("")
    handleGenerate()
  }
    // Handle feedback as needed, e.g., send to analytics or database.
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(saying)
  .then(() => {
    setCopySuccess('Copied to clipboard!');
  })
  .catch(err => {
    console.error('Could not copy text: ', err);
  });
};

return (
<ThemeProvider theme={theme}>
<Container maxWidth="sm">
<Box my={6} textAlign="center">
<Typography variant="h5" gutterBottom>What's on your mind?</Typography>
<InputArea ref={textAreaRef} onGenerate={handleGenerate} />
<OutputArea saying={saying} loading={loading} onFeedback={handleFeedback} />
{copySuccess && <div style={{ color: 'green' }}>{copySuccess}</div>}
</Box>
</Container>
</ThemeProvider>
);
}

export default App;
