import {Button, Card, ComicItem, Page, Text, View} from "@components";
import {Icon} from "@iconify/react";
import {ChapterService, ComicService} from "@services";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {useNavigate, useParams} from "react-router";
import {useTheme} from "styled-components";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

function ControlPanel({hide, onHideChanged}: {hide: boolean, onHideChanged: (isHide: boolean) => void}) {
  const [isHide, setIsHide] = useState(hide);

  const theme = useTheme();
  const navigate = useNavigate();
  const { comic_id, chapter_id } = useParams();

  useEffect(() => {
    setIsHide(hide);
  }, [hide])

  const query = useQuery({
    queryKey: ['app', 'comics', comic_id],
    queryFn: () => ComicService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage />
  }

  return (
    <View gap={8} style={{display: isHide ? 'none' : 'flex', position: 'sticky', height: 'calc(100vh - 60px)', left: 0, bottom: 0, top: 60, width: 272, padding: '0px 8px 8px 8px', flexBasis: 272, flexShrink: 0}}>
      <Card horizontal ebonsai animation="slideRightIn">
        <View flex={1} horizontal gap={8}>
          <Button ebonsai variant="transparent" onClick={() => navigate(`/comics/${comic_id}`)} style={{gap: 8, width: 'auto'}}>
            <Icon icon={'mingcute:arrow-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
            <Text>Trở về</Text>
          </Button>
        </View>
        <Button
          ebonsai
          variant="transparent"
          style={{width: 36}}
          onClick={() => {
            let _isHide = !isHide;
            setIsHide(_isHide);
            onHideChanged(_isHide);
          }}
        >
          <Icon icon={'mingcute:layout-left-fill'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
      </Card>
      <Card flex={1} animation="slideRightIn">
        <View scrollable>
          {query.data.comic.chapters.map((item: any) => (
            <Card
              variant={item.id.toString() === chapter_id ? 'tertiary' : undefined}
              horizontal
              style={{height: 40, alignItems: 'center'}}
              onClick={() => navigate(`/comics/${comic_id}/chapters/${item.id}`)}
            >
              <Text variant="title" style={{flex: 1}}>{item.name}</Text>
              {!item.free && <Icon icon="mingcute:vip-1-line" style={{height: 20, width: 20, color: theme.colors.themeColor}}/>}
            </Card>
          ))}
        </View>
      </Card>
    </View>
  );
}

function ReadingArea() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { comic_id, chapter_id } = useParams();

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
    <>
      {query.data.chapter.image_urls.length !== 0 ?
        query.data.chapter.image_urls.map((item: string) => (
          <Card style={{padding: 0, backgroundColor: 'transparent'}} animation="slideTopIn">
            <img src={item} />
          </Card>
        ))
      :
        <View flex={1} centerContent>
          <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>
            Đang được cập nhật
          </Text>
        </View>
      }
    </>
  )
}

function NavigateEbonsai({hide, onHideChanged}: {hide?: boolean, onHideChanged: (isHide: boolean) => void}) {
  const [isHide, setIsHide] = useState(hide);

  const theme = useTheme();

  useEffect(() => {
    setIsHide(hide);
  }, [hide]);

  return (
    <View horizontal centerContent gap={8} style={{display: isHide ? 'none' : 'flex', paddingTop: 8, position: 'sticky', bottom: 8, left: 0, right: 0}}>
      <Card ebonsai animation="slideTopIn">
        <Button ebonsai variant="secondary" style={{width: 120}}>
          <Icon icon={'mingcute:arrow-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
        <Button
          ebonsai
          variant="secondary"
          style={{width: 120}}
          onClick={() => {
            let _isHide = !isHide;
            setIsHide(_isHide);
            onHideChanged(_isHide);
          }}
        >
          <Icon icon={'mingcute:layout-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
        <Button ebonsai variant="secondary" style={{width: 120}}>
          <Icon icon={'mingcute:arrow-right-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
      </Card>
    </View>
  )
}

function ReadingPage() {
  const [isHideControlPanel, setIsHideControlPanel] = useState(false);

  return (
    <View flex={1} horizontal>
      <ControlPanel hide={isHideControlPanel} onHideChanged={(isHide) => setIsHideControlPanel(isHide)}/>
      <Page.Container>
        <Page.Content style={{gap: 0}}>
          <ReadingArea />
          <NavigateEbonsai hide={!isHideControlPanel} onHideChanged={() => setIsHideControlPanel(!isHideControlPanel)} />
        </Page.Content>
      </Page.Container>
    </View>
  );
}

export default ReadingPage;
