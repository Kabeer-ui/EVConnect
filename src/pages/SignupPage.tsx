import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { VehicleCatalogFields } from '../components/VehicleCatalogFields';
import { VehicleManufacturer, VehicleModel, VehicleVariant } from '../services/vehicleCatalogService';
import { Zap, ArrowRight, User, Mail, Phone, Lock, Car } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [modelId, setModelId] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [variantId, setVariantId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await authService.signup({
        name,
        email,
        phone,
        password,
        vehicleBrand,
        vehicleModel: selectedVariant ? `${vehicleModel} — ${selectedVariant.variantName}` : vehicleModel,
        batteryCapacity: selectedVariant?.batteryCapacityKwh ?? 0
      });
      navigate('/explore');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F8FAF9] flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full">
        <div className="rounded-3xl bg-white border border-neutral-200/90 shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#062D24] text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Zap className="w-6 h-6 fill-emerald-400 stroke-none" />
            </div>
            <h1 className="text-2xl font-black text-[#062D24] font-display">
              Join the EVConnect Network
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Create your account to unlock real-time bay reservations and environmental tracking.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            {/* Personal Details */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Jordan Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="jordan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Vehicle Information Box */}
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-neutral-200 space-y-3 pt-3">
              <span className="font-bold text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Car className="w-3.5 h-3.5 text-emerald-700" />
                <span>Primary Electric Vehicle</span>
              </span>

              <VehicleCatalogFields
                manufacturerId={manufacturerId}
                modelId={modelId}
                variantId={variantId}
                onManufacturerChange={(id: string, manufacturer: VehicleManufacturer | null) => {
                  setManufacturerId(id); setVehicleBrand(manufacturer?.manufacturerName || '');
                  setModelId(''); setVehicleModel(''); setVariantId(''); setSelectedVariant(null);
                }}
                onModelChange={(id: string, model: VehicleModel | null) => {
                  setModelId(id); setVehicleModel(model?.modelName || '');
                  setVariantId(''); setSelectedVariant(null);
                }}
                onVariantChange={(id: string, variant: VehicleVariant | null) => {
                  setVariantId(id); setSelectedVariant(variant);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 font-bold text-xs tracking-tight transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Registering...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-900">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
