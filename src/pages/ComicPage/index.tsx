import {Card, ComicItem, Dropdown, Tag, Text, View} from "@components";
import {useCategoriesQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {Category, CategoryService, Comic, ComicService, Suggestion} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useQuery} from "react-query";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

const sortByOptions = [
  {label: 'Ngày cập nhật', value: 'last_updated_chapter_at-desc'},
  {label: 'Lượt xem', value: 'views-desc'},
  {label: 'Lượt thích', value: 'likes-desc'}
]

const NavigationPanelContianer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 256px:
  flex-shrink: 0;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.secondaryBackground};
  position: sticky;
  top: 60px;
  bottom: 0;
  height: calc(100vh - 68px);
  overflow: auto;
  width: 256px;
  transition: box-shadow 0.5s;
  padding: 8px;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

function NavigationPanel() {
  const [searchParams] = useSearchParams();
  const [categoryIds, setCategoryIds] = useState<Array<number> | undefined>();
  const [queryText, setQueryText ] = useState<string | undefined>();
  const [recentlyKeywords, setRecentlyKeywords] = useState<Array<Suggestion>>([]);

  const  navigate = useNavigate();

  function buildSuggestion() {
    return {
      keyword: queryText || '',
      type: 'Keyword',
      data: categoryIds ? {categoryIds} : undefined
    }
  }

  useEffect(() => {
    let paramable = searchParams.get('category_id');
    const _categoryIds = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);
    paramable = searchParams.get('query');
    const _queryText = paramable === null || paramable === '' ? undefined : paramable;

    setCategoryIds(_categoryIds);
    setQueryText(_queryText);

    if (_queryText) {
      let suggestion = {
        keyword: _queryText,
        type: 'Keyword',
        data: categoryIds ? {categoryIds} : undefined
      }

      let keywords = JSON.parse(localStorage.getItem('RecentlyKeywords') || '[]');

      if (!keywords.find((item: Suggestion) => JSON.stringify(item) === JSON.stringify(suggestion))) {
        setRecentlyKeywords([suggestion, ...keywords]);
        localStorage.setItem('RecentlyKeywords', JSON.stringify([suggestion, ...keywords]));
      } else {
        setRecentlyKeywords(keywords);
      }
    }
  }, [searchParams])

  const categoryQuery = useCategoriesQuery();

  return (
    <NavigationPanelContianer>
      {queryText ?
      <>
        {recentlyKeywords.map((item, index) => (
          <Card
            variant={JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'tertiary' : 'secondary'}
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
                  navigate(`/comics?category_id=${item.data.categoryIds.join(',')}&query=${item.keyword}`);
                } else {
                  navigate(`/comics?query=${item.keyword}`);
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
      :
        <>
          <Link to={`/comics`} style={{textDecoration: 'none'}}>
            <Card variant={categoryIds ? undefined : 'tertiary'} style={{flex: 1}}>
              <Text variant="inhirit">Tất cả</Text>
            </Card>
          </Link>
          {categoryQuery.data?.categories.map((item: Category) => (
            <Link to={`/comics?category_id=${item.id}`} style={{textDecoration: 'none', display: 'flex'}}>
              <Card variant={categoryIds?.includes(item.id) ? 'tertiary' : undefined} style={{flex: 1}}>
                <Text variant="inhirit">{item.name}</Text>
              </Card>
            </Link>
          ))}
        </>
      }
    </NavigationPanelContianer>
  )
}

function ComicsList() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [searchParams] = useSearchParams();

  let paramable = searchParams.get('category_id');
  const _categoryId = paramable === null ? undefined : paramable;
  paramable = searchParams.get('sort_by');
  const _sortBy = paramable === null ? 'last_updated_chapter_at-desc' : paramable;
  paramable = searchParams.get('query');
  const _searchText = paramable === null ? undefined : paramable;

  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();

  useEffect(() => {
    setCategoryId(_categoryId);
    setSortBy(_sortBy);
    setSearchText(_searchText);
  }, [searchParams])

  const query = useInfiniteQuery({
    queryKey: ['comics', {categoryId, sortBy, searchText}],
    queryFn: ({ pageParam = 1 }) => ComicService.getAllAsync({page: pageParam, category_ids: categoryId, sort_by: sortBy, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const comics = useMemo(() => query.data?.pages.flatMap(page => page.comics), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage error={query.error} onButtonClick={() => {
      query.refetch();
    }}/>
  }

  return (
    <View flex={1} style={{flexShrink: 1, paddingBottom: 8}}>
      {comics?.length !== 0 ?
        <>
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
          <InfiniteScroll
            pageStart={0}
            loadMore={() => query.fetchNextPage()}
            hasMore={query.hasNextPage}
            loader={<Text>Loading...</Text>}
            useWindow={false}
            getScrollParent={() => document.getElementById('rootScrollable')}
          >
            <View gap={8} horizontal wrap style={{justifyContent: 'flex-start'}}>
              {comics?.map((item: Comic) => <ComicItem.Vertical shadowEffect _data={item}/>)}
            </View>
          </InfiniteScroll>
        </>
        :
        <View flex={1} gap={8} centerContent>
          <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>Không có nội dung</Text>
        </View>
      }
    </View>
  )
}

function ComicPage() {
  return (
    <View horizontal gap={8} style={{paddingRight: 8, paddingLeft: 8}}>
      <NavigationPanel />
      <ComicsList/>
    </View>
  );
}

export default ComicPage;
