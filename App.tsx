import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { GameStudio } from './components/GameStudio';
import { Guide } from './components/Guide';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { VoiceAssistant } from './components/VoiceAssistant';
import { View, GameProject } from './types';
import { generateGameCode } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [currentProject, setCurrentProject] = useState<GameProject | null>(null);
  
  // Initialize projects from LocalStorage to ensure persistence
  const [projects, setProjects] = useState<GameProject[]>(() => {
    try {
      const saved = localStorage.getItem('pg_projects');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load projects", e);
      return [];
    }
  });

  // Save to LocalStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem('pg_projects', JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save projects", e);
    }
  }, [projects]);

  const handleCreateNew = () => {
    setCurrentProject(null);
    setCurrentView(View.STUDIO);
  };

  const handleCreateFromTemplate = async (title: string, prompt: string) => {
    // Create a placeholder project
    const newProject: GameProject = {
      id: crypto.randomUUID(),
      name: title,
      description: 'Generating from template...',
      code: '',
      createdAt: Date.now(),
      lastModified: Date.now(),
      tags: ['template'],
      thumbnail: `linear-gradient(${Math.random() * 360}deg, #3b82f6, #8b5cf6)`
    };
    
    // Set it as current so we switch to studio
    setCurrentProject(newProject);
    setCurrentView(View.STUDIO);
  };

  const [templatePrompt, setTemplatePrompt] = useState<string>("");

  const handleCreateTemplateWrapper = (title: string, prompt: string) => {
    setTemplatePrompt(prompt);
    const newProject: GameProject = {
      id: crypto.randomUUID(),
      name: title,
      description: 'Template Project',
      code: '',
      createdAt: Date.now(),
      lastModified: Date.now(),
      tags: ['template'],
    };
    setCurrentProject(newProject);
    setCurrentView(View.STUDIO);
  };

  const handleOpenProject = (project: GameProject) => {
    setTemplatePrompt(""); // Clear template prompt
    setCurrentProject(project);
    setCurrentView(View.STUDIO);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
      setCurrentView(View.DASHBOARD);
    }
  };

  const handleSaveProject = (project: GameProject) => {
    setProjects(prev => {
      const existing = prev.find(p => p.id === project.id);
      if (existing) {
        return prev.map(p => p.id === project.id ? project : p);
      }
      return [...prev, project];
    });
    setCurrentProject(project);
  };

  const handleExport = (project: GameProject) => {
    const blob = new Blob([project.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {currentView === View.DASHBOARD && (
        <Dashboard 
          projects={projects}
          onCreateNew={handleCreateNew}
          onOpenProject={handleOpenProject}
          onDeleteProject={handleDeleteProject}
          onExport={handleExport}
          onCreateFromTemplate={handleCreateTemplateWrapper}
        />
      )}
      {currentView === View.STUDIO && (
        <GameStudio 
          project={currentProject}
          onSave={handleSaveProject}
          onBack={() => setCurrentView(View.DASHBOARD)}
          initialPrompt={templatePrompt}
        />
      )}
      {currentView === View.TUTORIAL && (
        <InteractiveTutorial />
      )}
      {currentView === View.GUIDE && (
        <Guide />
      )}
      {currentView === View.VOICE_ASSISTANT && (
        <VoiceAssistant onCreateGame={handleCreateTemplateWrapper} />
      )}
    </Layout>
  );
};

export default App;