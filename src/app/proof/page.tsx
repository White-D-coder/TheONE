'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Eye,
  History,
  Share2,
  MessageSquare,
  RefreshCw,
  Plus
} from 'lucide-react';
import { generateSocialDraft, getOSState, getDrafts } from '@/lib/actions';
import styles from './proof.module.css';

export default function ProofPage() {
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);
  const [tone, setTone] = useState('LINKEDIN');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const state = await getOSState();
    const existingDrafts = await getDrafts();
    if ((state as any).user) {
      setEvidenceList((state as any).user.evidences || []);
      if (!selectedArtifact && (state as any).user.evidences.length > 0) {
        setSelectedArtifact((state as any).user.evidences[0]);
      }
    }
    setDrafts(existingDrafts);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedArtifact) return;
    setIsGenerating(true);
    await generateSocialDraft(selectedArtifact.id, tone as any);
    await loadData();
    setIsGenerating(false);
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Synchronizing narratives...</div>;

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Public <span className="text-gradient">Proof Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Turn verified engineering artifacts into career-defining visibility.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Eye size={16} /> Impact Tracking Active
          </div>
        </div>
      </header>

      <div className={styles.studioGrid}>
        <div className={styles.artifactSelector}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            Select Source Evidence
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{evidenceList.length} ITEMS</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
            {evidenceList.length ? evidenceList.map((a) => (
              <div 
                key={a.id} 
                className={`glass-card ${styles.artifactItem} ${selectedArtifact?.id === a.id ? styles.artifactSelected : ''}`}
                onClick={() => setSelectedArtifact(a)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{a.title}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{(a.strength * 100).toFixed(0)}% STRENGTH</span>
                </div>
                <div className={styles.qualityBar}>
                  <div className={styles.qualityFill} style={{ width: `${a.strength * 100}%` }} />
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No evidence found in Vault.</p>}
          </div>

          <div className="glass-card" style={{ marginTop: '24px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent-blue)" />
              Proof Strategy
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "Publishing real-time builds builds 3x more trust than polished retrospective articles. 
              Queue a LinkedIn post for your latest repo sync."
            </p>
          </div>
        </div>

        <div className={`glass-card ${styles.editorCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className={styles.draftOptions}>
              {['LINKEDIN', 'TWITTER', 'MEDIUM'].map(t => (
                <button 
                  key={t}
                  className={`${styles.optionBtn} ${tone === t ? styles.optionBtnActive : ''}`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleGenerate} disabled={isGenerating || !selectedArtifact} className="glass-card" style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'var(--bg-surface-hover)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />} 
                Regenerate Draft
              </button>
            </div>
          </div>

          <div className={styles.draftContainer}>
            {drafts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {drafts.filter(d => d.platform === tone).map((draft: any) => (
                  <div key={draft.id} className="glass-card" style={{ padding: '20px', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>{new Date(draft.createdAt).toLocaleString()}</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderRadius: '4px' }}>{draft.status}</span>
                    </div>
                    <textarea 
                      className={styles.textArea}
                      defaultValue={draft.content}
                      rows={8}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Delete</button>
                      <button style={{ padding: '8px 24px', background: 'var(--accent-blue)', border: 'none', borderRadius: '4px', color: 'white', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Post Now <Send size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <MessageSquare size={40} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Select evidence and platform to generate your first draft.</p>
                <button onClick={handleGenerate} disabled={!selectedArtifact} className="glass-card" style={{ marginTop: '20px', padding: '12px 24px', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)' }}>
                  Generate {tone} Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
