import React, { useState } from 'react';
import { X, ShieldAlert, Clock, Fuel, Map, Save, TrendingUp, Sparkles, Loader2, PlayCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Driver } from '../types';
import { generateCoachingPlan } from '../services/geminiService';

interface DriverScorecardProps {
  driver: Driver;
  onClose: () => void;
  onUpdateScore: (driverId: string, newManagerScore: number) => void;
}

export const DriverScorecard: React.FC<DriverScorecardProps> = ({ driver, onClose, onUpdateScore }) => {
  const [managerScore, setManagerScore] = useState(driver.performance.managerScore);
  const [isSaving, setIsSaving] = useState(false);
  const [coachingPlan, setCoachingPlan] = useState<string>('');
  const [isCoachingLoading, setIsCoachingLoading] = useState(false);

  // Normalize safety violations (fewer is better) for the chart
  const safetyScore = Math.max(0, 100 - (driver.performance.safetyViolations * 20));

  const chartData = [
    { subject: 'On-Time', A: driver.performance.onTimeDeliveryRate, fullMark: 100 },
    { subject: 'Safety', A: safetyScore, fullMark: 100 },
    { subject: 'MPG', A: Math.min(100, (driver.performance.averageMpg / 8) * 100), fullMark: 100 }, // Normalized relative to 8mpg
    { subject: 'Adherence', A: driver.performance.scheduleAdherence, fullMark: 100 },
    { subject: 'Manager', A: managerScore, fullMark: 100 },
  ];

  // Weighted Calculation for Total Score
  const calculateTotalScore = () => {
    const wOnTime = 0.25;
    const wSafety = 0.30;
    const wMpg = 0.15;
    const wAdherence = 0.15;
    const wManager = 0.15;

    // Normalize MPG (target 7.5 as 100%)
    const normalizedMpg = Math.min(100, (driver.performance.averageMpg / 7.5) * 100);

    const total = 
      (driver.performance.onTimeDeliveryRate * wOnTime) +
      (safetyScore * wSafety) +
      (normalizedMpg * wMpg) +
      (driver.performance.scheduleAdherence * wAdherence) +
      (managerScore * wManager);
    
    return Math.round(total);
  };

  const totalScore = calculateTotalScore();

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateScore(driver.id, managerScore);
      setIsSaving(false);
      onClose();
    }, 800);
  };

  const handleGenerateCoaching = async () => {
    setIsCoachingLoading(true);
    const plan = await generateCoachingPlan(driver);
    setCoachingPlan(plan);
    setIsCoachingLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-5xl rounded-2xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            <img src={driver.avatar} alt={driver.name} className="w-16 h-16 rounded-xl border-2 border-zinc-700 object-cover" />
            <div>
              <h2 className="text-2xl font-display font-bold text-white">{driver.name}</h2>
              <p className="text-zinc-400 flex items-center gap-2 text-sm">
                ID: {driver.id} • <span className="text-twin-red font-semibold">{driver.truckType}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Overall Grade</p>
              <p className={`text-4xl font-display font-bold ${getScoreColor(totalScore)}`}>{totalScore}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visuals & Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Chart */}
            <div className="bg-zinc-950/50 rounded-xl border border-zinc-800 p-4 flex flex-col items-center justify-center min-h-[300px]">
              <h4 className="text-zinc-400 text-sm uppercase tracking-wider mb-4">Performance Matrix</h4>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Performance"
                      dataKey="A"
                      stroke="#8B0000"
                      strokeWidth={2}
                      fill="#8B0000"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-green-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <span className={`text-xl font-bold ${driver.performance.onTimeDeliveryRate >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {driver.performance.onTimeDeliveryRate}%
                  </span>
                </div>
                <p className="text-sm text-zinc-400">On-Time Delivery</p>
              </div>

              <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-red-900/20 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <span className={`text-xl font-bold ${driver.performance.safetyViolations === 0 ? 'text-zinc-200' : 'text-red-500'}`}>
                    {driver.performance.safetyViolations}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">Safety Violations</p>
              </div>

              <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <Fuel className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    {driver.performance.averageMpg}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">Average MPG</p>
              </div>

              <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-orange-900/20 rounded-lg">
                    <Map className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    {driver.performance.scheduleAdherence}%
                  </span>
                </div>
                <p className="text-sm text-zinc-400">Schedule Adherence</p>
              </div>
            </div>
            
            {/* Admin Input Section */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-twin-red" />
                  <h3 className="font-bold text-white">Manager Assessment</h3>
                </div>
                <span className="text-2xl font-bold text-twin-red">{managerScore}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>Performance Score (0-100)</span>
                    <span>Influence: 15% of Total</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={managerScore}
                    onChange={(e) => setManagerScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-twin-red"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Coaching (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-twin-red/30 rounded-xl p-6 h-full relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-4">
                 <Sparkles className="w-6 h-6 text-twin-red animate-pulse" />
               </div>
               
               <h3 className="text-xl font-display font-bold text-white mb-2">AI Performance Coach</h3>
               <p className="text-sm text-zinc-400 mb-6">Generate a data-driven coaching plan tailored to this driver's current metrics.</p>

               <div className="flex-1 bg-zinc-950/50 rounded-lg border border-zinc-800 p-4 mb-6 overflow-y-auto min-h-[200px] text-sm leading-relaxed text-zinc-200">
                 {isCoachingLoading ? (
                   <div className="h-full flex flex-col items-center justify-center gap-3 text-zinc-500">
                     <Loader2 className="w-8 h-8 animate-spin text-twin-red" />
                     <span>Analyzing Fleet Data...</span>
                   </div>
                 ) : coachingPlan ? (
                   <div className="whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                     {coachingPlan}
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center gap-3 text-zinc-600 italic text-center px-4">
                     <p>Click "Generate Plan" to receive actionable advice based on MPG, Safety, and On-Time stats.</p>
                   </div>
                 )}
               </div>

               <button 
                 onClick={handleGenerateCoaching}
                 disabled={isCoachingLoading}
                 className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 hover:border-twin-red transition-all font-bold flex items-center justify-center gap-2 group"
               >
                 {isCoachingLoading ? 'Processing...' : (
                   <>
                     <PlayCircle className="w-5 h-5 text-twin-red group-hover:scale-110 transition-transform" />
                     Generate Coaching Plan
                   </>
                 )}
               </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-twin-red hover:bg-red-700 text-white font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,0,0,0.3)]"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" /> Save Evaluation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
