import {Button, Card, ConfirmationBoard, Input, PreText, Tag, Text, View} from "@components";
import {useTheme} from "styled-components";
import {useNotifications} from "reapop";
import {useInfiniteQuery, useMutation} from "react-query";
import {ComicMNService, ComicService, Review} from "@services";
import {useEffect, useMemo, useState} from "react";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import InfiniteScroll from "react-infinite-scroller";
import {Icon} from "@iconify/react";
import {actCUDHelper, deleteConfirmHelper} from "@helpers/CUDHelper";
import moment from "moment";

function ReviewsSection({comic_id}: {comic_id: number}) {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Review | undefined>();
  const [confirmationBoardOpen, setConfirmationBoardOpen] = useState<boolean>(false);

  const noti = useNotifications();
  const theme = useTheme();

  const query = useInfiniteQuery({
    queryKey: ['admin', comic_id , 'reviews'],
    queryFn: ({ pageParam = 1 }) => ComicMNService.getAllReviewsAsync(comic_id, {page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const remove = useMutation({
    mutationFn: (id: number) => ComicMNService.deleteReviewAsync(comic_id, id),
    onSettled: query.refetch
  });

  const evaluate = useMutation({
    mutationFn: ({review_id, point_of_view}: {review_id: number, point_of_view: number}) => ComicService.evaluateReviewAsync(comic_id, review_id, point_of_view),
    onSettled: query.refetch
  });

  useEffect(() => {
    query.refetch();
  }, [searchText]);

  const reviews = useMemo(() => query.data?.pages.flatMap(page => page.reviews), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  return (
    <View gap={8}>
      <ConfirmationBoard
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa?"
        open={confirmationBoardOpen}
        onOpenChange={(open) => setConfirmationBoardOpen(open)}
        onConfirm={() => {
          actCUDHelper(remove, noti, 'delete', selectedItem?.id!);
          setConfirmationBoardOpen(false);
        }}
        onCancel={() => setConfirmationBoardOpen(false)}
      />

      <View horizontal>
        <View horizontal flex={1}>
        </View>
        <View horizontal>
          <Input
            variant="secondary"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </View>
      </View>
      <View gap={8} style={{height: 640}} scrollable animation="slideLeftIn">
        {reviews?.length !== 0 ?
        <InfiniteScroll
          pageStart={0}
          loadMore={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={<Text>Loading...</Text>}
          useWindow={false}
        >
          <View gap={8} wrap style={{justifyContent: 'center'}}>
            {reviews?.map((item: Review) => (
              <View horizontal gap={8}>
                <Card ebonsaiSnippet>
                  <img src={item?.user?.avatar_url} style={{height: 36, width: 36, borderRadius: 8}} />
                </Card>
                <Card flex={1} variant="secondary" shadowEffect>
                  <View flex={1} gap={8}>
                    <Text variant="title">{item?.title}</Text>
                    <PreText>{item?.content}</PreText>
                    <View horizontal gap={8}>
                      <View horizontal flex={1} gap={4} style={{justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <Tag
                          variant={{ct: "secondary"}}
                          style={{gap: 8, width: 60}}
                          onClick={() => {
                            actCUDHelper(evaluate, noti, 'update', {review_id: item?.id, point_of_view: 1});
                          }}
                        >
                          <Icon icon={'mingcute:thumb-up-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
                          {item.agreement_count || 0}
                        </Tag>
                        <Tag
                          variant={{ct: "secondary"}}
                          style={{gap: 8, width: 60}}
                          onClick={() => {
                            actCUDHelper(evaluate, noti, 'update', {review_id: item?.id, point_of_view: 2});
                          }}
                        >
                          <Icon icon={'mingcute:thumb-down-line'} style={{height: 16, width: 16, color: theme.colors.blue}} />
                          {item.disagreement_count || 0}
                        </Tag>
                        <Tag
                          variant={{ct: "secondary"}}
                          style={{gap: 8, width: 60}}
                          onClick={() => {
                            actCUDHelper(evaluate, noti, 'update', {review_id: item?.id, point_of_view: 3});
                          }}
                        >
                          <Icon icon={'mingcute:warning-line'} style={{height: 16, width: 16, color: theme.colors.red}} />
                          {item.transgression_count || 0}
                        </Tag>
                        {item.point_of_view && [1, 2, 3].includes(item.point_of_view) ? 
                          <Tag variant={{ct: "tertiary"}} style={{gap: 8}}>
                            {
                              item.point_of_view === 1
                              ?<Icon icon={'mingcute:thumb-up-fill'} style={{height: 16, width: 16, color: theme.colors.green}} />
                              : item.point_of_view === 2
                              ? <Icon icon={'mingcute:thumb-down-fill'} style={{height: 16, width: 16, color: theme.colors.blue}} />
                              : <Icon icon={'mingcute:warning-fill'} style={{height: 16, width: 16, color: theme.colors.red}} />
                            }
                            {
                              item.point_of_view === 1
                              ? <Text style={{color: theme.colors.green}}>Đồng ý</Text>
                              : item.point_of_view === 2
                              ? <Text style={{color: theme.colors.blue}}>Không đồng ý</Text> 
                              : <Text style={{color: theme.colors.red}}>Vi phạm</Text>
                            }
                          </Tag>
                          :
                          null
                        }
                        <View flex={1}></View>
                        <Tag variant={{ct: "tertiary"}}>{ item?.user?.firstname !== '' || item.user.lastname !== '' ? item?.user?.lastname + ' ' + item?.user?.firstname : item?.user?.username}</Tag>
                        <Tag variant={{ct: "secondary"}}>{moment(item?.updated_at).format('DD-MM-YYYY HH:MM:ss')}</Tag>
                      </View>
                    </View>
                  </View>
                </Card>
                <View>
                  <Card ebonsaiSnippet horizontal={false}>
                    <Button
                      ebonsai
                      square
                      onClick={() => {
                        // setSelectedItem(item);
                        // setConfirmationBoardOpen(true);
                        deleteConfirmHelper({
                          noti: noti,
                          onConfirm: async () => {
                            actCUDHelper(remove, noti, 'delete', item?.id!);
                          }
                        });
                      }}
                    >
                       <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.red}} />
                    </Button>
                  </Card>
                </View>
              </View>
            ))}
          </View>
        </InfiniteScroll>
        :
        <View flex={1} centerContent>
          <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>Không có đánh giá nào</Text>
        </View>
        }
      </View>
    </View>
  )
}

export default ReviewsSection;
