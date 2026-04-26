import { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('https://telegram-bot-9y9e.onrender.com/api/feedbacks');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setFeedbacks(data.feedbacks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}><div className="spinner"></div></div>;
  if (error) return <div className="message error">Error: {error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Feedback Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Total Feedbacks: {feedbacks.length}</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '100%' }}>
          <p>No feedback received yet.</p>
        </div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-item">
              <div className="feedback-meta">
                <div>
                  <strong>{fb.name}</strong> ({fb.email})
                </div>
                <div>
                  {new Date(fb.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="feedback-stars">
                {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
              </div>
              <div className="feedback-content" style={{ marginTop: '1rem' }}>
                {fb.experience}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
