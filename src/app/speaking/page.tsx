'use client';

import React, { useState } from 'react';
import { 
  Mic, 
  Square, 
  RotateCcw, 
  Send, 
  MessageSquare,
  BarChart3,
  Lightbulb,
  Zap
} from 'lucide-react';
import styles from './speaking.module.css';

export default function SpeakingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasTranscript, setHasTranscript] = useState(false);

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Speaking <span className="text-gradient">Lab</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Technical articulation and interview confidence training.
        </p>
      </header>

      <div className={styles.labGrid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={`glass-card ${styles.recorderCard}`}>
            {!hasTranscript ? (
              <>
                <div className={styles.promptCard}>
                  <span className={styles.promptLabel}>Current Drill: Technical Explanation</span>
                  <p className={styles.promptText}>
                    "Explain the difference between a Process and a Thread to a Junior Engineer."
                  </p>
                </div>

                <div className={styles.recordCircle} onClick={() => setIsRecording(!isRecording)}>
                  {isRecording && <div className={styles.recordingPulse} />}
                  {isRecording ? <Square size={40} color="var(--accent-rose)" fill="var(--accent-rose)" /> : <Mic size={40} color="var(--text-primary)" />}
                </div>

                <p style={{ color: isRecording ? 'var(--accent-rose)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                  {isRecording ? 'RECORDING ACTIVE...' : 'TAP TO START DRILL'}
                </p>

                {isRecording && (
                  <button 
                    className="glass-card" 
                    style={{ padding: '12px 24px', background: 'var(--accent-blue)', border: 'none', color: 'white', fontWeight: 600 }}
                    onClick={() => { setIsRecording(false); setHasTranscript(true); }}
                  >
                    Finish & Analyze
                  </button>
                )}
              </>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} /> Analysis Results
                  </h3>
                  <button onClick={() => setHasTranscript(false)} style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>

                <div className={styles.transcript}>
                  "So <span className={styles.fillerWord}>um</span>, basically a process is like an isolated instance of an application, <span className={styles.fillerWord}>right?</span> And <span className={styles.fillerWord}>like</span>, threads are components inside that process that share the same memory space. <span className={styles.fillerWord}>Uh</span>, that makes them faster for context switching."
                </div>

                <div className={styles.scoreGrid} style={{ marginTop: '32px' }}>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Clarity</span>
                    <span className={styles.scoreValue} style={{ color: 'var(--accent-emerald)' }}>8.4</span>
                  </div>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Conciseness</span>
                    <span className={styles.scoreValue} style={{ color: 'var(--accent-amber)' }}>6.2</span>
                  </div>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Confidence</span>
                    <span className={styles.scoreValue} style={{ color: 'var(--accent-blue)' }}>7.8</span>
                  </div>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Filler Words</span>
                    <span className={styles.scoreValue} style={{ color: 'var(--accent-rose)' }}>4</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Lightbulb size={20} color="var(--accent-amber)" />
              <span style={{ fontWeight: 600 }}>Speaking Coach Insight</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "Your explanation of shared memory was accurate, but you used 4 filler words in 20 seconds. 
              Try to pause for 1 second instead of saying 'um' when transitioning between points."
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <BarChart3 size={20} color="var(--accent-blue)" />
              <span style={{ fontWeight: 600 }}>Drill History</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Explain B-Trees</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Apr 24, 2026</div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-blue)' }}>8.1</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'var(--grad-primary)', border: 'none' }}>
            <h3 style={{ color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} fill="white" /> Interview Prep Mode
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
              Switch to rapid-fire behavioral questions to prepare for your Google screening.
            </p>
            <button style={{ width: '100%', padding: '12px', background: 'white', color: 'black', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}>
              Activate Prep Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
