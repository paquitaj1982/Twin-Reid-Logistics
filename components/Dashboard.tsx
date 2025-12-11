import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Truck, MapPin, DollarSign, Activity } from 'lucide-react';
import { Driver, DriverStatus, Load } from '../types';
import { LoadForm } from './LoadForm';

// Mock Data for Charts
const data = [
  { name: 'Mon', revenue: 4000, miles: 2400 },
  { name: 'Tue', revenue: 3000, miles: 1398 },
  { name: 'Wed', revenue: 9800, miles: 5000 },
  { name: 'Thu', revenue: 6500, miles: 3200 },
  { name: 'Fri', revenue: 8900, miles: 4100 },
  { name: 'Sat', revenue: 12000, miles: 6800 },
  { name: 'Sun', revenue: 7400, miles: 3800 },
];

const fleetStatusData = [
  { name: 'Rolling', value: 12, color: '#16a34a' },
  { name: 'Loading', value: 4, color: '#ea580c' },
  { name: 'Idle', value: 3, color: '#dc2626' },
];

// Mock Drivers for Booking (Shared context simulation)
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

const KPICard = ({ title, value, subtext, icon: Icon }: { title: string, value: string, subtext: string, icon: any }) => (
  <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm hover:border-twin-red transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-zinc-400 text-sm uppercase tracking-wider font-display">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1 font-display group-hover:text-twin-cream transition-colors">{value}</h3>
      </div>
      <div className="p-3 bg-zinc-950 rounded-lg group-hover:bg-twin-red/20 transition-colors">
        <Icon className="w-6 h-6 text-twin-red" />
      </div>
    </div>
    <p className="text-sm text-zinc-500">{subtext}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const [isLoadFormOpen, setIsLoadFormOpen] = useState(false);

  const handleBookLoad = (load: Load) => {
    setIsLoadFormOpen(false);
    
    // Simulate Notification System
    if (load.assignedDriverId) {
      const driver = mockDrivers.find(d => d.id === load.assignedDriverId);
      const driverName = driver ? driver.name : 'Driver';
      
      // Simulate delay for realism
      setTimeout(() => {
        alert(
          `🚀 LOAD ${load.id} BOOKED SUCCESSFULLY!\n\n` +
          `DETAILS:\n` +
          `--------------------------------\n` +
          `Origin: ${load.origin}\n` +
          `Destination: ${load.destination}\n` +
          `Rate: $${load.rate.toLocaleString()}\n` +
          `--------------------------------\n\n` +
          `✅ SYSTEM ACTIONS:\n` +
          `📨 Email Confirmation sent to ${driverName} (driver@twinreid.com)\n` +
          `📱 SMS Dispatch Alert sent to ${driverName} (555-0199)\n` +
          `"New Load Assigned: Pick up at ${load.origin} on ${load.pickupDate}. Log in to view details."`
        );
      }, 500);
    } else {
      setTimeout(() => {
        alert(
          `✅ LOAD ${load.id} POSTED!\n\n` +
          `The load has been successfully added to the Open Load Board.\n` +
          `Drivers will be notified of available high-value freight in ${load.origin}.`
        );
      }, 500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">Command Center</h1>
          <p className="text-zinc-400 mt-1">Twin Reid Logistics Ecosystem</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors border border-zinc-700">
            Export Report
          </button>
          <button 
            onClick={() => setIsLoadFormOpen(true)}
            className="px-4 py-2 bg-twin-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(139,0,0,0.5)] flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" /> Book New Load
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value="$51,600" subtext="+12% from last week" icon={DollarSign} />
        <KPICard title="Active Fleet" value="16/19" subtext="3 Drivers Off Duty" icon={Truck} />
        <KPICard title="Total Miles" value="26,450" subtext="Avg $2.95/mile" icon={MapPin} />
        <KPICard title="Open Loads" value="8" subtext="High Priority: 3" icon={Activity} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-xl font-display font-bold text-white mb-6">Revenue & Mileage</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B0000" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888'}} />
                <YAxis stroke="#666" tick={{fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-xl font-display font-bold text-white mb-6">Fleet Status</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={fleetStatusData} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="#888" width={60} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                   {fleetStatusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Rolling</span>
              <span className="text-green-500 font-bold">63%</span>
            </div>
             <div className="flex justify-between text-sm text-zinc-400">
              <span>Loading/Unloading</span>
              <span className="text-orange-500 font-bold">21%</span>
            </div>
             <div className="flex justify-between text-sm text-zinc-400">
              <span>Idle/Maint</span>
              <span className="text-red-500 font-bold">16%</span>
            </div>
          </div>
        </div>
      </div>

      {isLoadFormOpen && (
        <LoadForm 
          drivers={mockDrivers}
          onClose={() => setIsLoadFormOpen(false)}
          onSave={handleBookLoad}
        />
      )}
    </div>
  );
};