import {Button, Card, Input, Page, Text, TextArea, View} from "@components"
import {Icon} from "@iconify/react";
import {Plan, PlanMNService, User, UserMNService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation, UseMutationResult} from "react-query";
import {useNotifications} from "reapop";
import styled, { useTheme } from "styled-components";
import Modal from 'react-modal';
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import { actCUDHelper } from "@helpers/CUDHelper";
import Moment from 'moment';

const Avatar = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 8px;
`;

const HoriLine = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
`;

function UserMNPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<User | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [verfiyPassword, setVerifyPassword] = useState<string>('');

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
    queryKey: ['admin', 'users'],
    queryFn: ({ pageParam = 1 }) => UserMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create: UseMutationResult = useMutation({
    mutationFn: () => UserMNService.createAsync(selectedItem!, verfiyPassword),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => UserMNService.updateAsync(selectedItem!, verfiyPassword),
    onSettled: query.refetch
  });

  useEffect(() => {query.refetch()}, [searchText])

  const users = useMemo(() => query.data?.pages.flatMap(page => page.users), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />
  }

  return (
    <Page.Container>
      <Modal
        isOpen={modalMode !== 'close' && !isVerifyModalOpen}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Tên</Text>
            <Input
              disabled={modalMode !== 'create'}
              variant="tertiary"
              placeholder="Họ"
              value={selectedItem?.lastname}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, lastname: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Họ</Text>
            <Input
              disabled={modalMode !== 'create'}
              variant="tertiary"
              placeholder="Tên"
              value={selectedItem?.firstname}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, firstname: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tên đăng nhập</Text>
            <Input
              disabled={modalMode !== 'create'}
              variant="tertiary"
              placeholder="Tên đăng nhập"
              value={selectedItem?.username}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, username: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Email</Text>
            <Input
              disabled={modalMode !== 'create'}
              variant="tertiary"
              placeholder="Email"
              value={selectedItem?.email}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, email: e.target.value})}
            />
          </View>
          {modalMode === 'create' &&
          <View gap={8}>
            <Text variant="title">Mật khẩu</Text>
            <Input
              variant="tertiary"
              placeholder="Mật khẩu"
              type="password"
              value={selectedItem?.password}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, password: e.target.value})}
            />
          </View>
          }
          <View gap={8}>
            <Text variant="title">Vai trò</Text>
            <View horizontal gap={8}>
              <Button
                shadowEffect
                selected={selectedItem?.role !== 0}
                style={{flex: 1}}
                onClick={() => selectedItem && setSelectedItem({...selectedItem, role: selectedItem?.role === 0 ? 1 : 0})}
              >
              {selectedItem?.role !== 0 ? 'Quản trị viên' : 'Người dùng'}</Button>
            </View>
          </View>
          <View gap={8}>
            <Text variant="title">Khóa</Text>
            <View horizontal gap={8}>
              <Button
                shadowEffect
                selected={selectedItem?.locked}
                style={{flex: 1}}
                onClick={() => selectedItem && setSelectedItem({...selectedItem, locked: !selectedItem?.locked})}
              >
              {selectedItem?.locked ? 'Đã bị khóa' : 'Đang hoạt động'}</Button>
            </View>
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => setIsVerifyModalOpen(true)}>{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Button>
          </View>
        </View>
      </Modal>
      <Modal
        isOpen={isVerifyModalOpen}
        onRequestClose={() => setIsVerifyModalOpen(false)}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Nhập mật khẩu để xác nhận</Text>
            <Input
              type="password"
              variant="tertiary"
              placeholder="Mật khẩu"
              value={verfiyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => {setIsVerifyModalOpen(false); setVerifyPassword('');}}>Hủy</Button>
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => {
                    setIsVerifyModalOpen(false);
                    setVerifyPassword('');
                    setModalMode('close');
                  })
                :
                  actCUDHelper(update, noti, 'update').then(() => {
                    setIsVerifyModalOpen(false);
                    setVerifyPassword('');
                    setModalMode('close');
                  })
              }}
            >Xác nhận</Button>
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
                  firstname: '',
                  lastname: '',
                  username: '',
                  email: '',
                  birthday: new Date('2001-01-01'),
                  password: '',
                  role: 1,
                  locked: false
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
            {users?.map((item: User) => (
              <Card
                horizontal
                shadowEffect
              >
                <View
                  horizontal
                  flex={1}
                  gap={8}
                  style={{alignItems: 'center'}}
                >
                  <Avatar src={item.avatar_url}/>
                  <View flex={1} gap={4} style={{justifyContent: 'center'}}>
                    <Text variant="title">
                      { item.lastname !== '' || item.lastname !== '' ? `${item.lastname} ${item.firstname}` : `${item.username}`}
                    </Text>
                    <HoriLine>
                      <Icon icon={'mingcute:user-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                      <Text>{`${item.username}`}</Text>
                    </HoriLine>
                    <HoriLine>
                      <Icon icon={'mingcute:mail-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                      <Text>{`${item.email}`}</Text>
                    </HoriLine>
                    <HoriLine>
                      <Icon icon={'mingcute:cake-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                      <Text>{`${Moment(item.birthday).format('DD/MM/YYYY')}`}</Text>
                    </HoriLine>
                  </View>
                </View>
                <View horizontal style={{alignItems: 'center'}}>
                  <Button
                    style={{width: 40}}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode('update');
                    }}
                  >
                    <Icon icon={'mingcute:edit-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
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

export default UserMNPage;
