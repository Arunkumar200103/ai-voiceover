import { useState } from 'react';
import { X } from 'lucide-react';

interface ManagerData {
  name: string;
  title: string;
  photoUrl: string;
  mission: string;
  goals: string[];
  achievements: string[];
  galleryImages: string[];
}

interface SetupPanelProps {
  managerData: ManagerData;
  setManagerData: (data: ManagerData) => void;
}

export default function SetupPanel({ managerData, setManagerData }: SetupPanelProps) {
  const [editMode, setEditMode] = useState<keyof ManagerData | null>(null);

  const handleUpdate = <K extends keyof ManagerData>(key: K, value: ManagerData[K]) => {
    setManagerData({ ...managerData, [key]: value });
    setEditMode(null);
  };

  const addGoal = () => {
    setManagerData({
      ...managerData,
      goals: [...managerData.goals, 'New Goal'],
    });
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...managerData.goals];
    newGoals[index] = value;
    setManagerData({ ...managerData, goals: newGoals });
  };

  const removeGoal = (index: number) => {
    setManagerData({
      ...managerData,
      goals: managerData.goals.filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    setManagerData({
      ...managerData,
      achievements: [...managerData.achievements, 'New Achievement'],
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...managerData.achievements];
    newAchievements[index] = value;
    setManagerData({ ...managerData, achievements: newAchievements });
  };

  const removeAchievement = (index: number) => {
    setManagerData({
      ...managerData,
      achievements: managerData.achievements.filter((_, i) => i !== index),
    });
  };

  const addGalleryImage = () => {
    setManagerData({
      ...managerData,
      galleryImages: [...managerData.galleryImages, ''],
    });
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newImages = [...managerData.galleryImages];
    newImages[index] = value;
    setManagerData({ ...managerData, galleryImages: newImages });
  };

  const removeGalleryImage = (index: number) => {
    setManagerData({
      ...managerData,
      galleryImages: managerData.galleryImages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Manager Setup</h2>

      <div className="space-y-8">
        <div>
          <label className="block text-white font-semibold mb-2">Manager Name</label>
          <input
            type="text"
            value={managerData.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Title</label>
          <input
            type="text"
            value={managerData.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Photo URL</label>
          <input
            type="text"
            value={managerData.photoUrl}
            onChange={(e) => handleUpdate('photoUrl', e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Mission</label>
          <textarea
            value={managerData.mission}
            onChange={(e) => handleUpdate('mission', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none h-20"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-white font-semibold">Goals</label>
            <button
              onClick={addGoal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-all"
            >
              Add Goal
            </button>
          </div>
          <div className="space-y-2">
            {managerData.goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => removeGoal(index)}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-2 rounded transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-white font-semibold">Achievements</label>
            <button
              onClick={addAchievement}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-all"
            >
              Add Achievement
            </button>
          </div>
          <div className="space-y-2">
            {managerData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => removeAchievement(index)}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-2 rounded transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-white font-semibold">Gallery Images</label>
            <button
              onClick={addGalleryImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-all"
            >
              Add Image
            </button>
          </div>
          <div className="space-y-2">
            {managerData.galleryImages.map((imageUrl, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => updateGalleryImage(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-2 rounded transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
