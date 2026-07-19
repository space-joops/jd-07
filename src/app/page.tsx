"use client";

import { useState, useEffect, useRef } from "react";
import { Rocket, Map as MapIcon, ShoppingBag, User, Loader2 } from "lucide-react";

const INITIAL_TIME = parseInt(process.env.NEXT_PUBLIC_TIMER_SECONDS || "632", 10);

export default function Home() {
  // State to determine if the user has completed onboarding
  const [hasPet, setHasPet] = useState(false);
  
  // Onboarding states
  const [inviteCode, setInviteCode] = useState("");
  const [isHatching, setIsHatching] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Timer & AR states
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isGoldenTime, setIsGoldenTime] = useState(false);
  const [arMode, setArMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // AR Camera initialization
  useEffect(() => {
    if (arMode && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Error accessing camera:", err));
    }
  }, [arMode]);

  // PWA & Push Notification Setup
  useEffect(() => {
    // 1. Detect PWA installation and request notification permission
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Astropet 설치 완료! 🚀', {
              body: '앱 설치가 완료되었습니다. 이제 상공 통과 알림을 받을 수 있습니다!',
            });
          }
        });
      }
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // 2. Auto-update on new deployment (Service Worker controller change)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
         window.location.reload();
      });
    }

    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  useEffect(() => {
    if (!hasPet || isGoldenTime) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGoldenTime(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasPet, isGoldenTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return { m, s };
  };

  const { m, s } = formatTime(timeLeft);

  const handleHatch = () => {
    if (inviteCode.trim().length < 4) return;
    setIsHatching(true);
    
    // Simulate network delay and hatching animation
    setTimeout(() => {
      setHasPet(true);
    }, 2500);
  };

  // ----------------------------------------------------
  // ONBOARDING SCREEN
  // ----------------------------------------------------
  if (!hasPet) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex flex-col items-center justify-center px-6">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen"></div>

        <div className="z-10 flex flex-col items-center w-full max-w-sm">
          <h1 className="text-sm font-semibold tracking-[0.3em] text-cyan-400 mb-12 text-center uppercase">
            Astropet Protocol
          </h1>

          {/* Glowing Egg / Capsule */}
          <div className="relative w-48 h-64 mb-12 flex items-center justify-center">
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-blue-500/30 rounded-full blur-3xl transition-all duration-700 ${isHatching ? 'bg-cyan-400/60 scale-150' : 'animate-pulse'}`}></div>
            {/* The Egg */}
            <div className={`text-9xl relative z-10 transition-transform duration-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] ${isHatching ? 'animate-bounce scale-110' : 'animate-pulse'}`}>
              🥚
            </div>
          </div>

          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl transition-all duration-500">
            <h2 className="text-xl font-bold text-center mb-2">초대 코드가 필요합니다</h2>
            <p className="text-slate-400 text-xs text-center mb-6">
              아스트로펫 알을 부화시키려면<br />기존 대원에게 받은 분양 코드를 입력하세요.
            </p>

            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="A S T R O - 0 0 0"
              disabled={isHatching}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-4 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-cyan-400 transition-colors mb-4 disabled:opacity-50"
            />

            <button
              onClick={handleHatch}
              disabled={inviteCode.length < 4 || isHatching}
              className={`w-full py-4 rounded-xl font-bold tracking-widest text-sm flex items-center justify-center transition-all duration-300 ${
                inviteCode.length >= 4 && !isHatching
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isHatching ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  HATCHING...
                </>
              ) : (
                '부화 시작 (HATCH)'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN DASHBOARD SCREEN (Existing UI)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>
      
      {/* Header */}
      <header className="pt-12 px-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight flex items-baseline gap-2">
            ASTROPET
            <span className="text-[10px] text-cyan-500 font-mono font-bold tracking-widest border border-cyan-500/30 px-1.5 rounded-sm">
              v{process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0"}
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Level 12 <span className="mx-2 opacity-50">|</span> Energy: 85%</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-600/50 flex items-center justify-center overflow-hidden shadow-lg shadow-black/50">
          <span className="text-xl">🧑‍🚀</span>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "home" && (
        <main className="flex-1 flex flex-col items-center justify-start mt-8 px-6 z-10 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
          
          {/* Pet Placeholder & Planet Glow */}
          <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
             {/* Planet glowing arc */}
             <div className="absolute bottom-[-20px] w-[180%] h-40 bg-blue-500/20 rounded-t-[100%] blur-3xl"></div>
             {/* Pet character */}
             <div className="text-9xl relative z-10 animate-bounce drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">👽</div>
          </div>

          {/* Timer Card (Glassmorphism) */}
          <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 mb-5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <p className="text-center text-slate-300 text-xs mb-2 font-semibold tracking-[0.2em] uppercase">Next Orbit In</p>
              <h2 className="text-center text-[3.5rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-3 drop-shadow-sm">
                {m}<span className="text-3xl">M</span> {s.toString().padStart(2, '0')}<span className="text-3xl">S</span>
              </h2>
              <p className="text-center text-slate-400 text-sm">Countdown to space adventure!</p>
            </div>
          </div>

          {/* Status Card */}
          <div className="w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 mb-4 shadow-xl">
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
      )}

      {activeTab === "orbit" && (
        <main className="flex-1 flex flex-col items-center justify-start mt-8 px-6 z-10 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 pb-24">
          <div className="w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 mb-8 shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-bold text-cyan-400 mb-8 tracking-widest uppercase">Orbit Tracker</h2>
            
            {/* Radar / Orbit Visual */}
            <div className="relative w-64 h-64 rounded-full border border-slate-700/50 flex items-center justify-center mb-8">
              {/* Inner rings */}
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-slate-600/50"></div>
              <div className="absolute w-32 h-32 rounded-full border border-slate-500/50 bg-slate-800/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                <span className="text-5xl">🌍</span>
              </div>
              
              {/* Orbiting Pet */}
              <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 border border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_#22d3ee]">
                  <span className="text-sm">👽</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full flex justify-between items-center px-4 py-3 bg-slate-800/50 rounded-2xl mb-3">
              <div className="text-sm font-semibold text-slate-300">Space Debris</div>
              <div className="text-lg font-bold text-cyan-300">1,420 kg</div>
            </div>
            <div className="w-full flex justify-between items-center px-4 py-3 bg-slate-800/50 rounded-2xl">
              <div className="text-sm font-semibold text-slate-300">Current Zone</div>
              <div className="text-sm font-bold text-purple-400">Low Earth Orbit</div>
            </div>
          </div>
        </main>
      )}

      {activeTab === "craft" && (
        <main className="flex-1 flex flex-col items-center justify-start mt-8 px-6 z-10 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 pb-24">
          
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-cyan-400 tracking-widest uppercase">Craft Station</h2>
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <span className="text-sm">⚙️</span>
              <span className="text-cyan-300 font-bold text-sm tracking-wide">1,420 kg</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-6 text-center">
            수집한 우주 쓰레기를 재활용하여<br/>펫의 장비나 간식을 제작할 수 있습니다.
          </p>

          <div className="w-full flex flex-col gap-4">
            
            {/* Craft Item 1 */}
            <div className="w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all hover:border-cyan-400/50 group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                🕸️
              </div>
              <div className="flex-1">
                <h4 className="text-slate-100 font-bold mb-1 text-sm tracking-wide">레이저 그물망</h4>
                <p className="text-slate-500 text-[11px] leading-tight mb-2">우주 쓰레기 자동 수집 효율 +15% 증가</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <span>⚙️</span> 500 kg
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                +
              </button>
            </div>

            {/* Craft Item 2 */}
            <div className="w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all hover:border-pink-400/50 group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-rose-500/30 rounded-xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                🍖
              </div>
              <div className="flex-1">
                <h4 className="text-slate-100 font-bold mb-1 text-sm tracking-wide">고급 영양 간식</h4>
                <p className="text-slate-500 text-[11px] leading-tight mb-2">다음 상공 통과 시, 교감 효율 3배 상승</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <span>⚙️</span> 200 kg
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-400 flex items-center justify-center hover:bg-pink-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all">
                +
              </button>
            </div>

            {/* Craft Item 3 */}
            <div className="w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all opacity-60 grayscale-[50%]">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-500/20 to-gray-500/20 border border-gray-500/30 rounded-xl flex items-center justify-center text-3xl shadow-inner">
                🛡️
              </div>
              <div className="flex-1">
                <h4 className="text-slate-100 font-bold mb-1 text-sm tracking-wide flex items-center gap-2">티타늄 장갑 <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">Locked</span></h4>
                <p className="text-slate-500 text-[11px] leading-tight mb-2">태양풍으로부터 펫을 안전하게 보호합니다.</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <span>⚙️</span> 1,200 kg
                </div>
              </div>
              <button disabled className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-600 flex items-center justify-center cursor-not-allowed">
                +
              </button>
            </div>

          </div>
        </main>
      )}

      {/* Golden Time Modal Overlay */}
      {isGoldenTime && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* AR Video Background */}
          {arMode && (
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}

          {!arMode ? (
            <div className="bg-slate-900 border border-cyan-400/50 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_60px_rgba(6,182,212,0.3)] flex flex-col items-center text-center relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🛸</div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">상공 진입! (Golden Time)</h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                아스트로펫이 지금 내 상공을 통과 중입니다!<br/>지금 간식을 주면 유대감이 <span className="text-cyan-300 font-bold">2배</span>로 상승합니다.
              </p>
              <button 
                onClick={() => setArMode(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
              >
                <span>AR 카메라 켜고 간식 주기</span> 🥩
              </button>
              <button 
                onClick={() => {
                  setIsGoldenTime(false);
                  setTimeLeft(INITIAL_TIME);
                }}
                className="mt-4 text-slate-500 text-xs hover:text-slate-400 underline"
              >
                나중에 주기
              </button>
            </div>
          ) : (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 w-full px-6">
              {/* Virtual Pet floating in AR */}
              <div className="text-9xl mb-12 animate-bounce drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">👽</div>
              
              <button 
                onClick={() => {
                  setIsGoldenTime(false);
                  setArMode(false);
                  setTimeLeft(INITIAL_TIME);
                  // Stop video stream
                  if (videoRef.current && videoRef.current.srcObject) {
                     const stream = videoRef.current.srcObject as MediaStream;
                     stream.getTracks().forEach(track => track.stop());
                  }
                }}
                className="w-full max-w-xs bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-4 rounded-full shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse border-2 border-white/50 text-lg tracking-wider"
              >
                간식 던지기!
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pb-safe pt-3 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto px-2 pb-5">
          <NavItem icon={<Rocket strokeWidth={1.5} size={26} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <NavItem icon={<MapIcon strokeWidth={1.5} size={26} />} label="Orbit" active={activeTab === "orbit"} onClick={() => setActiveTab("orbit")} />
          <NavItem icon={<ShoppingBag strokeWidth={1.5} size={26} />} label="Craft" active={activeTab === "craft"} onClick={() => setActiveTab("craft")} />
          <NavItem icon={<User strokeWidth={1.5} size={26} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-cyan-400 transform scale-110' : 'text-slate-500 hover:text-slate-300 hover:scale-105'}`}>
      <div className={`p-1 rounded-xl ${active ? 'bg-cyan-400/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </button>
  );
}
