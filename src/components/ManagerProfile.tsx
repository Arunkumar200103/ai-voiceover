import CharacterVideo from "./CharacterVideo";


interface ManagerData {
  name: string;
  title: string;
  photoUrl: string;
  mission: string;
  goals: string[];
  achievements: string[];
  galleryImages: string[];
}

interface ManagerProfileProps {
  managerData: ManagerData;
  volume: number;
}

export default function ManagerProfile({ managerData, volume }: ManagerProfileProps) {
  return (
    <div className="text-center space-y-8">
     <CharacterVideo
  src="/character.mp4"
  volume={volume}
  isPlaying={true}
/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 overflow-hidden">
          <img
            src={managerData.photoUrl}
            alt={managerData.name}
            className="w-full h-72 object-cover rounded-xl border-2 border-blue-400/30 mb-6"
          />
          <div
            className="transition-transform duration-100"
            style={{
              transform: `scale(${1 + volume * 0.05})`,
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-2">{managerData.name}</h2>
            <p className="text-2xl text-cyan-400 font-semibold">{managerData.title}</p>
          </div>
        </div>

        <div className="text-left space-y-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4">Professional Summary</h3>
            <p className="text-xl text-gray-200 leading-relaxed">
              Visionary leader with extensive experience in driving business transformation,
              managing large-scale operations, and building exceptional teams. Known for strategic
              thinking and delivering measurable results across diverse industries.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
              <p className="text-sm text-blue-300 font-semibold">Expertise</p>
              <p className="text-white mt-2">Strategic Planning, Team Leadership, Business Growth</p>
            </div>
            <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-400/30">
              <p className="text-sm text-cyan-300 font-semibold">Focus Areas</p>
              <p className="text-white mt-2">Innovation, Operational Excellence, Stakeholder Relations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
