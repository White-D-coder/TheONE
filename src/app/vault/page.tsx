'use client';

import React, { useState } from 'react';
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
  Code
} from 'lucide-react';
import { getGitHubStats } from '@/lib/actions';
import styles from './vault.module.css';

const EVIDENCE = [
  { 
    id: 1, 
    type: 'REPO', 
    title: 'Adaptive Scheduler Core', 
    desc: 'The backend engine for Engineer OS. Implements dynamic role weighting and habit persistence logic.',
    strength: 'ELITE',
    icon: Code,
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
    date: 'Apr 24, 2026'
  },
  { 
    id: 2, 
    type: 'ARTICLE', 
    title: 'Why Consistency Beats Intensity', 
    desc: 'Deep dive into the math of compounding growth in engineering careers. Published on Medium.',
    strength: 'STRONG',
    icon: FileText,
    tags: ['Career', 'Writing'],
    date: 'Apr 20, 2026'
  },
];

export default function VaultPage() {
  const [filter, setFilter] = useState('ALL');
  const [username, setUsername] = useState('');
  const [ghStats, setGhStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSyncGitHub = async () => {
    if (!username) return;
    setLoading(true);
    const stats = await getGitHubStats(username);
    setGhStats(stats);
    setLoading(false);
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="GitHub Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.85rem' }}
            />
            <button 
              onClick={handleSyncGitHub} 
              disabled={loading}
              style={{ color: 'var(--accent-blue)', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Code size={14} />} SYNC
            </button>
          </div>
          <button className="glass-card" style={{ 
            padding: '12px 24px', 
            background: 'var(--grad-primary)', 
            border: 'none', 
            color: 'white', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Plus size={18} /> Add Evidence
          </button>
        </div>
      </header>

      {ghStats && (
        <div className="glass-card animate-slide-up" style={{ padding: '24px', marginBottom: '32px', border: '1px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img src={ghStats.avatar_url} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>@{username} Sync Complete</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Detected **{ghStats.public_repos}** public repositories. 
                  Strength analysis in progress...
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{ghStats.public_repos}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Repos</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{ghStats.followers}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Followers</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {EVIDENCE.map((item) => (
          <div key={item.id} className={`glass-card ${styles.evidenceCard}`}>
            <span className={`${styles.strengthBadge} ${
              item.strength === 'ELITE' ? styles.strengthElite : 
              item.strength === 'STRONG' ? styles.strengthStrong : ''
            }`}>
              {item.strength}
            </span>
            
            <div className={styles.evidenceIcon}>
              <item.icon size={24} color="var(--text-primary)" />
            </div>

            <div>
              <h3 className={styles.evidenceTitle}>{item.title}</h3>
              <p className={styles.evidenceDesc}>{item.desc}</p>
            </div>

            <div className={styles.tagList}>
              {item.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.evidenceFooter}>
              <span className={styles.evidenceDate}>{item.date}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>
                <button style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  VIEW <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
