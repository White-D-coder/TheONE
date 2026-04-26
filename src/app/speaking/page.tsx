'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  RotateCcw, 
  MessageSquare,
  BarChart3,
  Lightbulb,
  Zap,
  RefreshCw
} from 'lucide-react';
import { saveSpeakingSession, getOSState } from '@/lib/actions';
import styles from './speaking.module.css';

const PROMPTS = [
  "Explain the difference between a Process and a Thread.",
  "How does React's Virtual DOM work?",
  "Describe the concept of 'Eventual Consistency' in distributed systems.",
  "Explain the time complexity of QuickSort.",
  "Tell me about a time you resolved a technical conflict."
];

export default function SpeakingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [transcript, setTranscript] = useState("So um, basically a process is like an isolated instance, right? And like, threads share the same memory.");
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    const state = await getOSState();
    if ((state as any).user) {
      setHistory((state as any).user.speaking || []);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFinish = async () => {
    setIsRecording(false);
    setLoading(true);
    const result = await saveSpeakingSession(currentPrompt, transcript);
    setSession(result);
    await fetchHistory();
    setLoading(false);
  };

  const nextPrompt = () => {
    const nextIdx = (PROMPTS.indexOf(currentPrompt) + 1) % PROMPTS.length;
    setCurrentPrompt(PROMPTS[nextIdx]);
    setSession(null);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Speaking <span className="text-gradient">Lab</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real technical articulation training powered by AI analysis.
        </p>
      </header>

      <div className={styles.labGrid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={`glass-card ${styles.recorderCard}`}>
            {!session ? (
              <>
                <div className={styles.promptCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.promptLabel}>Current Drill</span>
                    <button onClick={nextPrompt} style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 600 }}>NEXT PROMPT</button>
                  </div>
                  <p className={styles.promptText}>"{currentPrompt}"</p>
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
                    onClick={handleFinish}
                  >
                    Finish & Analyze
                  </button>
                )}
                {loading && <RefreshCw size={24} className="animate-spin" color="var(--accent-blue)" />}
              </>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} /> Analysis Results
                  </h3>
                  <button onClick={() => setSession(null)} style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none' }}>
                    <RotateCcw size={14} /> New Drill
                  </button>
                </div>

                <div className={styles.transcript}>
                  "{session.transcript}"
                </div>

                <div className={styles.scoreGrid} style={{ marginTop: '32px' }}>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Clarity</span>
                    <span className={styles.scoreValue} style={{ color: 'var(--accent-emerald)' }}>{session.scores.clarity}</span>
                  </div>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Pacing</span>
                    <span className={styles.scoreValue} style={{ color: 'var(--accent-blue)' }}>{session.scores.pacing}</span>
                  </div>
                  <div className={`glass-card ${styles.scoreItem}`}>
                    <span className={styles.scoreLabel}>Filler</span>
                    <span className={styles.scoreValue} style={{ color: session.scores.filler === 'Low' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{session.scores.filler}</span>
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
              {session?.feedback || "Start a drill to receive personalized feedback on your technical articulation."}
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
              {history.length > 0 ? history.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.topic}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{item.scores?.clarity || 'N/A'}</span>
                </div>
              )) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No history yet.</p>
              )}
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
