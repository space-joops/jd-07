import { Rocket, Map as MapIcon, ShoppingBag, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>
      
      {/* Header */}
      <header className="pt-12 px-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight">
            ASTROPET
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Level 12 <span className="mx-2 opacity-50">|</span> Energy: 85%</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-600/50 flex items-center justify-center overflow-hidden shadow-lg shadow-black/50">
          <span className="text-xl">🧑‍🚀</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start mt-8 px-6 z-10 w-full max-w-md mx-auto">
        
        {/* Pet Placeholder & Planet Glow */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
           {/* Planet glowing arc */}
           <div className="absolute bottom-[-20px] w-[180%] h-40 bg-blue-500/20 rounded-t-[100%] blur-3xl"></div>
           {/* Pet character (placeholder for 3D model / image) */}
           <div className="text-9xl relative z-10 animate-bounce drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">👽</div>
        </div>

        {/* Timer Card (Glassmorphism) */}
        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 mb-5 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient overlay for the glass card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-center text-slate-300 text-xs mb-2 font-semibold tracking-[0.2em] uppercase">Next Orbit In</p>
            <h2 className="text-center text-[3.5rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-3 drop-shadow-sm">
              10<span className="text-3xl">M</span> 32<span className="text-3xl">S</span>
            </h2>
            <p className="text-center text-slate-400 text-sm">Countdown to space adventure!</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 mb-24 shadow-xl">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">PET STATUS</p>
              <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Nova <span className="text-sm font-normal text-slate-400 ml-1">Lvl 14</span></h3>
            </div>
            <div className="text-right flex flex-col gap-1">
              <div className="text-sm text-slate-400"><span className="inline-block w-20 text-left">Health:</span> <span className="text-white font-semibold text-right inline-block w-10">92%</span></div>
              <div className="text-sm text-slate-400"><span className="inline-block w-20 text-left">Happiness:</span> <span className="text-white font-semibold text-right inline-block w-10">100%</span></div>
            </div>
          </div>
          
          <div className="mt-2">
             <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
               <span>Explore Moon Crater</span>
               <span className="text-cyan-400">68%</span>
             </div>
             <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-slate-700">
                <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 h-full rounded-full relative" style={{ width: '68%' }}>
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pb-safe pt-3 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto px-2 pb-5">
          <NavItem icon={<Rocket strokeWidth={1.5} size={26} />} label="Home" active />
          <NavItem icon={<MapIcon strokeWidth={1.5} size={26} />} label="Orbit" />
          <NavItem icon={<ShoppingBag strokeWidth={1.5} size={26} />} label="Craft" />
          <NavItem icon={<User strokeWidth={1.5} size={26} />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-cyan-400 transform scale-110' : 'text-slate-500 hover:text-slate-300 hover:scale-105'}`}>
      <div className={`p-1 rounded-xl ${active ? 'bg-cyan-400/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </button>
  );
}
