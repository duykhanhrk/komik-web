import {Page, Text} from "@components";
import {ChapterService} from "@services";
import {useQuery} from "react-query";
import {useParams} from "react-router";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

function ReadingPage() {
  const { comic_id, chapter_id } = useParams();
  const query = useQuery({
    queryKey: ['comics', comic_id, 'chapters', chapter_id],
    queryFn: () => ChapterService.getDetailAsync(parseInt(chapter_id || '0'))
  });

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage />
  }

  return (
    <Page.Container>
      <Page.Content>
        {query.data.chapter.images.map((item: {url: string}) => (
          <img src={item.url} />
        ))}
      </Page.Content>
    </Page.Container>
  );
}

export default ReadingPage;
