import styled from "styled-components";

export interface TagProps {
  variant?: {
    ct?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary',
    tt?: 'normal' | 'small' | 'medium' | 'large'
  };
  numberOfLines?: number;
}

const Tag = styled.p<TagProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${
    props => props.variant && props.variant.ct === 'primary' ?
      props.theme.colors.themeForeground
      : props.theme.colors.foreground
  };
  font-size: 0.8em;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  height: ${
    props => !props.variant || !props.variant.tt || props.variant.tt === 'small' ? 'calc(0.8em + 20px)'
      : props.variant.tt === 'normal' ? 'calc(1.0em + 20px)'
      : props.variant.tt === 'medium' ? 'calc(1.2em + 20px)'
      : props.variant.tt === 'large' ? 'calc(1.6em + 20px)'
      : 'calc(0.8em + 20px)'
  };
  font-size: ${
    props => !props.variant || !props.variant.tt || props.variant.tt === 'small' ? '0.8em'
      : props.variant.tt === 'normal' ? '1.0em'
      : props.variant.tt === 'medium' ? '1.2em'
      : props.variant.tt === 'large' ? '1.6em'
      : '0.8em'
  };
  background-color: ${
    props => !props.variant || !props.variant.ct || props.variant.ct === 'tertiary' ? props.theme.colors.tertiaryBackground
      : props.variant.ct === 'primary' ? props.theme.colors.themeBackground
      : props.variant.ct === 'secondary' ? props.theme.colors.secondaryBackground
      : props.variant.ct === 'quaternary' ? props.theme.colors.quaternaryBackground
      : props.variant.ct === 'quinary' ? props.theme.colors.quinaryBackground
      : props.theme.colors.themeBackground
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

export default Tag;
