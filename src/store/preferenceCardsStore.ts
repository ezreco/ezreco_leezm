import { create } from "zustand";
import type { UserPreferences } from "./aiResponseStore";

export interface PreferenceCard {
  title: string;
  value: string;
  key: string; // The preference key (e.g., "purpose", "budget")
}

export interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PreferenceCardsState {
  // Raw data from user preferences
  userPreferences: UserPreferences;

  // Processed cards with values
  cards: PreferenceCard[];

  // Card positions for layout
  positions: CardPosition[];

  // Input order for sorting
  inputOrder: string[];

  // Actions
  updateFromPreferences: (preferences: UserPreferences) => void;
  setPositions: (positions: CardPosition[]) => void;
  clearCards: () => void;
}

// Define all possible cards
const createCard = (
  title: string,
  key: keyof UserPreferences,
  preferences: UserPreferences
): PreferenceCard | null => {
  let value = "";

  if (key === "purpose" || key === "users") {
    // Array fields
    const arrayValue = preferences[key] as string[] | undefined;
    value = arrayValue?.join(", ") || "";
  } else if (key === "inputOrder" || key === "conversationHistory") {
    // Skip these fields
    return null;
  } else {
    // String fields
    value = (preferences[key] as string) || "";
  }

  if (!value) return null;

  return {
    title,
    value,
    key: key as string,
  };
};

// Process preferences into cards
const processPreferences = (
  preferences: UserPreferences
): { cards: PreferenceCard[]; inputOrder: string[] } => {
  const allCardDefinitions: Array<{ title: string; key: keyof UserPreferences }> = [
    { title: "사용목적", key: "purpose" },
    { title: "크기", key: "screenSize" },
    { title: "가격대", key: "budget" },
    { title: "시청거리", key: "viewingDistance" },
    { title: "공간밝기", key: "spaceBrightness" },
    { title: "관람공간", key: "viewingArea" },
    { title: "실사용자", key: "users" },
    { title: "사용공간", key: "installationSpace" },
    { title: "선호브랜드", key: "brand" },
    { title: "패널타입", key: "panelType" },
    { title: "해상도", key: "resolution" },
    { title: "출시연도", key: "releaseYear" },
  ];

  // Create cards from preferences
  const cards = allCardDefinitions
    .map(({ title, key }) => createCard(title, key, preferences))
    .filter((card): card is PreferenceCard => card !== null);

  // Get input order
  const inputOrder = preferences.inputOrder || [];

  // Sort cards by input order
  if (inputOrder.length > 0) {
    cards.sort((a, b) => {
      const indexA = inputOrder.indexOf(a.key);
      const indexB = inputOrder.indexOf(b.key);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    });
  }

  return { cards, inputOrder };
};

export const preferenceCardsStore = create<PreferenceCardsState>((set) => ({
  userPreferences: {},
  cards: [],
  positions: [],
  inputOrder: [],

  updateFromPreferences: (preferences: UserPreferences) => {
    const { cards, inputOrder } = processPreferences(preferences);
    set({
      userPreferences: preferences,
      cards,
      inputOrder,
    });
  },

  setPositions: (positions: CardPosition[]) => {
    set({ positions });
  },

  clearCards: () => {
    set({
      userPreferences: {},
      cards: [],
      positions: [],
      inputOrder: [],
    });
  },
}));

// Selector hooks for convenience
export const usePreferenceCards = () => preferenceCardsStore((state) => state.cards);
export const useCardPositions = () => preferenceCardsStore((state) => state.positions);
export const useInputOrder = () => preferenceCardsStore((state) => state.inputOrder);
export const useUpdateFromPreferences = () => preferenceCardsStore((state) => state.updateFromPreferences);
