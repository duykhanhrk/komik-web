import styled from "styled-components";

interface CardProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  ebonsai?: boolean;
  ebonsaiSnippet?: boolean;
  horizontal?: boolean;
  flex?: number;
  shadowEffect?: boolean;
  centerContent?: boolean | 'horizontal' | 'vertical';
}

const Card = styled.div<CardProps>`
  ${props => props.flex ? `flex: ${props.flex}` : ''};
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;

  flex-direction: ${props => props.horizontal ? 'row' : 'column'};

  ${props => props.centerContent ?
    props.centerContent === 'horizontal' ? (props.horizontal ? 'align-items: center;' : 'justify-content: center;')
    : props.centerContent === 'vertical' ? (props.horizontal ? 'justify-content: center;' : 'align-items: center;')
    : 'align-items: center; justify-content: center;'
    : ''
  }

  color: ${
    props => props.variant && props.variant === 'primary'?
      props.theme.colors.themeForeground
      : props.theme.colors.foreground
  };
  background-color: ${
    props => !props.variant || props.variant === 'secondary' ? props.theme.colors.secondaryBackground
      : props.variant === 'primary' ? props.theme.colors.themeBackground
      : props.variant === 'tertiary' ? props.theme.colors.tertiaryBackground
      : props.variant === 'quaternary' ? props.theme.colors.quaternaryBackground
      : props.variant === 'quinary' ? props.theme.colors.quinaryBackground
      : props.theme.colors.themeBackground
  };

  ${props => props.ebonsai || props.ebonsaiSnippet ? `
    padding: 4px;
    flex-direction: row;
    align-items: center;
    height: 44px;
  ` : ''}

  ${props => props.shadowEffect || props.ebonsaiSnippet ?  'transition: box-shadow 0.5s;' : ''};

  &:hover {
    ${props => props.shadowEffect || props.ebonsaiSnippet ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
`;

export default Card;
