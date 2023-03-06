import styled from "styled-components";

const Input = styled.input`
  height: 40px;
  outline: none;
  padding: 8px;
  font-size: 1.0em;
  border-style: none;
  border-radius: 8px;
  color: ${props => props.theme.colors.foreground};
  background-color: ${props => props.theme.colors.secondaryBackground};

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${props => props.theme.colors.quinaryForeground};
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${props => props.theme.colors.quinaryForeground};
  }

  ::-ms-input-placeholder { /* Microsoft Edge */
    color: ${props => props.theme.colors.quinaryForeground};
  }
`;

export default Input;
