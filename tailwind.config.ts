import type { Config } from "tailwindcss";
import { colors } from "./src/styles/color";
import { typography } from "./src/styles/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // =======================================================================
      // COLORS - From Figma Design System
      // =======================================================================
      colors: {
        // Base Palette
        white: colors.white,
        black: colors.black,

        // Gray Scale
        gray: {
          20: colors.gray[20],
          40: colors.gray[40],
          60: colors.gray[60],
          80: colors.gray[80],
          100: colors.gray[100],
        },

        // Primary Colors
        blue: {
          20: colors.blue[20],
          50: colors.blue[50],
        },

        // Function Colors
        red: {
          20: colors.red[20],
          50: colors.red[50],
        },
        green: {
          20: colors.green[20],
          50: colors.green[50],
        },
        orange: {
          20: colors.orange[20],
          50: colors.orange[50],
        },
        purple: {
          20: colors.purple[20],
          50: colors.purple[50],
        },

        // Semantic Colors
        background: colors.background,
        surface: colors.surface,
        "surface-low": colors["surface-low"],
        "surface-lowest": colors["surface-lowest"],

        // Text Colors
        "on-surface": colors["on-surface"],
        "on-surface-low": colors["on-surface-low"],
        "on-surface-high": colors["on-surface-high"],
        "on-surface-highest": colors["on-surface-highest"],
        "on-surface-lowest": colors["on-surface-lowest"],

        // Border Colors
        outline: colors.outline,
        "outline-low": colors["outline-low"],

        // Brand Colors
        primary: colors.primary,
        "primary-bright": colors["primary-bright"],

        // Function Colors (Semantic)
        error: colors.error,
        "error-bright": colors["error-bright"],
        success: colors.success,
        "success-bright": colors["success-bright"],
        warning: colors.warning,
        "warning-bright": colors["warning-bright"],
        info: colors.info,
        "info-bright": colors["info-bright"],

        // State Colors
        "primary-hover": colors["primary-hover"],
        "primary-pressed": colors["primary-pressed"],
        "primary-selected": colors["primary-selected"],
        "secondary-d-hover": colors["secondary-d-hover"],
        "secondary-d-pressed": colors["secondary-d-pressed"],
        "secondary-d-selected": colors["secondary-d-selected"],
        "secondary-l-hover": colors["secondary-l-hover"],
        "secondary-l-pressed": colors["secondary-l-pressed"],
        "secondary-l-selected": colors["secondary-l-selected"],
      },

      // =======================================================================
      // TYPOGRAPHY - From typography.ts
      // =======================================================================
      fontFamily: {
        oneui: typography.fontFamily.oneui,
        primary: typography.fontFamily.primary,
        sans: typography.fontFamily.sans,
        mono: typography.fontFamily.mono,
      },

      fontSize: {
        // Convert typography scale to Tailwind format
        ...Object.fromEntries(
          Object.entries(typography.typeScale).map(([key, value]) => [
            key,
            [
              value.fontSize,
              {
                lineHeight: value.lineHeight,
                fontWeight: value.fontWeight.toString(),
                letterSpacing: value.letterSpacing,
              },
            ],
          ])
        ),
      },

      // =======================================================================
      // SPACING - Design System Spacing Scale
      // =======================================================================
      spacing: {
        // Standard 4px grid
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",

        // Component specific spacing
        "design-margin": "120px", // Standard left margin from Figma
        "chip-gap": "4px", // Gap between color chips
        "chip-padding": "12px", // Internal padding for chips
      },

      // =======================================================================
      // BORDER RADIUS
      // =======================================================================
      borderRadius: {
        none: "0px",
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",

        // Component specific
        chip: "8px", // Color chip border radius from Figma
      },

      // =======================================================================
      // COMPONENT SIZES
      // =======================================================================
      width: {
        // Color chip sizes from Figma
        "color-chip": "140px",

        // Color theme chip widths from Figma
        "color-theme-sm": "194px",
        "color-theme-md": "261px",
        "color-theme-lg": "390px",
        "color-theme-xl": "391px",
        "color-theme-full": "780px",
      },

      height: {
        // Component heights from Figma
        "color-chip": "182px", // Color chip total height
        "color-swatch": "110px", // Color swatch height
        "color-theme": "120px", // Color theme chip height
      },

      // =======================================================================
      // BOX SHADOWS
      // =======================================================================
      boxShadow: {
        none: "none",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",

        // Component specific
        chip: "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow for chips
      },

      // =======================================================================
      // LETTER SPACING
      // =======================================================================
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",

        // Component specific
        token: "0.5px", // For color theme tokens
      },

      // =======================================================================
      // FONT WEIGHTS - From typography.ts (OneUI Sans GUI available weights)
      // =======================================================================
      fontWeight: {
        // Standard Tailwind weights
        thin: "100",
        extralight: "200",
        light: typography.fontWeight.light.toString(), // 300 - OneUI Sans GUI Light
        normal: typography.fontWeight.regular.toString(), // 400 - OneUI Sans GUI Regular
        medium: "500",
        semibold: typography.fontWeight.semibold.toString(), // 600 - OneUI Sans GUI Semibold
        bold: typography.fontWeight.bold.toString(), // 700 - OneUI Sans GUI Bold
        extrabold: "800",
        black: "900",
        
        // EZReco specific aliases
        regular: typography.fontWeight.regular.toString(),
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
