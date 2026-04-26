import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  FileCode2, 
  Mic2, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { StatCard, ProgressCard, InsightCard } from '@/components/ui/DashboardCards';
import { getOSState, getDashboardStats } from '@/lib/actions';
import Link from 'next/link';

export default async function Dashboard() {
  const state = await getOSState();
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>System Offline</h2>
        <p>Please initialize your profile to start tracking.</p>
        <Link href="/settings">
          <button className="glass-card" style={{ padding: '12px 24px', background: 'var(--grad-primary)', border: 'none', color: 'white' }}>
            Complete Setup
          </button>
        </Link>
      </div>
    );
  }

  const roleWeights = state.roles as any;
  const user = state.user;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Welcome back, <span className="text-gradient">{user?.name || 'Engineer'}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          System status: **Optimal**. Active Focus: **{state.currentMode}**.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <StatCard 
          title="Deep Work" 
          value={stats.deepWorkHours} 
          icon={Clock} 
          trend={stats.deepWorkHours !== "0.0h" ? "Real-time log" : "No logs today"} 
        />
        <StatCard 
          title="Avg Skill Score" 
          value={stats.skillScore} 
          icon={TrendingUp} 
          trend={`Based on ${user?.skills.length || 0} skills`} 
        />
        <StatCard 
          title="Projects" 
          value={stats.activeProjects} 
          icon={FileCode2} 
          trend="In-flight builds" 
        />
        <StatCard 
          title="Evidence" 
          value={stats.evidenceCount} 
          icon={ShieldCheck} 
          trend="Verified proof" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <ProgressCard 
            title="Role Weights & Routine Gravity" 
            items={[
              { label: 'Engineer (Technical Mastery)', value: roleWeights.engineer, color: 'var(--accent-blue)' },
              { label: 'Builder (Shipping Projects)', value: roleWeights.builder, color: 'var(--accent-purple)' },
              { label: 'Communicator (Speaking/Writing)', value: roleWeights.communicator, color: 'var(--accent-emerald)' },
              { label: 'Candidate (Job Search)', value: roleWeights.candidate, color: 'var(--accent-amber)' },
            ]}
          />

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Active Project Pulse</h2>
              <Link href="/vault" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                View Vault <ArrowUpRight size={14} />
              </Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {user?.projects && user.projects.length > 0 ? user.projects.map((p: any) => (
                <div key={p.id} style={{ padding: '16px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', borderRadius: '4px' }}>{p.stage}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-surface)', borderRadius: '2px' }}>
                      <div style={{ width: p.stage === 'SHIPPED' ? '100%' : '60%', height: '100%', background: 'var(--accent-blue)', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>No projects detected.</p>
                  <Link href="/vault">
                    <button className="glass-card" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Start First Project</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <InsightCard 
            text={stats.latestInsight}
          />

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic2 size={16} />
              Speaking Lab Recap
            </h3>
            {user?.speaking && user.speaking.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Last Session</span>
                  <span>{new Date(user.speaking[0].createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Clarity Score</span>
                  <span>{user.speaking[0].scores?.clarity || '0'} / 10</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Filler Words</span>
                  <span style={{ color: user.speaking[0].scores?.filler === 'Low' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {user.speaking[0].scores?.filler || 'Pending'}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '10px 0', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                No practice sessions recorded yet.
              </div>
            )}
            <Link href="/speaking" style={{ textDecoration: 'none' }}>
              <button className="glass-card" style={{ width: '100%', padding: '12px', marginTop: '20px', fontSize: '0.85rem', background: 'var(--grad-primary)', border: 'none', color: 'white', fontWeight: 600 }}>
                Start Practice Drill
              </button>
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Non-Negotiables (Today)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* These should also be DB driven from Task model, but using as functional checklist for now */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={parseInt(stats.deepWorkHours) >= 1.5} readOnly />
                <span>90m Deep Work {parseInt(stats.deepWorkHours) >= 1.5 && '✅'}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={user?.evidences.length > 0} readOnly />
                <span>Log 1 Evidence {user?.evidences.length > 0 && '✅'}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={user?.speaking.length > 0} readOnly />
                <span>10m Speaking Drill</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
