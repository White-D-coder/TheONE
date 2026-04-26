'use client';

import React, { useState, useEffect } from 'react';
import { 
  Rss, 
  Bookmark, 
  ExternalLink, 
  Zap, 
  CheckCircle2, 
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { getOSState } from '@/lib/actions';
import styles from './content.module.css';

export default function ContentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    // Simulated data for now, real implementation would fetch ContentItem model
    setItems([
      {
        id: 1,
        title: "The Architecture of Linear's Sync Engine",
        source: "Linear Blog",
        category: "ENGINEERING",
        summary: "A deep dive into how Linear handles real-time synchronization with high availability.",
        relevance: 98,
        url: "https://linear.app/blog",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "How to Build a High-Performance Team",
        source: "High Growth Handbook",
        category: "LEADERSHIP",
        summary: "Strategies for scaling engineering teams from 10 to 100 while maintaining quality.",
        relevance: 82,
        url: "https://eladgil.com",
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "Large Language Models in Production",
        source: "OpenAI Research",
        category: "AI",
        summary: "Best practices for deploying LLMs with low latency and high reliability.",
        relevance: 91,
        url: "https://openai.com/research",
        createdAt: new Date().toISOString()
      }
    ]);
    setLoading(false);
  }, []);

  const categories = ['ALL', 'ENGINEERING', 'PRODUCT', 'AI', 'RESEARCH', 'MINDSET'];

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Knowledge <span className="text-gradient">Feed</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Curated intelligence for high-growth engineers. AI-scored for relevance.
        </p>
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
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search knowledge base..." 
            className="glass-card" 
            style={{ padding: '8px 16px 8px 40px', fontSize: '0.85rem', width: '300px' }} 
          />
        </div>
      </div>

      <div className={styles.contentGrid}>
        {items.map(item => (
          <div key={item.id} className={`glass-card ${styles.itemCard}`}>
            <div className={styles.itemHeader}>
              <span className={styles.source}>{item.source}</span>
              <div className={styles.relevance}>
                <Zap size={14} fill="var(--accent-blue)" color="var(--accent-blue)" />
                {item.relevance}% Match
              </div>
            </div>
            
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.summary}>{item.summary}</p>
            
            <div className={styles.footer}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <span className={styles.date}>
                  <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={styles.iconBtn}><Bookmark size={18} /></button>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <button className={styles.iconBtn}><ExternalLink size={18} /></button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
