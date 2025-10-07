/**
 * DeviceInfo.ts - Device detection and PPI lookup module
 * Automatically detects device specifications and provides accurate PPI values
 */

export interface DeviceResolution {
  cssWidth: number;
  cssHeight: number;
  deviceWidthPx: number;
  deviceHeightPx: number;
  devicePixelRatio: number;
}

export interface PPILookupResult {
  ppi: number;
  matched: boolean;
  deviceName?: string;
  confidence: "high" | "medium" | "low";
}

// Comprehensive device PPI database with real-world specifications
const DEVICE_PPI_DATABASE = [
  // iPhone models (high confidence matches)
  {
    signature: "iPhone 15 Pro Max",
    widthPx: 1320,
    heightPx: 2868,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 15 Pro",
    widthPx: 1179,
    heightPx: 2556,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 15 Plus",
    widthPx: 1290,
    heightPx: 2796,
    dpr: 3,
    ppi: 458,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 15",
    widthPx: 1179,
    heightPx: 2556,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 14 Pro Max",
    widthPx: 1320,
    heightPx: 2868,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 14 Pro",
    widthPx: 1179,
    heightPx: 2556,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 14 Plus",
    widthPx: 1284,
    heightPx: 2778,
    dpr: 3,
    ppi: 458,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 14",
    widthPx: 1170,
    heightPx: 2532,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 13 Pro Max",
    widthPx: 1284,
    heightPx: 2778,
    dpr: 3,
    ppi: 458,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 13 Pro",
    widthPx: 1170,
    heightPx: 2532,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 13",
    widthPx: 1170,
    heightPx: 2532,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 12 Pro Max",
    widthPx: 1284,
    heightPx: 2778,
    dpr: 3,
    ppi: 458,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 12 Pro",
    widthPx: 1170,
    heightPx: 2532,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone 12",
    widthPx: 1170,
    heightPx: 2532,
    dpr: 3,
    ppi: 460,
    confidence: "high" as const,
  },
  {
    signature: "iPhone SE",
    widthPx: 750,
    heightPx: 1334,
    dpr: 2,
    ppi: 326,
    confidence: "high" as const,
  },

  // Samsung Galaxy models
  {
    signature: "Galaxy S24 Ultra",
    widthPx: 1440,
    heightPx: 3120,
    dpr: 3,
    ppi: 501,
    confidence: "high" as const,
  },
  {
    signature: "Galaxy S24+",
    widthPx: 1440,
    heightPx: 3120,
    dpr: 3,
    ppi: 513,
    confidence: "high" as const,
  },
  {
    signature: "Galaxy S24",
    widthPx: 1080,
    heightPx: 2340,
    dpr: 3,
    ppi: 416,
    confidence: "high" as const,
  },
  {
    signature: "Galaxy S23 Ultra",
    widthPx: 1440,
    heightPx: 3088,
    dpr: 3,
    ppi: 501,
    confidence: "high" as const,
  },
  {
    signature: "Galaxy S23+",
    widthPx: 1080,
    heightPx: 2340,
    dpr: 3,
    ppi: 393,
    confidence: "high" as const,
  },
  {
    signature: "Galaxy S23",
    widthPx: 1080,
    heightPx: 2340,
    dpr: 3,
    ppi: 425,
    confidence: "high" as const,
  },
  {
    signature: "Galaxy A54",
    widthPx: 1080,
    heightPx: 2340,
    dpr: 2.75,
    ppi: 403,
    confidence: "medium" as const,
  },
  {
    signature: "Galaxy A34",
    widthPx: 1080,
    heightPx: 2340,
    dpr: 2.75,
    ppi: 390,
    confidence: "medium" as const,
  },

  // Google Pixel models
  {
    signature: "Pixel 8 Pro",
    widthPx: 1344,
    heightPx: 2992,
    dpr: 2.8,
    ppi: 489,
    confidence: "high" as const,
  },
  {
    signature: "Pixel 8",
    widthPx: 1080,
    heightPx: 2400,
    dpr: 2.6,
    ppi: 428,
    confidence: "high" as const,
  },
  {
    signature: "Pixel 7 Pro",
    widthPx: 1440,
    heightPx: 3120,
    dpr: 3.5,
    ppi: 512,
    confidence: "high" as const,
  },
  {
    signature: "Pixel 7",
    widthPx: 1080,
    heightPx: 2400,
    dpr: 2.6,
    ppi: 416,
    confidence: "high" as const,
  },
  {
    signature: "Pixel 6 Pro",
    widthPx: 1440,
    heightPx: 3120,
    dpr: 3.5,
    ppi: 512,
    confidence: "high" as const,
  },
  {
    signature: "Pixel 6",
    widthPx: 1080,
    heightPx: 2400,
    dpr: 2.75,
    ppi: 411,
    confidence: "high" as const,
  },

  // OnePlus models
  {
    signature: "OnePlus 12",
    widthPx: 1440,
    heightPx: 3168,
    dpr: 3,
    ppi: 510,
    confidence: "medium" as const,
  },
  {
    signature: "OnePlus 11",
    widthPx: 1440,
    heightPx: 3216,
    dpr: 3,
    ppi: 525,
    confidence: "medium" as const,
  },
  {
    signature: "OnePlus 10 Pro",
    widthPx: 1440,
    heightPx: 3216,
    dpr: 3,
    ppi: 525,
    confidence: "medium" as const,
  },

  // iPad models
  {
    signature: "iPad Pro 12.9",
    widthPx: 2048,
    heightPx: 2732,
    dpr: 2,
    ppi: 264,
    confidence: "high" as const,
  },
  {
    signature: "iPad Pro 11",
    widthPx: 1668,
    heightPx: 2388,
    dpr: 2,
    ppi: 264,
    confidence: "high" as const,
  },
  {
    signature: "iPad Air",
    widthPx: 1640,
    heightPx: 2360,
    dpr: 2,
    ppi: 264,
    confidence: "high" as const,
  },
  {
    signature: "iPad",
    widthPx: 1620,
    heightPx: 2160,
    dpr: 2,
    ppi: 264,
    confidence: "high" as const,
  },
  {
    signature: "iPad mini",
    widthPx: 1488,
    heightPx: 2266,
    dpr: 2,
    ppi: 326,
    confidence: "high" as const,
  },

  // Common laptop/desktop screens
  {
    signature: "MacBook Pro 16",
    widthPx: 3456,
    heightPx: 2234,
    dpr: 2,
    ppi: 254,
    confidence: "medium" as const,
  },
  {
    signature: "MacBook Pro 14",
    widthPx: 3024,
    heightPx: 1964,
    dpr: 2,
    ppi: 254,
    confidence: "medium" as const,
  },
  {
    signature: "MacBook Air",
    widthPx: 2560,
    heightPx: 1664,
    dpr: 2,
    ppi: 227,
    confidence: "medium" as const,
  },
  {
    signature: "Surface Laptop",
    widthPx: 2256,
    heightPx: 1504,
    dpr: 1.5,
    ppi: 201,
    confidence: "medium" as const,
  },
];

/**
 * Get device pixel ratio, handling edge cases
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Get comprehensive device resolution information
 */
export function getDeviceResolution(): DeviceResolution {
  const dpr = getDevicePixelRatio();
  const cssWidth = window.screen.width;
  const cssHeight = window.screen.height;

  return {
    cssWidth,
    cssHeight,
    deviceWidthPx: Math.round(cssWidth * dpr),
    deviceHeightPx: Math.round(cssHeight * dpr),
    devicePixelRatio: dpr,
  };
}

/**
 * Extract device model from user agent string
 */
function extractDeviceModel(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // iPhone detection
  if (ua.includes("iphone")) {
    if (ua.includes("iphone os 17")) return "iPhone 15 series";
    if (ua.includes("iphone os 16")) return "iPhone 14 series";
    if (ua.includes("iphone os 15")) return "iPhone 13 series";
    if (ua.includes("iphone os 14")) return "iPhone 12 series";
    return "iPhone";
  }

  // iPad detection
  if (ua.includes("ipad")) {
    if (ua.includes("pro")) return "iPad Pro";
    if (ua.includes("air")) return "iPad Air";
    if (ua.includes("mini")) return "iPad mini";
    return "iPad";
  }

  // Android device detection
  if (ua.includes("android")) {
    if (ua.includes("galaxy")) {
      if (ua.includes("s24")) return "Galaxy S24 series";
      if (ua.includes("s23")) return "Galaxy S23 series";
      return "Samsung Galaxy";
    }
    if (ua.includes("pixel")) return "Google Pixel";
    if (ua.includes("oneplus")) return "OnePlus";
    return "Android Device";
  }

  // Desktop detection
  if (ua.includes("macintosh")) {
    if (ua.includes("macbook")) return "MacBook";
    return "Mac Desktop";
  }

  if (ua.includes("windows")) return "Windows PC";

  return "Unknown Device";
}

/**
 * Lookup PPI based on device characteristics
 */
export function lookupPPI(
  userAgent: string,
  resolution: DeviceResolution
): PPILookupResult {
  const { deviceWidthPx, deviceHeightPx, devicePixelRatio } = resolution;

  // Find exact matches first (high confidence)
  const exactMatches = DEVICE_PPI_DATABASE.filter((device) => {
    const widthMatch = Math.abs(device.widthPx - deviceWidthPx) <= 10;
    const heightMatch = Math.abs(device.heightPx - deviceHeightPx) <= 10;
    const dprMatch = Math.abs(device.dpr - devicePixelRatio) <= 0.1;

    return widthMatch && heightMatch && dprMatch;
  });

  if (exactMatches.length > 0) {
    const bestMatch = exactMatches[0];
    return {
      ppi: bestMatch.ppi,
      matched: true,
      deviceName: bestMatch.signature,
      confidence: bestMatch.confidence,
    };
  }

  // Find approximate matches (medium confidence)
  const approximateMatches = DEVICE_PPI_DATABASE.filter((device) => {
    const widthMatch = Math.abs(device.widthPx - deviceWidthPx) <= 50;
    const heightMatch = Math.abs(device.heightPx - deviceHeightPx) <= 50;
    const dprMatch = Math.abs(device.dpr - devicePixelRatio) <= 0.3;

    return widthMatch && heightMatch && dprMatch;
  });

  if (approximateMatches.length > 0) {
    const bestMatch = approximateMatches.reduce((prev, curr) => {
      const prevScore =
        Math.abs(prev.widthPx - deviceWidthPx) +
        Math.abs(prev.heightPx - deviceHeightPx);
      const currScore =
        Math.abs(curr.widthPx - deviceWidthPx) +
        Math.abs(curr.heightPx - deviceHeightPx);
      return currScore < prevScore ? curr : prev;
    });

    return {
      ppi: bestMatch.ppi,
      matched: true,
      deviceName: `${bestMatch.signature} (approximate)`,
      confidence: "medium",
    };
  }

  // Category-based fallback (low confidence)
  const deviceModel = extractDeviceModel(userAgent);
  let fallbackPPI = 96; // Default desktop PPI

  if (deviceModel.includes("iPhone") || deviceModel.includes("Android")) {
    fallbackPPI =
      devicePixelRatio >= 3 ? 460 : devicePixelRatio >= 2 ? 326 : 264;
  } else if (deviceModel.includes("iPad") || deviceModel.includes("Tablet")) {
    fallbackPPI = 264;
  } else if (deviceModel.includes("MacBook") || devicePixelRatio >= 2) {
    fallbackPPI = 227;
  }

  return {
    ppi: fallbackPPI,
    matched: false,
    deviceName: deviceModel,
    confidence: "low",
  };
}

/**
 * Check if device scaling/zoom is detected
 */
export function detectScaling(resolution: DeviceResolution): {
  isScaled: boolean;
  suggestedAction?: string;
} {
  const { devicePixelRatio } = resolution;

  // Common standard DPR values
  const standardDPRs = [1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4];
  const isStandardDPR = standardDPRs.some(
    (dpr) => Math.abs(dpr - devicePixelRatio) < 0.1
  );

  if (!isStandardDPR) {
    return {
      isScaled: true,
      suggestedAction:
        "We detected screen zoom or scaling. Please ensure browser/OS display scaling is set to 100% for accurate measurements.",
    };
  }

  return { isScaled: false };
}
