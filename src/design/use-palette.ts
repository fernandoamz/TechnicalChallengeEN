import { useColorScheme } from 'react-native';

import { palette, type Palette } from '@/design/tokens';

export function usePalette(): Palette {
  const scheme = useColorScheme();
  return scheme === 'dark' ? palette.dark : palette.light;
}
