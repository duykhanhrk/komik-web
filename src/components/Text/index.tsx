import styled from 'styled-components';

export interface TextProps {
  variant?: 'default' | 'small' | 'medium' | 'large' |  'title' | 'small-title' | 'medium-title' | 'large-title' | 'inhirit';
  numberOfLines?: number;
  shadowEffect?: boolean;
}

const Text = styled.p<TextProps>`
  color: ${props => props.variant === 'inhirit' ? 'inhirit' : props.theme.colors.foreground};
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

  ${props => props.shadowEffect ?  'transition: text-shadow 0.5s;' : ''};

  :hover {
    ${props => props.shadowEffect ?  'text-shadow: 2px 7px 5px rgba(99, 99, 99, 0.2);' : ''}
  }
`;

export default Text;
