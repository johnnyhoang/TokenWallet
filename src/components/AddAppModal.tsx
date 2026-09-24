import React, { useState } from 'react';
import { Modal } from './Modal';
import {
  GithubIcon,
  VercelIcon,
  SparklesIcon,
  PlusIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  RefreshIcon,
  EditIcon,
} from './icons';
import { fetchGitHubRepoData, fetchVercelProjectData } from '../utils/connectors';
import { extractAppWithAI, findDuplicateApp, type ExtractedAppResult } from '../utils/aiAppBuilder';
import type { AppProject, BacklogItem } from '../data/mappers';
import { newId } from '../utils/ids';

interface AddAppModalProps {
  existingApps: AppProject[];
  onClose: () => void;
  onSaveNewApp: (app: Omit<AppProject, 'backlog'>, backlog: BacklogItem[]) => Promise<void>;
  onUpdateExistingApp: (app: AppProject, backlog: BacklogItem[]) => Promise<void>;
}

export function AddAppModal({
  existingApps,
  onClose,
  onSaveNewApp,
  onUpdateExistingApp,
}: AddAppModalProps) {
  const [activeTab, setActiveTab] = useState<'github' | 'vercel' | 'manual'>('github');

  // Input states
  const [githubInput, setGithubInput] = useState('');
  const [githubToken, setGithubToken] = useState(localStorage.getItem('github_token') || '');
  const [saveGithubToken, setSaveGithubToken] = useState(true);

  const [vercelInput, setVercelInput] = useState('');
  const [vercelToken, setVercelToken] = useState(localStorage.getItem('vercel_token') || '');
  const [saveVercelToken, setSaveVercelToken] = useState(true);

  // Status & loading states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Extracted Result & Duplicate state
  const [extractedData, setExtractedData] = useState<ExtractedAppResult | null>(null);
  const [duplicateApp, setDuplicateApp] = useState<AppProject | null>(null);
  const [viewMode, setViewMode] = useState<'import' | 'duplicate_prompt' | 'review'>('import');

  // Review / Manual form data
  const [formData, setFormData] = useState<Partial<AppProject>>({
    title: '',
    frontendUrl: '',
    category: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Development',
    priority: 'Medium',
    author: 'johnnyhoang',
    hosting: '',
    github: '',
    description: '',
    techNotes: '',
    specVi: '',
    specEn: '',
  });
  const [backlogList, setBacklogList] = useState<BacklogItem[]>([]);
  const [newBacklogTitle, setNewBacklogTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Handle GitHub Import
  const handleConnectGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;

    if (saveGithubToken && githubToken) {
      localStorage.setItem('github_token', githubToken.trim());
    }

    setIsProcessing(true);
    setErrorMessage('');
    setProgressStep('Connecting to GitHub and analyzing repository...');

    try {
      const repoPayload = await fetchGitHubRepoData(githubInput, githubToken);

      setProgressStep('AI is inspecting README, dependencies & code structure to extract specs...');
      const aiResult = await extractAppWithAI('github', repoPayload);

      setExtractedData(aiResult);
      populateFormData(aiResult);

      // Check duplicate
      const duplicate = findDuplicateApp(
        { title: aiResult.title, frontendUrl: aiResult.frontendUrl },
        existingApps
      );

      if (duplicate) {
        setDuplicateApp(duplicate);
        setViewMode('duplicate_prompt');
      } else {
        setViewMode('review');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error extracting data from GitHub');
    } finally {
      setIsProcessing(false);
      setProgressStep('');
    }
  };

  // Handle Vercel Import
  const handleConnectVercel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vercelInput.trim()) return;

    if (saveVercelToken && vercelToken) {
      localStorage.setItem('vercel_token', vercelToken.trim());
    }

    setIsProcessing(true);
    setErrorMessage('');
    setProgressStep('Connecting to Vercel deployment & inspecting live website...');

    try {
      const vercelPayload = await fetchVercelProjectData(vercelInput, vercelToken);

      setProgressStep('AI is analyzing architecture, DOM metadata & generating specifications...');
      const aiResult = await extractAppWithAI('vercel', vercelPayload);

      setExtractedData(aiResult);
      populateFormData(aiResult);

      // Check duplicate
      const duplicate = findDuplicateApp(
        { title: aiResult.title, frontendUrl: aiResult.frontendUrl },
        existingApps
      );

      if (duplicate) {
        setDuplicateApp(duplicate);
        setViewMode('duplicate_prompt');
      } else {
        setViewMode('review');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error extracting data from Vercel');
    } finally {
      setIsProcessing(false);
      setProgressStep('');
    }
  };

  // Populate form with AI extracted results
  const populateFormData = (result: ExtractedAppResult) => {
    setFormData({
      title: result.title,
      frontendUrl: result.frontendUrl,
      category: result.category,
      database: result.database,
      status: result.status,
      priority: result.priority,
      author: result.author || 'johnnyhoang',
      hosting: result.hosting || '',
      github: result.github || '',
      description: result.description,
      techNotes: result.techNotes,
      specVi: result.specVi,
      specEn: result.specEn,
      specUpdatedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    const items: BacklogItem[] = result.backlog.map((t) => ({
      id: newId('bl'),
      title: t,
      isCompleted: false,
    }));
    setBacklogList(items);
  };

  // Direct Update Existing App when Duplicate Detected
  const handleApplyUpdateDuplicate = async () => {
    if (!duplicateApp || !extractedData) return;
    setIsSaving(true);
    try {
      const updated: AppProject = {
        ...duplicateApp,
        title: formData.title || duplicateApp.title,
        frontendUrl: formData.frontendUrl || duplicateApp.frontendUrl,
        category: formData.category || duplicateApp.category,
        database: formData.database || duplicateApp.database,
        status: formData.status || duplicateApp.status,
        priority: formData.priority || duplicateApp.priority,
        author: formData.author || duplicateApp.author || 'johnnyhoang',
        hosting: formData.hosting || duplicateApp.hosting || '',
        github: formData.github || duplicateApp.github || '',
        description: formData.description || duplicateApp.description,
        techNotes: formData.techNotes || duplicateApp.techNotes,
        specVi: formData.specVi || duplicateApp.specVi,
        specEn: formData.specEn || duplicateApp.specEn,
        specUpdatedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const finalBacklog = backlogList.length > 0 ? backlogList : (duplicateApp.backlog || []);
      await onUpdateExistingApp(updated, finalBacklog);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error updating application');
    } finally {
      setIsSaving(false);
    }
  };

  // Save new app / review finish
  const handleFinalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setIsSaving(true);
    try {
      if (duplicateApp && viewMode === 'review') {
        // If reviewing duplicate, update
        const updated: AppProject = {
          ...duplicateApp,
          title: formData.title.trim(),
          frontendUrl: formData.frontendUrl?.trim() || '',
          category: formData.category || 'Web App',
          database: formData.database || 'JH Supabase Data 1',
          status: formData.status || 'Development',
          priority: formData.priority || 'Medium',
          author: formData.author?.trim() || 'johnnyhoang',
          hosting: formData.hosting?.trim() || '',
          github: formData.github?.trim() || '',
          description: formData.description || '',
          techNotes: formData.techNotes || '',
          specVi: formData.specVi || '',
          specEn: formData.specEn || '',
          specUpdatedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        await onUpdateExistingApp(updated, backlogList);
      } else {
        // Create brand new
        const newProj: Omit<AppProject, 'backlog'> = {
          id: newId('app'),
          title: formData.title.trim(),
          frontendUrl: formData.frontendUrl?.trim() || '',
          category: formData.category || 'Web App',
          database: formData.database || 'JH Supabase Data 1',
          status: formData.status || 'Development',
          priority: formData.priority || 'Medium',
          author: formData.author?.trim() || 'johnnyhoang',
          hosting: formData.hosting?.trim() || '',
          github: formData.github?.trim() || '',
          description: formData.description || '',
          techNotes: formData.techNotes || '',
          specVi: formData.specVi || '',
          specEn: formData.specEn || '',
          specUpdatedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          healthStatus: 'unknown',
        };
        await onSaveNewApp(newProj, backlogList);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error saving application');
    } finally {
      setIsSaving(false);
    }
  };

  // Add Backlog Item in review
  const handleAddBacklogItem = () => {
    if (!newBacklogTitle.trim()) return;
    setBacklogList((prev) => [
      ...prev,
      { id: newId('bl'), title: newBacklogTitle.trim(), isCompleted: false },
    ]);
    setNewBacklogTitle('');
  };

  return (
    <Modal
      title={
        viewMode === 'duplicate_prompt'
          ? 'Duplicate Application Detected'
          : viewMode === 'review'
          ? 'Review & Save Application'
          : 'Add New Application (AI App Builder)'
      }
      onClose={onClose}
      maxWidth={viewMode === 'review' ? '720px' : '580px'}
    >
      {/* 1. INITIAL IMPORT SCREEN */}
      {viewMode === 'import' && (
        <div>
          {/* Method Selection Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <button
              type="button"
              className={`btn ${activeTab === 'github' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('github')}
              style={{ justifyContent: 'center', padding: '0.6rem 0.5rem' }}
            >
              <GithubIcon size={18} />
              <span>GitHub Repo</span>
            </button>
            <button
              type="button"
              className={`btn ${activeTab === 'vercel' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('vercel')}
              style={{ justifyContent: 'center', padding: '0.6rem 0.5rem' }}
            >
              <VercelIcon size={16} />
              <span>Vercel Project</span>
            </button>
            <button
              type="button"
              className={`btn ${activeTab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveTab('manual');
                setViewMode('review');
              }}
              style={{ justifyContent: 'center', padding: '0.6rem 0.5rem' }}
            >
              <EditIcon size={16} />
              <span>Manual Entry</span>
            </button>
          </div>

          {errorMessage && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <AlertTriangleIcon size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {isProcessing ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <RefreshIcon size={32} className="spin-icon" />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#818cf8' }}>
                {progressStep || 'Processing...'}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '400px' }}>
                Automatically extracting architecture metadata, ports, database configurations, and technical specifications (SRS).
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: GITHUB */}
              {activeTab === 'github' && (
                <form onSubmit={handleConnectGitHub}>
                  <div className="form-group">
                    <label>GitHub Repository URL or Path:</label>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="e.g. https://github.com/johnnyhoang/TokenWallet or johnnyhoang/TokenWallet"
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      required
                      autoFocus
                    />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                      💡 Supports any public GitHub URL or private repo with Token.
                    </span>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>GitHub Personal Access Token (Optional for Private Repos):</label>
                    <input
                      type="password"
                      className="input-text"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="save-gh-token"
                      checked={saveGithubToken}
                      onChange={(e) => setSaveGithubToken(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="save-gh-token" style={{ fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', marginBottom: 0 }}>
                      Save this Token in browser storage for future imports
                    </label>
                  </div>

                  <div
                    style={{
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      marginTop: '1.25rem',
                      fontSize: '0.82rem',
                      color: '#c7d2fe',
                      display: 'flex',
                      gap: '0.6rem',
                    }}
                  >
                    <SparklesIcon size={18} />
                    <div>
                      <strong>AI Auto-Builder:</strong> Automatically parses `README.md`, `package.json`, dependencies, and generates complete bilingual SRS specifications.
                    </div>
                  </div>

                  <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!githubInput.trim()}>
                      <SparklesIcon size={16} />
                      <span>Connect & Analyze with AI</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: VERCEL */}
              {activeTab === 'vercel' && (
                <form onSubmit={handleConnectVercel}>
                  <div className="form-group">
                    <label>Vercel Project Name or Deployment URL:</label>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="e.g. https://token-wallet-chi.vercel.app or token-wallet-chi"
                      value={vercelInput}
                      onChange={(e) => setVercelInput(e.target.value)}
                      required
                      autoFocus
                    />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                      💡 Supports direct live domain URL or Vercel project slug.
                    </span>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Vercel API Token (Optional):</label>
                    <input
                      type="password"
                      className="input-text"
                      placeholder="Enter Vercel Token if available..."
                      value={vercelToken}
                      onChange={(e) => setVercelToken(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="save-vc-token"
                      checked={saveVercelToken}
                      onChange={(e) => setSaveVercelToken(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="save-vc-token" style={{ fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', marginBottom: 0 }}>
                      Save this Token in browser storage for future imports
                    </label>
                  </div>

                  <div
                    style={{
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      marginTop: '1.25rem',
                      fontSize: '0.82rem',
                      color: '#c7d2fe',
                      display: 'flex',
                      gap: '0.6rem',
                    }}
                  >
                    <SparklesIcon size={18} />
                    <div>
                      <strong>AI Auto-Inspector:</strong> Extracts title, meta tags, verifies online status, and establishes complete workspace configuration.
                    </div>
                  </div>

                  <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!vercelInput.trim()}>
                      <SparklesIcon size={16} />
                      <span>Connect & Analyze with AI</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}

      {/* 2. DUPLICATE DETECTION PROMPT */}
      {viewMode === 'duplicate_prompt' && duplicateApp && (
        <div>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fbbf24', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              <AlertTriangleIcon size={20} />
              <span>Application Already Exists in Workspace!</span>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              The system detected that <strong>"{duplicateApp.title}"</strong> (URL:{' '}
              <code>{duplicateApp.frontendUrl || 'No URL configured'}</code>) is already in your portfolio.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              AI has analyzed fresh information and updated SRS technical specifications. How would you like to proceed?
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyUpdateDuplicate}
              disabled={isSaving}
              style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🔄 Update Existing Application</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: 400 }}>
                  Overwrite metadata, tech notes, and latest SRS specs into this app
                </div>
              </div>
              <CheckCircleIcon size={20} />
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setViewMode('review')}
              style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>✏️ Review & Edit Details</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 400 }}>
                  Inspect every field before applying the update
                </div>
              </div>
              <span>➔</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setDuplicateApp(null);
                setViewMode('review');
              }}
              style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>➕ Create Separate New Application</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 400 }}>
                  Add as an independent standalone entry
                </div>
              </div>
              <PlusIcon size={18} />
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* 3. REVIEW / MANUAL EDIT FORM */}
      {viewMode === 'review' && (
        <form onSubmit={handleFinalSave}>
          {extractedData && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <SparklesIcon size={16} />
              <span>
                {duplicateApp
                  ? `Reviewing extracted specifications to update "${duplicateApp.title}"`
                  : 'AI has extracted project metadata and technical specifications successfully!'}
              </span>
            </div>
          )}

          <div className="form-group">
            <label>Application Title:</label>
            <input
              type="text"
              className="input-text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g.: Token Wallet, Payment App..."
              required
            />
          </div>

          <div className="form-row" style={{ marginTop: '0.85rem' }}>
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                className="input-text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g.: Web App, AI Tool, Trading Bot..."
              />
            </div>

            <div className="form-group">
              <label>Database Supabase:</label>
              <select
                className="input-select"
                value={formData.database || 'JH Supabase Data 1'}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
              >
                <option value="JH Supabase Data 1">JH Supabase Data 1</option>
                <option value="JH Supabase Data 2">JH Supabase Data 2</option>
                <option value="JH Supabase NoData">JH Supabase NoData</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                className="input-select"
                value={formData.status || 'Development'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Production">Production</option>
                <option value="Development">Development</option>
                <option value="Staging">Staging</option>
                <option value="Planning">Planning</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority:</label>
              <select
                className="input-select"
                value={formData.priority || 'Medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '0.85rem' }}>
            <div className="form-group">
              <label>Author (GitHub Owner):</label>
              <input
                type="text"
                className="input-text"
                value={formData.author || 'johnnyhoang'}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="johnnyhoang"
              />
            </div>

            <div className="form-group">
              <label>Hosting Provider / Project:</label>
              <input
                type="text"
                className="input-text"
                value={formData.hosting || ''}
                onChange={(e) => setFormData({ ...formData, hosting: e.target.value })}
                placeholder="e.g. Vercel (token-wallet)"
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '0.85rem' }}>
            <div className="form-group">
              <label>Frontend Web App URL:</label>
              <input
                type="url"
                className="input-text"
                value={formData.frontendUrl || ''}
                onChange={(e) => setFormData({ ...formData, frontendUrl: e.target.value })}
                placeholder="https://example.vercel.app"
              />
            </div>

            <div className="form-group">
              <label>GitHub Repository URL:</label>
              <input
                type="url"
                className="input-text"
                value={formData.github || ''}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/johnnyhoang/repo"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>Description Summary:</label>
            <textarea
              className="input-text"
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Application overview and core objectives..."
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>Technical Notes & Architecture:</label>
            <textarea
              className="input-text"
              rows={3}
              value={formData.techNotes || ''}
              onChange={(e) => setFormData({ ...formData, techNotes: e.target.value })}
              placeholder="Tech stack, port assignments, env configuration, repo branches..."
            />
          </div>

          {/* Backlog Tasks */}
          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>Backlog / Feature Roadmap ({backlogList.length} tasks):</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="input-text"
                placeholder="Add a new feature or task..."
                value={newBacklogTitle}
                onChange={(e) => setNewBacklogTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBacklogItem();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddBacklogItem}>
                Add
              </button>
            </div>

            {backlogList.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '120px', overflowY: 'auto' }}>
                {backlogList.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.35rem 0.6rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '6px',
                      marginBottom: '0.3rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span>{item.title}</span>
                    <button
                      type="button"
                      className="btn btn-icon-sm danger"
                      onClick={() => setBacklogList((prev) => prev.filter((b) => b.id !== item.id))}
                      style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Vietnamese SRS Editor */}
          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>Vietnamese SRS Specification (Markdown):</label>
            <textarea
              className="input-text"
              rows={3}
              value={formData.specVi || ''}
              onChange={(e) => setFormData({ ...formData, specVi: e.target.value })}
              placeholder="# 1. Giới thiệu tổng quan..."
            />
          </div>

          {/* English SRS Editor */}
          <div className="form-group" style={{ marginTop: '0.85rem' }}>
            <label>English SRS Specification (Markdown):</label>
            <textarea
              className="input-text"
              rows={3}
              value={formData.specEn || ''}
              onChange={(e) => setFormData({ ...formData, specEn: e.target.value })}
              placeholder="# 1. Overview & Objectives..."
            />
          </div>

          <div
            className="modal-actions"
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (extractedData) setViewMode('import');
                else onClose();
              }}
            >
              Back
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSaving || !formData.title?.trim()}>
                {isSaving
                  ? 'Saving...'
                  : duplicateApp
                  ? 'Save Updates'
                  : 'Create Application'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
