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
import { getOSState } from '@/lib/actions';
import styles from './Sidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Target, label: 'Identity & Mode', href: '/identity' },
  { icon: Cpu, label: 'Routine Engine', href: '/routine' },
  { icon: Briefcase, label: 'Evidence Vault', href: '/vault' },
  { icon: TrendingUp, label: 'Skill Matrix', href: '/skills' },
  { icon: Mic2, label: 'Speaking Lab', href: '/speaking' },
  { icon: ShieldCheck, label: 'Worth Impact', href: '/worth' },
  { icon: Terminal, label: 'Knowledge Feed', href: '/content' },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
  { icon: Briefcase, label: 'Opportunities', href: '/opportunities' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      const state = await getOSState();
      setUser((state as any).user);
    }
    load();
  }, []);

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
          <div className={styles.avatar} style={{ background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
            {user?.name?.[0] || 'E'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Loading...'}</span>
            <span className={styles.userRole}>Engineer OS Active</span>
          </div>
          <Settings size={16} className={styles.navItem} style={{ marginLeft: 'auto', padding: 0 }} />
        </div>
      </div>
    </aside>
  );
}
