import {Button, Card, Input, Page, Tag, Text, TextArea, View} from "@components"
import {Feedback, FeedbackMNService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";
import Modal from 'react-modal';
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import Moment from "moment";

function FeedbackMNPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Feedback | undefined>();
  const [modalMode, setModalMode] = useState<'open' | 'close'>('close');

  const theme = useTheme();
  const noti = useNotifications();

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: `0 solid ${theme.colors.secondaryBackground}`,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colors.secondaryBackground
    },
    overlay: {
      backgroundColor: `${theme.colors.background}99`
    }
  };

  const query = useInfiniteQuery({
    queryKey: ['admin', 'feedbacks'],
    queryFn: ({ pageParam = 1 }) => FeedbackMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  useEffect(() => {
    query.refetch();
  }, [searchText])

  const feedbacks = useMemo(() => query.data?.pages.flatMap(page => page.feedbacks), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />
  }

  return (
    <Page.Container>
      <Modal
        isOpen={modalMode !== 'close'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Người gửi</Text>
            <Input
              disabled
              variant="tertiary"
              placeholder="Người gửi"
              value={selectedItem?.user?.username}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Ngày gửi</Text>
            <Input
              disabled
              variant="tertiary"
              placeholder="Người gửi"
              value={Moment(selectedItem?.created_at).format('DD/MM/YYYY HH:MM:SS')}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tiêu đề</Text>
            <Input
              disabled
              variant="tertiary"
              placeholder="Tiêu đề"
              value={selectedItem?.title}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Nội dung</Text>
            <TextArea
              disabled
              variant="tertiary"
              placeholder="Nội dung"
              rows={12}
              cols={40}
              value={selectedItem?.content}
            />
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
          </View>
        </View>
      </Modal>
      <Page.Content gap={0}>
        <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}} horizontal>
          <View horizontal flex={1}>
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
            {feedbacks?.map((item: Feedback) => (
              <Card
                horizontal
                shadowEffect
                onClick={() => {
                  setSelectedItem(item);
                  setModalMode('open');
                }}
              >
                <View flex={1} horizontal gap={8} style={{alignItems: 'center'}}>
                  <Text numberOfLines={1} variant="title">{item.title}</Text>
                  <Tag>{item.user?.username}</Tag>
                  <Tag>{item.user?.email}</Tag>
                </View>
                <View horizontal style={{alignItems: 'center'}}>
                  <Tag>{Moment(item.created_at).format('DD/MM/YYYY HH:MM:SS')}</Tag>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  )
}

export default FeedbackMNPage;
