import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const EntitySentimentAnalysisSentences: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [sentences, setSentences] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeSentencesWithSalience = async () => {
        if (!inputText) {
            setError('Please enter text.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                'https://us-central1-automatedcontenthub.cloudfunctions.net/analyzeSentencesWithSalience',
                { params: { text: inputText } }
            );
            setSentences(response.data.sentences);
        } catch (error) {
            setError('Error analyzing, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <h2>Sentence Sentiment Analysis with Aggregated Salience</h2>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text for analysis"
                rows={5}
            />
            <button
                className="dashboard-button"
                onClick={analyzeSentencesWithSalience}
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {error && <p>{error}</p>}
            {sentences && (
                <div className="results-section">
                    <h3>Analysis Results</h3>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Sentence</th>
                                <th>Sentiment Score</th>
                                <th>Magnitude</th>
                                <th>Aggregated Salience</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentences.map((sentence, index) => (
                                <tr key={index}>
                                    <td>{sentence.text}</td>
                                    <td>{sentence.sentiment !== undefined ? sentence.sentiment.toFixed(2) : 'N/A'}</td>
                                    <td>{sentence.magnitude !== undefined ? sentence.magnitude.toFixed(2) : 'N/A'}</td>
                                    <td>{sentence.aggregatedSalience !== undefined ? sentence.aggregatedSalience.toFixed(2) : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EntitySentimentAnalysisSentences;