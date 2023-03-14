import {Card, ComicItem, Dropdown, Text, View} from "@components";
import {Category, CategoryService, Comic, ComicService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useQuery} from "react-query";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

const sortByOptions = [
  {label: 'Ngày cập nhật', value: 'updated_at-desc'},
  {label: 'Lượt xem', value: 'views-desc'},
  {label: 'Lượt thích', value: 'likes-desc'}
]

const NavigationPanelContianer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 240px:
  flex-shrink: 0;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.secondaryBackground};
  position: sticky;
  top: 60px;
  max-height: calc(100vh - 68px);
  overflow: auto;
  width: 240px;
  transition: box-shadow 0.5s;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

function NavigationPanel() {
  const categoryQuery = useQuery<{ categories: Array<Category> }>({
    queryKey: ['categories'],
    queryFn: CategoryService.getAllAsync,
  });

  return (
    <NavigationPanelContianer>
      <Link to={`/comics`} style={{textDecoration: 'none'}}>
        <Card>
          <Text>Tất cả</Text>
        </Card>
      </Link>
      {categoryQuery.data?.categories.map((item) => (
        <Link to={`/comics?category_id=${item.id}`} style={{textDecoration: 'none'}}>
          <Card>
            <Text>{item.name}</Text>
          </Card>
        </Link>
      ))}
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
  const _sortBy = paramable === null ? 'updated_at-desc' : paramable;
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

  console.log(searchText + 'rednerjlaskfjsadl f');


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
    <View flex={1} style={{flexShrink: 1}}>
      {comics?.length !== 0 ?
        <>
          <Card horizontal style={{justifyContent: 'flex-end', position: 'sticky', top: 60, backgroundColor: theme.colors.background}}>
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
          </Card>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => query.fetchNextPage()}
            hasMore={query.hasNextPage}
            loader={<Text>Loading...</Text>}
            useWindow={false}
            getScrollParent={() => document.getElementById('rootScrollable')}
          >
            <View gap={8} horizontal wrap style={{justifyContent: 'center'}}>
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
