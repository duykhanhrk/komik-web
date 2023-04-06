import {Button, Card, ComicItem, Input, Page, Text, TextArea, View} from "@components"
import {Icon} from "@iconify/react";
import {Comic, ComicMNService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation, UseMutationResult} from "react-query";
import {useNotifications} from "reapop";
import { useTheme } from "styled-components";
import Modal from 'react-modal';
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import { actCUDHelper } from "@helpers/CUDHelper";
import {useNavigate} from "react-router";

function ComicManegentPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Comic | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const theme = useTheme();
  const noti = useNotifications();
  const navigate = useNavigate();

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
    queryKey: ['admin', 'comics'],
    queryFn: ({ pageParam = 1 }) => ComicMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create: UseMutationResult = useMutation({
    mutationFn: () => ComicMNService.createAsync(selectedItem!),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => ComicMNService.updateAsync(selectedItem!),
    onSettled: query.refetch
  });

  const remove = useMutation({
    mutationFn: (id: number) => ComicMNService.deleteAsync(id),
    onSettled: query.refetch
  });

  useEffect(() => {
    query.refetch();
  }, [searchText])

  const comics = useMemo(() => query.data?.pages.flatMap(page => page.comics), [query.data]);

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
            <Text variant="title">Tên</Text>
            <Input
              variant="tertiary"
              placeholder="Tên"
              value={selectedItem?.name}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, name: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tên khác</Text>
            <Input
              variant="tertiary"
              placeholder="Tên khác"
              value={selectedItem?.other_names}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, other_names: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tác giả</Text>
            <Input
              variant="tertiary"
              placeholder="Tác giả"
              value={selectedItem?.author}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, author: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Mô tả</Text>
            <TextArea
              variant="tertiary"
              placeholder="Mô tả"
              rows={12}
              cols={40}
              value={selectedItem?.description}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, description: e.target.value})}
            />
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
                :
                  actCUDHelper(update, noti, 'update').then(() => setModalMode('close'))
              }}
            >{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Button>
          </View>
        </View>
      </Modal>
      <Page.Content gap={0}>
        <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}} horizontal>
          <View horizontal flex={1}>
            <Button
              shadowEffect
              style={{width: 120}}
              onClick={() => {
                setSelectedItem({
                  id: 0,
                  name: '',
                  description: '',
                  other_names: '',
                  author: ''
                });
                setModalMode('create');
              }}
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
            {comics?.map((item: Comic) => (
              <Card
                horizontal
                shadowEffect
                onClick={() => navigate(`/admin/comics/${item.id}`)}
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <View horizontal gap={8}>
                    <ComicItem.Image src={item.image_url} style={{borderRadius: 8}} />
                    <View flex={1} gap={4}>
                      <Text numberOfLines={1} variant="medium-title">{item.name}</Text>
                      <Text numberOfLines={1}><b>Tên khác: </b>{item.other_names}</Text>
                      <Text numberOfLines={1}><b>Tác giả: </b>{item.author}</Text>
                      <Text numberOfLines={1}><b>Trạng thái: </b>{item.status}</Text>
                      <Text numberOfLines={1}><b>Số lượt thích: </b>{item.likes}</Text>
                      <Text numberOfLines={1}><b>Số lượt xem: </b>{item.views}</Text>
                      <Text numberOfLines={2}><b>Mô tả: </b>{item.description}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  )
}

export default ComicManegentPage;
