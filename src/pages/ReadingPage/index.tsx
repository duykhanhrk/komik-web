import {Page, Text, View} from "@components";
import {ChapterService} from "@services";
import {useQuery} from "react-query";
import {useNavigate, useParams} from "react-router";
import {useTheme} from "styled-components";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

function ReadingPage() {
  const { comic_id, chapter_id } = useParams();

  const navigate = useNavigate();
  const theme = useTheme();

  const query = useQuery({
    queryKey: ['comics', comic_id, 'chapters', chapter_id],
    queryFn: () => ChapterService.getDetailAsync(parseInt(chapter_id || '0')),
    retry: 0
  });

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return (
      <ErrorPage
        error={query.error}
        messages={['Bạn cần đăng ký gói để sử dụng nội dung này']}
        buttonText={'Mua gói ngay'}
        onButtonClick={() => navigate('/plans')}
      />
    )
  }

  return (
    <Page.Container>
      <Page.Content style={{gap: 0}}>
        {query.data.chapter.image_urls.length !== 0 ?
          query.data.chapter.image_urls.map((item: string) => (
            <img src={item} />
          ))
        :
          <View flex={1} centerContent>
            <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>
              Đang được cập nhật
            </Text>
          </View>
        }
      </Page.Content>
    </Page.Container>
  );
}

export default ReadingPage;
