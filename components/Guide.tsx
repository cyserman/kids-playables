import React from 'react';
import { CheckCircle, AlertTriangle, Zap, Youtube, DollarSign, Target, Gift, HelpCircle, Tablet } from 'lucide-react';

export const Guide: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-600/20 rounded-xl">
           <Youtube className="text-red-600 w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Resources & Guide</h1>
          <p className="text-gray-400">Everything Angie needs to know about making and selling games.</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Play on Tablet Section */}
        <section className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
            <Tablet className="text-green-400" /> How to Play on Tablets (Right Now)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              Want the boys to play these games on their iPads or Tablets immediately? Here is the secret trick:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-300 bg-[#1a1a1a]/50 p-6 rounded-xl">
              <li className="pl-2">
                <strong>Download:</strong> Click the <span className="inline-block bg-[#333] px-2 py-0.5 rounded text-xs">Download HTML</span> button in the Dashboard.
              </li>
              <li className="pl-2">
                <strong>Transfer:</strong> Email the file to yourself, or upload it to Google Drive.
              </li>
              <li className="pl-2">
                <strong>Open:</strong> Open the email/Drive on the tablet and tap the file. It will open in the browser.
              </li>
              <li className="pl-2">
                <strong>Pro Move:</strong> Tap the "Share" button in the browser and select <strong>"Add to Home Screen"</strong>. This turns the game into a customized app icon they can tap anytime!
              </li>
            </ol>
          </div>
        </section>

        {/* Strategy FAQ - New Section */}
        <section className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
            <HelpCircle className="text-blue-400" /> Angie's Strategy FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-blue-200 mb-2">Is it worth the effort? Does it pay?</h3>
              <p className="text-gray-300 leading-relaxed">
                <strong>Yes, absolutely.</strong> Unlike Android/iOS apps which take weeks to develop and approve, Playables are instant. 
                The model here is <em>Volume</em>. Instead of spending 6 months on one game, you can make 5 simple games a week. 
                Even if each game only makes a few dollars a day from ads, having 50 games adds up to a significant passive income stream.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-blue-200 mb-2">Should I make YouTube Playlists?</h3>
              <p className="text-gray-300 leading-relaxed">
                <strong>100% Yes.</strong> Playlists are the secret sauce. 
                Create a "Twin Gaming" playlist. Put your game at the top, followed by videos of the twins playing it (if you film them), 
                or other similar games. This keeps kids in your ecosystem. 
                <br/><br/>
                <em>Pro Tip:</em> Make a "Geography Games" playlist mixing your State Racer with educational videos about states.
              </p>
            </div>
             <div>
              <h3 className="font-bold text-lg text-blue-200 mb-2">How do I make it easier for us?</h3>
              <p className="text-gray-300 leading-relaxed">
                Use the <strong>"Twin Co-Pilot"</strong> mode in the Game Studio. It lets the boys click big buttons to change the game 
                (like "More Explosions" or "Faster"). This turns <em>making</em> the game into a game itself!
              </p>
            </div>
          </div>
        </section>

        {/* Monetization Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-400">
            <DollarSign /> Monetization Strategy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
              <div className="mb-4 bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center text-green-400">
                <Target size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Ads</h3>
              <p className="text-sm text-gray-400 mb-4">The easiest way to start.</p>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• <strong>Interstitial:</strong> Show between levels.</li>
                <li>• <strong>Rewarded:</strong> "Watch ad to revive". Best for engagement.</li>
                <li>• <strong>Banner:</strong> Avoid in gameplay area.</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
              <div className="mb-4 bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center text-purple-400">
                <Gift size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">In-App Purchases</h3>
              <p className="text-sm text-gray-400 mb-4">Selling virtual goods.</p>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• <strong>Cosmetics:</strong> Skins for the hill climber car.</li>
                <li>• <strong>Power-ups:</strong> "Magnet" to attract coins.</li>
                <li>• <strong>No Ads:</strong> A one-time purchase to remove ads.</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
              <div className="mb-4 bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center text-blue-400">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Sponsorships</h3>
              <p className="text-sm text-gray-400 mb-4">Brand deals.</p>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• <strong>Branded Items:</strong> Use a specific toy brand car.</li>
                <li>• <strong>Themed Levels:</strong> A level designed around a movie.</li>
                <li>• <strong>Direct Deals:</strong> Harder to get but high value.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Requirements */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            Technical "Must Haves"
          </h2>
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a]">
              <p className="text-gray-300">
                YouTube Playables are strict about performance. Since the twins play on tablets, optimization is key.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-r border-[#2a2a2a] border-b md:border-b-0">
                <h3 className="font-bold mb-4 text-blue-400">Do This</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> 
                    <span><strong>Canvas API:</strong> Use HTML5 Canvas for rendering. It's fast and universally supported.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> 
                    <span><strong>AudioContext:</strong> Use Web Audio API. Browsers block auto-play audio, so initialize it on the first click.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> 
                    <span><strong>Touch Events:</strong> Support `touchstart` and `touchend`. Buttons need to be BIG (80px+).</span>
                  </li>
                </ul>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-4 text-red-400">Avoid This</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" /> 
                    <span><strong>Heavy Frameworks:</strong> Avoid full Unity builds if possible. They take too long to load.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" /> 
                    <span><strong>Complex Shaders:</strong> Keep graphical effects simple for older tablets.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
