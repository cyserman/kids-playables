import React, { useState, useEffect, useRef } from 'react';
import { GameProject } from '../types';
import { generateGameCode, suggestGameIdeas } from '../services/geminiService';
import { Send, RefreshCw, Save, Code, Play, Smartphone, Monitor, Users, Zap, Volume2, Move } from 'lucide-react';

interface GameStudioProps {
  project: GameProject | null;
  onSave: (project: GameProject) => void;
  onBack: () => void;
  initialPrompt?: string; 
}

export const GameStudio: React.FC<GameStudioProps> = ({ project: initialProject, onSave, onBack, initialPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>(initialProject?.code || '');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hi Angie! I'm ready to help you build a game for the twins. What should we make today? Maybe a Hill Climber or Planet Smasher?" }
  ]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isTwinMode, setIsTwinMode] = useState(false); // New state for Twin Co-Pilot Mode
  const [projectName, setProjectName] = useState(initialProject?.name || 'Untitled Game');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialProject && !initialPrompt) {
      suggestGameIdeas().then(setSuggestions);
    }
  }, [initialProject, initialPrompt]);

  useEffect(() => {
    if (initialPrompt && !currentCode && !isGenerating) {
      handleAutoGenerate(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAutoGenerate = async (autoPrompt: string) => {
    setMessages(prev => [...prev, { role: 'user', text: autoPrompt }]);
    setIsGenerating(true);
    try {
      const newCode = await generateGameCode(autoPrompt, "");
      setCurrentCode(newCode);
      setMessages(prev => [...prev, { role: 'model', text: "I've generated the template for you! Check it out." }]);
      saveProject(newCode, autoPrompt);
    } catch(e) {
      setMessages(prev => [...prev, { role: 'model', text: "Error generating template." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsGenerating(true);

    try {
      const newCode = await generateGameCode(textToSend, currentCode);
      setCurrentCode(newCode);
      setMessages(prev => [...prev, { role: 'model', text: "Updated! How does it look now?" }]);
      saveProject(newCode, textToSend);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I had trouble generating the code. Please try again." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = (code: string, desc: string) => {
     const updatedProject: GameProject = {
        id: initialProject?.id || crypto.randomUUID(),
        name: projectName,
        description: desc.substring(0, 100) + '...',
        code: code,
        createdAt: initialProject?.createdAt || Date.now(),
        lastModified: Date.now(),
        tags: [],
        thumbnail: `linear-gradient(${Math.random() * 360}deg, #3b82f6, #8b5cf6)`
      };
      onSave(updatedProject);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(`Create a ${suggestion} game for 5 year olds.`);
  };

  return (
    <div className="flex h-full">
      {/* Left Panel: Chat & Controls */}
      <div className="w-[400px] flex flex-col border-r border-[#2a2a2a] bg-[#141414]">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
           <div className="flex-1 mr-4">
             <input 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent font-bold text-lg focus:outline-none focus:border-b border-blue-500 w-full"
            />
           </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsTwinMode(!isTwinMode)}
              className={`p-2 rounded-lg transition-colors ${isTwinMode ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-[#333]'}`}
              title="Twin Co-Pilot Mode"
            >
              <Users size={18} />
            </button>
            <button onClick={() => saveProject(currentCode, 'Manual Save')} className="text-gray-400 hover:text-white">
              <Save size={18} />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-[#2a2a2a] text-gray-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
               <div className="bg-[#2a2a2a] p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                 <RefreshCw className="animate-spin w-4 h-4 text-blue-400" />
                 <span className="text-sm text-gray-400">Coding the game...</span>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Controls Area */}
        <div className="p-4 border-t border-[#2a2a2a] bg-[#1a1a1a]">
          {isTwinMode ? (
            /* Twin Co-Pilot Mode UI */
            <div className="space-y-2">
              <p className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">Twin Co-Pilot Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleSend("Make the game faster!")}
                  disabled={isGenerating}
                  className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95"
                >
                  <Zap size={24} />
                  <span className="font-bold">Faster!</span>
                </button>
                <button 
                  onClick={() => handleSend("Add more explosions and particle effects!")}
                  disabled={isGenerating}
                  className="bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 text-orange-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95"
                >
                  <Users size={24} />
                  <span className="font-bold">Explode!</span>
                </button>
                <button 
                  onClick={() => handleSend("Change the colors to be bright neon!")}
                  disabled={isGenerating}
                  className="bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 text-green-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95"
                >
                  <Monitor size={24} />
                  <span className="font-bold">Colors!</span>
                </button>
                 <button 
                  onClick={() => handleSend("Add funny sound effects!")}
                  disabled={isGenerating}
                  className="bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/50 text-blue-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95"
                >
                  <Volume2 size={24} />
                  <span className="font-bold">Sounds!</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Text Input */
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe changes (e.g. 'Make the car red')"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-3 pr-10 min-h-[50px] max-h-[150px] resize-none focus:outline-none focus:border-blue-500 text-sm"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Preview/Code */}
      <div className="flex-1 bg-[#0a0a0a] flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-[#2a2a2a] flex items-center justify-between px-6 bg-[#0F0F0F]">
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg">
             <button 
               onClick={() => setViewMode('preview')}
               className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'preview' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <Play size={14} /> Preview
             </button>
             <button 
               onClick={() => setViewMode('code')}
               className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'code' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <Code size={14} /> Code
             </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-lg transition-colors ${deviceMode === 'mobile' ? 'text-blue-400 bg-blue-900/20' : 'text-gray-500 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone size={20} />
            </button>
            <button 
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-lg transition-colors ${deviceMode === 'desktop' ? 'text-blue-400 bg-blue-900/20' : 'text-gray-500 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
          {viewMode === 'preview' ? (
             currentCode ? (
              <div 
                className={`transition-all duration-300 shadow-2xl overflow-hidden bg-white ${
                  deviceMode === 'mobile' 
                    ? 'w-[375px] h-[667px] rounded-[3rem] border-8 border-gray-800' 
                    : 'w-full h-full max-w-4xl max-h-[600px] rounded-xl border border-gray-800'
                }`}
              >
                <iframe 
                  srcDoc={currentCode}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-modals"
                  title="Game Preview"
                />
              </div>
             ) : (
               <div className="text-center text-gray-500">
                 <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone size={32} className="opacity-50" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Ready to Build!</h3>
                 <p className="text-gray-400 max-w-xs mx-auto mb-6">
                   {initialPrompt ? "Generating your template..." : "Use the chat on the left to describe your game, or turn on 'Twin Co-Pilot' mode!"}
                 </p>
               </div>
             )
          ) : (
            <div className="w-full h-full max-w-5xl bg-[#141414] rounded-xl border border-[#2a2a2a] overflow-hidden flex flex-col">
              <textarea 
                className="w-full h-full bg-[#141414] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { Gamepad2 } from 'lucide-react';
