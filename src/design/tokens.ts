export type Palette = {
  canvas: string;
  surface: string;
  ink: string;
  inkMuted: string;
  line: string;
  accent: string;
  accentSoft: string;
  olive: string;
  danger: string;
  onAccent: string;
};

export const palette: { light: Palette; dark: Palette } = {
  light: {
    canvas: '#F3EDE4',
    surface: '#FFF9F2',
    ink: '#1E1A16',
    inkMuted: '#6F675E',
    line: '#E4D9CC',
    accent: '#B8502A',
    accentSoft: '#F3D7CC',
    olive: '#2F4A3C',
    danger: '#8C2F2F',
    onAccent: '#FFF9F2',
  },
  dark: {
    canvas: '#141210',
    surface: '#211E1A',
    ink: '#F6F0E8',
    inkMuted: '#B7AEA3',
    line: '#3A342C',
    accent: '#E07A55',
    accentSoft: '#3D2A22',
    olive: '#8FBF9A',
    danger: '#F0A8A0',
    onAccent: '#1E1A16',
  },
};

export const fontFamily = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemibold: 'Figtree_600SemiBold',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;
