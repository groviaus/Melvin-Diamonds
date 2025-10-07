import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RingSizeMeasurement {
  id: string;
  size: string;
  diameter: number;
  circumference: number;
  measurementMethod: "manual" | "auto-detected";
  deviceInfo?: {
    deviceName?: string;
    confidence: "high" | "medium" | "low";
    ppi: number;
  };
  timestamp: number;
}

interface RingSizerStore {
  measurements: RingSizeMeasurement[];
  addMeasurement: (
    measurement: Omit<RingSizeMeasurement, "id" | "timestamp">
  ) => void;
  getLatestMeasurement: () => RingSizeMeasurement | null;
  clearMeasurements: () => void;
  removeMeasurement: (id: string) => void;
}

export const useRingSizerStore = create<RingSizerStore>()(
  persist(
    (set, get) => ({
      measurements: [],

      addMeasurement: (measurement) => {
        const newMeasurement: RingSizeMeasurement = {
          ...measurement,
          id: `measurement_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          timestamp: Date.now(),
        };

        set((state) => ({
          measurements: [newMeasurement, ...state.measurements].slice(0, 10), // Keep only last 10 measurements
        }));
      },

      getLatestMeasurement: () => {
        const measurements = get().measurements;
        return measurements.length > 0 ? measurements[0] : null;
      },

      clearMeasurements: () => {
        set({ measurements: [] });
      },

      removeMeasurement: (id) => {
        set((state) => ({
          measurements: state.measurements.filter((m) => m.id !== id),
        }));
      },
    }),
    {
      name: "ring-sizer-storage",
      partialize: (state) => ({ measurements: state.measurements }),
    }
  )
);
