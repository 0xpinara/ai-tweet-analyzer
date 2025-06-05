require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
const { OpenAI } = require('openai');
const { TwitterApi } = require('twitter-api-v2');

const app = express();
const port = 4000;  // Hardcoded port
console.log('Starting server on port:', port);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Twitter API
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Helper function to analyze tweet content
async function analyzeTweet(content) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a tweet analyzer. Analyze the following tweet and provide: 1) A brief summary (1-2 sentences), 2) Sentiment (positive/negative/neutral)"
        },
        {
          role: "user",
          content: content
        }
      ],
    });

    const analysis = completion.choices[0].message.content;
    return {
      summary: analysis.split('\n')[0],
      sentiment: analysis.toLowerCase().includes('positive') ? 'positive' : 
                 analysis.toLowerCase().includes('negative') ? 'negative' : 'neutral'
    };
  } catch (error) {
    console.error('Error analyzing tweet:', error);
    throw error;
  }
}

// API Endpoints
app.post('/api/analyze-tweet', async (req, res) => {
  try {
    const { tweetUrl } = req.body;
    
    // Extract tweet ID from URL (simplified version)
    const tweetId = tweetUrl.split('/').pop();

    const mockTweet = {
      text: "This is a sample tweet for demonstration purposes. #AI #Technology",
      username: "@sampleuser",
      createdAt: new Date().toISOString(),
    };

    // Analyze the tweet content
    const analysis = await analyzeTweet(mockTweet.text);

    // Prepare record for Airtable
    const record = {
      fields: {
        'Username': mockTweet.username,
        'Tweet Content': mockTweet.text,
        'Sentiment': analysis.sentiment,
        'Summary': analysis.summary,
        'Date and Time': mockTweet.createdAt
      }
    };

    // Save to Airtable
    const savedRecord = await table.create(record);

    res.json({
      success: true,
      data: {
        ...record.fields,
        id: savedRecord.id
      }
    });
  } catch (error) {
    console.error('Error processing tweet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process tweet'
    });
  }
});

app.get('/api/analysis-history', async (req, res) => {
  try {
    const records = await table.select().all();
    const history = records.map(record => record.fields);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis history'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 