'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Trash2, 
  Shield, 
  Bell, 
  Eye, 
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    focusLock: true,
    driftDetection: true,
    publicMode: false,
    notifications: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          System <span className="text-gradient">Settings</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure Engineer OS core parameters and intelligence layers.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Shield size={18} style={{ marginRight: '12px' }} />
          Intelligence & Review
        </h2>
        
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>AI Mentor Tone</span>
            <span className={styles.settingDesc}>Adjust how the system provides feedback on your failures.</span>
          </div>
          <select className={styles.select}>
            <option>SHARP (Strict & Direct)</option>
            <option>NEUTRAL (Data Focused)</option>
            <option>SUPPORTIVE (Motivational)</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Worth Formula Weighting</span>
            <span className={styles.settingDesc}>Prioritize different signals in your Monthly Worth calculation.</span>
          </div>
          <button className="glass-card" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Configure Formula</button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Lock size={18} style={{ marginRight: '12px' }} />
          Focus & Protection
        </h2>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Hard Focus Lock</span>
            <span className={styles.settingDesc}>Disable all non-essential UI during Deep Work blocks.</span>
          </div>
          <div 
            className={`${styles.toggle} ${settings.focusLock ? styles.toggleActive : ''}`}
            onClick={() => toggle('focusLock')}
          >
            <div className={`${styles.toggleCircle} ${settings.focusLock ? styles.toggleCircleActive : ''}`} />
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Drift Detection</span>
            <span className={styles.settingDesc}>Automatically flag context switching and low-output periods.</span>
          </div>
          <div 
            className={`${styles.toggle} ${settings.driftDetection ? styles.toggleActive : ''}`}
            onClick={() => toggle('driftDetection')}
          >
            <div className={`${styles.toggleCircle} ${settings.driftDetection ? styles.toggleCircleActive : ''}`} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Lock size={18} style={{ marginRight: '12px' }} />
          Secrets & Credentials
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
          These keys are required for the AI Mentor and Opportunity Discovery engines to function.
        </p>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>OpenAI API Key</span>
            <span className={styles.settingDesc}>Powers the Mentor intelligence and Proof drafting.</span>
          </div>
          <input 
            type="password" 
            placeholder="sk-..." 
            className={styles.input} 
          />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Opportunity Board Key</span>
            <span className={styles.settingDesc}>Used for scanning real-world job feeds.</span>
          </div>
          <input 
            type="password" 
            placeholder="Key for Adzuna/LinkedIn" 
            className={styles.input} 
          />
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className={styles.saveBtn}>Save Credentials</button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Smartphone size={18} style={{ marginRight: '12px' }} />
          Integrations
        </h2>
        
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>GitHub Sync</span>
            <span className={styles.settingDesc}>Automatically pull commits and PRs into the Evidence Vault.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>CONNECTED</span>
            <button className="glass-card" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Update Token</button>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>LeetCode / Codeforces</span>
            <span className={styles.settingDesc}>Connect competitive programming platforms.</span>
          </div>
          <button className="glass-card" style={{ padding: '8px 16px', fontSize: '0.8rem', color: 'var(--accent-blue)' }}>Configure Handles</button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.dangerZone}>
          <h3 className={styles.dangerTitle}>
            <Trash2 size={18} />
            Danger Zone
          </h3>
          <div className={styles.settingRow} style={{ border: 'none' }}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Export Data</span>
              <span className={styles.settingDesc}>Download a complete JSON backup of your Skills, Evidence, and Logs.</span>
            </div>
            <button className="glass-card" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
              <Download size={14} style={{ marginRight: '8px' }} /> Export
            </button>
          </div>
          <div className={styles.settingRow} style={{ border: 'none', marginTop: '12px' }}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Purge System</span>
              <span className={styles.settingDesc}>Delete all data and reset the OS to factory defaults. This is permanent.</span>
            </div>
            <button style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: 'var(--radius-sm)' }}>
              Factory Reset
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
