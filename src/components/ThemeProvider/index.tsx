import {useAppSelector} from '@hooks';
import {ColorScheme} from '@constants';
import {ThemeProvider as _ThemeProvider} from 'styled-components';

function ThemeProvider({children}: {children: React.ReactNode}) {
  const { themeMode } = useAppSelector(state => state.theme);

  return (
    <_ThemeProvider theme={themeMode === 'dark' ? ColorScheme.DarkTheme : ColorScheme.LightTheme}>
      {children}
    </_ThemeProvider>
  );
}

export default ThemeProvider;
