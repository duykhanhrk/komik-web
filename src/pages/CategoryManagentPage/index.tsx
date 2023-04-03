import {Button, Card, Input, Page, SearchInput, Text, TextArea, View} from "@components"
import {Icon} from "@iconify/react";
import {Category, CategoryMNService} from "@services";
import {isAxiosError} from "axios";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation, UseMutationResult} from "react-query";
import {useNotifications} from "reapop";
import { useTheme } from "styled-components";
import Modal from 'react-modal';
import {NotificationsContext} from "reapop/dist/contexts/reapopNotificationsContext";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

async function actCUDHelper(
  act: UseMutationResult<any, any, any, any>,
  noti: NotificationsContext,
  type: 'create' | 'update' | 'delete', 
  actVariable?: unknown,
  ) {
  const notification = noti.notify({
    title: 'Thực thi',
    message: type === 'create' ? 'Đang tạo...' : type === 'update' ? 'Đang cập nhật...' : 'Đang xóa...',
    status: 'loading',
    dismissible: false
  });

  try {
    await act.mutateAsync(actVariable);

    notification.title = 'Thành công'
    notification.status = 'success';
    notification.message = type === 'create' ? 'Tạo thành công' : type === 'update' ? 'Cập nhật thành công' : 'Xóa thành công';
    notification.dismissible = true;
    notification.dismissAfter = 3000;
    noti.notify(notification);
  } catch(error) {
    if (isAxiosError(error) && error.response) {
      notification.message = error.response.data.message;
    } else {
      notification.message = 'Có lỗi xảy ra, xin thử lại sau';
    }

    notification.title = 'Lỗi'
    notification.status = 'error';
    notification.dismissible = true;
    notification.dismissAfter = 3000;

    noti.notify(notification);

    return Promise.reject();
  }

  return Promise.resolve();
}

function CategoryManegentPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Category | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

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
    queryKey: ['admin', 'categories'],
    queryFn: ({ pageParam = 1 }) => CategoryMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create: UseMutationResult = useMutation({
    mutationFn: () => CategoryMNService.createAsync(selectedItem!),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => CategoryMNService.updateAsync(selectedItem!),
    onSettled: query.refetch
  });

  const remove = useMutation({
    mutationFn: (id: number) => CategoryMNService.deleteAsync(id),
    onSettled: query.refetch
  });

  useEffect(() => {
    query.refetch();
  }, [searchText])

  const categories = useMemo(() => query.data?.pages.flatMap(page => page.categories), [query.data]);

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
                setSelectedItem({id: 0, name: '', description: ''});
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
            {categories?.map((item: Category) => (
              <Card
                horizontal
                shadowEffect
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <Text variant="title">{item.name}</Text>
                </View>
                <View horizontal>
                  <Button
                    style={{width: 40}}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode('update');
                    }}
                  >
                    <Icon icon={'mingcute:edit-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                  <Button
                    style={{width: 40}}
                    onClick={() => actCUDHelper(remove, noti, 'delete', item.id)}
                  >
                    <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  )
}

export default CategoryManegentPage;
