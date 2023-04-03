import {Page, View} from "@components"
import {DocumentService} from "@services";
import {useQuery} from "react-query";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

function IntroductionPage() {
  const query = useQuery({
    queryKey: ['documents', 'introduction'],
    queryFn: () => DocumentService.getIntroductionAsync()
  });

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage />;
  }

  console.log();

  return (
    <Page.Container>
      <Page.Content>
        <View gap={8} style={{textAlign: 'justify'}} dangerouslySetInnerHTML={{ __html: query.data.introduction.value }}>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default IntroductionPage;
