/**
 * EZReco Color System
 * Generated from Figma Design System Guide
 */

// =============================================================================
// BASE COLOR PALETTE
// =============================================================================

export const palette = {
  // White & Black
  white: "#FFFFFF",
  black: "#000000",

  // Gray Scale
  gray: {
    20: "#F8F8FA",
    40: "#EEF0F3",
    60: "#D5D8DC",
    80: "#989BA2",
    100: "#252525",
  },

  // Primary Colors - Blue
  blue: {
    20: "#D6D7FF", // Blue Bright
    50: "#0106FF", // Blue Base
  },

  // Function Colors - Red
  red: {
    20: "#FEE3E4", // Red Bright
    50: "#F85057", // Red Base
  },

  // Function Colors - Green
  green: {
    20: "#D6F8EE", // Green Bright
    50: "#00D694", // Green Base
  },

  // Function Colors - Orange
  orange: {
    20: "#FFEED6", // Orange Bright
    50: "#FF9500", // Orange Base
  },

  // Function Colors - Purple
  purple: {
    20: "#F5E3FD", // Purple Bright
    50: "#C153F4", // Purple Base
  },
} as const;

// =============================================================================
// SEMANTIC COLOR SYSTEM
// =============================================================================

export const semantic = {
  // Background Colors
  background: palette.gray[20], // #F8F8FA - Main background
  surface: palette.gray[40], // #EEF0F3 - Container surfaces
  "surface-low": palette.gray[20], // #F8F8FA - Lower elevation
  "surface-lowest": palette.white, // #FFFFFF - Lowest elevation

  // Text Colors (On Surface)
  "on-surface": palette.gray[80], // #989BA2 - Primary text
  "on-surface-low": palette.gray[60], // #D5D8DC - Secondary text
  "on-surface-high": palette.gray[100], // #252525 - High emphasis text
  "on-surface-highest": palette.black, // #000000 - Highest emphasis text
  "on-surface-lowest": palette.white, // #FFFFFF - Text on dark surfaces

  // Border & Outline Colors
  outline: palette.gray[80], // #989BA2 - Borders, dividers
  "outline-low": palette.gray[60], // #D5D8DC - Light borders

  // Brand Colors
  primary: palette.blue[50], // #0106FF - Primary blue
  "primary-bright": palette.blue[20], // #D6D7FF - Light blue

  // Function Colors
  error: palette.red[50], // #F85057 - Error state
  "error-bright": palette.red[20], // #FEE3E4 - Error background

  success: palette.green[50], // #00D694 - Success state
  "success-bright": palette.green[20], // #D6F8EE - Success background

  warning: palette.orange[50], // #FF9500 - Warning state
  "warning-bright": palette.orange[20], // #FFEED6 - Warning background

  info: palette.purple[50], // #C153F4 - Info state
  "info-bright": palette.purple[20], // #F5E3FD - Info background
} as const;

// =============================================================================
// STATE COLORS
// =============================================================================

export const states = {
  // Primary State Colors
  "primary-hover": "#EDEDF1", // Blue5 - Hover state
  "primary-pressed": "#E5E5EB", // Blue10 - Pressed state
  "primary-selected": "#EDEDF1", // Blue5 - Selected state

  // Secondary Dark States (for light backgrounds)
  "secondary-d-hover": "rgba(255, 255, 255, 0.3)", // 30% white
  "secondary-d-pressed": "rgba(255, 255, 255, 0.4)", // 40% white
  "secondary-d-selected": "rgba(255, 255, 255, 0.3)", // 30% white

  // Secondary Light States (for dark backgrounds)
  "secondary-l-hover": "rgba(0, 0, 0, 0.12)", // 12% black
  "secondary-l-pressed": "rgba(0, 0, 0, 0.15)", // 15% black
  "secondary-l-selected": "rgba(0, 0, 0, 0.12)", // 12% black
} as const;

// =============================================================================
// UNIFIED COLOR SYSTEM
// =============================================================================

export const colors = {
  // Base palette
  ...palette,

  // Semantic colors
  ...semantic,

  // State colors
  ...states,

  // Legacy support (can be removed later)
  transparent: "transparent",
  current: "currentColor",
} as const;

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Get color value by key path
 * @example getColor('blue.50') -> '#0106FF'
 * @example getColor('primary') -> '#0106FF'
 */
export const getColor = (key: string): string => {
  const keys = key.split(".");
  let value: unknown = colors;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
    }
    if (value === undefined) {
      console.warn(`Color key "${key}" not found`);
      return "#000000"; // fallback
    }
  }

  return typeof value === "string" ? value : "#000000";
};

/**
 * Generate CSS custom properties for colors
 */
export const generateColorVars = () => {
  const vars: Record<string, string> = {};

  // Base palette
  Object.entries(palette).forEach(([key, value]) => {
    if (typeof value === "string") {
      vars[`--color-${key}`] = value;
    } else {
      Object.entries(value).forEach(([shade, color]) => {
        vars[`--color-${key}-${shade}`] = color;
      });
    }
  });

  // Semantic colors
  Object.entries(semantic).forEach(([key, value]) => {
    vars[`--color-${key}`] = value;
  });

  // State colors
  Object.entries(states).forEach(([key, value]) => {
    vars[`--color-${key}`] = value;
  });

  return vars;
};

export default colors;
