'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  History,
  Share2,
  MessageSquare
} from 'lucide-react';
import styles from './proof.module.css';

const ARTIFACTS = [
  { id: 1, title: 'Adaptive Scheduler Core', type: 'REPO', strength: 92 },
  { id: 2, title: 'Process vs Thread Drill', type: 'SPEECH', strength: 84 },
  { id: 3, title: 'Distributed Cache Viz', type: 'DEMO', strength: 88 },
];

export default function ProofPage() {
  const [selectedArtifact, setSelectedArtifact] = useState(ARTIFACTS[0]);
  const [tone, setTone] = useState('EDUCATIONAL');
  const [content, setContent] = useState(`I just finished implementing the core logic for the Adaptive Scheduler! 🚀

The most challenging part was designing the "Routine Gravity" formula that rebalances tasks based on role weights and skill decay. 

Key technical takeaways:
1. Used Prisma's JSON fields for dynamic weighting.
2. Implemented a custom decay algorithm for skill retention.
3. Leveraged CSS Grid for the timeline visualization.

Evidence in bio. #EngineerOS #BuildingInPublic #SystemDesign`);

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Public <span className="text-gradient">Proof Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Turn private work into visible credibility. No cringe, all signal.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Eye size={16} /> Visibility: 4.2k
          </div>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <History size={16} /> Strategy: Steady
          </div>
        </div>
      </header>

      <div className={styles.studioGrid}>
        <div className={styles.artifactSelector}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Select Evidence to Proof</h3>
          {ARTIFACTS.map((a) => (
            <div 
              key={a.id} 
              className={`glass-card ${styles.artifactItem} ${selectedArtifact.id === a.id ? styles.artifactSelected : ''}`}
              onClick={() => setSelectedArtifact(a)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{a.title}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{a.strength}% STRENGTH</span>
              </div>
              <div className={styles.qualityBar}>
                <div className={styles.qualityFill} style={{ width: `${a.strength}%` }} />
              </div>
            </div>
          ))}

          <div className="glass-card" style={{ marginTop: 'auto', padding: '24px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent-blue)" />
              AI Strategy Tip
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "Your 'Distributed Cache Viz' is perfect for a technical LinkedIn thread. It shows visual 
              complexity and system design mastery—two signals high-growth startups are looking for right now."
            </p>
          </div>
        </div>

        <div className={`glass-card ${styles.editorCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={styles.draftOptions}>
              {['EDUCATIONAL', 'STRICT', 'EXCITED'].map(t => (
                <button 
                  key={t}
                  className={`${styles.optionBtn} ${tone === t ? styles.optionBtnActive : ''}`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Share2 size={18} color="var(--text-tertiary)" />
              <MessageSquare size={18} color="var(--text-tertiary)" />
              <Globe size={18} color="var(--text-tertiary)" />
            </div>
          </div>

          <textarea 
            className={styles.textArea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={14} /> High Signal
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={14} /> Evidence Linked
              </div>
            </div>
            <button style={{ 
              padding: '12px 32px', 
              background: 'var(--grad-primary)', 
              border: 'none', 
              borderRadius: 'var(--radius-md)', 
              color: 'white', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Queue Post <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
