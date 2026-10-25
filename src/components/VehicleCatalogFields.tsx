import React, { useEffect, useState } from 'react';
import { vehicleCatalogService, VehicleManufacturer, VehicleModel, VehicleVariant } from '../services/vehicleCatalogService';

interface Props {
  manufacturerId: string;
  modelId: string;
  variantId: string;
  onManufacturerChange: (id: string, manufacturer: VehicleManufacturer | null) => void;
  onModelChange: (id: string, model: VehicleModel | null) => void;
  onVariantChange: (id: string, variant: VehicleVariant | null) => void;
}
const selectClass = 'w-full p-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 disabled:opacity-50';
export const VehicleCatalogFields: React.FC<Props> = ({ manufacturerId, modelId, variantId, onManufacturerChange, onModelChange, onVariantChange }) => {
  const [manufacturers, setManufacturers] = useState<VehicleManufacturer[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [variants, setVariants] = useState<VehicleVariant[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { vehicleCatalogService.manufacturers().then(setManufacturers).catch(e => setError(e.message)); }, []);
  useEffect(() => {
    setModels([]); setVariants([]);
    if (!manufacturerId) return;
    vehicleCatalogService.models(Number(manufacturerId)).then(setModels).catch(e => setError(e.message));
  }, [manufacturerId]);
  useEffect(() => {
    setVariants([]);
    if (!modelId) return;
    vehicleCatalogService.variants(Number(modelId)).then(setVariants).catch(e => setError(e.message));
  }, [modelId]);
  const selectedVariant = variants.find(v => String(v.variantId) === variantId) || null;
  return <div className="space-y-3">
    <div>
      <label className="block text-neutral-600 mb-1">Make / Manufacturer</label>
      <select required className={selectClass} value={manufacturerId} onChange={e => {
        const id=e.target.value; onManufacturerChange(id, manufacturers.find(x=>String(x.manufacturerId)===id)||null);
      }}>
        <option value="">Select manufacturer</option>{manufacturers.map(x=><option key={x.manufacturerId} value={x.manufacturerId}>{x.manufacturerName}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-neutral-600 mb-1">Model</label>
      <select required className={selectClass} value={modelId} disabled={!manufacturerId} onChange={e=>{
        const id=e.target.value; onModelChange(id,models.find(x=>String(x.vehicleModelId)===id)||null);
      }}>
        <option value="">Select model</option>{models.map(x=><option key={x.vehicleModelId} value={x.vehicleModelId}>{x.modelName}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-neutral-600 mb-1">Variant / Battery Pack</label>
      <select required className={selectClass} value={variantId} disabled={!modelId} onChange={e=>{
        const id=e.target.value; onVariantChange(id,variants.find(x=>String(x.variantId)===id)||null);
      }}>
        <option value="">Select variant</option>{variants.map(x=><option key={x.variantId} value={x.variantId}>{x.variantName}</option>)}
      </select>
    </div>
    {selectedVariant && <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 space-y-1 text-xs">
      <div className="font-semibold text-emerald-950">Catalogue specifications</div>
      <div>Battery: {selectedVariant.batteryCapacityKwh == null ? 'Not verified / unavailable' : `${selectedVariant.batteryCapacityKwh} kWh`}</div>
      <div>AC connector / max power: {selectedVariant.acConnectorType || 'Unknown'}{selectedVariant.maxAcPowerKw == null ? '' : ` · ${selectedVariant.maxAcPowerKw} kW`}</div>
      <div>DC connector / max power: {selectedVariant.dcConnectorType || 'Unknown'}{selectedVariant.maxDcPowerKw == null ? '' : ` · ${selectedVariant.maxDcPowerKw} kW`}</div>
      <div>Data status: {selectedVariant.verificationStatus || 'Not specified'}</div>
      {selectedVariant.notes && <p className="pt-1 text-neutral-600">{selectedVariant.notes}</p>}
    </div>}
    {error && <p className="text-rose-600">{error} Ensure the vehicle SQL migration and CSV importer have been run.</p>}
  </div>;
};
