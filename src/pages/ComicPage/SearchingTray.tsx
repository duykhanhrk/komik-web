import {Card, Tag, Text, View} from "@components";
import {useAppSelector} from "@hooks";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {matchPath, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useTheme} from "styled-components";

function SearchingTray() {
  const [params, setParams] = useState<{
    category_ids?: Array<number>,
    query?: string,
    release_dates?: string
  }>({});

  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const isSearching = matchPath("/comics/searching/*", pathname);

  const { keywords } = useAppSelector((state) => state.keywords);

  const theme = useTheme();
  const  navigate = useNavigate();

  function buildSuggestion() {
    return {
      keyword: params.query || '',
      type: 'Keyword',
      data: params.category_ids ? {categoryIds: params.category_ids} : undefined
    }
  }

  useEffect(() => {
    let paramable = searchParams.get('category_ids');
    const category_ids = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);

    paramable = searchParams.get('query');
    const query = paramable === null || paramable === '' ? undefined : paramable;

    paramable = searchParams.get('release_dates');
    const release_dates = paramable === null || paramable === '' ? undefined : paramable;

    setParams({
      category_ids,
      query,
      release_dates
    });

  }, [searchParams])

  return (
    <>
      {keywords.map((item, index) => (
        <Card
          variant={isSearching && JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'tertiary' : 'secondary'}
          horizontal
          style={{alignItems: 'center'}}
          key={index.toString()}
        >
          <View
            flex={1}
            horizontal
            gap={8}
            style={{alignItems: 'center'}}
            onClick={() => {
              if (item.data) {
                navigate(`/comics/searching?category_ids=${item.data.categoryIds.join(',')}&query=${item.keyword}`);
              } else {
                navigate(`/comics/searching?query=${item.keyword}`);
              }
            }}
          >
            <Text numberOfLines={1} style={{flex: 1}}>{item.keyword}</Text>
            <Tag variant={{ct: JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'quaternary' : 'tertiary'}} style={{gap: 8, display: item.data ? 'flex' : 'none'}}>
              <Icon icon={'mingcute:filter-line'} style={{height: 16, width: 16, color: 'inhirit'}} />
              {item.data ? item.data.categoryIds.length : null}
            </Tag>
            <Tag variant={{ct: JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'quaternary' : 'tertiary'}} style={{gap: 8}}>
              <Icon icon={'mingcute:history-line'} style={{height: 16, width: 16, color: 'inhirit'}} />
            </Tag>
          </View>
        </Card>
      ))}
    </>
  )
}

export default SearchingTray;
