import { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form' or 'admin'

  return (
    <div className="app-container">
      <header className="header">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setCurrentView('form'); }}>
          FeedbackFlow
        </a>
        <nav className="nav-links">
          <a 
            href="#" 
            className={currentView === 'form' ? 'active' : ''} 
            onClick={(e) => { e.preventDefault(); setCurrentView('form'); }}
          >
            Submit Feedback
          </a>
          <a 
            href="#" 
            className={currentView === 'admin' ? 'active' : ''} 
            onClick={(e) => { e.preventDefault(); setCurrentView('admin'); }}
          >
            Admin View
          </a>
        </nav>
      </header>

      <main>
        {currentView === 'form' ? <FeedbackForm /> : <AdminPanel />}
      </main>
    </div>
  );
}

export default App;
