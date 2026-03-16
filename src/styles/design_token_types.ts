/**
 * EZReco Design Token Types
 * Type definitions based on Figma Design System
 */

// =============================================================================
// COLOR TYPES
// =============================================================================

export type PaletteColors = {
  white: string;
  black: string;
  gray: {
    20: string;
    40: string;
    60: string;
    80: string;
    100: string;
  };
  blue: {
    20: string;
    50: string;
  };
  red: {
    20: string;
    50: string;
  };
  green: {
    20: string;
    50: string;
  };
  orange: {
    20: string;
    50: string;
  };
  purple: {
    20: string;
    50: string;
  };
};

export type SemanticColors = {
  // Background Colors
  background: string;
  surface: string;
  "surface-low": string;
  "surface-lowest": string;

  // Text Colors
  "on-surface": string;
  "on-surface-low": string;
  "on-surface-high": string;
  "on-surface-highest": string;
  "on-surface-lowest": string;

  // Border Colors
  outline: string;
  "outline-low": string;

  // Brand Colors
  primary: string;
  "primary-bright": string;

  // Function Colors
  error: string;
  "error-bright": string;
  success: string;
  "success-bright": string;
  warning: string;
  "warning-bright": string;
  info: string;
  "info-bright": string;
};

export type StateColors = {
  "primary-hover": string;
  "primary-pressed": string;
  "primary-selected": string;
  "secondary-d-hover": string;
  "secondary-d-pressed": string;
  "secondary-d-selected": string;
  "secondary-l-hover": string;
  "secondary-l-pressed": string;
  "secondary-l-selected": string;
};

export type Colors = PaletteColors &
  SemanticColors &
  StateColors & {
    transparent: string;
    current: string;
  };

// =============================================================================
// TYPOGRAPHY TYPES
// =============================================================================

export type FontFamily = {
  samsung: string[];
  oneui: string[];
};

export type FontWeight = {
  regular: number;
  semibold: number;
  bold: number;
};

export type TypographyScale = {
  // Headlines
  "headline-1": TypographyToken;
  "headline-2": TypographyToken;
  "headline-3": TypographyToken;

  // Text Scales
  "text-1": TypographyToken;
  "text-1-dimmed": TypographyToken;
  "text-2": TypographyToken;
  "text-3": TypographyToken;
  "text-3-regular": TypographyToken;
  "text-4": TypographyToken;
  "text-5": TypographyToken;
  "text-5-regular": TypographyToken;
  "text-6": TypographyToken;
  "text-6-semibold": TypographyToken;
  "text-7": TypographyToken;
};

export type TypographyToken = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
  usage: string;
};

export type Typography = {
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  scale: TypographyScale;
};

// =============================================================================
// SPACING TYPES
// =============================================================================

export type Spacing = {
  0: string;
  1: string; // 4px
  2: string; // 8px
  3: string; // 12px
  4: string; // 16px
  5: string; // 20px
  6: string; // 24px
  8: string; // 32px
  10: string; // 40px
  12: string; // 48px
  16: string; // 64px
  20: string; // 80px
  24: string; // 96px

  // Component specific
  "design-margin": string; // 120px
  "chip-gap": string; // 4px
  "chip-padding": string; // 12px
};

// =============================================================================
// COMPONENT TYPES
// =============================================================================

export type BorderRadius = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
  chip: string; // 8px
};

export type BoxShadow = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  chip: string; // Component specific
};

export type ComponentSizes = {
  "color-chip": {
    width: string; // 140px
    height: string; // 182px
  };
  "color-swatch": {
    height: string; // 110px
  };
  "color-theme": {
    height: string; // 120px
  };
};

// =============================================================================
// DESIGN TOKENS TYPE
// =============================================================================

export type DesignTokens = {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  sizes: ComponentSizes;
};

// =============================================================================
// TAILWIND CONFIG TYPES
// =============================================================================

export type TailwindFontSize = [
  string,
  {
    lineHeight: string;
    fontWeight: number;
    letterSpacing?: string;
  }
];

export type TailwindColors = Record<string, string | Record<string, string>>;

export type TailwindThemeExtension = {
  colors: TailwindColors;
  fontFamily: FontFamily;
  fontSize: Record<string, TailwindFontSize>;
  spacing: Spacing;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  width: Record<string, string>;
  height: Record<string, string>;
  letterSpacing: Record<string, string>;
};

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Extract keys for type-safe usage
export type ColorKey = keyof Colors;
export type TypographyScaleKey = keyof TypographyScale;
export type SpacingKey = keyof Spacing;
export type BorderRadiusKey = keyof BorderRadius;

// Component prop types
export type ComponentColorVariant =
  | "primary"
  | "error"
  | "success"
  | "warning"
  | "info";

export type ComponentSize = "sm" | "md" | "lg" | "xl";

export type TextColorVariant = "highest" | "high" | "normal" | "low" | "lowest";

// CSS Custom Properties
export type CSSCustomProperties = Record<string, string>;

// Theme configuration
export type ThemeConfig = {
  mode: "light" | "dark";
  primaryColor: string;
  fontFamily: keyof FontFamily;
  customColors?: Partial<SemanticColors>;
  customSpacing?: Partial<Spacing>;
};

// =============================================================================
// COMPONENT SPECIFIC TYPES
// =============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ColorComponentProps extends BaseComponentProps {
  color: ColorKey;
  variant?: ComponentColorVariant;
}

export interface TypographyProps extends BaseComponentProps {
  scale: TypographyScaleKey;
  color?: ColorKey;
  weight?: keyof FontWeight;
}

export interface SpacingProps {
  margin?: SpacingKey;
  padding?: SpacingKey;
  gap?: SpacingKey;
}
