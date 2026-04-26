import React from 'react';
import { 
  AlertCircle, 
  Zap, 
  Search, 
  Filter,
  BrainCircuit,
  History,
  Target,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { getOSState } from '@/lib/actions';
import styles from './skills.module.css';

export default async function SkillsPage() {
  const state = await getOSState();
  const user = (state as any).user;

  if (!user) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>System Offline</h2>
        <p>Please initialize your profile to start tracking.</p>
      </div>
    );
  }

  const technicalSkills = user.skills.filter((s: any) => s.category === 'TECHNICAL');
  const softSkills = user.skills.filter((s: any) => s.category === 'SOFT');

  // Calculate radar points based on real averages
  const techAvg = technicalSkills.length ? technicalSkills.reduce((acc: any, s: any) => acc + s.score, 0) / technicalSkills.length : 0;
  const softAvg = softSkills.length ? softSkills.reduce((acc: any, s: any) => acc + s.score, 0) / softSkills.length : 0;
  const evidenceAvg = user.evidences.length * 5; // Simple weight for radar
  const careerAvg = (user.worthHistory[0]?.score || 0);

  // Radar mapping (simple)
  const p1 = 150 - (techAvg * 1.2); // Top (Technical)
  const p2 = 150 + (softAvg * 1.2); // Right (Soft)
  const p3 = 150 + (careerAvg * 1.2); // Bottom (Career)
  const p4 = 150 - (evidenceAvg * 1.2); // Left (Evidence/Systems)

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Skill <span className="text-gradient">Matrix</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time mastery mapping derived from verified professional artifacts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Search size={16} /> Search Matrix
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={`glass-card ${styles.radarSection}`}>
          <h2 style={{ fontSize: '1rem', marginBottom: '32px', color: 'var(--text-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="var(--accent-blue)" /> Mastery Radar
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="300" height="300" viewBox="0 0 300 300" style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))' }}>
              <circle cx="150" cy="150" r="120" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
              <circle cx="150" cy="150" r="30" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
              
              <line x1="150" y1="30" x2="150" y2="270" stroke="var(--border-subtle)" />
              <line x1="30" y1="150" x2="270" y2="150" stroke="var(--border-subtle)" />
              
              <polygon 
                points={`150,${Math.max(30, p1)} ${Math.min(270, p2)},150 150,${Math.min(270, p3)} ${Math.max(30, p4)},150`} 
                fill="rgba(59, 130, 246, 0.2)" 
                stroke="var(--accent-blue)" 
                strokeWidth="2" 
                className="animate-pulse"
              />
              
              <text x="150" y="20" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontWeight="700">TECHNICAL</text>
              <text x="280" y="150" textAnchor="start" fill="var(--text-tertiary)" fontSize="10" fontWeight="700">SOFT</text>
              <text x="150" y="290" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontWeight="700">WORTH</text>
              <text x="20" y="150" textAnchor="end" fill="var(--text-tertiary)" fontSize="10" fontWeight="700">EVIDENCE</text>
            </svg>
          </div>
          
          <div style={{ marginTop: '40px', width: '100%' }}>
            <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.03)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <BrainCircuit size={20} color="var(--accent-blue)" />
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>AI Growth Prediction</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Based on your velocity in **{technicalSkills[0]?.name || 'Engineering'}**, you are on track to reach **Expert (85+)** status in 22 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.skillList}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className={styles.categoryTitle}>Technical Infrastructure</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{technicalSkills.length} SKILLS</span>
          </div>
          
          {technicalSkills.length ? technicalSkills.map((skill: any) => (
            <div key={skill.id} className={`glass-card ${styles.skillCard}`}>
              <div className={styles.skillHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                  <span className={styles.skillName}>{skill.name}</span>
                </div>
                <span className={styles.skillScore}>{skill.score}</span>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${skill.score}%` }} />
                </div>
                <div className={styles.skillMeta}>
                  <span className={styles.metaItem}>
                    <ShieldCheck size={12} color="var(--accent-blue)" /> 
                    {skill.evidenceCount || 0} Evidence Items
                  </span>
                  <span className={styles.metaItem}>
                    <History size={12} /> 
                    Last Active: {new Date(skill.lastPracticedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )) : <p style={{ color: 'var(--text-tertiary)' }}>No technical skills mapped yet.</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '32px' }}>
            <span className={styles.categoryTitle}>Communication & Communication</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{softSkills.length} SKILLS</span>
          </div>

          {softSkills.length ? softSkills.map((skill: any) => (
            <div key={skill.id} className={`glass-card ${styles.skillCard}`}>
              <div className={styles.skillHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }} />
                  <span className={styles.skillName}>{skill.name}</span>
                </div>
                <span className={styles.skillScore} style={{ color: 'var(--accent-purple)' }}>{skill.score}</span>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${skill.score}%`, background: 'var(--accent-purple)' }} />
                </div>
                <div className={styles.skillMeta}>
                  <span className={styles.metaItem}><Target size={12} color="var(--accent-purple)" /> Active Drill Mode</span>
                </div>
              </div>
            </div>
          )) : <p style={{ color: 'var(--text-tertiary)' }}>No communication skills mapped yet.</p>}
        </div>
      </div>
    </div>
  );
}
