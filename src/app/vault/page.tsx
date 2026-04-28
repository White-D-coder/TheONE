'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCode2, 
  Globe, 
  FileText, 
  ExternalLink,
  Plus,
  Search,
  MoreVertical,
  Cpu,
  Mic2,
  RefreshCw,
  Code,
  Trophy,
  Terminal,
  Play
} from 'lucide-react';
import { syncGitHub, syncLeetCode, syncCodeforces, syncMedium, syncYouTube, syncPublicProfile, getOSState } from '@/lib/actions';
import { Modal } from '@/components/ui/Modal';
import styles from './vault.module.css';

export default function VaultPage() {
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [manualTitle, setManualTitle] = useState('');
  const [manualType, setManualType] = useState('REPO');
  const [manualUrl, setManualUrl] = useState('');

  const [ghUser, setGhUser] = useState('');
  const [lcUser, setLcUser] = useState('');
  const [cfUser, setCfUser] = useState('');
  const [medUser, setMedUser] = useState('');
  const [ytChannel, setYtChannel] = useState('');

  const fetchData = async () => {
    const state = await getOSState();
    if ((state as any).user) {
      setEvidence((state as any).user.evidences);
      setAccounts((state as any).user.accounts);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl) return;
    
    setLoading('MANUAL');
    const result = await syncPublicProfile(manualUrl); // We might want to expand this to take more fields
    if (result.success) {
      await fetchData();
      setIsModalOpen(false);
      setManualTitle('');
      setManualUrl('');
    } else {
      alert(`Sync failed: ${(result as any).error || 'Platform error'}`);
    }
    setLoading(null);
  };

  const handleSync = async (platform: string) => {
    let user = '';
    let fn: any;
    
    if (platform === 'GITHUB') { user = ghUser; fn = syncGitHub; }
    if (platform === 'LEETCODE') { user = lcUser; fn = syncLeetCode; }
    if (platform === 'CODEFORCES') { user = cfUser; fn = syncCodeforces; }
    if (platform === 'MEDIUM') { user = medUser; fn = syncMedium; }
    if (platform === 'YOUTUBE') { user = ytChannel; fn = syncYouTube; }

    if (!user) return;
    
    setLoading(platform);
    const result = await fn(user);
    if ((result as any).success) {
      await fetchData();
      if (platform === 'GITHUB') setGhUser('');
      if (platform === 'LEETCODE') setLcUser('');
      if (platform === 'CODEFORCES') setCfUser('');
      if (platform === 'MEDIUM') setMedUser('');
      if (platform === 'YOUTUBE') setYtChannel('');
    } else {
      alert(`Sync failed: ${(result as any).error || 'Platform error'}`);
    }
    setLoading(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'REPO': return Code;
      case 'ARTICLE': return FileText;
      case 'SPEECH': return Mic2;
      case 'DEMO': return Cpu;
      case 'VIDEO': return Play;
      default: return Globe;
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header className={styles.vaultHeader}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Evidence <span className="text-gradient">Vault</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            The trusted source of truth for your professional credibility.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-card" 
          style={{ 
            padding: '12px 24px', 
            background: 'var(--grad-primary)', 
            border: 'none', 
            color: 'white', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} /> Add Manual Evidence
        </button>
      </header>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Manual Evidence"
      >
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>EVIDENCE TITLE</label>
            <input 
              className={styles.syncInput} 
              style={{ width: '100%' }}
              placeholder="e.g. Distributed Caching Implementation"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TYPE</label>
            <select 
              className={styles.syncInput} 
              style={{ width: '100%' }}
              value={manualType}
              onChange={(e) => setManualType(e.target.value)}
            >
              <option value="REPO">Repository</option>
              <option value="ARTICLE">Article / Blog</option>
              <option value="VIDEO">Video / Demo</option>
              <option value="LINK">External Profile</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>RESOURCE URL</label>
            <input 
              className={styles.syncInput} 
              style={{ width: '100%' }}
              placeholder="https://github.com/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="glass-card" 
            disabled={loading === 'MANUAL'}
            style={{ padding: '12px', background: 'var(--grad-primary)', border: 'none', color: 'white', fontWeight: 600, marginTop: '10px' }}
          >
            {loading === 'MANUAL' ? 'Verifying...' : 'Add to Vault'}
          </button>
        </form>
      </Modal>


      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)', fontWeight: 700 }}>CONNECT PLATFORMS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {/* GitHub */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Code size={20} color="var(--accent-blue)" />
              {accounts.find(a => a.platform === 'GITHUB') && <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>LIVE</span>}
            </div>
            <input 
              className={styles.syncInput}
              placeholder="GitHub User" 
              value={ghUser}
              onChange={(e) => setGhUser(e.target.value)}
            />
            <button onClick={() => handleSync('GITHUB')} disabled={loading === 'GITHUB'} className={styles.syncBtn}>
              {loading === 'GITHUB' ? <RefreshCw size={14} className="animate-spin" /> : 'Sync'}
            </button>
          </div>

          {/* LeetCode */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Trophy size={20} color="var(--accent-amber)" />
              {accounts.find(a => a.platform === 'LEETCODE') && <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>LIVE</span>}
            </div>
            <input 
              className={styles.syncInput}
              placeholder="LeetCode User" 
              value={lcUser}
              onChange={(e) => setLcUser(e.target.value)}
            />
            <button onClick={() => handleSync('LEETCODE')} disabled={loading === 'LEETCODE'} className={styles.syncBtn}>
              {loading === 'LEETCODE' ? <RefreshCw size={14} className="animate-spin" /> : 'Sync'}
            </button>
          </div>

          {/* Codeforces */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Terminal size={20} color="var(--accent-purple)" />
              {accounts.find(a => a.platform === 'CODEFORCES') && <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>LIVE</span>}
            </div>
            <input 
              className={styles.syncInput}
              placeholder="CF Handle" 
              value={cfUser}
              onChange={(e) => setCfUser(e.target.value)}
            />
            <button onClick={() => handleSync('CODEFORCES')} disabled={loading === 'CODEFORCES'} className={styles.syncBtn}>
              {loading === 'CODEFORCES' ? <RefreshCw size={14} className="animate-spin" /> : 'Sync'}
            </button>
          </div>

          {/* Medium */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FileText size={20} color="var(--accent-emerald)" />
              {accounts.find(a => a.platform === 'MEDIUM') && <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>LIVE</span>}
            </div>
            <input 
              className={styles.syncInput}
              placeholder="Medium User" 
              value={medUser}
              onChange={(e) => setMedUser(e.target.value)}
            />
            <button onClick={() => handleSync('MEDIUM')} disabled={loading === 'MEDIUM'} className={styles.syncBtn}>
              {loading === 'MEDIUM' ? <RefreshCw size={14} className="animate-spin" /> : 'Sync'}
            </button>
          </div>

          {/* YouTube */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Play size={20} color="#FF0000" />
              {accounts.find(a => a.platform === 'YOUTUBE') && <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>LIVE</span>}
            </div>
            <input 
              className={styles.syncInput}
              placeholder="YouTube Channel ID" 
              value={ytChannel}
              onChange={(e) => setYtChannel(e.target.value)}
            />
            <button onClick={() => handleSync('YOUTUBE')} disabled={loading === 'YOUTUBE'} className={styles.syncBtn}>
              {loading === 'YOUTUBE' ? <RefreshCw size={14} className="animate-spin" /> : 'Sync'}
            </button>
          </div>
        </div>
      </section>

      <div className={styles.filterBar}>
        {['ALL', 'REPOS', 'ARTICLES', 'DEMOS', 'SPEECHES'].map((f) => (
          <button 
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-tertiary)' }}>
          <Search size={18} />
          <span style={{ fontSize: '0.85rem' }}>Search the vault...</span>
        </div>
      </div>

      <div className={styles.vaultGrid}>
        {evidence.length ? evidence.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div key={item.id} className={`glass-card ${styles.evidenceCard}`}>
              <span className={`${styles.strengthBadge} ${
                item.strength > 0.8 ? styles.strengthElite : 
                item.strength > 0.5 ? styles.strengthStrong : ''
              }`}>
                {item.strength > 0.8 ? 'ELITE' : 'STRONG'}
              </span>
              
              <div className={styles.evidenceIcon}>
                <Icon size={24} color="var(--text-primary)" />
              </div>

              <div>
                <h3 className={styles.evidenceTitle}>{item.title}</h3>
                <p className={styles.evidenceDesc}>{item.description || 'Verified proof of competence.'}</p>
                {item.url && (
                   <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', wordBreak: 'break-all' }}>{item.url}</span>
                )}
              </div>

              <div className={styles.evidenceFooter}>
                <span className={styles.evidenceDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ color: 'var(--text-tertiary)', border: 'none', background: 'transparent' }}><MoreVertical size={16} /></button>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, border: 'none', background: 'transparent' }}>
                        VIEW <ExternalLink size={12} />
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '100px', color: 'var(--text-tertiary)' }}>
             <Globe size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
             <p>No evidence found. Connect your accounts to begin syncing real-world proof.</p>
          </div>
        )}
      </div>
    </div>
  );
}
