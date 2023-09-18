import React, { useState, useRef, useEffect } from 'react';
import './App.css'
import translations from './translations.json';
import axios from 'axios';
import { Button, Container, TextareaAutosize, Typography, Box } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function InputArea({ onGenerate, strings }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault(); // Prevent the default action (new line) 
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
      onGenerate(input);
    }
  };

  return (
    <Box my={4} position={'relative'}>
      <TextareaAutosize
        ref={textareaRef}
        minRows={2}
        style={{ width: '100%', padding: '1em', paddingRight: '50px' }}
        placeholder={strings.placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {input && (<button className='round-button' style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-200%)', cursor: 'pointer' }} onClick={() => setInput('')}>x</button>)}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => onGenerate(input)}>
          {strings.submit}
        </Button>
      </Box>
    </Box>
  );
}

function OutputArea({ saying, loading, onFeedback, strings }) {
  return (
    <Box my={4}>
      {loading && <Typography variant="h5">{strings.loading}</Typography>}
      {saying && !loading && (
        <div>
          <Typography variant="h5">{saying}</Typography>
          <Box mt={2}>
            <Button startIcon={<ThumbUp />} onClick={() => onFeedback(true)}>{strings.positivefeedback}</Button>
            <Button startIcon={<ThumbDown />} onClick={() => onFeedback(false)}>{strings.negativefeedback}</Button>
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
  // eslint-disable-next-line no-unused-vars
  const [locale, setLocale] = useState("en");
  const [strings, setStrings] = useState({});

  useEffect(() => {
    // Check if the browser's language starts with 'es' (for any Spanish variant)
    if (navigator.language.startsWith('es')) {
      setLocale('es');
      setStrings(translations.es);
    } else {
      setLocale('en');
      setStrings(translations.en);
    }
  }, []);

  const handleGenerate = async (input) => {

    setLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `your job is to give me an existing short traditional Spanish saying that can portray the following scenario. Add its translation: "${input}"`
        }],
        temperature: 0.5,
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
      console.error(strings.errorgenerating, error);
      setSaying(strings.genericerror);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (isRelevant) => {
    if (isRelevant) {
      copyToClipboard()
    } else {
      setCopySuccess("")
      setSaying("")
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(saying)
      .then(() => {
        setCopySuccess(strings.copied);
      })
      .catch(err => {
        console.error(strings.couldnotcopy, err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" padding='10px'>
        <Box my={6} textAlign="center" style={{ paddingBottom: '50px' }}>
          <InputArea onGenerate={handleGenerate} strings={strings} />
          <OutputArea saying={saying} loading={loading} onFeedback={handleFeedback} strings={strings} />
          {copySuccess && <div style={{ color: 'green', padding: '5px 10px', border: '1px solid green', borderRadius: '20px', display: 'inline-block' }}>{copySuccess}</div>}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
