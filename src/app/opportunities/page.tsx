'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Star,
  Target,
  Zap,
  Briefcase,
  RefreshCw,
  Search,
  FileText,
  X
} from 'lucide-react';
import { getOSState, discoverOpportunities, draftApplication, submitApplication } from '@/lib/actions';
import styles from './opportunities.module.css';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [drafting, setDrafting] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const state = await getOSState();
    if ((state as any).user) {
      setOpportunities((state as any).user.opportunities || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await discoverOpportunities();
    await fetchData();
    setSyncing(false);
  };

  const handleApplyClick = async (oppId: string) => {
    setSubmitting(true);
    const draft = await draftApplication(oppId);
    setDrafting(draft);
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitApplication(drafting.oppId, drafting);
    setDrafting(null);
    await fetchData();
    setSubmitting(false);
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '50vh' }}>Scanning the market...</div>;
  }

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Opportunity <span className="text-gradient">Discovery</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real opportunities ranked by **Skill Fit** and **Evidence Strength**.
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
          {syncing ? 'Scanning Market...' : 'Scan for Opportunities'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
        <div className={styles.opportunityGrid}>
          {opportunities.length > 0 ? opportunities.map((opp) => (
            <div key={opp.id} className={`glass-card ${styles.oppCard} ${opp.status === 'APPLIED' ? styles.applied : ''}`}>
              <div className={styles.logo}>{opp.company[0]}</div>
              
              <div className={styles.info}>
                <span className={styles.company}>{opp.company}</span>
                <h3 className={styles.title}>{opp.title}</h3>
                <div className={styles.meta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {opp.location || 'Remote'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={14} /> {opp.salary || 'Competitive'}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', borderLeft: '2px solid var(--border-subtle)', paddingLeft: '12px', fontStyle: 'italic' }}>
                  "{opp.reason || 'Matches your core skill profile.'}"
                </p>
              </div>

              <div className={styles.ranking}>
                <div>
                  <span className={styles.fitLabel}>Match Score</span>
                  <div className={styles.fitScore}>{opp.fitScore}%</div>
                </div>
                {opp.status === 'APPLIED' ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} fill="var(--accent-emerald)" /> APPLIED
                  </span>
                ) : (
                  <button 
                    onClick={() => handleApplyClick(opp.id)} 
                    disabled={submitting}
                    className={styles.actionBtn}
                  >
                    {submitting ? 'Drafting...' : 'Apply with Vault'}
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Briefcase size={40} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3>No opportunities discovered yet.</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Scan the market or connect more skills to increase your visibility.</p>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={`glass-card ${styles.filterCard}`}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="var(--accent-blue)" />
              Match Criteria
            </h3>
            <div className={styles.filterItem}>
              <span>Min Salary</span>
              <span style={{ fontWeight: 600 }}>$120k</span>
            </div>
            <div className={styles.filterItem}>
              <span>Min Match</span>
              <span style={{ fontWeight: 600 }}>75%</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Zap size={18} color="var(--accent-blue)" fill="var(--accent-blue)" />
              <span style={{ fontWeight: 600 }}>Application Pulse</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
              {opportunities.filter(o => o.status === 'APPLIED').length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Active applications in pipeline</span>
          </div>
        </div>
      </div>

      {/* Drafting Modal */}
      {drafting && (
        <div className={styles.modalOverlay}>
          <div className={`glass-card ${styles.modal}`}>
            <div className={styles.modalHeader}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="var(--accent-blue)" />
                Application Assistant
              </h3>
              <button onClick={() => setDrafting(null)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Generated Cover Letter</label>
                <textarea 
                  className={styles.textarea}
                  value={drafting.coverLetter}
                  onChange={(e) => setDrafting({ ...drafting, coverLetter: e.target.value })}
                />
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>RESUME STRATEGY</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{drafting.suggestedResume}</div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setDrafting(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className={styles.submitBtn}>
                {submitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
