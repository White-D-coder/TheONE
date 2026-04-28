'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Send, 
  FileText,
  AlertCircle,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { getApplications } from '@/lib/actions';
import styles from './applications.module.css';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getApplications();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'var(--accent-blue)';
      case 'INTERVIEW': return 'var(--accent-purple)';
      case 'OFFER': return 'var(--accent-emerald)';
      case 'REJECTED': return 'var(--accent-rose)';
      default: return 'var(--text-tertiary)';
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Application <span className="text-gradient">Pipeline</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track your high-gravity engineering applications and interview stages.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active</span>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{applications.filter(a => a.status === 'SUBMITTED' || a.status === 'INTERVIEW').length}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Interviews</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{applications.filter(a => a.status === 'INTERVIEW').length}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Offers</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{applications.filter(a => a.status === 'OFFER').length}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Conversion</span>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{applications.length > 0 ? ((applications.filter(a => a.status === 'OFFER').length / applications.length) * 100).toFixed(0) : 0}%</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Role & Company</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Materials</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? applications.map((app) => (
              <tr key={app.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{app.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{app.company}</div>
                </td>
                <td>
                  <span className={styles.statusBadge} style={{ background: `${getStatusColor(app.status)}15`, color: getStatusColor(app.status) }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {app.coverLetter && <FileText size={16} color="var(--text-tertiary)" />}
                    {app.resumeUrl && <Send size={16} color="var(--text-tertiary)" />}
                  </div>
                </td>
                <td>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)' }}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                  <Briefcase size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <div>No active applications in the pipeline.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
