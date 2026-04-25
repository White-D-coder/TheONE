'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Terminal, 
  Mic2, 
  Briefcase, 
  FileCode2, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  Settings,
  Cpu
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Control Center', href: '/' },
  { icon: Target, label: 'Identity & Mode', href: '/identity' },
  { icon: Cpu, label: 'Routine Engine', href: '/routine' },
  { icon: FileCode2, label: 'Execution Tracker', href: '/tracker' },
  { icon: Briefcase, label: 'Evidence Vault', href: '/vault' },
  { icon: TrendingUp, label: 'Skill Progress', href: '/skills' },
  { icon: Mic2, label: 'Speaking Lab', href: '/speaking' },
  { icon: ShieldCheck, label: 'Public Proof', href: '/proof' },
  { icon: TrendingUp, label: 'Analytics & Review', href: '/analytics' },
  { icon: Terminal, label: 'Opportunities', href: '/opportunities' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Cpu size={20} color="white" />
        </div>
        <span>Engineer OS</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Elite Student</span>
            <span className={styles.userRole}>Engineer | Builder</span>
          </div>
          <Settings size={16} className={styles.navItem} style={{ marginLeft: 'auto', padding: 0 }} />
        </div>
      </div>
    </aside>
  );
}
