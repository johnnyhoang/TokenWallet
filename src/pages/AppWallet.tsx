import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import CodeExperience from './CodeExperience';
import { supabase } from '../utils/supabaseClient';
import { useSyncedCollection } from '../data/useSyncedCollection';
import {
  rowToAppProject,
  appProjectToRow,
  rowToBacklogItem,
  backlogItemToRow,
  type AppProject,
  type BacklogItem,
  type AppProjectRow,
  type BacklogItemRow,
} from '../data/mappers';
import { newId } from '../utils/ids';
import { interpretHealth } from '../utils/health';
import { Modal } from '../components/Modal';
import { removedIds } from '../data/syncPolicy';
import { useAuth } from '../contexts/AuthContext';
import {
  SearchIcon,
  RefreshIcon,
  PlusIcon,
  EditIcon,
  ExternalLinkIcon,
  AppStoreIcon,
} from '../components/icons';

export type { AppProject, BacklogItem };

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo -> Purple
  'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', // Emerald -> Cyan
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber -> Red
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan -> Blue
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink -> Violet
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue -> Dark Blue
  'linear-gradient(135deg, #f97316 0%, #eab308 100%)', // Orange -> Yellow
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

function AppIcon({ title, frontendUrl, id }: { title: string; frontendUrl?: string; id: string }) {
  const candidates = useMemo(() => getFaviconCandidates(frontendUrl, id), [frontendUrl, id]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const initials = getAppInitials(title);
  const bgGradient = getAppGradient(title + id);

  useEffect(() => {
    setCandidateIndex(0);
  }, [frontendUrl, id]);

  const currentSrc = candidateIndex < candidates.length ? candidates[candidateIndex] : null;

  return (
    <div className="store-app-icon" style={{ background: bgGradient }}>
      {currentSrc ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={title}
          onError={() => setCandidateIndex((prev) => prev + 1)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '7px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            borderRadius: '14px',
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
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
  if (!content) return <div style={{ opacity: 0.6 }}>Chưa có nội dung đặc tả.</div>;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let inList = false;

  const flushList = (keyPrefix: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul
          key={`ul-${keyPrefix}-${elements.length}`}
          style={{ paddingLeft: '1.2rem', marginBottom: '1rem', lineHeight: '1.75' }}
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
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#60a5fa',
            borderBottom: '2px solid rgba(99, 102, 241, 0.3)',
            paddingBottom: '0.4rem',
            marginTop: index === 0 ? '0' : '1.4rem',
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
            fontSize: '1.1rem',
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
            fontSize: '0.95rem',
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

export default function AppWallet() {
  const { permissions } = useAuth();
  const canEdit = !!permissions?.can_edit_app_wallet;

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isCodeExpRoute = location.pathname.includes('/code-experience') || location.pathname.includes('/notes');
  const activeTab = isCodeExpRoute || searchParams.get('tab') === 'code-experience' ? 'code-experience' : 'workspace';

  const handleSubTabChange = (tab: 'workspace' | 'code-experience') => {
    if (tab === 'code-experience') {
      setSearchParams({ tab: 'code-experience' });
    } else {
      setSearchParams({});
    }
  };

  const { items: projectItems, setItems: setProjectItems } = useSyncedCollection<
    Omit<AppProject, 'backlog'>,
    AppProjectRow
  >({
    table: 'tkw_app_projects',
    rowToItem: rowToAppProject,
    itemToRow: appProjectToRow,
    seed: (loaded) => loaded,
  });

  const { items: backlogItems, setItems: setBacklogItems } = useSyncedCollection<
    BacklogItem & { projectId: string },
    BacklogItemRow
  >({
    table: 'tkw_app_backlog_items',
    rowToItem: (row) => ({
      ...rowToBacklogItem(row),
      projectId: row.project_id,
    }),
    itemToRow: (item) => backlogItemToRow(item, item.projectId),
    seed: (loaded) => loaded,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModal, setActiveModal] = useState<{
    type: 'edit-app' | 'view-spec';
    project?: AppProject;
    lang?: 'vi' | 'en';
  } | null>(null);

  const [modalForm, setModalForm] = useState<Partial<AppProject>>({});
  const [modalBacklog, setModalBacklog] = useState<BacklogItem[]>([]);
  const [newBacklogTitle, setNewBacklogTitle] = useState('');
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthMap, setHealthMap] = useState<Record<string, 'healthy' | 'checking' | 'failed'>>({});

  // Combined Apps view
  const apps: AppProject[] = useMemo(() => {
    return projectItems.map((p) => ({
      ...p,
      healthStatus: healthMap[p.id] || p.healthStatus || 'unknown',
      backlog: backlogItems.filter((b) => b.projectId === p.id),
    }));
  }, [projectItems, backlogItems, healthMap]);

  // Dynamic Categories list extracted from projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [apps]);

  // Statistics
  const healthyCount = useMemo(() => {
    return apps.filter((a) => a.healthStatus === 'healthy').length;
  }, [apps]);

  // Manual Concurrency-Capped Health Checker (Max 5 concurrent) - Saves results to Supabase!
  const handleCheckHealthAll = async () => {
    setIsCheckingHealth(true);

    const targets = apps.filter((a) => a.frontendUrl);
    const limit = 5;
    const nowTimeStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (let i = 0; i < targets.length; i += limit) {
      const batch = targets.slice(i, i + limit);
      await Promise.all(
        batch.map(async (app) => {
          setHealthMap((prev) => ({ ...prev, [app.id]: 'checking' }));
          let status: 'healthy' | 'failed' = 'failed';
          try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(app.frontendUrl!)}`;
            const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(9000) });
            if (res.ok) {
              const data = await res.json();
              const httpCode = data.status?.http_code;
              status = interpretHealth(httpCode) === 'healthy' ? 'healthy' : 'failed';
            }
          } catch {
            status = 'failed';
          }
          setHealthMap((prev) => ({ ...prev, [app.id]: status }));

          // Save check result directly down to Supabase DB so it persists upon refresh!
          try {
            const updatedApp: AppProject = {
              ...app,
              healthStatus: status,
              healthCheckedAt: nowTimeStr,
            };
            const row = appProjectToRow(updatedApp);
            await supabase.from('tkw_app_projects').update(row).eq('id', app.id);
            setProjectItems((prev) =>
              prev.map((p) =>
                p.id === app.id ? { ...p, healthStatus: status, healthCheckedAt: nowTimeStr } : p
              )
            );
          } catch (dbErr) {
            console.error('Lỗi lưu kết quả kiểm tra health:', dbErr);
          }
        })
      );
    }

    setIsCheckingHealth(false);
  };

  // Toggle user manual verification with date stamp
  const handleToggleManualCheck = async (app: AppProject) => {
    const nextChecked = !app.manualChecked;
    const nextCheckedAt = nextChecked
      ? new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

    // Optimistically update state
    setProjectItems((prev) =>
      prev.map((p) =>
        p.id === app.id
          ? { ...p, manualChecked: nextChecked, manualCheckedAt: nextCheckedAt }
          : p
      )
    );

    // Save directly to Supabase DB
    try {
      const updatedApp: AppProject = {
        ...app,
        manualChecked: nextChecked,
        manualCheckedAt: nextCheckedAt,
      };
      const row = appProjectToRow(updatedApp);
      const { error: upErr } = await supabase.from('tkw_app_projects').update(row).eq('id', app.id);
      if (upErr) {
        console.error('Lỗi lưu xác nhận kiểm tra:', upErr);
        alert('Không thể lưu trạng thái xác nhận: ' + upErr.message);
      }
    } catch (err: any) {
      console.error('Lỗi lưu xác nhận:', err);
      alert('Không thể lưu trạng thái xác nhận: ' + (err?.message || 'Lỗi không xác định'));
    }
  };

  const handleOpenEditModal = (project?: AppProject) => {
    if (project) {
      setActiveModal({ type: 'edit-app', project });
      setModalForm({ ...project });
      setModalBacklog([...(project.backlog || [])]);
    } else {
      setActiveModal({ type: 'edit-app' });
      setModalForm({
        title: '',
        frontendUrl: '',
        category: 'Web App',
        database: 'JH Supabase NoData',
        status: 'Development',
        priority: 'Medium',
        description: '',
        isDisabled: false,
        manualChecked: false,
        manualCheckedAt: '',
      });
      setModalBacklog([]);
    }
  };

  const handleSaveApp = async () => {
    if (!modalForm.title?.trim()) return;

    if (activeModal?.project) {
      // Editing existing project
      const projectId = activeModal.project.id;
      const updatedProject: Omit<AppProject, 'backlog'> = {
        id: projectId,
        title: modalForm.title.trim(),
        frontendUrl: modalForm.frontendUrl?.trim() || '',
        category: modalForm.category || 'Web App',
        database: modalForm.database !== undefined ? modalForm.database : activeModal.project.database,
        status: modalForm.status || 'Development',
        priority: modalForm.priority || 'Medium',
        description: modalForm.description || '',
        isDisabled: Boolean(modalForm.isDisabled),
        techNotes: modalForm.techNotes || activeModal.project.techNotes,
        manualChecked: modalForm.manualChecked !== undefined ? modalForm.manualChecked : activeModal.project.manualChecked,
        manualCheckedAt: modalForm.manualCheckedAt || activeModal.project.manualCheckedAt,
        healthStatus: modalForm.healthStatus || activeModal.project.healthStatus,
        healthCheckedAt: modalForm.healthCheckedAt || activeModal.project.healthCheckedAt,
      };

      // Direct save to Supabase
      const row = appProjectToRow(updatedProject as AppProject);
      const { error: saveErr } = await supabase.from('tkw_app_projects').upsert(row);
      if (saveErr) {
        alert('Lỗi lưu vào Supabase: ' + saveErr.message);
        return;
      }

      setProjectItems((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)));

      // Diff removed backlog items and delete explicitly
      const origBacklog = activeModal.project.backlog || [];
      const deletedIds = removedIds(origBacklog, modalBacklog);

      if (deletedIds.length > 0) {
        await supabase.from('tkw_app_backlog_items').delete().in('id', deletedIds);
      }

      if (modalBacklog.length > 0) {
        const backlogRows = modalBacklog.map((b) => backlogItemToRow(b, projectId));
        await supabase.from('tkw_app_backlog_items').upsert(backlogRows);
      }

      setBacklogItems((prev) => [
        ...prev.filter((b) => b.projectId !== projectId),
        ...modalBacklog.map((b) => ({ ...b, projectId })),
      ]);
    } else {
      // New project
      const projectId = newId('app');
      const newProj: Omit<AppProject, 'backlog'> = {
        id: projectId,
        title: modalForm.title.trim(),
        frontendUrl: modalForm.frontendUrl?.trim() || '',
        category: modalForm.category || 'Web App',
        database: modalForm.database || 'JH Supabase NoData',
        status: modalForm.status || 'Development',
        priority: modalForm.priority || 'Medium',
        description: modalForm.description || '',
        isDisabled: Boolean(modalForm.isDisabled),
        techNotes: modalForm.techNotes || '',
        manualChecked: Boolean(modalForm.manualChecked),
        manualCheckedAt: modalForm.manualCheckedAt || '',
        healthStatus: 'unknown',
      };

      const row = appProjectToRow(newProj as AppProject);
      const { error: saveErr } = await supabase.from('tkw_app_projects').upsert(row);
      if (saveErr) {
        alert('Lỗi thêm dự án vào Supabase: ' + saveErr.message);
        return;
      }

      if (modalBacklog.length > 0) {
        const backlogRows = modalBacklog.map((b) => backlogItemToRow(b, projectId));
        await supabase.from('tkw_app_backlog_items').upsert(backlogRows);
      }

      setProjectItems((prev) => [newProj, ...prev]);
      setBacklogItems((prev) => [
        ...prev,
        ...modalBacklog.map((b) => ({ ...b, projectId })),
      ]);
    }

    setActiveModal(null);
  };

  const handleDeleteApp = async (projectId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa ứng dụng này?')) {
      try {
        await supabase.from('tkw_app_backlog_items').delete().eq('project_id', projectId);
        await supabase.from('tkw_app_projects').delete().eq('id', projectId);
        setProjectItems((prev) => prev.filter((p) => p.id !== projectId));
        setBacklogItems((prev) => prev.filter((b) => b.projectId !== projectId));
        setActiveModal(null);
      } catch (err: any) {
        alert('Lỗi xóa dự án: ' + err?.message);
      }
    }
  };

  const handleAddBacklogItem = () => {
    if (!newBacklogTitle.trim()) return;
    const newItem: BacklogItem = {
      id: newId('bl'),
      title: newBacklogTitle.trim(),
      isCompleted: false,
    };
    setModalBacklog((prev) => [...prev, newItem]);
    setNewBacklogTitle('');
  };

  const filteredApps = useMemo(() => {
    let result = apps;
    const q = searchQuery.toLowerCase().trim();

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (q) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [apps, searchQuery, selectedCategory]);

  return (
    <div className="app-wallet-container">
      {/* App Wallet Sub-Navigation Bar */}
      <div className="app-wallet-subtabs">
        <button
          className={`app-wallet-subtab ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => handleSubTabChange('workspace')}
        >
          <AppStoreIcon size={18} />
          <span>App Workspace</span>
        </button>
        <button
          className={`app-wallet-subtab ${activeTab === 'code-experience' ? 'active' : ''}`}
          onClick={() => handleSubTabChange('code-experience')}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>💡</span>
          <span>Code Experience</span>
        </button>
      </div>

      {activeTab === 'code-experience' ? (
        <CodeExperience />
      ) : (
        <>
          {/* App Store Header & Controls Card */}
      <div className="store-header-card">
        <div className="store-header-top">
          <div className="store-title-block">
            <h2>
              <AppStoreIcon size={26} />
              App Store Workspace
            </h2>
            <p>Bộ sưu tập các ứng dụng & sản phẩm hệ thống</p>
          </div>

          <div className="store-stats-pills">
            <div className="store-stat-pill">
              Tổng số app: <strong>{apps.length}</strong>
            </div>
            {healthyCount > 0 && (
              <div className="store-stat-pill active-healthy">
                Online: <strong>{healthyCount}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="store-control-bar">
          <div className="store-search-box">
            <div className="store-search-icon">
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              className="store-search-input"
              placeholder="Tìm kiếm ứng dụng, danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="store-actions">
            <button
              className="btn btn-secondary"
              onClick={handleCheckHealthAll}
              disabled={isCheckingHealth}
            >
              <RefreshIcon size={15} className={isCheckingHealth ? 'spin-icon' : ''} />
              {isCheckingHealth ? 'Đang check health...' : 'Check Health Tất Cả'}
            </button>

            {canEdit && (
              <button className="btn btn-primary" onClick={() => handleOpenEditModal()}>
                <PlusIcon size={16} />
                Thêm Dự Án
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="store-categories-bar">
          <button
            className={`store-cat-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tất cả
            <span className="store-cat-count">{apps.length}</span>
          </button>

          {categories.map((cat) => {
            const count = apps.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                className={`store-cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span className="store-cat-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 PER ROW APP STORE GRID */}
      <div className="store-grid">
        {filteredApps.map((app, index) => {
          const backlogCount = app.backlog?.length || 0;

          return (
            <div
              key={app.id}
              className={`store-card ${app.isDisabled ? 'disabled' : ''}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div>
                {/* Squircle Icon & Title Block */}
                <div className="store-card-header">
                  <AppIcon title={app.title} frontendUrl={app.frontendUrl} id={app.id} />
                  <div className="store-app-meta">
                    <div className="store-app-title" title={app.title}>
                      {app.title}
                    </div>
                    <div className="store-app-category">{app.category || 'Web App'}</div>
                  </div>
                </div>

                {/* Status Bar: Health dot + Status badge + Specs button */}
                <div className="store-card-status-bar">
                  <div
                    className="store-health-tag"
                    title={app.healthCheckedAt ? `Kiểm tra tự động lúc: ${app.healthCheckedAt}` : 'Chưa kiểm tra tự động'}
                  >
                    <span
                      className={`store-health-dot ${app.healthStatus || 'unknown'}`}
                    />
                    <span>
                      {app.healthStatus === 'healthy'
                        ? 'Healthy'
                        : app.healthStatus === 'failed'
                        ? 'Down'
                        : app.healthStatus === 'checking'
                        ? 'Checking...'
                        : 'Chưa check'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModal({ type: 'view-spec', project: app, lang: 'vi' })}
                      title="Xem Đặc Tả Kỹ Thuật (Specification)"
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>📋</span>
                      <span>Specs</span>
                    </button>
                    <span className="store-status-badge">{app.status}</span>
                  </div>
                </div>

                {app.database && (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '0.45rem',
                      marginBottom: '0.15rem',
                      background: app.database.includes('Data 1')
                        ? 'rgba(16, 185, 129, 0.12)'
                        : app.database.includes('Data 2')
                        ? 'rgba(99, 102, 241, 0.12)'
                        : 'rgba(148, 163, 184, 0.12)',
                      color: app.database.includes('Data 1')
                        ? '#10b981'
                        : app.database.includes('Data 2')
                        ? '#818cf8'
                        : '#94a3b8',
                      border: `1px solid ${
                        app.database.includes('Data 1')
                          ? 'rgba(16, 185, 129, 0.3)'
                          : app.database.includes('Data 2')
                          ? 'rgba(99, 102, 241, 0.3)'
                          : 'rgba(148, 163, 184, 0.25)'
                      }`,
                    }}
                  >
                    <span>🗄️</span>
                    <span>{app.database}</span>
                  </div>
                )}

                {/* Manual Check Verification Bar */}
                <div className="store-manual-check-bar">
                  <button
                    type="button"
                    className={`store-manual-check-btn ${app.manualChecked ? 'checked' : 'uncheck'}`}
                    onClick={() => canEdit && handleToggleManualCheck(app)}
                    disabled={!canEdit}
                    title={
                      canEdit
                        ? (app.manualChecked ? 'Bấm để hủy hoặc cập nhật ngày xác nhận' : 'Bấm để xác nhận bạn đã kiểm tra ứng dụng')
                        : 'Trạng thái xác nhận kiểm tra'
                    }
                  >
                    <span className="check-indicator">{app.manualChecked ? '✓' : '○'}</span>
                    <span className="check-text">
                      {app.manualChecked ? (
                        <>
                          <span className="check-label">Đã check</span>
                          {app.manualCheckedAt && (
                            <span className="check-date">• {app.manualCheckedAt}</span>
                          )}
                        </>
                      ) : (
                        <span className="check-prompt">Xác nhận đã check</span>
                      )}
                    </span>
                  </button>
                </div>

                {/* Description */}
                <p className="store-app-desc" title={app.description}>
                  {app.description || 'Không có mô tả cho ứng dụng này.'}
                </p>
              </div>

              {/* Card Footer: OPEN Button, SPECS Button & Edit controls */}
              <div className="store-card-footer" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {app.frontendUrl ? (
                  <a
                    href={app.frontendUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="store-btn-open"
                    title={`Mở ${app.title}`}
                  >
                    MỞ
                    <ExternalLinkIcon size={12} />
                  </a>
                ) : (
                  <button
                    className="store-btn-open disabled"
                    onClick={() => canEdit && handleOpenEditModal(app)}
                  >
                    Chưa có URL
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveModal({ type: 'view-spec', project: app, lang: 'vi' })}
                  title="Xem Đặc Tả Kỹ Thuật (Specification)"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    padding: '0.45rem 0.65rem',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>📋</span>
                  <span>SPECS</span>
                </button>

                {backlogCount > 0 && (
                  <span className="store-backlog-chip" title={`${backlogCount} công việc backlog`}>
                    {backlogCount} task
                  </span>
                )}

                {canEdit && (
                  <button
                    className="store-icon-btn"
                    onClick={() => handleOpenEditModal(app)}
                    title="Chỉnh sửa / Quản lý"
                  >
                    <EditIcon size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty placeholder card to add project if editor */}
        {canEdit && (
          <div className="store-card store-card-add" onClick={() => handleOpenEditModal()}>
            <div className="store-card-add-icon">
              <PlusIcon size={20} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Thêm Ứng Dụng Mới</span>
          </div>
        )}
      </div>

      {/* Edit App Modal */}
      {activeModal?.type === 'edit-app' && (
        <Modal
          title={activeModal.project ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
          onClose={() => setActiveModal(null)}
          maxWidth="600px"
        >
          <div className="form-group">
            <label>Tên dự án:</label>
            <input
              type="text"
              className="input-text"
              value={modalForm.title || ''}
              onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
              placeholder="VD: JohnnyHoang's Wallet, Payment App..."
            />
          </div>

          <div className="form-row" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Danh mục (Category):</label>
              <input
                type="text"
                className="input-text"
                value={modalForm.category || ''}
                onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                placeholder="VD: Web App, AI Tool..."
              />
            </div>

            <div className="form-group">
              <label>Database Supabase:</label>
              <select
                className="input-select"
                value={modalForm.database || 'JH Supabase NoData'}
                onChange={(e) => setModalForm({ ...modalForm, database: e.target.value })}
              >
                <option value="JH Supabase Data 1">JH Supabase Data 1</option>
                <option value="JH Supabase Data 2">JH Supabase Data 2</option>
                <option value="JH Supabase NoData">JH Supabase NoData</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái (Status):</label>
              <select
                className="input-select"
                value={modalForm.status || 'Development'}
                onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
              >
                <option value="Production">Production</option>
                <option value="Development">Development</option>
                <option value="Staging">Staging</option>
                <option value="Planning">Planning</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>URL Frontend:</label>
            <input
              type="url"
              className="input-text"
              value={modalForm.frontendUrl || ''}
              onChange={(e) => setModalForm({ ...modalForm, frontendUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-row" style={{ marginTop: '1rem', alignItems: 'center' }}>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input
                type="checkbox"
                id="modal-manual-check"
                checked={Boolean(modalForm.manualChecked)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setModalForm({
                    ...modalForm,
                    manualChecked: checked,
                    manualCheckedAt: checked
                      ? (modalForm.manualCheckedAt || new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))
                      : '',
                  });
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="modal-manual-check" style={{ cursor: 'pointer', marginBottom: 0, fontWeight: 600 }}>
                Xác nhận đã check tay
              </label>
            </div>

            {modalForm.manualChecked && (
              <div className="form-group">
                <label>Ngày check:</label>
                <input
                  type="text"
                  className="input-text"
                  value={modalForm.manualCheckedAt || ''}
                  onChange={(e) => setModalForm({ ...modalForm, manualCheckedAt: e.target.value })}
                  placeholder="VD: 23/09/2026"
                />
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Mô tả:</label>
            <textarea
              className="input-text"
              rows={3}
              value={modalForm.description || ''}
              onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
              placeholder="Mô tả tóm tắt ứng dụng..."
            />
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Backlog Tasks ({modalBacklog.length}):</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="input-text"
                placeholder="Thêm task backlog mới..."
                value={newBacklogTitle}
                onChange={(e) => setNewBacklogTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBacklogItem()}
              />
              <button className="btn btn-secondary" onClick={handleAddBacklogItem}>
                Thêm
              </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '160px', overflowY: 'auto' }}>
              {modalBacklog.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.4rem 0.6rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '6px',
                    marginBottom: '0.35rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <span>{item.title}</span>
                  <button
                    className="btn btn-icon-sm danger"
                    onClick={() => setModalBacklog((prev) => prev.filter((b) => b.id !== item.id))}
                    title="Xóa task"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="modal-actions"
            style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}
          >
            {activeModal.project ? (
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteApp(activeModal.project!.id)}
              >
                Xóa dự án
              </button>
            ) : (
              <div />
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSaveApp}>
                Lưu
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Specification Viewer Modal */}
      {activeModal?.type === 'view-spec' && activeModal.project && (
        <Modal
          title={`Đặc Tả Kỹ Thuật - ${activeModal.project.title}`}
          onClose={() => setActiveModal(null)}
          maxWidth="760px"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`btn ${activeModal.lang === 'vi' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveModal({ ...activeModal, lang: 'vi' })}
                style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: '6px' }}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                type="button"
                className={`btn ${activeModal.lang === 'en' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveModal({ ...activeModal, lang: 'en' })}
                style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: '6px' }}
              >
                🇬🇧 English
              </button>
            </div>

            {activeModal.project.frontendUrl && (
              <a
                href={activeModal.project.frontendUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px' }}
              >
                Mở Web App <ExternalLinkIcon size={12} />
              </a>
            )}
          </div>

          <div
            style={{
              maxHeight: '64vh',
              overflowY: 'auto',
              padding: '1.4rem',
              background: 'rgba(15, 23, 42, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: '#cbd5e1',
            }}
          >
            <SpecDocRenderer
              content={
                activeModal.lang === 'en'
                  ? (activeModal.project.specEn || 'No English specification available for this project.')
                  : (activeModal.project.specVi || 'Chưa có đặc tả tiếng Việt cho dự án này.')
              }
            />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>
              Đóng
            </button>
          </div>
        </Modal>
      )}
        </>
      )}
    </div>
  );
}
