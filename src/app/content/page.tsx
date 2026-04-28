'use client';

import React, { useState, useEffect } from 'react';
import { 
  Rss, 
  Bookmark, 
  ExternalLink, 
  Zap, 
  Clock,
  Search,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { getContentItems, syncContentFeeds, updateContentStatus } from '@/lib/actions';
import styles from './content.module.css';

export default function ContentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    const data = await getContentItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await syncContentFeeds();
    await fetchData();
    setSyncing(false);
  };

  const handleStatus = async (id: string, status: 'SAVED' | 'IGNORED') => {
    await updateContentStatus(id, status);
    fetchData();
  };

  const categories = ['ALL', 'ENGINEERING', 'PRODUCT', 'AI', 'RESEARCH'];
  const filteredItems = items.filter(item => 
    (activeCategory === 'ALL' || item.category === activeCategory) && 
    item.status === 'UNREAD'
  );

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Knowledge <span className="text-gradient">Feed</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Curated intelligence for high-growth engineers. AI-scored for relevance.
          </p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="glass-card" 
          style={{ 
            padding: '12px 24px', 
            background: syncing ? 'var(--bg-surface)' : 'var(--grad-primary)', 
            border: 'none', 
            color: 'white', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Ingesting Feeds...' : 'Sync Global Feeds'}
        </button>
      </header>

      <div className={styles.topBar}>
        <div className={styles.categoryPills}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '40vh' }}>
          <RefreshCw className="animate-spin" />
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <div key={item.id} className={`glass-card ${styles.itemCard}`}>
              <div className={styles.itemHeader}>
                <span className={styles.source}>{item.source}</span>
                <div className={styles.relevance}>
                  <Zap size={14} fill="var(--accent-blue)" color="var(--accent-blue)" />
                  {(item.relevance * 100).toFixed(0)}% Relevance
                </div>
              </div>
              
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.summary}>{item.summary?.substring(0, 160)}...</p>
              
              <div className={styles.footer}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <span className={styles.date}>
                    <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleStatus(item.id, 'IGNORED')} className={styles.iconBtn}><XCircle size={18} /></button>
                  <button onClick={() => handleStatus(item.id, 'SAVED')} className={styles.iconBtn}><Bookmark size={18} /></button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <button className={styles.iconBtn}><ExternalLink size={18} /></button>
                  </a>
                </div>
              </div>
            </div>
          )) : (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Rss size={40} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3>Inbox Zero.</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Sync feeds or connect new sources to discover more intelligence.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
