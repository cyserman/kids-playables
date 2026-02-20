import React, { useRef, useState, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Volume2, Activity, Zap, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

interface VoiceAssistantProps {
  onCreateGame: (title: string, description: string) => void;
}

interface TranscriptItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  isPartial: boolean;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCreateGame }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  
  // Refs for audio handling and state
  const nextStartTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const currentTranscriptRef = useRef<{ user: string; model: string }>({ user: '', model: '' });
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const handleConnect = async () => {
    setError(null);
    try {
      // 1. Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Define Tools
      const createGameTool: FunctionDeclaration = {
        name: "create_game",
        description: "Creates a new game project in the studio based on the user's description. Use this when the user explicitly confirms they want to build a specific game idea. E.g. 'Yes, let's build that dinosaur game!'",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, catchy title for the game.",
            },
            description: {
              type: Type.STRING,
              description: "A detailed description of the game mechanics, visuals, and educational elements to be passed to the game generator.",
            },
          },
          required: ["title", "description"],
        },
      };

      // 4. Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Session opened');
            setIsConnected(true);
            setTranscripts([{
              id: 'init',
              role: 'model',
              text: "Hi! I'm Genie. I can help you brainstorm and build games for the twins. What should we make today?",
              isPartial: false
            }]);
            
            // Setup Input Stream Processing
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Tool Calls (Game Creation)
            if (message.toolCall) {
              console.log('Tool call received:', message.toolCall);
              const functionCalls = message.toolCall.functionCalls;
              
              if (functionCalls && functionCalls.length > 0) {
                 const call = functionCalls[0];
                 if (call.name === 'create_game') {
                    const { title, description } = call.args as any;
                    
                    // Respond to model
                    if (sessionPromiseRef.current) {
                      sessionPromiseRef.current.then(session => {
                        session.sendToolResponse({
                          functionResponses: [
                            {
                              id: call.id,
                              name: call.name,
                              response: { result: "Game creation started successfully. Redirecting user to studio." }
                            }
                          ]
                        });
                      });
                    }

                    // Provide UI Feedback
                    setTranscripts(prev => [...prev, {
                      id: crypto.randomUUID(),
                      role: 'model',
                      text: `🚀 Starting project: ${title}...`,
                      isPartial: false
                    }]);

                    // Execute Action (Delay slightly to allow audio response to finish if any)
                    setTimeout(() => {
                      handleDisconnect(); // Clean disconnect
                      onCreateGame(title, description);
                    }, 2000);
                 }
              }
            }

            // Handle Transcriptions
            const serverContent = message.serverContent;
            if (serverContent) {
              if (serverContent.modelTurn) {
                const parts = serverContent.modelTurn.parts;
                for (const part of parts) {
                  if (part.text) {
                     currentTranscriptRef.current.model += part.text;
                     updateTranscript('model', currentTranscriptRef.current.model, true);
                  }
                }
              }

              if (serverContent.turnComplete) {
                // Finalize model turn
                if (currentTranscriptRef.current.model) {
                  updateTranscript('model', currentTranscriptRef.current.model, false);
                  currentTranscriptRef.current.model = '';
                }
                // Finalize user turn (if any pending, though usually handled via inputTranscription)
                if (currentTranscriptRef.current.user) {
                  updateTranscript('user', currentTranscriptRef.current.user, false);
                  currentTranscriptRef.current.user = '';
                }
              }
            }

            // Handle Input Transcription (User Speech)
            // Note: In current API version, this might come in different messages
            if ((message as any).serverContent?.inputTranscription) {
               const text = (message as any).serverContent.inputTranscription.text;
               if (text) {
                 currentTranscriptRef.current.user += text;
                 // Assuming input transcription is streamed, we treat it as partial until we see a response or turn complete
                 updateTranscript('user', currentTranscriptRef.current.user, true);
               }
            }


             // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputCtx) {
              setIsSpeaking(true);
              // Simple timeout to toggle "isSpeaking" visual off after a bit if no new audio comes
              setTimeout(() => setIsSpeaking(false), 500);

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputCtx,
                24000,
                1
              );
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              console.log("Interrupted!");
              for (const src of sourcesRef.current) {
                src.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              currentTranscriptRef.current.model = ''; // Clear pending model text on interrupt
            }
          },
          onclose: () => {
            console.log('Session closed');
            setIsConnected(false);
          },
          onerror: (err: any) => {
            console.error('Session error:', err);
            setError("Connection error. Please try again.");
            setIsConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          // Enable Transcriptions
          inputAudioTranscription: { model: "gemini-2.5-flash-latest" }, 
          // Note: outputAudioTranscription is implied/automatic in some versions, but we parse modelTurn.parts.text if available.
          // Currently, the Live API sends text in modelTurn ONLY if we ask for it or it's implicitly part of the modality response?
          // Actually, responseModalities: [Modality.AUDIO] implies we mostly get audio. 
          // To get text transcription of the model's audio, we need outputAudioTranscription config.
          outputAudioTranscription: { model: "gemini-2.5-flash-latest" },
          
          systemInstruction: "You are 'Genie', an enthusiastic AI game design partner for Angie. \n" +
            "Your goal is to help brainstorm fun HTML5 game ideas for her 5-year-old twin boys.\n" + 
            "Topics: Dinosaurs, Space, Cars, Colors, Shapes.\n" +
            "When Angie likes an idea, say 'Great! I'm opening the studio to build that now.' and call the `create_game` tool with a descriptive title and detailed prompt.\n" +
            "Keep responses concise and conversational.",
          tools: [{ functionDeclarations: [createGameTool] }],
        },
      };

      // Start Connection
      sessionPromiseRef.current = ai.live.connect(config);
      
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to connect microphone");
    }
  };

  const updateTranscript = (role: 'user' | 'model', text: string, isPartial: boolean) => {
    setTranscripts(prev => {
      const last = prev[prev.length - 1];
      if (last && last.role === role && last.isPartial) {
        // Update existing partial
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { ...last, text, isPartial };
        return newHistory;
      } else {
        // Append new
        return [...prev, { id: crypto.randomUUID(), role, text, isPartial }];
      }
    });
  };

  const handleDisconnect = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close());
      sessionPromiseRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setTranscripts([]);
    currentTranscriptRef.current = { user: '', model: '' };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px] transition-all duration-1000 ${isConnected ? 'opacity-100' : 'opacity-0'}`} />
         {isSpeaking && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] animate-pulse" />
         )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 z-10">
        
        {/* Visualizer Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
           {!isConnected ? (
             <div className="text-center space-y-6">
               <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto border-4 border-[#222] shadow-xl">
                 <Mic size={40} className="text-gray-500" />
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-white mb-2">Hello, Angie!</h2>
                 <p className="text-gray-400">I'm Genie. Ready to brainstorm?</p>
               </div>
               <button
                  onClick={handleConnect}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                >
                  <Mic size={20} />
                  <span>Start Conversation</span>
                </button>
             </div>
           ) : (
             <div className="text-center space-y-8">
                {/* Active Visualizer */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                   {/* Ripple Effect */}
                   {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`absolute inset-0 border-2 border-blue-500/30 rounded-full ${isSpeaking ? 'animate-ping' : ''}`}
                        style={{ animationDuration: `${2 + i}s`, animationDelay: `${i * 0.5}s` }}
                      />
                   ))}
                   
                   {/* Core Circle */}
                   <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-transform duration-100 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                      <Sparkles size={40} className="text-white animate-pulse" />
                   </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-blue-200">
                    {isSpeaking ? "Genie is speaking..." : "Listening..."}
                  </h3>
                  <button 
                    onClick={handleDisconnect}
                    className="mt-6 px-6 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-red-400 rounded-full text-sm font-medium transition-colors border border-red-900/30"
                  >
                    End Session
                  </button>
                </div>
             </div>
           )}
        </div>

        {/* Transcript Area */}
        {isConnected && (
          <div className="h-[300px] bg-[#141414]/80 backdrop-blur-md border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col shadow-2xl mt-8">
            <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/50 flex items-center gap-2">
               <MessageSquare size={16} className="text-gray-400" />
               <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Transcript</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
               {transcripts.length === 0 && (
                 <div className="text-center text-gray-600 mt-10 italic">
                   Conversation will appear here...
                 </div>
               )}
               {transcripts.map((t) => (
                 <div key={t.id} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div 
                    className={`max-w-[80%] p-3 rounded-xl ${
                      t.role === 'user' 
                        ? 'bg-[#2a2a2a] text-gray-200 rounded-tr-sm' 
                        : 'bg-blue-900/20 border border-blue-500/20 text-blue-100 rounded-tl-sm'
                    } ${t.isPartial ? 'opacity-70' : 'opacity-100'}`}
                   >
                     {t.text}
                     {t.isPartial && <span className="inline-block w-1.5 h-3 ml-1 bg-current animate-pulse align-middle" />}
                   </div>
                 </div>
               ))}
               <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

      </div>
      
      {/* Error Toast */}
      {error && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
           <Activity size={18} />
           <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// --- Audio Helper Functions ---

function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
