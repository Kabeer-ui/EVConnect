export interface VehicleManufacturer { manufacturerId: number; manufacturerName: string; countryOfOrigin: string | null }
export interface VehicleModel { vehicleModelId: number; manufacturerId: number; modelName: string; vehicleCategory: string | null; bodyType: string | null; marketStatus: string | null }
export interface VehicleVariant {
  variantId: number; vehicleModelId: number; variantName: string; modelYearStart: number | null; modelYearEnd: number | null;
  batteryCapacityKwh: number | null; batteryCapacityType: string | null; acConnectorType: string | null; dcConnectorType: string | null;
  maxAcPowerKw: number | null; maxDcPowerKw: number | null; verificationStatus: string | null; notes: string | null;
}
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error('Vehicle catalogue is unavailable. Check the backend and database setup.');
  return response.json();
}
export const vehicleCatalogService = {
  manufacturers: () => request<VehicleManufacturer[]>('/api/vehicles/manufacturers'),
  models: (manufacturerId: number) => request<VehicleModel[]>(`/api/vehicles/models?manufacturerId=${manufacturerId}`),
  variants: (modelId: number) => request<VehicleVariant[]>(`/api/vehicles/variants?modelId=${modelId}`),
};
