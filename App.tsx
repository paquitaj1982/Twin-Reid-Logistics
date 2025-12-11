import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Map as MapIcon, 
  FileText, 
  GraduationCap, 
  Settings, 
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Dispatch } from './components/Dispatch';
import { Fleet } from './components/Fleet';
import { Academy } from './components/Academy';
import { Paperwork } from './components/Paperwork';
import { ChatAssistant } from './components/ChatAssistant';
import { AdminProfileModal } from './components/AdminProfileModal';
import { AdminProfile } from './types';

type View = 'dashboard' | 'fleet' | 'dispatch' | 'academy' | 'paperwork';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'HQ Admin',
    role: 'Operations Manager',
    email: 'admin@twinreid.com',
    avatar: 'https://picsum.photos/40/40?random=10'
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleUpdateProfile = (newProfile: AdminProfile) => {
    setAdminProfile(newProfile);
    setIsAdminModalOpen(false);
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); // Close mobile menu on navigate
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => handleNavClick(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        currentView === view 
          ? 'bg-twin-red text-white shadow-lg shadow-red-900/20' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${currentView === view ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`} />
      <span className={`font-medium ${!isSidebarOpen && 'md:hidden'}`}>{label}</span>
      {currentView === view && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-zinc-200 selection:bg-twin-red selection:text-white">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-950 border-r border-zinc-900 transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-auto'
        } ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}
      >
        <div className="p-6 flex items-center gap-3 justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-twin-red to-black rounded-lg flex items-center justify-center border border-zinc-700 shadow-lg shrink-0">
               <span className="font-display font-bold text-white text-xl">TR</span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'md:opacity-0 md:w-0'}`}>
              <h1 className="font-display font-bold text-white text-lg leading-tight">TWIN REID</h1>
              <p className="text-xs text-twin-red tracking-widest uppercase">Logistics</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden text-zinc-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="dispatch" icon={MapIcon} label="Dispatch" />
          <NavItem view="fleet" icon={Truck} label="Fleet Manager" />
          <NavItem view="academy" icon={GraduationCap} label="Academy" />
          
          <div className="my-6 border-t border-zinc-900 mx-2"></div>
          
          <NavItem view="paperwork" icon={FileText} label="Paperwork" />
        </nav>

        <div className="p-4 border-t border-zinc-900 hidden md:block">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-full flex items-center justify-center p-2 text-zinc-500 hover:text-white transition-colors"
           >
             <Menu className="w-5 h-5" />
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Top Bar */}
        <header className="h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white p-1"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-twin-red rounded flex items-center justify-center text-white font-bold">TR</div>
            </div>
            
            {/* Breadcrumb or Page Title Placeholder */}
            <div className="hidden md:block text-zinc-500 text-sm">
              Twin Reid Systems <span className="mx-2">/</span> <span className="text-white capitalize">{currentView}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsAdminModalOpen(true)}
               className="flex items-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 pl-2 pr-4 py-1.5 rounded-full border border-zinc-800 hover:border-twin-red transition-all duration-300 group"
             >
                <img src={adminProfile.avatar} alt="User" className="w-8 h-8 rounded-full border border-zinc-700 group-hover:border-twin-red/50 transition-colors" />
                <div className="text-left hidden sm:block">
                  <span className="block text-sm font-bold text-white leading-none">{adminProfile.name}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider group-hover:text-twin-red transition-colors">{adminProfile.role}</span>
                </div>
             </button>
             <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Content Area with Background */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Hero Background Image - Fixed */}
          <div className="fixed inset-0 z-0">
             <div className="absolute inset-0 bg-black/90 z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
               className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
               alt="Truck Background"
             />
          </div>

          <div className="relative z-10 p-4 md:p-10 max-w-7xl mx-auto min-h-full">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'dispatch' && <Dispatch />}
            {currentView === 'fleet' && <Fleet />}
            {currentView === 'academy' && <Academy />}
            {currentView === 'paperwork' && <Paperwork />}
          </div>
        </div>

        {/* Floating AI Button */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-twin-red to-red-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/40 hover:scale-110 transition-all duration-300 z-40 group border border-red-500"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute right-0 top-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>
        )}

        {/* Chat Interface */}
        <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Admin Profile Modal */}
        {isAdminModalOpen && (
          <AdminProfileModal 
            profile={adminProfile} 
            onClose={() => setIsAdminModalOpen(false)} 
            onSave={handleUpdateProfile} 
          />
        )}
        
      </main>
    </div>
  );
};

export default App;