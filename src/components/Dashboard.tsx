import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 

const Dashboard: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [sentiment, setSentiment] = useState<{ score: number, magnitude: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeText = async () => {
        if (!inputText) {
            setError('Please enter some text for analysis.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeText', 
                { params: { text: inputText } }
            );
            setSentiment(response.data.sentiment);
        } catch (error) {
            setError('Error analyzing sentiment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const analyzeUrl = async () => {
        
        setError('URL analysis is not implemented yet.');
    };

    return (
        <div className="dashboard">
            <h1>Sentiment Analysis Dashboard</h1>

            <div className="input-section">
                <p>Insert text here to analyze. **Note: Authenticated users can save results and access to URL analysis </p>
                <br />
                <p>Start with a news article below...or something else</p>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text for sentiment analysis"
                    rows={5}
                />
                <button onClick={analyzeText} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Text'}
                </button>
            </div>

            <div className="input-section">
                <p>Analyze URL</p>
                <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter URL to analyze"
                />
                <button onClick={analyzeUrl} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze URL'}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {sentiment && (
                <div className="results-section">
                    <h3>Sentiment Analysis Results</h3>
                    <p><strong>Sentiment Score:</strong> {sentiment.score}</p>
                    <p><strong>Sentiment Magnitude:</strong> {sentiment.magnitude}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;