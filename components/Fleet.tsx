import React, { useState } from 'react';
import { User, Phone, MapPin, Truck, Award, Eye, Pencil } from 'lucide-react';
import { Driver, DriverStatus } from '../types';
import { DriverScorecard } from './DriverScorecard';
import { DriverForm } from './DriverForm';

const initialDrivers: Driver[] = [
  { 
    id: 'DR-001', 
    name: 'Marcus Reid', 
    avatar: 'https://picsum.photos/100/100?random=1', 
    status: DriverStatus.EN_ROUTE, 
    truckType: 'Sleeper', 
    currentLocation: 'El Paso, TX', 
    rating: 5.0, 
    earningsWeek: 3200,
    performance: {
      onTimeDeliveryRate: 98,
      safetyViolations: 0,
      averageMpg: 7.2,
      scheduleAdherence: 99,
      managerScore: 95
    }
  },
  { 
    id: 'DR-002', 
    name: 'Sarah Jenkins', 
    avatar: 'https://picsum.photos/100/100?random=2', 
    status: DriverStatus.AVAILABLE, 
    truckType: 'Day Cab', 
    currentLocation: 'Dallas, TX', 
    rating: 4.8, 
    earningsWeek: 2100,
    performance: {
      onTimeDeliveryRate: 94,
      safetyViolations: 0,
      averageMpg: 6.8,
      scheduleAdherence: 96,
      managerScore: 88
    }
  },
  { 
    id: 'DR-003', 
    name: 'David Chen', 
    avatar: 'https://picsum.photos/100/100?random=3', 
    status: DriverStatus.OFF_DUTY, 
    truckType: 'Reefer', 
    currentLocation: 'Austin, TX', 
    rating: 4.9, 
    earningsWeek: 0,
    performance: {
      onTimeDeliveryRate: 92,
      safetyViolations: 1,
      averageMpg: 7.5,
      scheduleAdherence: 90,
      managerScore: 82
    }
  },
  { 
    id: 'DR-004', 
    name: 'Tyrell Biggs', 
    avatar: 'https://picsum.photos/100/100?random=4', 
    status: DriverStatus.AT_PICKUP, 
    truckType: 'Flatbed', 
    currentLocation: 'Midland, TX', 
    rating: 4.7, 
    earningsWeek: 1800,
    performance: {
      onTimeDeliveryRate: 89,
      safetyViolations: 2,
      averageMpg: 6.5,
      scheduleAdherence: 85,
      managerScore: 75
    }
  },
];

const getStatusColor = (status: DriverStatus) => {
  switch (status) {
    case DriverStatus.AVAILABLE: return 'bg-green-500';
    case DriverStatus.EN_ROUTE: return 'bg-blue-500';
    case DriverStatus.OFF_DUTY: return 'bg-zinc-500';
    default: return 'bg-orange-500';
  }
};

export const Fleet: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // State for adding/editing drivers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const handleUpdateScore = (driverId: string, newManagerScore: number) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          performance: {
            ...d.performance,
            managerScore: newManagerScore
          }
        };
      }
      return d;
    }));
  };

  const handleSaveDriver = (driver: Driver) => {
    setDrivers(prev => {
      // If editing existing driver
      if (prev.some(d => d.id === driver.id)) {
        return prev.map(d => d.id === driver.id ? driver : d);
      }
      // If adding new driver
      return [...prev, driver];
    });
    setIsFormOpen(false);
    setEditingDriver(null);
  };

  const openEditForm = (driver: Driver, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingDriver(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-display font-bold text-white">Fleet Management</h2>
           <p className="text-zinc-400">Manage drivers, assignments, and performance.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-twin-red text-white px-5 py-2 rounded-lg hover:bg-red-800 transition-colors font-semibold shadow-lg shadow-red-900/30"
        >
          + Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div 
            key={driver.id} 
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-twin-red transition-all duration-300 group cursor-pointer relative"
            onClick={() => setSelectedDriver(driver)}
          >
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-twin-red/0 group-hover:bg-twin-red/5 transition-colors z-0 pointer-events-none"></div>

            {/* Header / Cover */}
            <div className="h-24 bg-gradient-to-r from-zinc-900 to-zinc-800 relative z-10">
               <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${getStatusColor(driver.status)}`}></div>
                 {driver.status}
               </div>
               
               {/* Edit Button */}
               <button 
                 onClick={(e) => openEditForm(driver, e)}
                 className="absolute top-4 left-4 p-1.5 bg-black/40 hover:bg-twin-red rounded-lg text-white/70 hover:text-white transition-all backdrop-blur-sm border border-white/10"
               >
                 <Pencil className="w-4 h-4" />
               </button>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 relative z-10">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <img src={driver.avatar} alt={driver.name} className="w-20 h-20 rounded-xl border-4 border-zinc-900 shadow-lg object-cover" />
                <div className="flex gap-2">
                   <button onClick={(e) => e.stopPropagation()} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors z-20 relative">
                     <Phone className="w-4 h-4" />
                   </button>
                   <button onClick={(e) => e.stopPropagation()} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors z-20 relative">
                     <MapPin className="w-4 h-4" />
                   </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-twin-red transition-colors">{driver.name}</h3>
                <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                   <Truck className="w-3 h-3" /> {driver.truckType} • {driver.id}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800">
                <div>
                   <p className="text-xs text-zinc-500 uppercase">Current Loc</p>
                   <p className="text-sm text-white font-medium truncate">{driver.currentLocation}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-zinc-500 uppercase">Wk Earnings</p>
                   <p className="text-sm text-green-500 font-bold">${driver.earningsWeek.toLocaleString()}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-4 bg-zinc-950/50 p-3 rounded-lg flex items-center justify-between">
                 <div className="flex items-center gap-3 flex-1">
                   <Award className="w-5 h-5 text-yellow-500" />
                   <div className="flex-1 max-w-[100px]">
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-yellow-500" style={{ width: `${(driver.rating / 5) * 100}%` }}></div>
                     </div>
                   </div>
                   <span className="text-sm font-bold text-white">{driver.rating}</span>
                 </div>
                 <div className="text-xs text-twin-red font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   View Scorecard <Eye className="w-3 h-3" />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDriver && (
        <DriverScorecard 
          driver={selectedDriver} 
          onClose={() => setSelectedDriver(null)}
          onUpdateScore={handleUpdateScore}
        />
      )}

      {isFormOpen && (
        <DriverForm 
          driver={editingDriver}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveDriver}
        />
      )}
    </div>
  );
};