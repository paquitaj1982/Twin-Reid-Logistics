import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, Clock, Tag } from 'lucide-react';
import { TrainingModule } from '../types';

interface TrainingModuleFormProps {
  module?: TrainingModule | null;
  onClose: () => void;
  onSave: (module: TrainingModule) => void;
}

const emptyModule: TrainingModule = {
  id: '',
  title: '',
  duration: '',
  category: 'Safety',
  completed: false
};

export const TrainingModuleForm: React.FC<TrainingModuleFormProps> = ({ module, onClose, onSave }) => {
  const [formData, setFormData] = useState<TrainingModule>(emptyModule);

  useEffect(() => {
    if (module) {
      setFormData(module);
    } else {
      setFormData({
        ...emptyModule,
        id: `TM-${Math.floor(Math.random() * 10000)}`
      });
    }
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
          <h2 className="text-xl font-display font-bold text-white">{module ? 'Edit Module' : 'Add New Module'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Module Title</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                placeholder="e.g. Advanced Backing Techniques"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Duration</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="e.g. 45 min"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red appearance-none"
                >
                  <option value="Safety">Safety</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Skills">Skills</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={e => setFormData({...formData, completed: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-twin-red focus:ring-twin-red cursor-pointer"
            />
            <label htmlFor="completed" className="text-sm font-medium text-white cursor-pointer select-none">Mark as Completed</label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800 mt-2">
            <button
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg bg-twin-red hover:bg-red-700 text-white font-bold transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(139,0,0,0.3)]"
            >
              <Save className="w-4 h-4" /> Save Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};