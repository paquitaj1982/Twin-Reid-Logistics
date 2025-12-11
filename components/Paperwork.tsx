import React, { useState } from 'react';
import { FileText, Upload, Check, X, Filter, Search, Eye, AlertCircle, FileCheck, Trash2 } from 'lucide-react';
import { Document, DocumentType, DocumentStatus } from '../types';

const initialDocs: Document[] = [
  { id: 'DOC-1001', type: 'BOL', loadId: 'LD-8832', driverName: 'Marcus Reid', uploadDate: '2023-10-24', status: 'Verified', fileSize: '1.2 MB', notes: 'Signed by receiver' },
  { id: 'DOC-1002', type: 'Fuel Receipt', loadId: 'LD-8832', driverName: 'Marcus Reid', uploadDate: '2023-10-24', status: 'Pending', fileSize: '0.5 MB', notes: 'Loves Travel Stop #44' },
  { id: 'DOC-1003', type: 'Scale Ticket', loadId: 'LD-9910', driverName: 'Sarah Jenkins', uploadDate: '2023-10-25', status: 'Rejected', fileSize: '0.8 MB', notes: 'Blurry image, please re-upload' },
  { id: 'DOC-1004', type: 'POD', loadId: 'LD-9910', driverName: 'Sarah Jenkins', uploadDate: '2023-10-25', status: 'Pending', fileSize: '1.5 MB' },
];

export const Paperwork: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocs);
  const [filter, setFilter] = useState<'All' | DocumentStatus>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Upload State
  const [newDocType, setNewDocType] = useState<DocumentType>('BOL');
  const [newDocLoadId, setNewDocLoadId] = useState('');
  const [newDocDriver, setNewDocDriver] = useState('');
  const [newDocNotes, setNewDocNotes] = useState('');

  const filteredDocs = documents.filter(doc => filter === 'All' || doc.status === filter);

  const handleStatusChange = (id: string, newStatus: DocumentStatus) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this document record?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Document = {
      id: `DOC-${Math.floor(Math.random() * 10000)}`,
      type: newDocType,
      loadId: newDocLoadId || 'N/A',
      driverName: newDocDriver || 'Unknown Driver',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      fileSize: '2.4 MB', // Simulated
      notes: newDocNotes
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
    // Reset form
    setNewDocLoadId('');
    setNewDocDriver('');
    setNewDocNotes('');
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch(status) {
      case 'Verified': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Paperwork Center</h2>
          <p className="text-zinc-400">Manage BOLs, PODs, and receipts.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-twin-red hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-red-900/30 flex items-center gap-2 transition-all"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Stats & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['All', 'Pending', 'Verified', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${
              filter === status 
                ? 'bg-zinc-800 border-twin-red' 
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${status === 'All' ? 'text-white' : status === 'Pending' ? 'text-yellow-500' : status === 'Verified' ? 'text-green-500' : 'text-red-500'}`}>
              <FileText className="w-12 h-12" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{status} Docs</p>
            <p className="text-2xl font-bold text-white font-display">
              {status === 'All' ? documents.length : documents.filter(d => d.status === status).length}
            </p>
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Document Details</th>
                <th className="p-4">Load ID</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-zinc-900 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <FileText className="w-5 h-5 text-twin-red" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{doc.type}</p>
                        <p className="text-xs text-zinc-500">{doc.uploadDate} • {doc.fileSize}</p>
                      </div>
                    </div>
                    {doc.notes && <p className="text-xs text-zinc-400 mt-1 italic pl-10">"{doc.notes}"</p>}
                  </td>
                  <td className="p-4 text-sm text-zinc-300 font-mono">{doc.loadId}</td>
                  <td className="p-4 text-sm text-white">{doc.driverName}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatusChange(doc.id, 'Verified')} className="p-1.5 hover:bg-green-900/30 text-zinc-400 hover:text-green-500 rounded transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleStatusChange(doc.id, 'Rejected')} className="p-1.5 hover:bg-red-900/30 text-zinc-400 hover:text-red-500 rounded transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-red-500 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No documents found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
              <h2 className="text-xl font-display font-bold text-white">Upload Paperwork</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Document Type</label>
                <select 
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                >
                  <option value="BOL">Bill of Lading (BOL)</option>
                  <option value="POD">Proof of Delivery (POD)</option>
                  <option value="Fuel Receipt">Fuel Receipt</option>
                  <option value="Scale Ticket">Scale Ticket</option>
                  <option value="Lumper Receipt">Lumper Receipt</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Load ID (Optional)</label>
                <input 
                  type="text"
                  value={newDocLoadId}
                  onChange={(e) => setNewDocLoadId(e.target.value)}
                  placeholder="e.g. LD-1024"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Driver Name</label>
                <input 
                  type="text"
                  required
                  value={newDocDriver}
                  onChange={(e) => setNewDocDriver(e.target.value)}
                  placeholder="Driver Name"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-twin-red"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Notes</label>
                <textarea 
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-twin-red h-20 resize-none"
                  placeholder="Any additional details..."
                />
              </div>

              <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-twin-red transition-colors cursor-pointer bg-zinc-950/50">
                <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-sm text-zinc-300">Click to select file</p>
                <p className="text-xs text-zinc-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-twin-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/20"
              >
                Upload Document
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
