import React, { useState } from 'react';
import { Search, Filter, Map, DollarSign, Clock, ArrowRight, Pencil, Trash2, Plus, User } from 'lucide-react';
import { Load, LoadType, Driver, DriverStatus } from '../types';
import { LoadForm } from './LoadForm';

// Mock Drivers Data (Duplicated from Fleet for standalone context)
const mockDrivers: Driver[] = [
  { 
    id: 'DR-001', 
    name: 'Marcus Reid', 
    avatar: 'https://picsum.photos/100/100?random=1', 
    status: DriverStatus.EN_ROUTE, 
    truckType: 'Sleeper', 
    currentLocation: 'El Paso, TX', 
    rating: 5.0, 
    earningsWeek: 3200,
    performance: { onTimeDeliveryRate: 98, safetyViolations: 0, averageMpg: 7.2, scheduleAdherence: 99, managerScore: 95 }
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
    performance: { onTimeDeliveryRate: 94, safetyViolations: 0, averageMpg: 6.8, scheduleAdherence: 96, managerScore: 88 }
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
    performance: { onTimeDeliveryRate: 92, safetyViolations: 1, averageMpg: 7.5, scheduleAdherence: 90, managerScore: 82 }
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
    performance: { onTimeDeliveryRate: 89, safetyViolations: 2, averageMpg: 6.5, scheduleAdherence: 85, managerScore: 75 }
  },
];

// Initial Mock Data
const initialLoads: Load[] = [
  // Existing
  { id: 'LD-8832', origin: 'Dallas, TX', destination: 'Phoenix, AZ', rate: 2400, distance: 1060, weight: 38000, type: LoadType.OTR, status: 'Open', commodity: 'Auto Parts', pickupDate: '2023-10-24' },
  { id: 'LD-9910', origin: 'Fort Worth, TX', destination: 'Houston, TX', rate: 850, distance: 260, weight: 42000, type: LoadType.LOCAL, status: 'Open', commodity: 'Building Materials', pickupDate: '2023-10-25' },
  
  // AL to WY coverage
  { id: 'LD-1001', origin: 'Birmingham, AL', destination: 'Mobile, AL', rate: 750, distance: 260, weight: 41000, type: LoadType.LOCAL, status: 'Open', commodity: 'Steel', pickupDate: '2023-10-26' },
  { id: 'LD-1002', origin: 'Anchorage, AK', destination: 'Fairbanks, AK', rate: 2800, distance: 360, weight: 35000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Machinery', pickupDate: '2023-10-26' },
  { id: 'LD-1003', origin: 'Phoenix, AZ', destination: 'Los Angeles, CA', rate: 1100, distance: 370, weight: 44000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Produce', pickupDate: '2023-10-27' },
  { id: 'LD-1004', origin: 'Little Rock, AR', destination: 'Memphis, TN', rate: 600, distance: 137, weight: 38000, type: LoadType.LOCAL, status: 'Open', commodity: 'Rice', pickupDate: '2023-10-27' },
  { id: 'LD-1005', origin: 'Los Angeles, CA', destination: 'Las Vegas, NV', rate: 1200, distance: 270, weight: 42000, type: LoadType.REGIONAL, status: 'Assigned', commodity: 'Electronics', pickupDate: '2023-10-28', assignedDriverId: 'DR-001' },
  { id: 'LD-1006', origin: 'Denver, CO', destination: 'Salt Lake City, UT', rate: 1500, distance: 520, weight: 36000, type: LoadType.OTR, status: 'Open', commodity: 'Beverages', pickupDate: '2023-10-28' },
  { id: 'LD-1007', origin: 'Hartford, CT', destination: 'New York, NY', rate: 800, distance: 115, weight: 20000, type: LoadType.LOCAL, status: 'Open', commodity: 'Paper', pickupDate: '2023-10-28' },
  { id: 'LD-1008', origin: 'Wilmington, DE', destination: 'Philadelphia, PA', rate: 450, distance: 30, weight: 15000, type: LoadType.LOCAL, status: 'Open', commodity: 'Chemicals', pickupDate: '2023-10-29' },
  { id: 'LD-1009', origin: 'Miami, FL', destination: 'Orlando, FL', rate: 950, distance: 235, weight: 40000, type: LoadType.LOCAL, status: 'Open', commodity: 'Fruits', pickupDate: '2023-10-29' },
  { id: 'LD-1010', origin: 'Atlanta, GA', destination: 'Savannah, GA', rate: 850, distance: 248, weight: 43000, type: LoadType.LOCAL, status: 'Assigned', commodity: 'Textiles', pickupDate: '2023-10-29', assignedDriverId: 'DR-002' },
  { id: 'LD-1011', origin: 'Honolulu, HI', destination: 'Hilo, HI', rate: 500, distance: 200, weight: 12000, type: LoadType.LOCAL, status: 'Open', commodity: 'General Freight', pickupDate: '2023-10-29' },
  { id: 'LD-1012', origin: 'Boise, ID', destination: 'Portland, OR', rate: 1300, distance: 430, weight: 45000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Potatoes', pickupDate: '2023-10-30' },
  { id: 'LD-1013', origin: 'Chicago, IL', destination: 'St. Louis, MO', rate: 1100, distance: 297, weight: 41000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Manufacturing Parts', pickupDate: '2023-10-30' },
  { id: 'LD-1014', origin: 'Indianapolis, IN', destination: 'Columbus, OH', rate: 700, distance: 175, weight: 39000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Auto Parts', pickupDate: '2023-10-30' },
  { id: 'LD-1015', origin: 'Des Moines, IA', destination: 'Omaha, NE', rate: 650, distance: 140, weight: 42000, type: LoadType.LOCAL, status: 'Open', commodity: 'Corn', pickupDate: '2023-10-30' },
  { id: 'LD-1016', origin: 'Wichita, KS', destination: 'Kansas City, MO', rate: 800, distance: 196, weight: 35000, type: LoadType.LOCAL, status: 'Open', commodity: 'Wheat', pickupDate: '2023-10-31' },
  { id: 'LD-1017', origin: 'Louisville, KY', destination: 'Nashville, TN', rate: 700, distance: 175, weight: 40000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Bourbon', pickupDate: '2023-10-31' },
  { id: 'LD-1018', origin: 'New Orleans, LA', destination: 'Baton Rouge, LA', rate: 450, distance: 80, weight: 44000, type: LoadType.LOCAL, status: 'Open', commodity: 'Seafood', pickupDate: '2023-10-31' },
  { id: 'LD-1019', origin: 'Portland, ME', destination: 'Boston, MA', rate: 550, distance: 107, weight: 28000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Lobster', pickupDate: '2023-10-31' },
  { id: 'LD-1020', origin: 'Baltimore, MD', destination: 'Washington, DC', rate: 400, distance: 40, weight: 15000, type: LoadType.LOCAL, status: 'Open', commodity: 'Medical Supplies', pickupDate: '2023-11-01' },
  { id: 'LD-1021', origin: 'Boston, MA', destination: 'Providence, RI', rate: 350, distance: 50, weight: 18000, type: LoadType.LOCAL, status: 'Open', commodity: 'Tech Goods', pickupDate: '2023-11-01' },
  { id: 'LD-1022', origin: 'Detroit, MI', destination: 'Chicago, IL', rate: 900, distance: 280, weight: 42000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Car Parts', pickupDate: '2023-11-01' },
  { id: 'LD-1023', origin: 'Minneapolis, MN', destination: 'Fargo, ND', rate: 850, distance: 235, weight: 39000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Grain', pickupDate: '2023-11-01' },
  { id: 'LD-1024', origin: 'Jackson, MS', destination: 'New Orleans, LA', rate: 750, distance: 185, weight: 41000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Cotton', pickupDate: '2023-11-02' },
  { id: 'LD-1025', origin: 'St. Louis, MO', destination: 'Chicago, IL', rate: 1000, distance: 297, weight: 43000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Beer', pickupDate: '2023-11-02' },
  { id: 'LD-1026', origin: 'Billings, MT', destination: 'Seattle, WA', rate: 2100, distance: 820, weight: 38000, type: LoadType.OTR, status: 'Open', commodity: 'Cattle', pickupDate: '2023-11-02' },
  { id: 'LD-1027', origin: 'Omaha, NE', destination: 'Lincoln, NE', rate: 300, distance: 60, weight: 40000, type: LoadType.LOCAL, status: 'Open', commodity: 'Beef', pickupDate: '2023-11-02' },
  { id: 'LD-1028', origin: 'Las Vegas, NV', destination: 'Reno, NV', rate: 1400, distance: 450, weight: 35000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Convention Goods', pickupDate: '2023-11-03' },
  { id: 'LD-1029', origin: 'Manchester, NH', destination: 'Concord, NH', rate: 250, distance: 20, weight: 10000, type: LoadType.LOCAL, status: 'Open', commodity: 'Granite', pickupDate: '2023-11-03' },
  { id: 'LD-1030', origin: 'Newark, NJ', destination: 'New York, NY', rate: 500, distance: 15, weight: 25000, type: LoadType.LOCAL, status: 'Open', commodity: 'Imports', pickupDate: '2023-11-03' },
  { id: 'LD-1031', origin: 'Albuquerque, NM', destination: 'Santa Fe, NM', rate: 350, distance: 65, weight: 15000, type: LoadType.LOCAL, status: 'Open', commodity: 'Art Supplies', pickupDate: '2023-11-03' },
  { id: 'LD-1032', origin: 'New York, NY', destination: 'Albany, NY', rate: 650, distance: 150, weight: 30000, type: LoadType.LOCAL, status: 'Open', commodity: 'Fashion', pickupDate: '2023-11-04' },
  { id: 'LD-1033', origin: 'Charlotte, NC', destination: 'Raleigh, NC', rate: 600, distance: 165, weight: 38000, type: LoadType.LOCAL, status: 'Open', commodity: 'Banking Docs', pickupDate: '2023-11-04' },
  { id: 'LD-1034', origin: 'Fargo, ND', destination: 'Bismarck, ND', rate: 700, distance: 196, weight: 42000, type: LoadType.LOCAL, status: 'Open', commodity: 'Oil Equip', pickupDate: '2023-11-04' },
  { id: 'LD-1035', origin: 'Columbus, OH', destination: 'Cleveland, OH', rate: 600, distance: 140, weight: 40000, type: LoadType.LOCAL, status: 'Open', commodity: 'Tires', pickupDate: '2023-11-04' },
  { id: 'LD-1036', origin: 'Oklahoma City, OK', destination: 'Tulsa, OK', rate: 500, distance: 106, weight: 39000, type: LoadType.LOCAL, status: 'Open', commodity: 'Energy Equip', pickupDate: '2023-11-05' },
  { id: 'LD-1037', origin: 'Portland, OR', destination: 'Eugene, OR', rate: 550, distance: 110, weight: 36000, type: LoadType.LOCAL, status: 'Open', commodity: 'Lumber', pickupDate: '2023-11-05' },
  { id: 'LD-1038', origin: 'Philadelphia, PA', destination: 'Pittsburgh, PA', rate: 1200, distance: 305, weight: 41000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Steel', pickupDate: '2023-11-05' },
  { id: 'LD-1039', origin: 'Providence, RI', destination: 'Newport, RI', rate: 300, distance: 35, weight: 12000, type: LoadType.LOCAL, status: 'Open', commodity: 'Maritime Goods', pickupDate: '2023-11-05' },
  { id: 'LD-1040', origin: 'Charleston, SC', destination: 'Columbia, SC', rate: 550, distance: 115, weight: 38000, type: LoadType.LOCAL, status: 'Open', commodity: 'Automotive', pickupDate: '2023-11-06' },
  { id: 'LD-1041', origin: 'Sioux Falls, SD', destination: 'Rapid City, SD', rate: 1300, distance: 350, weight: 37000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Agriculture', pickupDate: '2023-11-06' },
  { id: 'LD-1042', origin: 'Nashville, TN', destination: 'Memphis, TN', rate: 800, distance: 212, weight: 40000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Music Gear', pickupDate: '2023-11-06' },
  { id: 'LD-1043', origin: 'Houston, TX', destination: 'San Antonio, TX', rate: 850, distance: 197, weight: 42000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Oil', pickupDate: '2023-11-06' },
  { id: 'LD-1044', origin: 'Salt Lake City, UT', destination: 'Provo, UT', rate: 350, distance: 45, weight: 20000, type: LoadType.LOCAL, status: 'Open', commodity: 'Tech', pickupDate: '2023-11-07' },
  { id: 'LD-1045', origin: 'Burlington, VT', destination: 'Montpelier, VT', rate: 300, distance: 40, weight: 15000, type: LoadType.LOCAL, status: 'Open', commodity: 'Maple Syrup', pickupDate: '2023-11-07' },
  { id: 'LD-1046', origin: 'Richmond, VA', destination: 'Norfolk, VA', rate: 500, distance: 93, weight: 39000, type: LoadType.LOCAL, status: 'Open', commodity: 'Naval Supplies', pickupDate: '2023-11-07' },
  { id: 'LD-1047', origin: 'Seattle, WA', destination: 'Spokane, WA', rate: 1200, distance: 280, weight: 40000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Aerospace', pickupDate: '2023-11-07' },
  { id: 'LD-1048', origin: 'Charleston, WV', destination: 'Morgantown, WV', rate: 600, distance: 155, weight: 43000, type: LoadType.LOCAL, status: 'Open', commodity: 'Coal', pickupDate: '2023-11-08' },
  { id: 'LD-1049', origin: 'Milwaukee, WI', destination: 'Madison, WI', rate: 450, distance: 80, weight: 38000, type: LoadType.LOCAL, status: 'Open', commodity: 'Cheese', pickupDate: '2023-11-08' },
  { id: 'LD-1050', origin: 'Cheyenne, WY', destination: 'Casper, WY', rate: 700, distance: 178, weight: 40000, type: LoadType.REGIONAL, status: 'Open', commodity: 'Wind Turbines', pickupDate: '2023-11-08' }
];

export const Dispatch: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);

  const filteredLoads = loads.filter(load => {
    const matchesType = filterType === 'All' || load.type === filterType;
    const matchesSearch = load.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          load.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSaveLoad = (load: Load) => {
    setLoads(prev => {
      // Edit existing
      if (prev.some(l => l.id === load.id)) {
        return prev.map(l => l.id === load.id ? load : l);
      }
      // Add new
      return [load, ...prev];
    });
    setIsFormOpen(false);
    setEditingLoad(null);
  };

  const handleDeleteLoad = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this load?')) {
      setLoads(prev => prev.filter(l => l.id !== id));
    }
  };

  const openAddForm = () => {
    setEditingLoad(null);
    setIsFormOpen(true);
  };

  const openEditForm = (load: Load, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLoad(load);
    setIsFormOpen(true);
  };

  const getDriver = (driverId?: string) => {
    return mockDrivers.find(d => d.id === driverId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-display font-bold text-white">High-Value Loads</h2>
          <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs font-bold border border-zinc-700">
            {filteredLoads.length} Active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {['All', 'Local', 'OTR'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterType === type 
                    ? 'bg-twin-red text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button 
            onClick={openAddForm}
            className="px-4 py-2 bg-twin-red hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-900/40 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post Load
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-twin-red focus:border-transparent sm:text-sm backdrop-blur-md"
          placeholder="Search by city, commodity, or load ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
           <button className="text-zinc-400 hover:text-white flex items-center gap-1 text-xs uppercase tracking-wide">
             <Filter className="w-4 h-4" /> Filters
           </button>
        </div>
      </div>

      {/* Load List */}
      <div className="grid gap-4">
        {filteredLoads.map((load) => {
          const assignedDriver = getDriver(load.assignedDriverId);
          
          return (
            <div key={load.id} className="group bg-zinc-900/80 border border-zinc-800 hover:border-twin-red rounded-xl p-6 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-twin-red transition-colors"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                {/* Route Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-3 text-sm text-zinc-500">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{load.type}</span>
                      <span>{load.id}</span>
                      <span>{load.pickupDate}</span>
                     </div>
                     
                     {/* Mobile Edit/Delete - Always visible on mobile */}
                     <div className="flex items-center gap-2 md:hidden">
                       <button onClick={(e) => openEditForm(load, e)} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
                       <button onClick={(e) => handleDeleteLoad(load.id, e)} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white">{load.origin}</h3>
                    <ArrowRight className="text-zinc-600" />
                    <h3 className="text-xl font-bold text-white">{load.destination}</h3>
                  </div>
                  <p className="text-zinc-400 mt-2 text-sm">{load.commodity} • {load.weight.toLocaleString()} lbs</p>
                </div>

                {/* Metrics */}
                <div className="flex gap-8 text-center md:text-left border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-8 mt-4 md:mt-0">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Rate</p>
                    <p className="text-2xl font-bold text-green-500 font-display">${load.rate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Distance</p>
                    <p className="text-xl font-bold text-white font-display">{load.distance} mi</p>
                  </div>
                  <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider">RPM</p>
                     <p className="text-xl font-bold text-twin-cream font-display">${load.distance > 0 ? (load.rate / load.distance).toFixed(2) : '0.00'}</p>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-4 md:mt-0 flex flex-col gap-2 min-w-[160px]">
                  {assignedDriver ? (
                    <button 
                      onClick={(e) => openEditForm(load, e)}
                      className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700 hover:border-twin-red transition-all flex items-center gap-3 text-left group-hover:bg-zinc-800"
                    >
                       <img src={assignedDriver.avatar} alt={assignedDriver.name} className="w-8 h-8 rounded-full border border-zinc-600" />
                       <div className="flex-1 overflow-hidden">
                         <p className="text-xs text-zinc-500">Assigned To</p>
                         <p className="text-xs font-bold text-white truncate">{assignedDriver.name}</p>
                       </div>
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => openEditForm(load, e)}
                      className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm rounded hover:bg-twin-red hover:text-white transition-colors w-full flex items-center justify-center gap-2"
                    >
                       <User className="w-4 h-4" /> Assign Driver
                    </button>
                  )}
                  
                  {/* Desktop Edit/Delete - Visible on md screens */}
                  <div className="flex items-center justify-end gap-2 mt-2">
                     <button onClick={(e) => openEditForm(load, e)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit</button>
                     <span className="text-zinc-700">|</span>
                     <button onClick={(e) => handleDeleteLoad(load.id, e)} className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLoads.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <Map className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No loads found matching your criteria.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <LoadForm 
          load={editingLoad}
          drivers={mockDrivers}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveLoad}
        />
      )}
    </div>
  );
};