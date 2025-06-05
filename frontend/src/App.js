import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function App() {
  const [tweetUrl, setTweetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis-history`);
      setAnalysisHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/analyze-tweet`, { tweetUrl });
      setAnalysisHistory([response.data.data, ...analysisHistory]);
      setTweetUrl('');
    } catch (error) {
      setError('Failed to analyze tweet. Please try again.');
      console.error('Error analyzing tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Swipeline AI Tweet Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleAnalyze}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Tweet URL"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://twitter.com/username/status/123456789"
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Tweet Content</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Date and Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analysisHistory.map((analysis, index) => (
              <TableRow key={index}>
                <TableCell>{analysis.Username}</TableCell>
                <TableCell>{analysis['Tweet Content']}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      color: analysis.Sentiment === 'positive' ? 'success.main' :
                             analysis.Sentiment === 'negative' ? 'error.main' :
                             'info.main'
                    }}
                  >
                    {analysis.Sentiment}
                  </Box>
                </TableCell>
                <TableCell>{analysis.Summary}</TableCell>
                <TableCell>
                  {new Date(analysis['Date and Time']).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App; 