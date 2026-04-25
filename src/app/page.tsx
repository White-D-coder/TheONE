import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Clock, 
  FileCode2, 
  Mic2, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { StatCard, ProgressCard, InsightCard } from '@/components/ui/DashboardCards';

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Welcome back, <span className="text-gradient">Engineer</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          System status: Optimal. High-leverage blocks identified.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <StatCard 
          title="Deep Work" 
          value="4.5h" 
          icon={Clock} 
          trend="+12% today" 
        />
        <StatCard 
          title="Worth Score" 
          value="842" 
          icon={TrendingUp} 
          trend="+15 this week" 
        />
        <StatCard 
          title="Commits" 
          value="12" 
          icon={FileCode2} 
          trend="Target: 8" 
        />
        <StatCard 
          title="Proof Artifacts" 
          value="3" 
          icon={ShieldCheck} 
          trend="2 pending review" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <ProgressCard 
            title="Role Weights & Routine Gravity" 
            items={[
              { label: 'Engineer (Technical Mastery)', value: 65, color: 'var(--accent-blue)' },
              { label: 'Builder (Shipping Projects)', value: 45, color: 'var(--accent-purple)' },
              { label: 'Communicator (Speaking/Writing)', value: 30, color: 'var(--accent-emerald)' },
              { label: 'Candidate (Job Search)', value: 15, color: 'var(--accent-amber)' },
            ]}
          />

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Active Project Pulse</h2>
              <button style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Vault <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Project: Adaptive Scheduler API</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', borderRadius: '4px' }}>BUILDING</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Implementing decay logic for skill-based routine generation.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '100%', height: '4px', background: 'var(--bg-surface)', borderRadius: '2px' }}>
                    <div style={{ width: '70%', height: '100%', background: 'var(--accent-blue)', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <InsightCard 
            text="You have solved 10 easy problems repeatedly this week. Your 'Difficulty Progression' is stagnating. Shift tomorrow's block to LeetCode Medium/Hard to maintain worth growth."
          />

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic2 size={16} />
              Speaking Lab Recap
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg Clarity</span>
                <span>8.2 / 10</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Filler Words</span>
                <span style={{ color: 'var(--accent-rose)' }}>High (Um, Like)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
                <span>Improving</span>
              </div>
            </div>
            <button className="glass-card" style={{ width: '100%', padding: '12px', marginTop: '20px', fontSize: '0.85rem', background: 'var(--grad-primary)', border: 'none', color: 'white', fontWeight: 600 }}>
              Start Drill
            </button>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Non-Negotiables</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" defaultChecked />
                <span>7h Sleep Baseline</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" defaultChecked />
                <span>90m Deep Work</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" />
                <span>30m Technical Reading</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" />
                <span>10m Speaking Drill</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
