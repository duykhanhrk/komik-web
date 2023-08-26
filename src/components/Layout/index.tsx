import styled from 'styled-components';

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  overflow: auto;
`;

const AppScalableContainer = styled.div<{horizontal?: boolean}>`
  min-height: 100vh;
  display: flex;
  text-align: center;
  flex-direction: ${props => props.horizontal ? 'row' : 'column'};
  font-size: 1.0em;
  align-items: stretch;
  justify-content: stretch;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

const AppHeaderContainer = styled.div<{horizontal?: boolean, hide?: boolean, scalable? :boolean}>`
  flex: ${props => props.scalable ? '1' : '0'};
  display: ${props => props.hide ? 'none' : 'flex'};
  flex-direction: column;
  height: ${props => props.horizontal ? '100vh' : '60px'};
  position: sticky;
  left: 0;
  top: 0;
  ${props => props.horizontal ? 'bottom: 0;' : 'right: 0;'}
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  z-index: 46
`;

const AppContentContainer = styled.div<{horizontal?: boolean, scalable?: boolean, ebonsaiShelf?: boolean}>`
  display: flex;
  flex: ${props => props.scalable ? '1' : '0'};
  flex-direction: column;
  align-items: stretch;
  justify-items: center;
  min-height: ${props => props.horizontal ? '100vh' : 'calc(100vh - 60px)'};
  ${props => props.ebonsaiShelf ? 'gap: 8px; padding: 8px;' : ''}
`;

const AppFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

export default {AppContainer, AppScalableContainer, AppHeaderContainer, AppContentContainer, AppFooterContainer};
