import React, { useState, useMemo } from 'react';
import {
  ExternalLinkIcon,
  RefreshIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from './icons';
import type { AppProject, BacklogItem } from '../data/mappers';
import { interpretHealth } from '../utils/health';
import { supabase } from '../utils/supabaseClient';
import { appProjectToRow, backlogItemToRow } from '../data/mappers';
import { newId } from '../utils/ids';

interface AppPortfolioModalProps {
  app: AppProject;
  canEdit: boolean;
  onClose: () => void;
  onUpdateApp: (updatedApp: AppProject) => void;
  onDeleteApp: (appId: string) => void;
  onBacklogChange: (backlog: BacklogItem[]) => void;
}

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
];

function getAppGradient(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

function getAppInitials(title: string): string {
  if (!title) return 'APP';
  const parts = title.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}

function getFaviconCandidates(url?: string, id?: string): string[] {
  const candidates: string[] = [];
  if (id) {
    candidates.push(`/favicons/${id}.svg`);
  }
  if (url && url.trim()) {
    try {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      const parsed = new URL(formattedUrl);
      if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1' && parsed.hostname.includes('.')) {
        candidates.push(`${parsed.origin}/favicon.svg`);
        candidates.push(`${parsed.origin}/favicon.ico`);
        candidates.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=128`);
      }
    } catch {
      // ignore
    }
  }
  return candidates;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#f8fafc', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            background: 'rgba(99, 102, 241, 0.18)',
            color: '#a5b4fc',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.85em',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function SpecDocRenderer({ content }: { content: string }) {
  if (!content) return <div style={{ opacity: 0.6, fontStyle: 'italic', padding: '1rem 0' }}>Chưa có nội dung đặc tả.</div>;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let inList = false;

  const flushList = (keyPrefix: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul
          key={`ul-${keyPrefix}-${elements.length}`}
          style={{ paddingLeft: '1.4rem', marginBottom: '1rem', lineHeight: '1.75' }}
        >
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`${index}`);
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(`${index}`);
      elements.push(
        <h1
          key={index}
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#60a5fa',
            borderBottom: '2px solid rgba(99, 102, 241, 0.3)',
            paddingBottom: '0.4rem',
            marginTop: index === 0 ? '0' : '1.5rem',
            marginBottom: '0.85rem',
            letterSpacing: '-0.01em',
          }}
        >
          {formatInline(trimmed.substring(2))}
        </h1>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`${index}`);
      elements.push(
        <h2
          key={index}
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.08)',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            borderLeft: '4px solid #38bdf8',
            marginTop: '1.25rem',
            marginBottom: '0.75rem',
          }}
        >
          {formatInline(trimmed.substring(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`${index}`);
      elements.push(
        <h3
          key={index}
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#a7f3d0',
            marginTop: '1rem',
            marginBottom: '0.4rem',
          }}
        >
          {formatInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(
        <li key={index} style={{ marginBottom: '0.35rem', color: '#cbd5e1' }}>
          {formatInline(trimmed.substring(2))}
        </li>
      );
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushList(`${index}`);
      const text = trimmed.replace(/^\d+\.\s/, '');
      const numMatch = trimmed.match(/^\d+\./);
      elements.push(
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '0.6rem',
            marginBottom: '0.5rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <span style={{ fontWeight: 700, color: '#818cf8', minWidth: '1.2rem' }}>
            {numMatch ? numMatch[0] : ''}
          </span>
          <span style={{ color: '#e2e8f0' }}>{formatInline(text)}</span>
        </div>
      );
      return;
    }

    flushList(`${index}`);
    elements.push(
      <p key={index} style={{ marginBottom: '0.75rem', color: '#cbd5e1', lineHeight: '1.65' }}>
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList('final');

  return <div>{elements}</div>;
}

export function AppPortfolioModal({
  app,
  canEdit,
  onClose,
  onUpdateApp,
  onDeleteApp,
  onBacklogChange,
}: AppPortfolioModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'backlog' | 'settings'>('overview');
  const [specLang, setSpecLang] = useState<'vi' | 'en'>('vi');
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [newBacklogTitle, setNewBacklogTitle] = useState('');

  // Edit form state for admin settings tab
  const [formData, setFormData] = useState<AppProject>({ ...app });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Favicon handling
  const candidates = useMemo(() => getFaviconCandidates(app.frontendUrl, app.id), [app.frontendUrl, app.id]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const initials = getAppInitials(app.title);
  const bgGradient = getAppGradient(app.title + app.id);
  const currentSrc = candidateIndex < candidates.length ? candidates[candidateIndex] : null;

  // Backlog counts
  const backlog = app.backlog || [];
  const completedCount = backlog.filter((b) => b.isCompleted).length;
  const progressPercent = backlog.length > 0 ? Math.round((completedCount / backlog.length) * 100) : 0;

  // Manual Health Check for this single app
  const handleCheckHealth = async () => {
    if (!app.frontendUrl) return;
    setIsCheckingHealth(true);

    const nowTimeStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let status: 'healthy' | 'failed' = 'failed';
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(app.frontendUrl)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(9000) });
      if (res.ok) {
        const data = await res.json();
        const httpCode = data.status?.http_code;
        status = interpretHealth(httpCode) === 'healthy' ? 'healthy' : 'failed';
      }
    } catch {
      status = 'failed';
    }

    const updated: AppProject = {
      ...app,
      healthStatus: status,
      healthCheckedAt: nowTimeStr,
    };

    try {
      const row = appProjectToRow(updated);
      await supabase.from('tkw_app_projects').update(row).eq('id', app.id);
      onUpdateApp(updated);
      setFormData(updated);
    } catch (err) {
      console.error('Lỗi lưu kết quả health check:', err);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Toggle Manual Check (Admin only)
  const handleToggleManualCheck = async () => {
    if (!canEdit) return;
    const nextChecked = !app.manualChecked;
    const nextCheckedAt = nextChecked
      ? new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

    const updated: AppProject = {
      ...app,
      manualChecked: nextChecked,
      manualCheckedAt: nextCheckedAt,
    };

    try {
      const row = appProjectToRow(updated);
      await supabase.from('tkw_app_projects').update(row).eq('id', app.id);
      onUpdateApp(updated);
      setFormData(updated);
    } catch (err: any) {
      alert('Lỗi cập nhật xác nhận kiểm tra: ' + (err?.message || ''));
    }
  };

  // Toggle Backlog item completion
  const handleToggleBacklog = async (item: BacklogItem) => {
    if (!canEdit) return;
    const nextCompleted = !item.isCompleted;
    const nextBacklog = backlog.map((b) =>
      b.id === item.id ? { ...b, isCompleted: nextCompleted } : b
    );

    try {
      await supabase
        .from('tkw_app_backlog_items')
        .update({ is_completed: nextCompleted })
        .eq('id', item.id);
      onBacklogChange(nextBacklog);
    } catch (err: any) {
      alert('Lỗi cập nhật task: ' + (err?.message || ''));
    }
  };

  // Add Backlog Item
  const handleAddBacklog = async () => {
    if (!canEdit || !newBacklogTitle.trim()) return;
    const newItem: BacklogItem = {
      id: newId('bl'),
      title: newBacklogTitle.trim(),
      isCompleted: false,
    };
    const nextBacklog = [...backlog, newItem];

    try {
      const row = backlogItemToRow(newItem, app.id);
      await supabase.from('tkw_app_backlog_items').insert(row);
      onBacklogChange(nextBacklog);
      setNewBacklogTitle('');
    } catch (err: any) {
      alert('Lỗi thêm task: ' + (err?.message || ''));
    }
  };

  // Delete Backlog Item
  const handleDeleteBacklog = async (itemId: string) => {
    if (!canEdit) return;
    const nextBacklog = backlog.filter((b) => b.id !== itemId);
    try {
      await supabase.from('tkw_app_backlog_items').delete().eq('id', itemId);
      onBacklogChange(nextBacklog);
    } catch (err: any) {
      alert('Lỗi xóa task: ' + (err?.message || ''));
    }
  };

  // Save Settings Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !formData.title.trim()) return;
    setIsSaving(true);
    setSaveSuccessMessage('');

    try {
      const updated: AppProject = {
        ...formData,
        title: formData.title.trim(),
        frontendUrl: formData.frontendUrl?.trim() || '',
        description: formData.description || '',
        techNotes: formData.techNotes || '',
        specVi: formData.specVi || '',
        specEn: formData.specEn || '',
        specUpdatedAt: new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const row = appProjectToRow(updated);
      const { error } = await supabase.from('tkw_app_projects').upsert(row);
      if (error) throw error;

      onUpdateApp(updated);
      setSaveSuccessMessage('Đã lưu thay đổi thành công!');
      setTimeout(() => setSaveSuccessMessage(''), 3000);
    } catch (err: any) {
      alert('Lỗi lưu thông tin app: ' + (err?.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="portfolio-modal-overlay" onClick={onClose}>
      <div className="portfolio-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Fullscreen Header / Hero Bar */}
        <div className="portfolio-hero-header">
          <div className="portfolio-hero-left">
            <div className="portfolio-icon" style={{ background: bgGradient }}>
              {currentSrc ? (
                <img
                  key={currentSrc}
                  src={currentSrc}
                  alt={app.title}
                  onError={() => setCandidateIndex((prev) => prev + 1)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '8px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '16px',
                  }}
                />
              ) : (
                initials
              )}
            </div>

            <div className="portfolio-title-meta">
              <div className="portfolio-title-row">
                <h1 className="portfolio-app-title">{app.title}</h1>
                <span className="portfolio-status-pill">{app.status}</span>
                {app.priority && (
                  <span className={`portfolio-priority-pill ${app.priority.toLowerCase()}`}>
                    {app.priority}
                  </span>
                )}
              </div>

              <div className="portfolio-meta-tags">
                <span className="portfolio-category-badge">🏷️ {app.category || 'Web App'}</span>
                <span className="portfolio-category-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  👤 {app.author || 'johnnyhoang'}
                </span>
                {app.hosting && (
                  <span className="portfolio-category-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    ☁️ {app.hosting}
                  </span>
                )}
                {app.database && (
                  <span className="portfolio-db-badge">
                    🗄️ {app.database}
                  </span>
                )}
                <div
                  className="portfolio-health-tag"
                  title={app.healthCheckedAt ? `Checked at: ${app.healthCheckedAt}` : 'Unchecked'}
                >
                  <span className={`store-health-dot ${app.healthStatus || 'unknown'}`} />
                  <span>
                    {app.healthStatus === 'healthy'
                      ? 'Healthy'
                      : app.healthStatus === 'failed'
                      ? 'Down'
                      : app.healthStatus === 'checking'
                      ? 'Checking...'
                      : 'Unchecked'}
                  </span>
                </div>
                {app.manualChecked && (
                  <span className="portfolio-verified-badge" title={`Manually verified at: ${app.manualCheckedAt || 'N/A'}`}>
                    ✓ Verified {app.manualCheckedAt ? `(${app.manualCheckedAt})` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="portfolio-hero-actions">
            {app.frontendUrl && (
              <a
                href={app.frontendUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary portfolio-btn-launch"
              >
                <span>Launch App</span>
                <ExternalLinkIcon size={16} />
              </a>
            )}

            <button
              className="btn btn-secondary portfolio-btn-health"
              onClick={handleCheckHealth}
              disabled={isCheckingHealth || !app.frontendUrl}
              title="Test live availability and status"
            >
              <RefreshIcon size={14} className={isCheckingHealth ? 'spin-icon' : ''} />
              <span>{isCheckingHealth ? 'Checking...' : 'Check Health'}</span>
            </button>

            {canEdit && (
              <button
                className={`btn ${app.manualChecked ? 'btn-secondary' : 'btn-secondary'} portfolio-btn-verify`}
                onClick={handleToggleManualCheck}
                title="Verify application status"
              >
                <span>{app.manualChecked ? '✓ Verified' : '○ Verify Check'}</span>
              </button>
            )}

            <button className="portfolio-close-btn" onClick={onClose} title="Close modal (Esc)">
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="portfolio-nav-bar">
          <div className="portfolio-tabs-list">
            <button
              className={`portfolio-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span>🌟</span>
              <span>Overview</span>
            </button>
            <button
              className={`portfolio-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              <span>📋</span>
              <span>Specifications (SRS)</span>
            </button>
            <button
              className={`portfolio-tab-btn ${activeTab === 'backlog' ? 'active' : ''}`}
              onClick={() => setActiveTab('backlog')}
            >
              <span>🚀</span>
              <span>Roadmap & Backlog</span>
              {backlog.length > 0 && (
                <span className="portfolio-tab-badge">
                  {completedCount}/{backlog.length}
                </span>
              )}
            </button>
            {canEdit && (
              <button
                className={`portfolio-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <span>⚙️</span>
                <span>Settings & Admin</span>
              </button>
            )}
          </div>

          <div className="portfolio-quick-stats">
            <span className="portfolio-stat-text">
              Role: <strong>{canEdit ? 'Admin / Full Access' : 'Viewer / Read Only'}</strong>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="portfolio-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="portfolio-tab-content">
              <div className="portfolio-grid-layout">
                {/* Left Column: Description & Feature Highlights */}
                <div className="portfolio-main-column">
                  <div className="portfolio-card">
                    <h3 className="portfolio-card-title">
                      <span>📖</span> Application Overview & Description
                    </h3>
                    <p className="portfolio-desc-text">
                      {app.description || 'No description available for this application.'}
                    </p>

                    {app.frontendUrl && (
                      <div className="portfolio-launch-banner">
                        <div className="portfolio-launch-info">
                          <h4>Access Live Application</h4>
                          <p className="portfolio-launch-url">{app.frontendUrl}</p>
                        </div>
                        <a
                          href={app.frontendUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                        >
                          Launch Now <ExternalLinkIcon size={15} />
                        </a>
                      </div>
                    )}
                  </div>

                  {app.techNotes && (
                    <div className="portfolio-card">
                      <h3 className="portfolio-card-title">
                        <span>💡</span> Technical Architecture & Notes
                      </h3>
                      <div className="portfolio-tech-notes">
                        <SpecDocRenderer content={app.techNotes} />
                      </div>
                    </div>
                  )}

                  {/* Backlog Snapshot */}
                  <div className="portfolio-card">
                    <div className="portfolio-card-header-row">
                      <h3 className="portfolio-card-title">
                        <span>🚀</span> Roadmap & Task Progress
                      </h3>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveTab('backlog')}
                      >
                        View All ({backlog.length})
                      </button>
                    </div>

                    <div className="portfolio-progress-bar-wrapper">
                      <div className="portfolio-progress-bar-track">
                        <div
                          className="portfolio-progress-bar-fill"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="portfolio-progress-text">{progressPercent}% Completed</span>
                    </div>

                    {backlog.length === 0 ? (
                      <p className="portfolio-empty-text">No backlog tasks recorded yet.</p>
                    ) : (
                      <ul className="portfolio-backlog-preview-list">
                        {backlog.slice(0, 4).map((item) => (
                          <li
                            key={item.id}
                            className={`portfolio-backlog-preview-item ${
                              item.isCompleted ? 'completed' : ''
                            }`}
                          >
                            <span className="backlog-preview-check">
                              {item.isCompleted ? '✓' : '○'}
                            </span>
                            <span className="backlog-preview-title">{item.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Right Column: Key Details & Tech Matrix */}
                <div className="portfolio-side-column">
                  <div className="portfolio-card">
                    <h3 className="portfolio-card-title">
                      <span>⚡</span> System Information
                    </h3>

                    <div className="portfolio-info-list">
                      <div className="portfolio-info-row">
                        <span className="info-label">Author / Owner:</span>
                        <span className="info-value">
                          <strong style={{ color: '#a5b4fc' }}>👤 {app.author || 'johnnyhoang'}</strong>
                        </span>
                      </div>

                      <div className="portfolio-info-row">
                        <span className="info-label">Hosting:</span>
                        <span className="info-value">
                          <span style={{ color: '#38bdf8' }}>☁️ {app.hosting || 'Vercel'}</span>
                        </span>
                      </div>

                      {app.github && (
                        <div className="portfolio-info-row">
                          <span className="info-label">GitHub Repo:</span>
                          <span className="info-value">
                            <a
                              href={app.github}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                            >
                              <span>Repo Link</span>
                              <ExternalLinkIcon size={12} />
                            </a>
                          </span>
                        </div>
                      )}

                      <div className="portfolio-info-row">
                        <span className="info-label">Category:</span>
                        <span className="info-value">{app.category || 'Web App'}</span>
                      </div>

                      <div className="portfolio-info-row">
                        <span className="info-label">Status:</span>
                        <span className="info-value">
                          <span className="portfolio-status-pill">{app.status}</span>
                        </span>
                      </div>

                      <div className="portfolio-info-row">
                        <span className="info-label">Priority:</span>
                        <span className="info-value">{app.priority || 'Medium'}</span>
                      </div>

                      <div className="portfolio-info-row">
                        <span className="info-label">Database:</span>
                        <span className="info-value">{app.database || 'JH Supabase NoData'}</span>
                      </div>

                      <div className="portfolio-info-row">
                        <span className="info-label">Health Status:</span>
                        <span className="info-value">
                          {app.healthStatus === 'healthy'
                            ? '🟢 Online / Operational'
                            : app.healthStatus === 'failed'
                            ? '🔴 Unresponsive / Down'
                            : '⚪ Unchecked'}
                        </span>
                      </div>

                      {app.healthCheckedAt && (
                        <div className="portfolio-info-row">
                          <span className="info-label">Auto-checked:</span>
                          <span className="info-value">{app.healthCheckedAt}</span>
                        </div>
                      )}

                      <div className="portfolio-info-row">
                        <span className="info-label">Manual Check:</span>
                        <span className="info-value">
                          {app.manualChecked
                            ? `✓ Verified (${app.manualCheckedAt || 'Recent'})`
                            : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specification Snapshot Link */}
                  <div className="portfolio-card portfolio-spec-card">
                    <h3 className="portfolio-card-title">
                      <span>📋</span> Specifications (SRS)
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem' }}>
                      Complete system design, database architecture, workflows, and breakthrough highlights.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => {
                          setSpecLang('vi');
                          setActiveTab('specs');
                        }}
                      >
                        🇻🇳 Tiếng Việt
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => {
                          setSpecLang('en');
                          setActiveTab('specs');
                        }}
                      >
                        🇬🇧 English
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="portfolio-tab-content">
              <div className="portfolio-spec-header">
                <div className="portfolio-spec-lang-btns">
                  <button
                    type="button"
                    className={`btn ${specLang === 'vi' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSpecLang('vi')}
                  >
                    🇻🇳 Đặc Tả Tiếng Việt
                  </button>
                  <button
                    type="button"
                    className={`btn ${specLang === 'en' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSpecLang('en')}
                  >
                    🇬🇧 English Specification
                  </button>
                </div>

                <div className="portfolio-spec-meta">
                  <span className="portfolio-spec-date">
                    📅 Last Updated: {app.specUpdatedAt || '24/09/2026'}
                  </span>
                  {canEdit && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('settings')}
                      title="Edit specification document in settings"
                    >
                      <EditIcon size={14} />
                      <span>Edit Specs</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="portfolio-spec-doc-container">
                <SpecDocRenderer
                  content={
                    specLang === 'en'
                      ? (app.specEn || 'No English specification available for this project.')
                      : (app.specVi || 'Chưa có đặc tả tiếng Việt cho dự án này.')
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 3: BACKLOG & ROADMAP */}
          {activeTab === 'backlog' && (
            <div className="portfolio-tab-content">
              <div className="portfolio-card">
                <div className="portfolio-card-header-row">
                  <div>
                    <h3 className="portfolio-card-title">
                      <span>🚀</span> Task Backlog & Roadmap
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      {canEdit
                        ? 'Admin can mark completion, add new tasks, or delete tasks.'
                        : 'Track development progress of project features.'}
                    </p>
                  </div>

                  <div className="portfolio-progress-chip">
                    <strong>{completedCount}</strong> / {backlog.length} done ({progressPercent}%)
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="portfolio-progress-bar-wrapper" style={{ margin: '1rem 0 1.5rem 0' }}>
                  <div className="portfolio-progress-bar-track">
                    <div
                      className="portfolio-progress-bar-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Add Task Input (Admin Only) */}
                {canEdit && (
                  <div className="portfolio-add-task-row">
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter new feature or task..."
                      value={newBacklogTitle}
                      onChange={(e) => setNewBacklogTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddBacklog()}
                    />
                    <button className="btn btn-primary" onClick={handleAddBacklog}>
                      <PlusIcon size={16} />
                      <span>Add Task</span>
                    </button>
                  </div>
                )}

                {/* Task List */}
                {backlog.length === 0 ? (
                  <div className="portfolio-empty-state">
                    <span>📝</span>
                    <p>No backlog tasks recorded for this project yet.</p>
                  </div>
                ) : (
                  <div className="portfolio-backlog-full-list">
                    {backlog.map((item) => (
                      <div
                        key={item.id}
                        className={`portfolio-backlog-row ${item.isCompleted ? 'done' : ''}`}
                        onClick={() => canEdit && handleToggleBacklog(item)}
                        style={{ cursor: canEdit ? 'pointer' : 'default' }}
                      >
                        <div className="backlog-row-left">
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => canEdit && handleToggleBacklog(item)}
                            disabled={!canEdit}
                            style={{ cursor: canEdit ? 'pointer' : 'default', width: '18px', height: '18px' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="backlog-row-title">{item.title}</span>
                        </div>

                        {canEdit && (
                          <button
                            className="btn-icon-sm danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBacklog(item.id);
                            }}
                            title="Delete task"
                          >
                            <TrashIcon size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & MANAGEMENT (ADMIN ONLY) */}
          {activeTab === 'settings' && canEdit && (
            <div className="portfolio-tab-content">
              <form onSubmit={handleSaveForm}>
                <div className="portfolio-card">
                  <h3 className="portfolio-card-title">
                    <span>⚙️</span> Edit Application Details
                  </h3>

                  {saveSuccessMessage && (
                    <div className="portfolio-success-alert">
                      ✓ {saveSuccessMessage}
                    </div>
                  )}

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Application Title:</label>
                    <input
                      type="text"
                      className="input-text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>Author / GitHub Owner:</label>
                      <input
                        type="text"
                        className="input-text"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="e.g. johnnyhoang"
                      />
                    </div>

                    <div className="form-group">
                      <label>Hosting / Vercel Project:</label>
                      <input
                        type="text"
                        className="input-text"
                        value={formData.hosting || ''}
                        onChange={(e) => setFormData({ ...formData, hosting: e.target.value })}
                        placeholder="e.g. Vercel (token-wallet)"
                      />
                    </div>

                    <div className="form-group">
                      <label>GitHub Repository URL:</label>
                      <input
                        type="url"
                        className="input-text"
                        value={formData.github || ''}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/johnnyhoang/..."
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>Category:</label>
                      <input
                        type="text"
                        className="input-text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Database Supabase:</label>
                      <select
                        className="input-select"
                        value={formData.database || 'JH Supabase NoData'}
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
                        value={formData.status}
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

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Frontend URL:</label>
                    <input
                      type="url"
                      className="input-text"
                      value={formData.frontendUrl || ''}
                      onChange={(e) => setFormData({ ...formData, frontendUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Summary Description:</label>
                    <textarea
                      className="input-text"
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Application purpose, target users, and key features..."
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Technical Notes & Architecture:</label>
                    <textarea
                      className="input-text"
                      rows={4}
                      value={formData.techNotes || ''}
                      onChange={(e) => setFormData({ ...formData, techNotes: e.target.value })}
                      placeholder="Notes on stack, ports, env, auth..."
                    />
                  </div>
                </div>

                <div className="portfolio-card" style={{ marginTop: '1.25rem' }}>
                  <h3 className="portfolio-card-title">
                    <span>📝</span> Edit Technical Specifications (SRS Markdown)
                  </h3>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Vietnamese Specification (Markdown):</label>
                    <textarea
                      className="input-text"
                      rows={6}
                      value={formData.specVi || ''}
                      onChange={(e) => setFormData({ ...formData, specVi: e.target.value })}
                      placeholder="# 1. Giới thiệu tổng quan..."
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>English Specification (Markdown):</label>
                    <textarea
                      className="input-text"
                      rows={6}
                      value={formData.specEn || ''}
                      onChange={(e) => setFormData({ ...formData, specEn: e.target.value })}
                      placeholder="# 1. Overview and Architecture..."
                    />
                  </div>
                </div>

                {/* Save & Danger Zone */}
                <div
                  className="portfolio-form-actions"
                  style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete "${app.title}"?`)) {
                        onDeleteApp(app.id);
                      }
                    }}
                  >
                    <TrashIcon size={16} />
                    <span>Delete Application</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save All Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
