import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Toast from './components/Toast/Toast';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <div className="app-shell">
      <aside className="app-shell__rail">
        <div className="brand-mark">publishly</div>

        <nav className="rail-nav" aria-label="Main navigation">
          <button type="button" className="rail-nav__item rail-nav__item--active">
            <span className="rail-nav__icon">▣</span>
            <span>Calendar</span>
          </button>
          <button type="button" className="rail-nav__item">
            <span className="rail-nav__icon">▤</span>
            <span>Posts</span>
          </button>
          <button type="button" className="rail-nav__item">
            <span className="rail-nav__icon">◌</span>
            <span>Analytics</span>
          </button>
        </nav>

        <div className="rail-next">
          <div className="rail-next__label">UP NEXT</div>

          <div className="rail-next__item">
            <div className="rail-next__date">Sep 9</div>
            <div className="rail-next__meta">
              <span className="rail-next__platform">Facebook</span>
            </div>
          </div>

          <div className="rail-next__item">
            <div className="rail-next__date">Sep 9</div>
            <div className="rail-next__meta">
              <span className="rail-next__platform rail-next__platform--instagram">Instagram</span>
            </div>
          </div>

          <div className="rail-next__item">
            <div className="rail-next__date">Sep 8</div>
            <div className="rail-next__meta">
              <span className="rail-next__platform rail-next__platform--youtube">YouTube</span>
            </div>
          </div>
        </div>

        <button type="button" className="rail-settings">
          <span className="rail-settings__icon">⚙</span>
          <span>Settings</span>
        </button>
      </aside>

      <main className="app-shell__workspace">
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </main>

      <Toast />
    </div>
  );
}

export default App;