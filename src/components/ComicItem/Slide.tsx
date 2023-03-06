import {Comic} from "@services";
import styled, {useTheme} from "styled-components";
import Text from "../Text";

interface SlideProps extends React.HTMLProps<HTMLDivElement> {
  _data: Comic
}

const SlideContainer = styled.div`
  display: flex;
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.secondaryBackground};
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
`;

const BlurredImage = styled.div`
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
`;

const MainImage = styled.img`
  position: relative;
  object-fit: contain;
  z-index: 1;
  height: 300px;
`;

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
`;

function Slide(props: SlideProps) {
  const theme = useTheme();
  const { _data, style, ...rest } = props;

  return (
    <SlideContainer style={style}>
      <ImageContainer>
        <BlurredImage style={{backgroundImage: `url(${_data.image})`}}/>
        <MainImage src={_data.image}/>
      </ImageContainer>
      <TextContainer>
        <Text variant='large' numberOfLines={1}>{_data.name}</Text>
        <Text numberOfLines={0}><b>Tên khác: </b>{_data.other_names}</Text>
        <Text numberOfLines={0}><b>Tác giả: </b>{_data.author}</Text>
        <Text numberOfLines={0}><b>Trạng thái: </b>{_data.status}</Text>
        <Text numberOfLines={5}><b>Tóm tắt: </b>{_data.description}</Text>
      </TextContainer>
    </SlideContainer>
  );
}

export default Slide;
