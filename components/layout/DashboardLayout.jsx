'use client';

import Sidebar from './Sidebar';
import AppBar from './AppBar';

export default function DashboardLayout({ children, user }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppBar user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}