import {Button, Card, Page, Text, View} from '@components';
import {useTheme} from 'styled-components';
import {useNavigate} from 'react-router';
import {useNotifications} from 'reapop';
import {useParams} from 'react-router';
import {useMutation, useQuery} from 'react-query';
import {ComicMNService} from '@services';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import {actCUDHelper, deleteConfirmHelper} from '@helpers/CUDHelper';
import {Icon} from '@iconify/react';
import InfoSection from './InfoSection';
import ChaptersSection from './ChapterSection';
import ImageSection from './ImageSection';
import {useState} from 'react';
import ReviewsSection from './ReviewsSection';

function ComicDetailMNPage() {
  const [tab, setTab] = useState<'info' | 'chapters' | 'reviews'>('info');

  const theme = useTheme();
  const noti = useNotifications();
  const navigate = useNavigate();

  const { comic_id } = useParams();

  const query = useQuery({
    queryKey: ['admin', 'comic', comic_id],
    queryFn: () => ComicMNService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

  const update = useMutation({
    mutationFn: () => ComicMNService.activeAsync(parseInt(comic_id || ''), !query.data?.active),
    onSettled: () => query.refetch()
  });

  const remove = useMutation({
    mutationFn: () => ComicMNService.deleteAsync(parseInt(comic_id || ''))
  });

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />;
  }

  return (
    <Page.Container>
      <Page.Content style={{flex: 0, flexDirection: 'row', position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}}>
        <View horizontal flex={1} gap={8}>
          <Button
            variant="secondary"
            style={{gap: 8, width: 120}}
            onClick={() => navigate(-1)}
          >
            <Icon icon={'mingcute:arrow-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
            <Text variant="inhirit">Trở về</Text>
          </Button>
          <Button
            variant="secondary"
            style={{gap: 8, width: 180}}
            onClick={() => setTab('info')}
          >
            <Icon icon={tab === 'info' ? 'mingcute:document-fill' : 'mingcute:document-line'} style={{color: theme.colors.blue, height: 24, width: 24}}/>
            <Text style={{color: tab === 'info' ? theme.colors.blue : theme.colors.foreground}}>Thông tin</Text>
          </Button>
          <Button
            variant="secondary"
            style={{gap: 8, width: 180}}
            onClick={() => setTab('chapters')}
          >
            <Icon icon={tab === 'chapters' ? 'mingcute:grid-fill' : 'mingcute:grid-line'} style={{color: theme.colors.green, height: 24, width: 24}}/>
            <Text style={{color: tab === 'chapters' ? theme.colors.green : theme.colors.foreground}}>Các chương</Text>
          </Button>
          <Button
            variant="secondary"
            style={{gap: 8, width: 180}}
            onClick={() => setTab('reviews')}
          >
            <Icon icon={tab === 'reviews' ? 'mingcute:comment-fill' : 'mingcute:comment-line'} style={{color: theme.colors.yellow, height: 24, width: 24}}/>
            <Text style={{color: tab === 'reviews' ? theme.colors.yellow : theme.colors.foreground}}>Đánh giá</Text>
          </Button>
        </View>
        {tab === 'info' && (
          <View horizontal gap={8}>
            <Button
              shadowEffect
              variant="secondary"
              style={{gap: 8, width: 120}}
              onClick={() => actCUDHelper(update, noti, 'update')}
            >
              <Icon icon={query.data?.active ? 'mingcute:eye-fill' : 'mingcute:eye-line'} style={{color: theme.colors.blue, height: 20, width: 20}}/>
              <Text style={{color: query.data?.active ? theme.colors.blue : theme.colors.foreground}}>Công khai</Text>
            </Button>
            <Button
              variant="primary"
              style={{background: theme.colors.red, gap: 8, width: 120}}
              onClick={() => {
                deleteConfirmHelper({
                  noti: noti,
                  onConfirm: async () => {actCUDHelper(remove, noti, 'delete').then(() => navigate(-1));},
                  title: 'Xác nhận xóa truyện',
                  message: 'Bạn có chắc chắn muốn xóa truyện này?'
                });
              }}
            >
              <Icon icon={'mingcute:delete-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
              <Text variant="inhirit">Xóa</Text>
            </Button>
          </View>
        )}
      </Page.Content>
      <Page.Content gap={16}>
        {tab === 'info' && (
          <>
            <Card shadowEffect animation="slideLeftIn">
              <Text variant="medium-title">Ảnh đại diện</Text>
              <ImageSection _data={query.data!} onSaveSuccess={query.refetch}/>
            </Card>
            <Card shadowEffect animation="slideRightIn">
              <InfoSection _data={query.data!} onSaveSuccess={query.refetch}/>
            </Card>
          </>
        )}
        {tab === 'chapters' && (<ChaptersSection comic_id={parseInt(comic_id || '')} />)}
        {tab === 'reviews' && (<ReviewsSection comic_id={parseInt(comic_id || '')} />)}
      </Page.Content>
    </Page.Container>
  );
}

export default ComicDetailMNPage;
