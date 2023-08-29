import {Card, Input, Tag, Text, View} from '@components';
import {Author, AuthorMNService} from '@services';
import {useEffect, useMemo, useState} from 'react';
import styled, {useTheme} from 'styled-components';
import Modal from 'react-modal';
import {useInfiniteQuery} from 'react-query';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import InfiniteScroll from 'react-infinite-scroller';
import {Icon} from '@iconify/react';

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 8px;
`;

function AuthorsModal({_data, open, onOpenChange, onDataChange}: {
  _data?: Array<Author>,
  open: boolean,
  onOpenChange?: (open: boolean) => void
  onDataChange?: (data: Array<Author>) => void
}) {
  const [searchText, setSearchText] = useState<string>('');
  const [_open, setOpen] = useState<boolean>(open);
  const [data, setData] = useState<Array<Author>>(_data || []);

  const theme = useTheme();

  const query = useInfiniteQuery({
    queryKey: ['admin', 'comic', 'authors'],
    queryFn: ({ pageParam = 1 }) => AuthorMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  useEffect(() => {query.refetch();}, [searchText]);
  useEffect(() => {setOpen(open);}, [open]);
  useEffect(() => {setData(_data || []);}, [_data]);

  const authors = useMemo(() => query.data?.pages.flatMap(page => page.data), [query.data]);

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
      backgroundColor: theme.colors.secondaryBackground,
      overflow: 'hidden'
    },
    overlay: {
      backgroundColor: `${theme.colors.background}99`
    }
  };

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />;
  }

  return (
    <Modal
      isOpen={_open}
      onRequestClose={() => {setOpen(false); onOpenChange?.(false);}}
      style={customStyles}
    >
      <View gap={16} animation="slideTopIn" style={{height: 540, width: 420}}>
        <View>
          <Input
            variant="tertiary"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </View>
        <View scrollable flex={1} gap={4} style={{padding: 2}}>
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
                    <View flex={1} />
                    {data.find(i => i.id === item.id) ?
                      <Tag
                        variant={{ct: 'tertiary'}}
                        style={{color: theme.colors.red, width: 120, gap: 8}}
                        onClick={() => {
                          setData(data.filter(i => i.id !== item.id));
                          onDataChange?.(data.filter(i => i.id !== item.id));
                        }}
                      >
                        <Icon icon="akar-icons:minus" />
                        Xóa
                      </Tag>
                      :
                      <Tag
                        variant={{ct: 'tertiary'}}
                        style={{color: theme.colors.blue, width: 120, gap: 8}}
                        onClick={() => {
                          setData([...data, item]);
                          onDataChange?.([...data, item]);
                        }}
                      >
                        <Icon icon="akar-icons:plus" />
                        Thêm
                      </Tag>
                    }
                  </View>
                  <View horizontal gap={8} style={{alignItems: 'center'}}>
                  </View>
                </Card>
              ))}
            </View>
          </InfiniteScroll>
        </View>
      </View>
    </Modal>
  );
}

export default AuthorsModal;
