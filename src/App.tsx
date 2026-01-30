import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
} from 'lucide-react';

import ManagerProfile from './components/ManagerProfile';


interface ManagerData {
  name: string;
  title: string;
  photoUrl: string;
  mission: string;
  goals: string[];
  achievements: string[];
  history: string[];
  galleryImages: string[];
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
 

  const [currentSlide, setCurrentSlide] = useState<
    'intro' | 'profile' | 'mission' | 'goals' | 'achievements' | 'history' | 'gallery'
  >('intro');

  const [galleryIndex, setGalleryIndex] = useState(0);

  // ✅ STATIC AUDIO
  const audioUrl = 'public/ai-vioceover.mpeg';

  const [managerData] = useState<ManagerData>({
  name: 'B. Shankar Govindaraj',
  title: 'Education Consultant & Counselor',
  photoUrl:
    '/shankar-1.jpeg', // replace with actual photo URL if needed

  mission:
    'Empowering students, parents, and institutions through holistic education, counseling, and personality development',

  goals: [
    'Provide quality career guidance to students',
    'Support mental wellness through counseling',
    'Promote life skills and personality development',
    'Encourage strategic thinking through chess education',
  ],

  achievements: [
    'Multiple postgraduate degrees in psychology, yoga, and nutrition',
    'NCVT Certified Yoga Therapist',
    'FIDE Arbiter & Chess Coach',
    'President – Gobi Taluk Chess Association',
    'Worked as counselor in educational institutions and judiciary',
  ],

  history: [
    'Started career in education and counseling',
    'Worked as Counselor at MPNMJ College (2017–2018)',
    'Associated with multiple schools as Education Consultant',
    'Became President of Gobi Taluk Chess Association',
    'Currently working as Counselor at Gobi Sub Court',
  ],

  galleryImages: [
    'shankar-2.jpeg',
    'shankar-3.jpeg',
    'shankar-4.jpeg',
  ],
});

  const audioRef = useRef<HTMLAudioElement | null>(null);
const animationFrameRef = useRef<number>();

useEffect(() => {
  const unlockAudio = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);
    } catch {}
    window.removeEventListener("pointerdown", unlockAudio);
  };

  window.addEventListener("pointerdown", unlockAudio);
  return () => window.removeEventListener("pointerdown", unlockAudio);
}, []);




  // 🎵 AUDIO ANALYSIS
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      setVolume(avg / 255);
      animationFrameRef.current = requestAnimationFrame(detectVolume);
    };

    detectVolume();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 🔁 VIDEO LOOP - Start playing and loop infinitely
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay prevented:', err));
    }
  }, []);

  const slides = [
    'intro',
    'profile',
    'mission',
    'goals',
    'achievements',
    'history',
    'gallery',
  ] as const;

  const changeSlide = (dir: 'next' | 'prev') => {
    const index = slides.indexOf(currentSlide);
    if (dir === 'next' && index < slides.length - 1) {
      setCurrentSlide(slides[index + 1]);
      setGalleryIndex(0);
    }
    if (dir === 'prev' && index > 0) {
      setCurrentSlide(slides[index - 1]);
      setGalleryIndex(0);
    }
  };

  const changeGalleryImage = (dir: 'next' | 'prev') => {
    if (dir === 'next' && galleryIndex < managerData.galleryImages.length - 1) {
      setGalleryIndex(galleryIndex + 1);
    }
    if (dir === 'prev' && galleryIndex > 0) {
      setGalleryIndex(galleryIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <audio ref={audioRef} src={audioUrl} />

      
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="text-center space-y-10">
          {/* Video Always Visible and Looping */}
          {currentSlide !== 'profile' && (
            <div className="mb-8 flex justify-center">
              <div className="relative inline-block">
                <video
                  ref={videoRef}
                  src="/character.mp4"
                  loop
                  muted
                  playsInline
                  autoPlay
                  className="w-64 h-64 object-cover rounded-full border-4 border-cyan-400/50 shadow-2xl shadow-cyan-500/30"
                  style={{
                    transform: `scale(${1 + volume * 0.1})`,
                    transition: 'transform 0.1s ease-out',
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 pointer-events-none"></div>
              </div>
            </div>
          )}

          {currentSlide === 'intro' && (
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl px-8 py-3 mb-6">
                  <p className="text-cyan-300 font-semibold text-lg flex items-center gap-2 justify-center">
                    <Sparkles className="w-5 h-5" />
                    AI-Powered Presentation
                  </p>
                </div>
              </div>
              
              <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                Welcome to Our
                <br />
                Presentation
              </h1>
              
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
                <p className="text-4xl text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text font-light">
                  Meet {managerData.name}
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
              </div>
            </div>
          )}

          {currentSlide === 'profile' && (
            <div className="animate-fade-in">
              <ManagerProfile managerData={managerData} volume={volume} />
            </div>
          )}

          {currentSlide === 'mission' && (
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-16 border border-white/20 shadow-2xl shadow-blue-500/10 animate-fade-in">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg">
                  Our Mission
                </span>
              </div>
              <p className="text-4xl text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text font-light leading-relaxed max-w-4xl mx-auto">
                {managerData.mission}
              </p>
            </div>
          )}

          {currentSlide === 'goals' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-8">Strategic Goals</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {managerData.goals.map((g, i) => (
                  <div
                    key={i}
                    className="group bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                      <span className="text-2xl font-bold text-white">{i + 1}</span>
                    </div>
                    <p className="text-xl text-blue-100 leading-relaxed">{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSlide === 'achievements' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-8">Key Achievements</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {managerData.achievements.map((a, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl text-blue-100 leading-relaxed text-left">{a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSlide === 'history' && (
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl shadow-blue-500/10 animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-12">
                Career History
              </h2>
              <div className="relative max-w-3xl mx-auto">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 rounded-full"></div>
                
                <ul className="space-y-8 text-left relative">
                  {managerData.history.map((item, i) => (
                    <li
                      key={i}
                      className="relative pl-20 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-5 top-2 w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-4 border-slate-950 shadow-lg shadow-blue-500/50 group-hover:scale-125 transition-transform duration-300"></div>
                      
                      <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                        <p className="text-2xl text-blue-100 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentSlide === 'gallery' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-8">Gallery</h2>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <img
                  src={managerData.galleryImages[galleryIndex]}
                  className="mx-auto rounded-2xl max-h-96 shadow-2xl shadow-blue-500/20 border border-white/10"
                  alt={`Gallery image ${galleryIndex + 1}`}
                />
                <div className="flex justify-center items-center gap-6 mt-8">
                  <button
                    onClick={() => changeGalleryImage('prev')}
                    disabled={galleryIndex === 0}
                    className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <ChevronLeft className="text-white w-6 h-6" />
                  </button>
                  
                  <div className="flex gap-2">
                    {managerData.galleryImages.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === galleryIndex
                            ? 'bg-cyan-400 w-8'
                            : 'bg-white/30'
                        }`}
                      ></div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => changeGalleryImage('next')}
                    disabled={galleryIndex === managerData.galleryImages.length - 1}
                    className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <ChevronRight className="text-white w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Controls */}
          <div className="flex justify-center items-center gap-8 mt-16">
            <button
              onClick={() => changeSlide('prev')}
              disabled={slides.indexOf(currentSlide) === 0}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed p-4 rounded-2xl border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20 group"
            >
              <ChevronLeft className="text-white w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* <button
              onClick={togglePlayPause}
              className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-5 rounded-2xl flex items-center gap-4 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 border border-blue-400/30"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7" />
              )}
              <span className="text-xl font-semibold">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
              {isPlaying && (
                <Volume2 className="w-6 h-6 animate-pulse" />
              )}
              
              {/* Animated ring */
              /* {isPlaying && (
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping"></div>
              )}
            </button> */}

            <button
              onClick={() => changeSlide('next')}
              disabled={slides.indexOf(currentSlide) === slides.length - 1}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed p-4 rounded-2xl border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20 group"
            >
              <ChevronRight className="text-white w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Slide Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {slides.map((slide, i) => (
              <div
                key={slide}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === slide
                    ? 'w-12 h-3 bg-gradient-to-r from-cyan-400 to-blue-500'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50 cursor-pointer'
                }`}
                onClick={() => {
                  setCurrentSlide(slide);
                  setGalleryIndex(0);
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6 text-center">
          <p className="text-blue-300/60 text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by Thiran360AI - Next Generation AI Presentations
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default App;