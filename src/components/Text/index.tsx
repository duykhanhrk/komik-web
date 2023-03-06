import styled from "styled-components";

export interface TextProps {
  variant?: 'default' | 'small' | 'medium' | 'large' | 'title',
  numberOfLines?: number;
}

const Text = styled.p<TextProps>`
  color: ${props => props.theme.colors.foreground};
  font-size: ${
    props => !props.variant || props.variant === 'default' ? '1.0em'
      : props.variant === 'small' ? '0.8em'
      : props.variant === 'medium' || props.variant === 'title' ? '1.2em'
      : props.variant === 'large' ? '1.6em'
      : '1.0em'
  };
  text-align: left;
  font-weight: ${props => props.variant === 'title' ? 'bold' : 'normal'};
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
