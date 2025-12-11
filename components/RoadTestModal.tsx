import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Truck, User } from 'lucide-react';

interface RoadTestModalProps {
  onClose: () => void;
  onBook: (date: string, time: string, instructor: string) => void;
}

const timeSlots = [
  '08:00 AM', '09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'
];

const instructors = [
  'Master Driver Mike', 'Instructor Sarah', 'Capt. James (Senior)'
];

export const RoadTestModal: React.FC<RoadTestModalProps> = ({ onClose, onBook }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedInstructor, setSelectedInstructor] = useState<string>(instructors[0]);
  const [step, setStep] = useState(1);

  const handleBook = () => {
    onBook(selectedDate, selectedTime, selectedInstructor);
  };

  // Get current date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div>
             <h2 className="text-xl font-display font-bold text-white">Book Road Test</h2>
             <p className="text-xs text-zinc-400">Final Certification Exam</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Date Selection */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-twin-red" />
                  <input 
                    type="date" 
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-twin-red [color-scheme:dark] cursor-pointer"
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Available Time Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        selectedTime === time 
                          ? 'bg-twin-red border-twin-red text-white shadow-lg shadow-red-900/40' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructor Selection */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Preferred Instructor</label>
                <div className="space-y-2">
                  {instructors.map((inst) => (
                    <button
                      key={inst}
                      onClick={() => setSelectedInstructor(inst)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        selectedInstructor === inst
                          ? 'bg-zinc-800 border-twin-red ring-1 ring-twin-red'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${selectedInstructor === inst ? 'bg-twin-red text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-medium ${selectedInstructor === inst ? 'text-white' : 'text-zinc-400'}`}>{inst}</span>
                      {selectedInstructor === inst && <CheckCircle className="w-4 h-4 text-twin-red ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime}
            className="px-6 py-2 rounded-lg bg-twin-red hover:bg-red-700 text-white font-bold transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(139,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Truck className="w-4 h-4" /> Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};