/**
 * EZReco Typography System
 * Generated from Figma Design System Guide
 */

// =============================================================================
// FONT FAMILIES
// =============================================================================

export const fontFamily = {
  // Primary and only font - OneUI Sans GUI
  oneui: ["One UI Sans GUI", "system-ui", "sans-serif"],
  
  // Alias for consistency (same as oneui)
  primary: ["One UI Sans GUI", "system-ui", "sans-serif"],

  // Fallbacks
  sans: ["system-ui", "sans-serif"],
  mono: ["ui-monospace", "SFMono-Regular", "monospace"],
} as const;

// =============================================================================
// FONT WEIGHTS
// =============================================================================

export const fontWeight = {
  light: 300,
  regular: 400,
  semibold: 600,
  bold: 700,
} as const;

// =============================================================================
// TYPE SCALE (From Figma)
// =============================================================================

export const typeScale = {
  // Headlines
  "headline-1": {
    fontSize: "84px",
    lineHeight: "102px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Home Title",
  },
  "headline-2": {
    fontSize: "56px",
    lineHeight: "68px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Home Sub Text",
  },
  "headline-3": {
    fontSize: "48px",
    lineHeight: "68px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Title",
  },

  // Text Styles
  "text-1": {
    fontSize: "36px",
    lineHeight: "48px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Tab Selected",
  },
  "text-1-dimmed": {
    fontSize: "36px",
    lineHeight: "48px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Tab Dimmed",
  },
  "text-2": {
    fontSize: "34px",
    lineHeight: "52px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Command / Home Contents",
  },
  "text-3": {
    fontSize: "32px",
    lineHeight: "36px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Title / Gradient Button / Gray Button / Profile",
  },
  "text-3-regular": {
    fontSize: "32px",
    lineHeight: "48px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "비교 Contents Card / Beta Info Button",
  },
  "text-4": {
    fontSize: "30px",
    lineHeight: "40px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Chat Bubble",
  },
  "text-5": {
    fontSize: "28px",
    lineHeight: "40px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "LNB Menu / Home Contents Color tag / Command Button",
  },
  "text-5-regular": {
    fontSize: "28px",
    lineHeight: "40px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "LNB Search / History List / Contents Card / Text Button",
  },
  "text-6": {
    fontSize: "26px",
    lineHeight: "38px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "History Title",
  },
  "text-6-semibold": {
    fontSize: "26px",
    lineHeight: "38px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Loading",
  },
  "text-7": {
    fontSize: "22px",
    lineHeight: "30px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Button",
  },

  // Component Specific Typography
  "color-chip-title": {
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: fontWeight.bold,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Color Chip Title",
  },
  "color-chip-hex": {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0px",
    fontFamily: fontFamily.oneui,
    usage: "Color Chip Hex Value",
  },
  "color-theme-title": {
    fontSize: "16px",
    lineHeight: "19.2px",
    fontWeight: fontWeight.semibold,
    letterSpacing: "0.5px",
    fontFamily: fontFamily.oneui,
    usage: "Color Theme Title",
  },
  "color-theme-token": {
    fontSize: "12px",
    lineHeight: "16.2px",
    fontWeight: fontWeight.regular,
    letterSpacing: "0.5px",
    fontFamily: fontFamily.oneui,
    usage: "Color Theme Token",
  },
} as const;

// =============================================================================
// TYPOGRAPHY UTILITIES
// =============================================================================

/**
 * Get typography styles for a given scale
 */
export const getTypographyStyles = (scale: keyof typeof typeScale) => {
  const token = typeScale[scale];
  return {
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    fontWeight: token.fontWeight,
    letterSpacing: token.letterSpacing,
    fontFamily: token.fontFamily.join(", "),
  };
};

/**
 * Generate CSS custom properties for typography
 */
export const generateTypographyVars = () => {
  const vars: Record<string, string> = {};

  // Font families
  Object.entries(fontFamily).forEach(([key, value]) => {
    vars[`--font-${key}`] = value.join(", ");
  });

  // Font weights
  Object.entries(fontWeight).forEach(([key, value]) => {
    vars[`--font-weight-${key}`] = value.toString();
  });

  // Type scale
  Object.entries(typeScale).forEach(([key, value]) => {
    vars[`--font-${key}-size`] = value.fontSize;
    vars[`--font-${key}-height`] = value.lineHeight;
    vars[`--font-${key}-weight`] = value.fontWeight.toString();
    vars[`--font-${key}-spacing`] = value.letterSpacing;
  });

  return vars;
};

/**
 * Get font loading CSS for OneUI Sans GUI web fonts
 */
export const getFontLoadCSS = () => `
  /* One UI Sans GUI - Light */
  @font-face {
    font-family: 'One UI Sans GUI';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: url('/src/assets/fonts/OneUISansGUI-300Light.woff2') format('woff2');
  }
  
  /* One UI Sans GUI - Regular */
  @font-face {
    font-family: 'One UI Sans GUI';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('/src/assets/fonts/OneUISansGUI-400Regular.woff2') format('woff2');
  }
  
  /* One UI Sans GUI - Semibold */
  @font-face {
    font-family: 'One UI Sans GUI';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('/src/assets/fonts/OneUISansGUI-600SemiBold.woff2') format('woff2');
  }
  
  /* One UI Sans GUI - Bold */
  @font-face {
    font-family: 'One UI Sans GUI';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('/src/assets/fonts/OneUISansGUI-700Bold.woff2') format('woff2');
  }
`;

// =============================================================================
// RESPONSIVE TYPOGRAPHY
// =============================================================================

/**
 * Responsive typography scales for mobile
 */
export const responsiveScale = {
  mobile: {
    "headline-1": { fontSize: "48px", lineHeight: "56px" },
    "headline-2": { fontSize: "36px", lineHeight: "44px" },
    "headline-3": { fontSize: "28px", lineHeight: "36px" },
    "text-1": { fontSize: "24px", lineHeight: "32px" },
    "text-2": { fontSize: "22px", lineHeight: "30px" },
    "text-3": { fontSize: "20px", lineHeight: "28px" },
  },
  tablet: {
    "headline-1": { fontSize: "64px", lineHeight: "72px" },
    "headline-2": { fontSize: "48px", lineHeight: "56px" },
    "headline-3": { fontSize: "36px", lineHeight: "44px" },
    "text-1": { fontSize: "28px", lineHeight: "36px" },
    "text-2": { fontSize: "26px", lineHeight: "34px" },
    "text-3": { fontSize: "24px", lineHeight: "32px" },
  },
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  typeScale,
  responsiveScale,
} as const;

export default typography;
