import {DefaultTheme} from "styled-components"

const LightTheme: DefaultTheme = {
  mode: 'light',
  colors: {
    metal: '#FFFFFF',
    wood: '#1E97F3',
    water: '#000000',
    fire: '#FF2C2C',
    earth: '#E5DE00',

    red: '#FF2C2C',
    orange: '#EC9006',
    yellow: '#E5DE00',
    green: '#95BB72',
    blue: '#1E97F3',
    idigo: '#3F54BE',
    purple: '#B100CD',

    themeColor: '#101014',

    firstThemeColor: '#FF2C2C',
    secondThemeColor: '#1E97F3',
    thirdThemeColor: '#E5DE00',

    foreground: '#000000',
    background: '#EFEFF3',

    secondaryForeground: '#222222',
    secondaryBackground: '#FEFEFE',

    tertiaryForeground: '#444444',
    tertiaryBackground: '#EEEEEE',

    quaternaryForeground: '#666666',
    quaternaryBackground: '#DEDEDE',
  
    quinaryForeground: '#888888',
    quinaryBackground: '#CECECE',

    themeForeground: '#FFFFFF',
    themeBackground: '#101014',

    secondaryThemeForeground: '#DDDDDD',
    secondaryThemeBackground: '#010101',

    tertiaryThemeForeground: '#BBBBBB',
    tertiaryThemeBackground: '#111111',

    quaternaryThemeForeground: '#999999',
    quaternaryThemeBackground: '#212121',
  
    quinaryThemeForeground: '#777777',
    quinaryThemeBackground: '#313131'
  },
  dimensions: {
    size: '40px',
    iconSize: '24px',
    fontSize: '1.0em',
    margin: '8px',
    padding:'8px',
    borderRadius: '8px'
  }
}

const DarkTheme: DefaultTheme = {
  mode: 'dark',
  colors: {
    metal: '#FFFFFF',
    wood: '#1E97F3',
    water: '#000000',
    fire: '#FF2C2C',
    earth: '#E5DE00',

    red: '#FF2C2C',
    orange: '#EC9006',
    yellow: '#E5DE00',
    green: '#95BB72',
    blue: '#1E97F3',
    idigo: '#3F54BE',
    purple: '#B100CD',

    themeColor: '#EFEFF3',
    firstThemeColor: '#FF2C2C',
    secondThemeColor: '#1E97F3',
    thirdThemeColor: '#E5DE00',

    foreground: '#FFFFFF',
    background: '#101014',

    secondaryForeground: '#DDDDDD',
    secondaryBackground: '#010101',

    tertiaryForeground: '#BBBBBB',
    tertiaryBackground: '#111111',

    quaternaryForeground: '#999999',
    quaternaryBackground: '#212121',
  
    quinaryForeground: '#777777',
    quinaryBackground: '#313131',

    themeForeground: '#000000',
    themeBackground: '#EFEFF3',

    secondaryThemeForeground: '#222222',
    secondaryThemeBackground: '#FEFEFE',

    tertiaryThemeForeground: '#444444',
    tertiaryThemeBackground: '#EEEEEE',

    quaternaryThemeForeground: '#666666',
    quaternaryThemeBackground: '#DEDEDE',
  
    quinaryThemeForeground: '#888888',
    quinaryThemeBackground: '#CECECE',
  },
  dimensions: {
    size: '40px',
    iconSize: '24px',
    fontSize: '1.0em',
    margin: '8px',
    padding:'8px',
    borderRadius: '8px'
  }
}

export default { LightTheme, DarkTheme };
