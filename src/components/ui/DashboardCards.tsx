import React from 'react';
import { TrendingUp, Target, Zap, Clock } from 'lucide-react';
import styles from './DashboardCards.module.css';

export function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>
          <Icon size={16} />
          {title}
        </span>
        {trend && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem' }}>{trend}</span>}
      </div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}

export function ProgressCard({ title, items }: any) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
      </div>
      <div className={styles.progressContainer}>
        {items.map((item: any) => (
          <div key={item.label}>
            <div className={styles.progressLabel}>
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${item.value}%`, background: item.color }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightCard({ text }: any) {
  return (
    <div className={`glass-card ${styles.card} ${styles.insightCard}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle} style={{ color: 'var(--accent-blue)' }}>
          <Zap size={16} />
          AI MENTOR INSIGHT
        </span>
      </div>
      <p className={styles.insightText}>"{text}"</p>
    </div>
  );
}
