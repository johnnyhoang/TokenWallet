import { useState } from 'react';
import { Modal } from './Modal';
import { applyTheme } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from '../pages/UserManagement';

export { applyTheme };

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { isAdmin } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'dark');
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'users'>('general');

  // AI & Connector API keys state
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [githubToken, setGithubToken] = useState(localStorage.getItem('github_token') || '');
  const [vercelToken, setVercelToken] = useState(localStorage.getItem('vercel_token') || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey) localStorage.setItem('gemini_api_key', geminiKey.trim());
    else localStorage.removeItem('gemini_api_key');

    if (openAIKey) localStorage.setItem('openai_api_key', openAIKey.trim());
    else localStorage.removeItem('openai_api_key');

    if (githubToken) localStorage.setItem('github_token', githubToken.trim());
    else localStorage.removeItem('github_token');

    if (vercelToken) localStorage.setItem('vercel_token', vercelToken.trim());
    else localStorage.removeItem('vercel_token');

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <Modal
      title="System Settings"
      onClose={onClose}
      maxWidth={activeTab === 'users' ? '760px' : activeTab === 'ai' ? '560px' : '480px'}
    >
      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
        <button
          className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('general')}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
        >
          ⚙️ Appearance
        </button>
        <button
          className={`btn ${activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('ai')}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
        >
          🤖 AI & API Connectors
        </button>
        {isAdmin && (
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
          >
            👥 User Management
          </button>
        )}
      </div>

      {activeTab === 'general' && (
        <div>
          {/* Dark / Light Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Theme & Appearance</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Switch between dark and light workstation modes</div>
            </div>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                border: '1px solid var(--color-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <form onSubmit={handleSaveApiKeys}>
          {savedNotice && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              ✓ API Keys saved successfully in local browser storage!
            </div>
          )}

          <div className="form-group">
            <label>Google Gemini API Key:</label>
            <input
              type="password"
              className="input-text"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Used to automatically extract repository architectures and synthesize technical specifications.
            </span>
          </div>

          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>OpenAI API Key (Optional):</label>
            <input
              type="password"
              className="input-text"
              placeholder="sk-..."
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>GitHub Personal Access Token (PAT):</label>
            <input
              type="password"
              className="input-text"
              placeholder="ghp_..."
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Used to inspect private GitHub repositories.
            </span>
          </div>

          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>Vercel Access Token:</label>
            <input
              type="password"
              className="input-text"
              placeholder="Vercel API Token..."
              value={vercelToken}
              onChange={(e) => setVercelToken(e.target.value)}
            />
          </div>

          <div className="modal-actions" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {activeTab === 'users' && <UserManagement />}
    </Modal>
  );
}
