'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BrainCircuit, 
  BarChart3, 
  Zap, 
  AlertTriangle,
  Target,
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { getOSState, getMentorAudit, getStrategicInsights, getSystemBottlenecks, getWeeklyReport } from '@/lib/actions';
import styles from './analytics.module.css';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [audit, setAudit] = useState('Generating audit...');
  const [insights, setInsights] = useState<any[]>([]);
  const [bottlenecks, setBottlenecks] = useState<string[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [state, auditText, strategicData, bottleneckData, weeklyData] = await Promise.all([
        getOSState(),
        getMentorAudit(),
        getStrategicInsights(),
        getSystemBottlenecks(),
        getWeeklyReport()
      ]);
      setStats((state as any).user);
      setAudit(auditText);
      setInsights(strategicData);
      setBottlenecks(bottleneckData);
      setReport(weeklyData);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}>Auditing performance...</div>;

  const logs = (stats?.logs || []).slice().reverse();
  const weeklyChartData = logs.length > 0 
    ? logs.map((l: any) => l.focusScore || 0)
    : [0, 0, 0, 0, 0, 0, 0];
  
  const days = logs.length > 0
    ? logs.map((l: any) => new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase())
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const avgSkillScore = (stats?.skills?.length || 0) > 0 
    ? (stats.skills.reduce((acc: any, s: any) => acc + s.score, 0) / stats.skills.length).toFixed(1)
    : "0";

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            AI Review & <span className="text-gradient">Performance Audit</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            System-wide performance auditing. The "Strict Mentor" logic is active.
          </p>
        </div>
      </header>

      <div className={styles.reviewGrid}>
        <div className={`glass-card ${styles.reportCard}`}>
          <div className={styles.reportHeader}>
            <h3 className={styles.reportTitle}>
              <BrainCircuit size={20} color="var(--accent-blue)" />
              Mentor Audit
            </h3>
            <span className={styles.toneBadge}>TONE: SHARP</span>
          </div>
          
          <div className={styles.reportContent}>
            "{audit}"
          </div>

          <div className={styles.metricGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Skill Avg</span>
              <span className={styles.metricValue}>{avgSkillScore}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Projects</span>
              <span className={styles.metricValue}>{stats?.projects.length || 0}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Evidence</span>
              <span className={styles.metricValue}>{stats?.evidences.length || 0}</span>
            </div>
          </div>
        </div>

        <div className={`glass-card ${styles.reportCard}`}>
          <h3 className={styles.reportTitle}>
            <BarChart3 size={20} color="var(--accent-emerald)" />
            Focus Score Trend
          </h3>
          <div className={styles.chartContainer}>
            {weeklyChartData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div 
                  className={`${styles.bar} ${i === 6 ? styles.barActive : ''}`} 
                  style={{ height: `${val}%` }} 
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{days[i]}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '16px' }}>
            Calculated from DailyLog intensity scores.
          </p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Weekly Report Section */}
          {report && (
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem' }}>
                  <FileText size={22} color="var(--accent-blue)" />
                  Weekly Performance Report
                </h3>
                <span className={styles.scoreBadge}>{report.overallScore}% Efficiency</span>
              </div>
              
              <div className={styles.reportSection}>
                <h4 className={styles.subTitle}>EXECUTIVE SUMMARY</h4>
                <p className={styles.summaryText}>{report.executiveSummary}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
                <div>
                  <h4 className={styles.subTitle} style={{ color: 'var(--accent-emerald)' }}>WINS</h4>
                  <ul className={styles.reportList}>
                    {report.wins.map((w: string, i: number) => (
                      <li key={i}><CheckCircle2 size={14} color="var(--accent-emerald)" /> {w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={styles.subTitle} style={{ color: 'var(--accent-rose)' }}>FAILURES</h4>
                  <ul className={styles.reportList}>
                    {report.failures.map((f: string, i: number) => (
                      <li key={i}><XCircle size={14} color="var(--accent-rose)" /> {f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.strategyBox}>
                <Zap size={16} fill="var(--accent-blue)" color="var(--accent-blue)" />
                <span><strong>NEXT STEPS:</strong> {report.strategy}</span>
              </div>
            </div>
          )}

          <div className={`glass-card ${styles.insightCard}`}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-blue)" fill="var(--accent-blue)" />
              Strategic Optimization
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {insights.length > 0 ? insights.map((insight, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-surface-hover)', borderRadius: '8px', height: 'fit-content' }}>
                    <Target size={18} color="var(--accent-blue)" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{insight.title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {insight.text}
                    </p>
                  </div>
                </div>
              )) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No strategic adjustments recommended yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--accent-amber)" />
            System Bottlenecks
          </h3>
          {bottlenecks.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bottlenecks.map((b, idx) => (
                <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-rose)' }}></span>
                  {b}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No major bottlenecks detected. Keep executing.</p>
          )}
        </div>
      </div>
    </div>
  );
}
