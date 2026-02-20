import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Play, Code, UploadCloud, DollarSign } from 'lucide-react';

export const InteractiveTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "The Concept",
      icon: <CheckCircle />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">Every great game starts with a simple idea.</p>
          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            <h4 className="font-bold mb-2">Exercise: Refine your idea</h4>
            <p className="text-sm text-gray-400 mb-4">Which of these is the best prompt for an AI game generator?</p>
            <div className="space-y-2">
              <Option text="Make a fun game." isCorrect={false} feedback="Too vague! The AI needs specifics." />
              <Option text="A racing game with cars." isCorrect={false} feedback="Better, but what kind of cars? 2D or 3D?" />
              <Option text="A 2D side-scrolling racing game where a monster truck crushes old cars to get points." isCorrect={true} feedback="Perfect! Specific mechanics and visual style." />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Using the Studio",
      icon: <Code />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">The Game Studio is where the magic happens.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333]">
              <h4 className="font-bold text-blue-400 mb-2">1. Prompt</h4>
              <p className="text-sm text-gray-400">Describe what you want in plain English. "Make the car faster" or "Add background music".</p>
            </div>
            <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333]">
              <h4 className="font-bold text-green-400 mb-2">2. Preview</h4>
              <p className="text-sm text-gray-400">See your changes instantly on the right. Toggle between Mobile and Desktop views.</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 italic">Tip: If the game breaks, just click the Undo button or ask the AI to "Fix the last change".</p>
        </div>
      )
    },
    {
      title: "Publishing",
      icon: <UploadCloud />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">Getting your game on YouTube Playables.</p>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li className="p-2 bg-[#1a1a1a] rounded">Export your game as a single HTML file from the Dashboard.</li>
            <li className="p-2 bg-[#1a1a1a] rounded">Ensure your file size is under 5MB for fast loading.</li>
            <li className="p-2 bg-[#1a1a1a] rounded">Submit through the YouTube Studio Playables submission form (currently in beta/invite only for some).</li>
            <li className="p-2 bg-[#1a1a1a] rounded">Test on the actual YouTube app to ensure touch controls work.</li>
          </ol>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interactive Bootcamp</h1>
        <p className="text-gray-400">Master the art of Playable creation in 3 simple steps.</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Steps */}
        <div className="w-64 space-y-4">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                currentStep === index
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : completedSteps.includes(index)
                  ? 'bg-[#1a1a1a] border-green-900 text-green-400'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">Step {index + 1}</span>
                {completedSteps.includes(index) && <CheckCircle size={16} />}
              </div>
              <div className="text-sm mt-1">{step.title}</div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#2a2a2a] rounded-lg">
              {steps[currentStep].icon}
            </div>
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
          </div>
          
          <div className="flex-1">
            {steps[currentStep].content}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Option: React.FC<{ text: string; isCorrect: boolean; feedback: string }> = ({ text, isCorrect, feedback }) => {
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const handleClick = () => {
    setStatus(isCorrect ? 'correct' : 'incorrect');
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full text-left p-3 rounded border transition-colors ${
          status === 'idle' ? 'bg-[#1a1a1a] border-[#333] hover:border-[#555]' :
          status === 'correct' ? 'bg-green-900/20 border-green-500 text-green-200' :
          'bg-red-900/20 border-red-500 text-red-200'
        }`}
      >
        {text}
      </button>
      {status !== 'idle' && (
        <p className={`text-xs mt-1 ml-2 ${status === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
          {feedback}
        </p>
      )}
    </div>
  );
};
