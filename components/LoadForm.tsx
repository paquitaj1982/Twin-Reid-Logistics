import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, DollarSign, Calendar, Box, Navigation, Truck, User } from 'lucide-react';
import { Load, LoadType, Driver } from '../types';

interface LoadFormProps {
  load?: Load | null;
  drivers: Driver[];
  onClose: () => void;
  onSave: (load: Load) => void;
}

const emptyLoad: Load = {
  id: '',
  origin: '',
  destination: '',
  rate: 0,
  distance: 0,
  weight: 0,
  type: LoadType.OTR,
  status: 'Open',
  commodity: '',
  pickupDate: new Date().toISOString().split('T')[0],
};

export const LoadForm: React.FC<LoadFormProps> = ({ load, drivers, onClose, onSave }) => {
  const [formData, setFormData] = useState<Load>(emptyLoad);

  useEffect(() => {
    if (load) {
      setFormData(load);
    } else {
      setFormData({
        ...emptyLoad,
        id: `LD-${Math.floor(Math.random() * 10000)}`
      });
    }
  }, [load]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDriverChange = (driverId: string) => {
    if (driverId) {
      setFormData({
        ...formData,
        assignedDriverId: driverId,
        status: 'Assigned'
      });
    } else {
      setFormData({
        ...formData,
        assignedDriverId: undefined,
        status: 'Open'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
          <h2 className="text-xl font-display font-bold text-white">{load ? 'Edit Load' : 'Post New Load'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Origin</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="text"
                  value={formData.origin}
                  onChange={e => setFormData({...formData, origin: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="City, State"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Destination</label>
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="text"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Rate ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="number"
                  value={formData.rate}
                  onChange={e => setFormData({...formData, rate: parseFloat(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Distance (mi)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="number"
                  value={formData.distance}
                  onChange={e => setFormData({...formData, distance: parseFloat(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="Miles"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Weight (lbs)</label>
              <div className="relative">
                <Box className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="number"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                  placeholder="Weight"
                />
              </div>
            </div>
          </div>

          {/* Assigned Driver Section */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Assigned Driver</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <select
                value={formData.assignedDriverId || ''}
                onChange={e => handleDriverChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red appearance-none"
              >
                <option value="">-- Unassigned --</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.status}) - {driver.truckType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Commodity</label>
               <input
                 type="text"
                 value={formData.commodity}
                 onChange={e => setFormData({...formData, commodity: e.target.value})}
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                 placeholder="Cargo description"
               />
             </div>
             <div>
               <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Pickup Date</label>
               <div className="relative">
                 <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                 <input
                   type="date"
                   value={formData.pickupDate}
                   onChange={e => setFormData({...formData, pickupDate: e.target.value})}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red [color-scheme:dark]"
                 />
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Load Type</label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as LoadType})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-twin-red appearance-none"
                >
                  {Object.values(LoadType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-twin-red appearance-none"
              >
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
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
              <Save className="w-4 h-4" /> {load ? 'Save Changes' : 'Post Load'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};