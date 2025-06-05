# AI Tweet Analysis App

This application analyzes tweets using AI and stores the results in a spreadsheet. It provides sentiment analysis, content summarization, and other tweet metrics.

## Features

- Tweet URL input and analysis
- Sentiment analysis (Positive/Negative/Neutral)
- Content summarization
- Tweet metadata extraction
- Automatic spreadsheet integration
- Real-time analysis results

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: Airtable (for storing analysis results)
- AI: OpenAI GPT API for analysis

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd swipeline
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name
OPENAI_API_KEY=your_openai_api_key
```

4. Start the application:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

5. Open http://localhost:4000 in your browser

## Project Structure

```
swipeline/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── README.md         # Project documentation
```

## API Endpoints

- POST /api/analyze-tweet - Analyze a tweet URL
- GET /api/analysis-history - Get analysis history

## Contributing

Feel free to submit issues and enhancement requests. 
