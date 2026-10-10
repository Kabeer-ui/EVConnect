import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { User, Vehicle, ConnectorType } from '../types';
import {
  User as UserIcon,
  Car,
  Zap,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  Plus,
  Save,
  Mail,
  Phone
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Edit states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredConnector, setPreferredConnector] = useState<ConnectorType>('CCS2');
  const [bookingReminders, setBookingReminders] = useState(true);
  const [stationAlerts, setStationAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);

  // New vehicle modal/form toggle
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newCapacity, setNewCapacity] = useState('75');

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchUser() {
      const data = await userService.getProfile();
      setUser(data);
      setName(data.name);
      setPhone(data.phone);
      setPreferredConnector(data.preferredConnector);
      setBookingReminders(data.notificationSettings.bookingReminders);
      setStationAlerts(data.notificationSettings.stationAlerts);
      setEmailReceipts(data.notificationSettings.emailReceipts);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading || !user) {
    return <div className="py-20 text-center text-xs text-neutral-400">Loading user profile...</div>;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await userService.updateProfile({
      name,
      phone,
      preferredConnector,
      notificationSettings: {
        ...user.notificationSettings,
        bookingReminders,
        stationAlerts,
        emailReceipts
      }
    });
    setUser(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand || !newModel) return;

    await userService.addVehicle({
      brand: newBrand,
      model: newModel,
      year: 2025,
      batteryCapacityKwh: Number(newCapacity) || 75,
      usableRangeKm: Math.round((Number(newCapacity) || 75) * 5.8),
      preferredConnector: 'CCS2',
      licensePlate: `EV-${Math.floor(100 + Math.random() * 900)}`
    });

    const refreshed = await userService.getProfile();
    setUser(refreshed);
    setShowAddVehicle(false);
    setNewBrand('');
    setNewModel('');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#062D24] text-emerald-300 font-extrabold text-xl flex items-center justify-center shadow-md">
              AR
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#062D24] font-display">
                {user.name}
              </h1>
              <p className="text-xs text-neutral-500">
                Driver member since {user.memberSince} · {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:text-rose-600 hover:border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {isSavedNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Profile and vehicle preferences updated successfully.</span>
          </div>
        )}

        {/* 1. Vehicles Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-bold text-[#062D24] font-display">
                Registered Vehicles ({user.vehicles.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Charging speeds and battery state-of-charge automatically calibrate to your car specs.
              </p>
            </div>

            <button
              onClick={() => setShowAddVehicle(!showAddVehicle)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* Add vehicle form modal / inline panel */}
          {showAddVehicle && (
            <form onSubmit={handleAddVehicleSubmit} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
              <h4 className="font-bold text-neutral-900">Add New Electric Vehicle</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rivian"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R1T Dual Motor"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Battery (kWh)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#062D24] text-emerald-300 font-bold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          )}

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.vehicles.map((veh) => (
              <div
                key={veh.id}
                className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-800 uppercase tracking-wide">
                      {veh.brand}
                    </span>
                    <span className="font-mono text-neutral-500 font-semibold">{veh.licensePlate}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 font-display">
                    {veh.model}
                  </h3>
                  <div className="pt-3 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Battery Pack</span>
                      <span className="font-semibold text-neutral-900 tabular-nums">{veh.batteryCapacityKwh} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Range</span>
                      <span className="font-semibold text-neutral-900 tabular-nums">{veh.usableRangeKm} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connector</span>
                      <span className="font-semibold text-neutral-900">{veh.preferredConnector}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Preferences & Contact Details */}
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <div className="pb-3 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-[#062D24] font-display">
              Driver Details &amp; Hardware Preferences
            </h2>
            <p className="text-xs text-neutral-500">
              Set default connector filters and notification channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">Preferred Fast Connector</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CCS2', 'Type 2', 'CHAdeMO'] as ConnectorType[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setPreferredConnector(c)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    preferredConnector === c
                      ? 'border-emerald-600 bg-emerald-50 text-[#062D24]'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Notification toggles */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Notification Preferences
            </h4>

            <label className="flex items-center justify-between text-xs text-neutral-700 cursor-pointer">
              <span>Send SMS and push reminders 15 minutes before booking slot</span>
              <input
                type="checkbox"
                checked={bookingReminders}
                onChange={(e) => setBookingReminders(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-neutral-700 cursor-pointer">
              <span>Alert when ultra-fast bays open up on frequently traversed routes</span>
              <input
                type="checkbox"
                checked={stationAlerts}
                onChange={(e) => setStationAlerts(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-neutral-700 cursor-pointer">
              <span>Email itemized charging energy receipts and tax invoices</span>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
