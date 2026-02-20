import React, { useEffect, useState } from 'react';
import { GameProject } from '../types';
import { Plus, Play, Download, Trash2, Zap, Palette, Rocket, Globe, Map, Box, Gamepad2 } from 'lucide-react';

interface DashboardProps {
  projects: GameProject[];
  onCreateNew: () => void;
  onOpenProject: (project: GameProject) => void;
  onDeleteProject: (id: string) => void;
  onExport: (project: GameProject) => void;
  onCreateFromTemplate: (title: string, prompt: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateNew, onOpenProject, onDeleteProject, onExport, onCreateFromTemplate }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, Angie!</h2>
            <p className="text-gray-400">Ready to make some games for the twins?</p>
          </div>
          <button 
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            <Plus size={20} />
            Create New Game
          </button>
        </div>

        {/* Templates Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            Quick Start Templates (Twin Approved)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <TemplateCard 
              title="Planet Smasher (Edu)" 
              description="Blow up planets & learn their names! Big booms + Space facts."
              icon={<Zap className="text-purple-400" />}
              color="bg-purple-500/10 border-purple-500/20"
              onClick={() => onCreateFromTemplate(
                "Planet Smasher Edu",
                "Create a 'Planet Smasher' clicker game. Center screen is a colorful planet (use real colors like Red for Mars). Clicking it creates particle explosions. IMPORTANT: When a planet explodes, show a text popup with its Name and a Fun Fact (e.g., 'Jupiter is the biggest!'). Then spawn the next planet. Add big buttons for 'Upgrade Clicker'."
              )}
            />
            <TemplateCard 
              title="State Racer Deluxe" 
              description="Race, Quiz & Learn! Includes 'Pit Stop' trivia and Map Explorer."
              icon={<Globe className="text-blue-400" />}
              color="bg-blue-500/10 border-blue-500/20"
              onClick={() => onCreateFromTemplate(
                "State Racer Deluxe",
                "Create a comprehensive 'State Racer Deluxe' game with a Main Menu offering 3 modes:\n\n1. RACE MODE: Vertical driving game avoiding obstacles. Every 15 seconds, trigger a 'Pit Stop': The car stops, and a multiple-choice question appears (e.g., 'Capital of Texas?'). Correct answer = Turbo Boost & Resume. Wrong answer = Slow resume.\n\n2. MAP CHALLENGE: Show the US Map. Prompt: 'Where is [State]?'. Player must tap the correct state. Score points for accuracy.\n\n3. LEARN MODE: Stress-free interactive map. Tap any state to see its Name, Capital, and a fun fact.\n\nDesign: Use a 'gameState' variable to switch views. Always show a 'Back to Menu' button. Big buttons for tablets."
              )}
            />
             <TemplateCard 
              title="State Master Quiz" 
              description="Interactive US Map. 3 Modes: Find State, Capitals, & Learn Mode."
              icon={<Map className="text-yellow-400" />}
              color="bg-yellow-500/10 border-yellow-500/20"
              onClick={() => onCreateFromTemplate(
                "State Master Quiz",
                "Create an interactive US Geography educational game. START SCREEN: 3 Big Buttons: 'Find the State', 'Capital Quiz', and 'Explore Mode'. \n\n1. Find the State: Show a simplified map of the USA. Prompt: 'Touch Florida!'. Player taps the map. Correct = Green Flash + Cheering. \n2. Capital Quiz: Show 'California'. Display 3 large text buttons with city options. \n3. Explore Mode: No pressure. Tapping any state on the map shows a popup with Name, Capital, and a fun fact. \n\nEnsure buttons are large for tablets."
              )}
            />
            <TemplateCard 
              title="3D Sky Roller" 
              description="Roll a ball through a neon 3D obstacle course."
              icon={<Gamepad2 className="text-cyan-400" />}
              color="bg-cyan-500/10 border-cyan-500/20"
              onClick={() => onCreateFromTemplate(
                "3D Sky Roller",
                "Create a 3D Rolling Ball game using Three.js (via CDN). The player controls a rolling ball on a narrow 3D track floating in space. \n\nControls: Large Left/Right buttons at the bottom of the screen to steer the ball.\n\nGameplay: The ball moves forward automatically. The player must steer to stay on the track and avoid obstacles (static red cubes). Collect blue gems (small spheres) for points. \n\nCamera: Follow the ball from behind (3rd person view). \n\nFail state: If the ball falls off the edge of the track (y < -5), show 'Game Over' and a Restart button. \n\nVisuals: Use a 'Synthwave' aesthetic: Purple sky, neon grid floor."
              )}
            />
            <TemplateCard 
              title="3D Sphere Garden" 
              description="Satisfying 3D ball grower. Click to grow, release to drop."
              icon={<Box className="text-pink-400" />}
              color="bg-pink-500/10 border-pink-500/20"
              onClick={() => onCreateFromTemplate(
                "3D Sphere Garden",
                "Create a satisfying 3D interactive toy using HTML5 Canvas. Visuals: Use radial gradients on circles to simulate 3D spheres with lighting. Gameplay: The player touches/clicks anywhere to spawn a small sphere. Holding down makes the sphere grow larger. Releasing drops the sphere into the box. Physics: The spheres should have gravity and bounce off each other and the walls. If a growing sphere touches another sphere, the growing stops (or it pops). Add satisfying 'pop' and 'bounce' sounds."
              )}
            />
             <TemplateCard 
              title="Draw Your Racer" 
              description="Draw a shape and watch it race downhill."
              icon={<Palette className="text-green-400" />}
              color="bg-green-500/10 border-green-500/20"
              onClick={() => onCreateFromTemplate(
                "Draw Racer",
                "Create a drawing racing game. Phase 1: A large canvas box appears. Player draws a continuous line. This line becomes the wheel/body. Phase 2: The shape drops onto a hill and rolls down. Add a 'Redraw' button to try a new shape instantly."
              )}
            />
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-4">
           <h3 className="text-xl font-bold mb-4">Your Projects</h3>
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-gray-700 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No games yet</h3>
            <p className="text-gray-500 mb-6">Pick a template above or start from scratch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#444] transition-all cursor-pointer flex flex-col h-64"
                onClick={() => onOpenProject(project)}
              >
                <div 
                  className="h-32 w-full relative"
                  style={{ background: project.thumbnail || 'linear-gradient(45deg, #2b2b2b 25%, #383838 25%, #383838 50%, #2b2b2b 50%, #2b2b2b 75%, #383838 75%, #383838 100%)', backgroundSize: '20px 20px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                    <Play className="fill-white text-white w-12 h-12" />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1 truncate">{project.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      {new Date(project.lastModified).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); onExport(project); }}
                        className="p-2 hover:bg-[#333] rounded-full text-gray-400 hover:text-white"
                        title="Download HTML"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                        className="p-2 hover:bg-[#333] rounded-full text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TemplateCard: React.FC<{ title: string; description: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, description, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-xl border cursor-pointer hover:scale-[1.02] transition-transform ${color}`}
  >
    <div className="mb-4 bg-[#0F0F0F]/50 w-12 h-12 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);
