import {Button, Card, Input, Page, Text, View} from "@components"
import {Icon} from "@iconify/react";
import {Author, AuthorMNService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import styled, { useTheme } from "styled-components";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {useNavigate} from "react-router";
import AuthorModal from "./AuthorModal";

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 8px;
`;

function AuthorPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const theme = useTheme();
  const navigate = useNavigate();

  const query = useInfiniteQuery({
    queryKey: ['admin', 'authors'],
    queryFn: ({ pageParam = 1 }) => AuthorMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  useEffect(() => {query.refetch()}, [searchText])

  const authors = useMemo(() => query.data?.pages.flatMap(page => page.authors), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />
  }

  return (
    <Page.Container>
      <AuthorModal mode={modalMode} query={query} onModeChange={(mode) => setModalMode(mode)} />
      <Page.Content gap={0}>
        <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}} horizontal>
          <View horizontal flex={1}>
            <Button
              shadowEffect
              style={{width: 120}}
              onClick={() => {setModalMode('create')}}
            >
              <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
              <Text style={{marginLeft: 8, color: theme.colors.foreground}}>Thêm</Text>
            </Button>
          </View>
          <View horizontal>
            <Input
              shadowEffect
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </View>
        </View>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={<Text>Loading...</Text>}
          useWindow={false}
          getScrollParent={() => document.getElementById('rootScrollable')}
        >
          <View gap={8} wrap style={{justifyContent: 'center'}}>
            {authors?.map((item: Author, index: number) => (
              <Card
                horizontal
                shadowEffect
                animation={"slideLeftIn"}
                onClick={() => {navigate(`/admin/authors/${item.id}`)}}
              >
                <View
                  horizontal
                  flex={1}
                  gap={8}
                  style={{alignItems: 'center'}}
                >
                  <Avatar src={item.image_url || theme.assets.defaultAvatar}/>
                  <View gap={4} style={{justifyContent: 'center'}}>
                    <Text variant="title">
                      {`${item.lastname} ${item.firstname}`}
                    </Text>
                  </View>
                </View>
                <View horizontal gap={8} style={{alignItems: 'center'}}>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  )
}

export default AuthorPage;
