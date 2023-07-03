import {View, Card, Dropdown, Text} from "@components";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import {useTheme} from "styled-components";

const sortByOptions = [
  {label: 'Ngày cập nhật', value: 'last_updated_chapter_at-desc'},
  {label: 'Lượt xem', value: 'views-desc'},
  {label: 'Lượt thích', value: 'likes-desc'}
]

function OptionBar() {
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    let paramable = searchParams.get('category_id');
    const _categoryId = paramable === null ? undefined : paramable;
    paramable = searchParams.get('sort_by');
    const _sortBy = paramable === null ? 'last_updated_chapter_at-desc' : paramable;
    paramable = searchParams.get('query');
    const _searchText = paramable === null ? undefined : paramable;

    console.log(_sortBy);

    setCategoryId(_categoryId);
    setSortBy(_sortBy);
    setSearchText(_searchText);
  }, [searchParams])

  return (
    <View horizontal style={{justifyContent: 'flex-end', padding: '0 0 8px 8px', position: 'sticky', top: 60, backgroundColor: theme.colors.background}}>
      <Card shadowEffect style={{padding: 0}}>
        <Dropdown.SelectionList<{label: string, value: string}>
          _data={sortByOptions}
          style={{width: 160}}
          buttonContent={(item) => item ? <Text>{item.label}</Text> : 'Sắp xếp theo'}
          buttonStyle={{height: 36}}
          renderItem={(item: {label: string, value: string}) => (<Card><Text>{item.label}</Text></Card>)}
          onItemSelected={(item) => {
            setSortBy(item?.value);
            navigate(`/comics?sort_by=${item?.value}${categoryId ? `&category_id=${categoryId}` : ''}${searchText ? `&query=${searchText}` : ''}`);
          }}
          selectedItem={sortByOptions.find(item => item.value === sortBy)}
        />
      </Card>
    </View>
  )
}

export default OptionBar;
