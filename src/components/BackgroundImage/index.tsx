import styled from 'styled-components';

interface BackgroundImageProps extends React.HTMLProps<HTMLDivElement> {
  src: string;
  blur?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Image = styled.div<{src: string, blur?: number}>`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  ${props => props.blur ? `filter: blur(${props.blur}px);` : ''}
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

function BackgroundImage(props: BackgroundImageProps) {
  const { src, blur, children, style } = props;

  return (
    <Container style={style}>
      <Image src={src} blur={blur}/>
      <Content>
        {children}
      </Content>
    </Container>
  );
}

export default BackgroundImage;
