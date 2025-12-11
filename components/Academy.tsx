import React, { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle, BookOpen, ShieldCheck, Plus, Pencil, Trash2, Calendar, Quote, Truck } from 'lucide-react';
import { TrainingModule } from '../types';
import { TrainingModuleForm } from './TrainingModuleForm';
import { RoadTestModal } from './RoadTestModal';

const initialModules: TrainingModule[] = [
  { id: 'TM-101', title: 'DOT Compliance Basics', duration: '45 min', category: 'Compliance', completed: true },
  { id: 'TM-102', title: 'Defensive Driving: Highway', duration: '60 min', category: 'Safety', completed: true },
  { id: 'TM-103', title: 'Pre-Trip Inspection Mastery', duration: '30 min', category: 'Skills', completed: false },
  { id: 'TM-104', title: 'Managing Hours of Service (HOS)', duration: '40 min', category: 'Compliance', completed: false },
  { id: 'TM-105', title: 'Winter Weather Tactics', duration: '55 min', category: 'Safety', completed: false },
];

const affirmations = [
  "Own the road, own your future.",
  "Precision driving pays the best rates.",
  "Safety is the ultimate luxury.",
  "Your skills dictate your paycheck.",
  "Every mile is an opportunity to improve.",
  "Stay sharp, stay safe, stay profitable.",
  "A professional driver is always learning."
];

export const Academy: React.FC = () => {
  const [modules, setModules] = useState<TrainingModule[]>(initialModules);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<TrainingModule | null>(null);
  const [affirmation, setAffirmation] = useState('');

  // Set random affirmation on mount
  useEffect(() => {
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, []);

  const completedCount = modules.filter(m => m.completed).length;
  const totalCount = modules.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find next module to resume
  const nextModuleIndex = modules.findIndex(m => !m.completed);
  const nextModule = nextModuleIndex !== -1 ? modules[nextModuleIndex] : null;

  const handleSaveModule = (module: TrainingModule) => {
    setModules(prev => {
      // Edit existing
      if (prev.some(m => m.id === module.id)) {
        return prev.map(m => m.id === module.id ? module : m);
      }
      // Add new
      return [...prev, module];
    });
    setIsFormOpen(false);
    setEditingModule(null);
  };

  const handleDeleteModule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this training module?')) {
      setModules(prev => prev.filter(m => m.id !== id));
    }
  };

  const openAddForm = () => {
    setEditingModule(null);
    setIsFormOpen(true);
  };

  const openEditForm = (module: TrainingModule, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingModule(module);
    setIsFormOpen(true);
  };

  const toggleComplete = (id: string) => {
    setModules(prev => prev.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  const handleBookRoadTest = (date: string, time: string, instructor: string) => {
    setIsBookingOpen(false);
    setTimeout(() => {
      alert(
        `✅ ROAD TEST CONFIRMED!\n\n` +
        `📅 Date: ${date}\n` +
        `⏰ Time: ${time}\n` +
        `👨‍🏫 Instructor: ${instructor}\n\n` +
        `A calendar invite has been sent to your email. Good luck!`
      );
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-64 border border-zinc-800 group">
        <img 
          src="https://picsum.photos/1200/400?grayscale&blur=2" 
          alt="Academy Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent flex items-center px-10">
          <div className="max-w-2xl">
             <h2 className="text-4xl font-display font-bold text-white mb-4">Twin Reid <span className="text-twin-red">Academy</span></h2>
             <p className="text-zinc-300 mb-6 max-w-lg">Master the road. Compliance, safety, and advanced techniques for the modern professional driver.</p>
             
             {nextModule ? (
               <button className="bg-white text-black pl-5 pr-6 py-3 rounded font-bold uppercase tracking-wider hover:bg-twin-cream transition-all flex items-center gap-3 shadow-lg hover:shadow-white/20">
                 <PlayCircle className="w-5 h-5 text-twin-red" />
                 <span>Resume: {nextModule.title}</span>
               </button>
             ) : (
               <button className="bg-green-600 text-white px-6 py-3 rounded font-bold uppercase tracking-wider hover:bg-green-500 transition-all shadow-lg flex items-center gap-2">
                 <CheckCircle className="w-5 h-5" /> All Training Complete
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Affirmation Banner */}
          <div className="bg-zinc-900/50 border border-twin-red/20 p-4 rounded-xl flex items-start gap-4">
            <Quote className="w-8 h-8 text-twin-red opacity-50 shrink-0" />
            <div>
              <h4 className="text-twin-red font-bold uppercase tracking-wider text-xs mb-1">Daily Driver Affirmation</h4>
              <p className="text-white font-display text-lg italic">"{affirmation}"</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-twin-red" /> 
                Training Modules
              </h3>
              <button 
                onClick={openAddForm}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700"
              >
                <Plus className="w-4 h-4" /> Add Module
              </button>
            </div>
            
            <div className="space-y-3">
              {modules.map((module) => (
                <div 
                  key={module.id} 
                  className={`border p-4 rounded-xl flex items-center justify-between transition-all duration-300 group cursor-pointer relative ${
                    module.completed 
                      ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900' 
                      : 'bg-zinc-900 border-zinc-700 hover:border-twin-red hover:shadow-[0_0_15px_rgba(139,0,0,0.1)]'
                  }`}
                  onClick={() => toggleComplete(module.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full transition-colors ${module.completed ? 'bg-green-500/10 text-green-500' : 'bg-twin-red/10 text-twin-red group-hover:bg-twin-red group-hover:text-white'}`}>
                      {module.completed ? <CheckCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-bold transition-all ${module.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{module.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border ${
                           module.completed ? 'border-zinc-800 bg-zinc-950 text-zinc-600' : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                         }`}>
                           {module.category}
                         </span>
                         {module.id === nextModule?.id && (
                           <span className="text-[10px] font-bold text-twin-red animate-pulse">
                             • RESUME HERE
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400 font-mono">{module.duration}</span>
                    
                    {/* Action Buttons (Visible on hover or mobile) */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => openEditForm(module, e)}
                        className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteModule(module.id, e)}
                        className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  <p>No training modules assigned.</p>
                  <button onClick={openAddForm} className="text-twin-red hover:underline mt-2 text-sm">Add your first module</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
           {/* Progress Card */}
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-white mb-4">Your Progress</h4>
              <div className="flex justify-center mb-6">
                 <div className="relative w-32 h-32 rounded-full border-8 border-zinc-950 flex items-center justify-center bg-zinc-950">
                    {/* SVG for Circle Progress */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="transparent"
                        stroke="#27272a"
                        strokeWidth="8"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="transparent"
                        stroke="#8B0000"
                        strokeWidth="8"
                        strokeDasharray={351.86} // 2 * PI * 56
                        strokeDashoffset={351.86 - (351.86 * progressPercentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white block">{progressPercentage}%</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Complete</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-2 text-sm border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Modules Completed</span>
                  <span className="text-white font-mono">{completedCount}/{totalCount}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Est. Time Remaining</span>
                  <span className="text-white font-mono">
                    {modules.filter(m => !m.completed).length * 45} min
                  </span>
                </div>
              </div>
           </div>

           {/* Road Test Card - Active Calendar Signup */}
           <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-twin-red/20 blur-2xl rounded-full -mr-10 -mt-10"></div>
              <Calendar className="w-10 h-10 text-white mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Road Test Booking</h4>
              <p className="text-sm text-zinc-400 mb-4">Ready for the final exam? Schedule your on-road certification test.</p>
              
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-twin-red hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" /> Book Now
              </button>
           </div>

           {/* Safety Bonus */}
           <div className="bg-gradient-to-br from-twin-darkRed to-black border border-twin-red/30 p-6 rounded-xl relative overflow-hidden">
              <ShieldCheck className="w-16 h-16 text-white/10 absolute -bottom-4 -right-4" />
              <h4 className="text-lg font-bold text-white mb-2">Safety Bonus</h4>
              <p className="text-sm text-zinc-300 mb-4">Complete all safety modules by Friday to unlock your $200 bonus.</p>
              <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-white h-full w-3/4"></div>
              </div>
           </div>
        </div>
      </div>

      {isFormOpen && (
        <TrainingModuleForm 
          module={editingModule}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveModule}
        />
      )}

      {isBookingOpen && (
        <RoadTestModal 
          onClose={() => setIsBookingOpen(false)}
          onBook={handleBookRoadTest}
        />
      )}
    </div>
  );
};