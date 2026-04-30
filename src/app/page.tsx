import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  FileCode2, 
  Mic2, 
  ShieldCheck,
  ArrowUpRight,
  Code,
  Trophy,
  Terminal,
  FileText,
  Play,
  Send
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
    <div className="animate-slide-up">
      <header style={{ marginBottom: '48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 112, 243, 0.1) 0%, transparent 70%)', zIndex: -1 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(0, 255, 189, 0.1)', color: 'var(--accent-emerald)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(0, 255, 189, 0.2)' }}>SYSTEM ONLINE</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>MODE: {state.currentMode}</span>
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.04em' }}>
          Welcome back, <span className="text-gradient">{user?.name || 'Engineer'}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>
          Your performance is <span style={{ color: 'white', fontWeight: 600 }}>{stats.deepWorkHours !== "0.0h" ? 'active' : 'stabilizing'}</span>. You have <span style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>{user?.evidences.length || 0}</span> verified signals in your vault.
        </p>

        {!stats.githubConsistency?.committedToday && (
          <div className="glass-card animate-float" style={{ marginTop: '24px', padding: '16px 24px', background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-rose)', boxShadow: '0 0 10px var(--accent-rose)' }}></div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--accent-rose)', fontSize: '0.9rem' }}>CONSISTENCY ALERT</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No GitHub commits detected for the current session. Ship code to maintain your streak.</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>CONSISTENCY SCORE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.githubConsistency?.score}%</div>
            </div>
          </div>
        )}
      </header>

      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {['CODE', 'DSA', 'CONTENT', 'ROUTINE'].map(type => {
            const streak = stats.streaks?.find((s: any) => s.type === type);
            const count = streak?.currentCount || 0;
            const isZero = count === 0;
            return (
              <div key={type} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', opacity: isZero ? 0.6 : 1, border: isZero ? '1px solid var(--border-subtle)' : '1px solid var(--accent-blue)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isZero ? 'var(--bg-surface)' : 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {type === 'CODE' && <Code size={16} color={isZero ? 'var(--text-tertiary)' : 'var(--accent-blue)'} />}
                  {type === 'DSA' && <Trophy size={16} color={isZero ? 'var(--text-tertiary)' : 'var(--accent-amber)'} />}
                  {type === 'CONTENT' && <Send size={16} color={isZero ? 'var(--text-tertiary)' : 'var(--accent-emerald)'} />}
                  {type === 'ROUTINE' && <Clock size={16} color={isZero ? 'var(--text-tertiary)' : 'var(--accent-purple)'} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 800 }}>{type} STREAK</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{count} Days</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <StatCard 
          title="Deep Work" 
          value={stats.deepWorkHours} 
          icon={Clock} 
          trend={stats.deepWorkHours !== "0.0h" ? "Real-time log" : "No logs today"} 
        />
        <StatCard 
          title="Market Worth" 
          value={stats.worthScore} 
          icon={TrendingUp} 
          trend={`$${(stats.worthScore * 50).toLocaleString()} potential`} 
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
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Professional Signal Feed</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>LIVE SYNC ACTIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {user?.evidences && user.evidences.length > 0 ? user.evidences.slice(0, 5).map((e: any) => (
                <div key={e.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                    {e.source === 'GITHUB' && <Code size={16} color="var(--accent-blue)" />}
                    {e.source === 'LEETCODE' && <Trophy size={16} color="var(--accent-amber)" />}
                    {e.source === 'CODEFORCES' && <Terminal size={16} color="var(--accent-purple)" />}
                    {e.source === 'MEDIUM' && <FileText size={16} color="var(--accent-emerald)" />}
                    {e.source === 'YOUTUBE' && <Play size={16} color="#FF0000" />}
                    {!['GITHUB', 'LEETCODE', 'CODEFORCES', 'MEDIUM', 'YOUTUBE'].includes(e.source) && <ShieldCheck size={16} color="var(--accent-blue)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{e.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{e.source} • {new Date(e.createdAt).toLocaleDateString()}</div>
                  </div>
                  <ArrowUpRight size={14} color="var(--text-tertiary)" />
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  No signals detected. Connect platforms in the Vault.
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={parseFloat(stats.deepWorkHours) >= 1.5} readOnly />
                <span>90m Deep Work {parseFloat(stats.deepWorkHours) >= 1.5 && '✅'}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={user?.evidences.length > 0} readOnly />
                <span>Log 1 Evidence {user?.evidences.length > 0 && '✅'}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={user?.speaking.length > 0} readOnly />
                <span>Speaking Drill Performance</span>
              </label>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={16} color="var(--accent-blue)" />
              Application Pulse
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.applicationCount}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Active roles in pipeline.
            </p>
            <Link href="/applications">
              <button className="glass-card" style={{ width: '100%', padding: '10px', marginTop: '16px', fontSize: '0.8rem' }}>
                Manage Pipeline
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
