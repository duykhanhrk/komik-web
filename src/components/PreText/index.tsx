import styled from "styled-components";

export interface TextProps {
  variant?: 'default' | 'small' | 'medium' | 'large' |  'title' | 'small-title' | 'medium-title' | 'large-title' | 'inhirit';
  numberOfLines?: number;
}

const Text = styled.pre<TextProps>`
  color: ${props => props.variant === 'inhirit' ? 'inhirit' : props.theme.colors.foreground};
  white-space: pre-wrap;
  text-align: justify;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: ${
    props => !props.variant || props.variant === 'default' || props.variant === 'title' ? '1.0em'
      : props.variant === 'small' || props.variant === 'small-title' ? '0.8em'
      : props.variant === 'medium' || props.variant === 'medium-title' ? '1.2em'
      : props.variant === 'large' || props.variant === 'large-title' ? '1.6em'
      : '1.0em'
  };
  text-align: left;
  font-weight: ${
    props =>
      props.variant === 'title' ||
      props.variant === 'small-title' ||
      props.variant === 'medium-title' ||
      props.variant === 'large-title'
      ? 'bold' : 'normal'
  };
  overflow: hidden;
  ${
    props => props.numberOfLines ?
    `text-overflow: ellipsis;
     display: -webkit-box;
     -webkit-line-clamp: ${props.numberOfLines};
     -webkit-box-orient: vertical;`
    :
    ''
  }
`;

export default Text;
