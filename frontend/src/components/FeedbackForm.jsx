import { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    experience: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRating = (ratingValue) => {
    setFormData(prev => ({ ...prev, rating: ratingValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setStatus('error');
      setMessage('Please provide a rating.');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you! Your feedback has been submitted successfully.');
        setFormData({ name: '', email: '', rating: 0, experience: '' });
        setHoverRating(0);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Share Your Experience</h2>
      
      {status === 'success' && <div className="message success">{message}</div>}
      {status === 'error' && <div className="message error">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || formData.rating) ? 'active' : ''}`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Your Experience</label>
          <textarea
            id="experience"
            name="experience"
            className="form-control"
            placeholder="Tell us what you liked or how we can improve..."
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? <div className="spinner"></div> : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
