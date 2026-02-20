import React from 'react';
import { Gamepad2, LayoutDashboard, BookOpen, Rocket, GraduationCap, Mic } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  onChangeView: (view: View) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  return (
    <div className="flex h-screen bg-[#0F0F0F] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#2a2a2a] flex flex-col bg-[#0F0F0F]">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PlayableGenie</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === View.DASHBOARD}
            onClick={() => onChangeView(View.DASHBOARD)}
          />
          <NavItem 
            icon={<Gamepad2 size={20} />} 
            label="Game Studio" 
            active={currentView === View.STUDIO}
            onClick={() => onChangeView(View.STUDIO)}
          />
          <NavItem 
            icon={<Mic size={20} />} 
            label="Voice Brainstorm" 
            active={currentView === View.VOICE_ASSISTANT}
            onClick={() => onChangeView(View.VOICE_ASSISTANT)}
          />
          <NavItem 
            icon={<GraduationCap size={20} />} 
            label="Interactive Tutorial" 
            active={currentView === View.TUTORIAL}
            onClick={() => onChangeView(View.TUTORIAL)}
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Resources & Guide" 
            active={currentView === View.GUIDE}
            onClick={() => onChangeView(View.GUIDE)}
          />
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="bg-[#1F1F1F] rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Current User</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm font-medium">Angie</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ 
  icon, label, active, onClick 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-[#2a2a2a] text-white' 
        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);