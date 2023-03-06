import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: string;
    colors: {
      metal: string;
      wood: string;
      water: string;
      fire: string;
      earth: string;

      red: string;
      orange: string;
      yellow: string;
      green: string;
      blue: string;
      idigo: string;
      purple: string;

      themeColor: string;

      firstThemeColor: string;
      secondThemeColor: string;
      thirdThemeColor: string;

      foreground: string;
      background: string;

      secondaryForeground: string;
      secondaryBackground: string;

      tertiaryForeground: string;
      tertiaryBackground: string;

      quaternaryForeground: string;
      quaternaryBackground: string;
    
      quinaryForeground: string;
      quinaryBackground: string;

      themeForeground: string;
      themeBackground: string;


      secondaryThemeForeground: string;
      secondaryThemeBackground: string;

      tertiaryThemeForeground: string;
      tertiaryThemeBackground: string;

      quaternaryThemeForeground: string;
      quaternaryThemeBackground: string;
    
      quinaryThemeForeground: string;
      quinaryThemeBackground: string;
    };
    dimensions: {
      size: string;
      iconSize: string;
      fontSize: string;
      margin: string;
      padding: string;
      borderRadius: string;
    }
  }
}
