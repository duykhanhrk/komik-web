import {Comic} from "@services";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import Card from "../Card";
import Tag from "../Tag";
import Text from "../Text";
import View from "../View";
import Image from "./Image";

interface VerticalProps extends React.HTMLProps<HTMLDivElement> {
  _data: Comic;
  shadowEffect?: boolean;
}

function Vertical(props: VerticalProps) {
  const { _data, style } = props;
  const theme = useTheme();

  return (
    <Link key={_data.id.toString()} to={`/comics/${_data.id}`} style={{textDecoration: 'none'}}>
      <Card
        shadowEffect={props.shadowEffect}
        key={_data.id.toString()}
        style={style}
      >
        <View style={{position: 'relative'}}>
          <Image style={{borderRadius: 8}} variant="medium" src={_data.image_url}/>
          {_data.up_coming &&
          <Tag style={{position: 'absolute', right: 8, top: 8, backgroundColor: theme.colors.green}}>Sắp đến</Tag>
          }
        </View>
        <Text variant="title" numberOfLines={1} style={{textAlign: 'center'}}>{_data.name}</Text>
      </Card>
    </Link>
  );
}

export default Vertical;
