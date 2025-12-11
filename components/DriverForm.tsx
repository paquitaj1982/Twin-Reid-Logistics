import React, { useState, useEffect } from 'react';
import { X, Save, Truck, MapPin, User, Activity, DollarSign, Gauge, AlertTriangle, Clock, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Driver, DriverStatus, DriverPerformance } from '../types';

interface DriverFormProps {
  driver?: Driver | null;
  onClose: () => void;
  onSave: (driver: Driver) => void;
}

const emptyDriver: Driver = {
  id: '',
  name: '',
  avatar: '',
  status: DriverStatus.AVAILABLE,
  truckType: 'Sleeper',
  currentLocation: '',
  rating: 5.0,
  earningsWeek: 0,
  performance: {
    onTimeDeliveryRate: 100,
    safetyViolations: 0,
    averageMpg: 7.0,
    scheduleAdherence: 100,
    managerScore: 100
  }
};

export const DriverForm: React.FC<DriverFormProps> = ({ driver, onClose, onSave }) => {
  const [formData, setFormData] = useState<Driver>(emptyDriver);

  useEffect(() => {
    if (driver) {
      setFormData(driver);
    } else {
      // Initialize new driver with random ID and Avatar
      setFormData({
        ...emptyDriver,
        id: `DR-${Math.floor(Math.random() * 10000)}`,
        avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000)}`
      });
    }
  }, [driver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updatePerformance = (field: keyof DriverPerformance, value: number) => {
    setFormData(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl shrink-0">
          <h2 className="text-xl font-display font-bold text-white">{driver ? 'Edit Driver Profile' : 'Add New Driver'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: General Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-twin-red uppercase tracking-wider border-b border-zinc-800 pb-2">General Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                    placeholder="Driver Name"
                  />
                </div>
              </div>
              <div>
                 <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Avatar URL</label>
                 <div className="relative">
                   <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                   <input
                     type="text"
                     value={formData.avatar}
                     onChange={e => setFormData({...formData, avatar: e.target.value})}
                     className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red text-xs truncate"
                     placeholder="https://..."
                   />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Truck Type</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={formData.truckType}
                    onChange={e => setFormData({...formData, truckType: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                    placeholder="e.g. Sleeper"
                  />
                </div>
              </div>
               <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as DriverStatus})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red appearance-none"
                  >
                    {Object.values(DriverStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Current Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={formData.currentLocation}
                  onChange={e => setFormData({...formData, currentLocation: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financials & Rating */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-twin-red uppercase tracking-wider border-b border-zinc-800 pb-2">Financials & Rating</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Weekly Earnings ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    value={formData.earningsWeek}
                    onChange={e => setFormData({...formData, earningsWeek: parseFloat(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Overall Rating (0-5)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    min="0"
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-twin-red uppercase tracking-wider border-b border-zinc-800 pb-2">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">On-Time %</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formData.performance.onTimeDeliveryRate}
                    onChange={e => updatePerformance('onTimeDeliveryRate', parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Safety Violations</label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    min="0"
                    value={formData.performance.safetyViolations}
                    onChange={e => updatePerformance('safetyViolations', parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Average MPG</label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    step="0.1"
                    value={formData.performance.averageMpg}
                    onChange={e => updatePerformance('averageMpg', parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Schedule Adherence %</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formData.performance.scheduleAdherence}
                    onChange={e => updatePerformance('scheduleAdherence', parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Manager Score (0-100)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formData.performance.managerScore}
                    onChange={e => updatePerformance('managerScore', parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  />
                </div>
              </div>
            </div>
          </div>

        </form>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950 rounded-b-2xl flex justify-end gap-3 shrink-0">
             <button
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-twin-red hover:bg-red-700 text-white font-bold transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(139,0,0,0.3)]"
            >
              <Save className="w-4 h-4" /> Save Driver
            </button>
        </div>
      </div>
    </div>
  );
};