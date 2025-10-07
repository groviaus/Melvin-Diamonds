"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Ruler,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Monitor,
  X,
} from "lucide-react";
import {
  getDeviceResolution,
  lookupPPI,
  detectScaling,
  type PPILookupResult,
} from "@/lib/device-info";
import { useRingSizerStore } from "@/stores/ringSizerStore";

const RING_SIZE_CHART = [
  { size: "D", diameter: 14.1, circumference: 44.2 },
  { size: "E", diameter: 14.9, circumference: 46.8 },
  { size: "F", diameter: 15.7, circumference: 49.3 },
  { size: "G", diameter: 16.5, circumference: 51.9 },
  { size: "H", diameter: 17.3, circumference: 54.4 },
  { size: "I", diameter: 18.1, circumference: 56.9 },
  { size: "J", diameter: 18.9, circumference: 59.5 },
  { size: "K", diameter: 19.8, circumference: 62.1 },
  { size: "L", diameter: 20.6, circumference: 64.6 },
  { size: "M", diameter: 21.4, circumference: 67.2 },
  { size: "N", diameter: 22.2, circumference: 69.7 },
  { size: "O", diameter: 23.0, circumference: 72.3 },
  { size: "P", diameter: 23.8, circumference: 74.8 },
  { size: "Q", diameter: 24.6, circumference: 77.4 },
  { size: "R", diameter: 25.4, circumference: 79.9 },
  { size: "S", diameter: 26.2, circumference: 82.4 },
  { size: "T", diameter: 27.0, circumference: 85.0 },
];

type CalibrationMode = "manual" | "auto-detected";

interface RingSizerProps {
  onClose?: () => void;
  onSizeSelected?: (size: string, diameter: number) => void;
}

export default function RingSizer({ onClose, onSizeSelected }: RingSizerProps) {
  const [ppiResult, setPpiResult] = useState<PPILookupResult | null>(null);
  const [diameter, setDiameter] = useState([18.0]);
  const [calibrationMode, setCalibrationMode] =
    useState<CalibrationMode>("auto-detected");
  const [scalingWarning, setScalingWarning] = useState<string>("");

  const { addMeasurement } = useRingSizerStore();

  // Auto-detect device on component mount
  useEffect(() => {
    const autoDetectDevice = () => {
      const resolution = getDeviceResolution();
      const ppiLookup = lookupPPI(navigator.userAgent, resolution);
      const scaling = detectScaling(resolution);

      // Apply mobile correction: increase PPI by ~2mm worth for phones
      let correctedPPI = ppiLookup.ppi;
      if (
        navigator.userAgent.includes("Mobile") ||
        navigator.userAgent.includes("iPhone") ||
        navigator.userAgent.includes("Android")
      ) {
        // Increase PPI by approximately 2mm worth of pixels
        correctedPPI = ppiLookup.ppi * 1.05; // ~5% increase to compensate for 2mm difference
      }

      setPpiResult({
        ...ppiLookup,
        ppi: correctedPPI,
      });
      setCalibrationMode("auto-detected");

      if (scaling.isScaled && scaling.suggestedAction) {
        setScalingWarning(scaling.suggestedAction);
      }
    };

    autoDetectDevice();
  }, []);

  useEffect(() => {
    // Disable pinch zoom
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventDefault, { passive: false });
    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventDefault);
      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  const handleRingSizeSelect = (size: string) => {
    const ringSize = RING_SIZE_CHART.find((r) => r.size === size);
    if (ringSize) {
      setDiameter([ringSize.diameter]);
    }
  };

  const getRingSize = (diameterMm: number) => {
    const closest = RING_SIZE_CHART.reduce((prev, curr) =>
      Math.abs(curr.diameter - diameterMm) <
      Math.abs(prev.diameter - diameterMm)
        ? curr
        : prev
    );
    return closest.size;
  };

  const handleSaveMeasurement = () => {
    const currentDiameter = diameter[0];
    const currentCircumference = currentDiameter * Math.PI;
    const suggestedSize = getRingSize(currentDiameter);

    // Save to store
    addMeasurement({
      size: suggestedSize,
      diameter: currentDiameter,
      circumference: currentCircumference,
      measurementMethod: calibrationMode,
      deviceInfo: ppiResult
        ? {
            deviceName: ppiResult.deviceName,
            confidence: ppiResult.confidence,
            ppi: ppiResult.ppi,
          }
        : undefined,
    });

    // Call callback if provided
    if (onSizeSelected) {
      onSizeSelected(suggestedSize, currentDiameter);
    }

    // Close modal
    if (onClose) {
      onClose();
    }
  };

  const currentDiameter = diameter[0];
  const currentCircumference = currentDiameter * Math.PI;

  // Calculate CSS pixels per mm for accurate rendering
  const ppi = ppiResult?.ppi || 96;
  const ppiPerMM = ppi / 25.4;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const cssPixelsPerMM = ppiPerMM / devicePixelRatio;
  const ringPixelSize = currentDiameter * cssPixelsPerMM;

  const suggestedSize = getRingSize(currentDiameter);

  const getCalibrationModeInfo = () => {
    if (!ppiResult) return null;

    switch (calibrationMode) {
      case "manual":
        return {
          badge: (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Calibrated
            </Badge>
          ),
          message: "Using precise manual calibration with credit card",
        };
      case "auto-detected":
        const confidenceColor =
          ppiResult.confidence === "high"
            ? "bg-blue-100 text-blue-800"
            : ppiResult.confidence === "medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800";
        return {
          badge: (
            <Badge className={confidenceColor}>
              <Monitor className="w-3 h-3 mr-1" />
              {ppiResult.matched ? "Auto-detected" : "Fallback"}
            </Badge>
          ),
          message: ppiResult.deviceName
            ? `Detected: ${ppiResult.deviceName}`
            : "Using device detection",
        };
    }
  };

  const calibrationInfo = getCalibrationModeInfo();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600">
              <Ruler className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Ring Size Finder</h1>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            Measure your ring size accurately on your mobile device
          </p>

          {/* Zoom Warning */}
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Important:</strong> Pinch-zoom is disabled to retain
              physical scale. Hold your device at normal viewing distance.
            </AlertDescription>
          </Alert>

          {/* Scaling Warning */}
          {scalingWarning && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Scaling Detected:</strong> {scalingWarning}
              </AlertDescription>
            </Alert>
          )}

          {/* Ring Sizer Section */}
          {ppiResult && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Ring Sizer</CardTitle>
                  {calibrationInfo?.badge}
                </div>
                <p className="text-xs text-gray-600">
                  {calibrationInfo?.message}
                </p>
                {ppiResult && !ppiResult.matched && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      We couldn't match your exact device; measurement accuracy
                      may be ±0.2 mm. Please use an actual ring for best
                      results.
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Place your ring on the circle below and adjust the slider
                    until it fits exactly inside.
                  </p>

                  {/* Ring Circle */}
                  <div
                    className="flex justify-center py-8"
                    role="img"
                    aria-label={`Ring sizer circle, ${currentDiameter.toFixed(
                      1
                    )}mm diameter`}
                  >
                    <div
                      className="border-4 border-rose-400 rounded-full bg-transparent relative shadow-lg"
                      style={{
                        width: `${Math.max(ringPixelSize, 40)}px`,
                        height: `${Math.max(ringPixelSize, 40)}px`,
                      }}
                    >
                      <div className="w-full h-full rounded-full border-2 border-rose-200 border-dashed"></div>
                      {ringPixelSize > 60 && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-rose-600 font-medium">
                          {currentDiameter.toFixed(1)}mm
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Size Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quick select common sizes:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["H", "J", "L", "N", "P", "R", "S", "T"].map((size) => (
                        <Button
                          key={size}
                          variant={
                            suggestedSize === size ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleRingSizeSelect(size)}
                          className="text-xs"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Diameter Slider */}
                  <div className="space-y-3">
                    <label
                      htmlFor="diameter-slider"
                      className="text-sm font-medium text-gray-700"
                    >
                      Fine-tune diameter (10-30mm):
                    </label>
                    <Slider
                      id="diameter-slider"
                      value={diameter}
                      onValueChange={setDiameter}
                      min={10}
                      max={30}
                      step={0.05}
                      className="w-full"
                      aria-label="Ring diameter adjustment"
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-900">
                          Diameter
                        </div>
                        <div className="text-rose-600 font-bold">
                          {currentDiameter.toFixed(1)} mm
                        </div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-900">
                          Circumference
                        </div>
                        <div className="text-rose-600 font-bold">
                          {currentCircumference.toFixed(1)} mm
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-rose-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        Suggested Ring Size
                      </div>
                      <div className="text-2xl font-bold text-rose-600">
                        {suggestedSize}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSaveMeasurement}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                    size="lg"
                  >
                    Save Ring Size Measurement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
