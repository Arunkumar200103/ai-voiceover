import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Upload, Volume2, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import CharacterVideo from './components/CharacterVideo';
import ManagerProfile from './components/ManagerProfile';
import SetupPanel from './components/SetupPanel';

interface ManagerData {
  name: string;
  title: string;
  photoUrl: string;
  mission: string;
  goals: string[];
  achievements: string[];
  galleryImages: string[];
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const [volume, setVolume] = useState(0);
  const [showSetup, setShowSetup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<'intro' | 'profile' | 'mission' | 'goals' | 'achievements' | 'gallery'>('intro');
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [managerData, setManagerData] = useState<ManagerData>({
    name: 'John Mitchell',
    title: 'Executive Director',
    photoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    mission: 'Leading innovation and excellence in business transformation',
    goals: ['Drive operational excellence', 'Build high-performing teams', 'Accelerate digital transformation'],
    achievements: ['20+ years of industry leadership', '500M+ in revenue growth', '15 successful projects', 'Industry awards 2023'],
    galleryImages: [
      'https://images.pexels.com/photos/3862633/pexels-photo-3862633.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3407857/pexels-photo-3407857.jpeg?auto=compress&cs=tinysrgb&w=400',
    ]
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const startPresentation = () => {
    setShowPresentation(true);
    setCurrentSlide('intro');
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 500);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSlide = (direction: 'next' | 'prev') => {
    const slides: Array<'intro' | 'profile' | 'mission' | 'goals' | 'achievements' | 'gallery'> = ['intro', 'profile', 'mission', 'goals', 'achievements', 'gallery'];
    const currentIndex = slides.indexOf(currentSlide);

    if (direction === 'next' && currentIndex < slides.length - 1) {
      setCurrentSlide(slides[currentIndex + 1]);
      if (currentSlide === 'gallery') setGalleryIndex(0);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentSlide(slides[currentIndex - 1]);
      if (currentSlide === 'gallery') setGalleryIndex(0);
    }
  };

  const changeGalleryImage = (direction: 'next' | 'prev') => {
    const max = managerData.galleryImages.length - 1;
    if (direction === 'next' && galleryIndex < max) {
      setGalleryIndex(galleryIndex + 1);
    } else if (direction === 'prev' && galleryIndex > 0) {
      setGalleryIndex(galleryIndex - 1);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const getVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      setVolume(average / 255);
      animationFrameRef.current = requestAnimationFrame(getVolume);
    };

    getVolume();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePause = () => {
      setIsPlaying(false);
      setVolume(0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setVolume(0);
    };

    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (!showPresentation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <Settings className="w-5 h-5" />
              {showSetup ? 'Close Setup' : 'Setup Manager'}
            </button>
          </div>

          {showSetup ? (
            <SetupPanel managerData={managerData} setManagerData={setManagerData} />
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-blue-500/20 rounded-full mb-4">
                  <Mic className="w-16 h-16 text-blue-300" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Business Presentation</h1>
                <p className="text-blue-200 text-lg">Featuring {managerData.name}</p>
              </div>

              <div className="space-y-6">
                <label className="block">
                  <div className="border-2 border-dashed border-blue-400/50 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white/5">
                    <Upload className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                    <span className="text-white text-lg block mb-2">
                      {audioFile ? audioFile.name : 'Click to upload audio file'}
                    </span>
                    <span className="text-blue-300 text-sm">MP3, WAV, or other audio formats</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </label>

                {audioUrl && (
                  <button
                    onClick={startPresentation}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Start Presentation
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-8">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        {currentSlide === 'intro' && (
          <div className="text-center space-y-8">
            <CharacterVideo
  src="/character.mp4"
  volume={volume}
  isPlaying={isPlaying}
/>

            <div className="space-y-4">
              <h1 className="text-7xl font-bold text-white leading-tight animate-fadeIn">
                Welcome to Our Presentation
              </h1>
              <p className="text-3xl text-blue-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                Meet {managerData.name}
              </p>
            </div>
          </div>
        )}

        {currentSlide === 'profile' && (
          <ManagerProfile managerData={managerData} volume={volume} />
        )}

        {currentSlide === 'mission' && (
          <div className="text-center space-y-8">
           <CharacterVideo
  src="/character.mp4"
  volume={volume}
  isPlaying={isPlaying}
/>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-6">Mission</h2>
              <p className="text-3xl text-blue-200 leading-relaxed">{managerData.mission}</p>
            </div>
          </div>
        )}

        {currentSlide === 'goals' && (
          <div className="text-center space-y-8">
            <CharacterVideo
  src="/character.mp4"
  volume={volume}
  isPlaying={isPlaying}
/>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-8">Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {managerData.goals.map((goal, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all transform hover:scale-105"
                  >
                    <div className="text-4xl font-bold text-cyan-400 mb-3">{index + 1}</div>
                    <p className="text-2xl text-white">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentSlide === 'achievements' && (
          <div className="text-center space-y-8">
            <CharacterVideo
  src="/character.mp4"
  volume={volume}
  isPlaying={isPlaying}
/>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-8">Achievements</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {managerData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-8 border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
                  >
                    <p className="text-2xl text-white font-semibold">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentSlide === 'gallery' && (
          <div className="text-center space-y-8">
            <CharacterVideo
  src="/character.mp4"
  volume={volume}
  isPlaying={isPlaying}
/>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-8">Gallery</h2>
              <div className="relative">
                <img
                  src={managerData.galleryImages[galleryIndex]}
                  alt={`Gallery ${galleryIndex + 1}`}
                  className="w-full max-h-96 object-cover rounded-xl border border-blue-400/30"
                />
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => changeGalleryImage('prev')}
                    disabled={galleryIndex === 0}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-white text-xl font-semibold">
                    {galleryIndex + 1} / {managerData.galleryImages.length}
                  </span>
                  <button
                    onClick={() => changeGalleryImage('next')}
                    disabled={galleryIndex === managerData.galleryImages.length - 1}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-12">
          <button
            onClick={() => changeSlide('prev')}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlayPause}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all shadow-lg"
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                <span>Play</span>
              </>
            )}
            {isPlaying && <Volume2 className="w-6 h-6 animate-pulse" />}
          </button>

          <button
            onClick={() => changeSlide('next')}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
