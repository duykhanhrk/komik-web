import {Card, Tag, Text, View} from "@components";
import {useAppSelector, useCategoriesQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {Category} from "@services";
import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {default as Animations} from "../../components/Animations";

const NavigationPanelContianer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 256px:
  flex-shrink: 0;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.secondaryBackground};
  position: sticky;
  top: 60px;
  bottom: 0;
  height: calc(100vh - 68px);
  overflow: auto;
  width: 256px;
  transition: box-shadow 0.5s;
  padding: 8px;
  animation: ${Animations.slideRightIn} 0.5s ease;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

function NavigationPanel() {
  const [searchParams] = useSearchParams();
  const [categoryIds, setCategoryIds] = useState<Array<number> | undefined>();
  const [queryText, setQueryText ] = useState<string | undefined>();

  const { keywords } = useAppSelector((state) => state.keywords);

  const  navigate = useNavigate();

  function buildSuggestion() {
    return {
      keyword: queryText || '',
      type: 'Keyword',
      data: categoryIds ? {categoryIds} : undefined
    }
  }

  useEffect(() => {
    let paramable = searchParams.get('category_id');
    const _categoryIds = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);
    paramable = searchParams.get('query');
    const _queryText = paramable === null || paramable === '' ? undefined : paramable;

    setCategoryIds(_categoryIds);
    setQueryText(_queryText);
  }, [searchParams])

  const categoryQuery = useCategoriesQuery();

  return (
    <NavigationPanelContianer>
      {queryText && queryText !== '' ?
      <>
        {keywords.map((item, index) => (
          <Card
            variant={JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'tertiary' : 'secondary'}
            horizontal
            style={{alignItems: 'center'}}
            key={index.toString()}
          >
            <View
              flex={1}
              horizontal
              gap={8}
              style={{alignItems: 'center'}}
              onClick={() => {
                if (item.data) {
                  navigate(`/comics?category_id=${item.data.categoryIds.join(',')}&query=${item.keyword}`);
                } else {
                  navigate(`/comics?query=${item.keyword}`);
                }
              }}
            >
              <Text numberOfLines={1} style={{flex: 1}}>{item.keyword}</Text>
              <Tag variant={{ct: JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'quaternary' : 'tertiary'}} style={{gap: 8, display: item.data ? 'flex' : 'none'}}>
                <Icon icon={'mingcute:filter-line'} style={{height: 16, width: 16, color: 'inhirit'}} />
                {item.data ? item.data.categoryIds.length : null}
              </Tag>
              <Tag variant={{ct: JSON.stringify(item) === JSON.stringify(buildSuggestion()) ? 'quaternary' : 'tertiary'}} style={{gap: 8}}>
                <Icon icon={'mingcute:history-line'} style={{height: 16, width: 16, color: 'inhirit'}} />
              </Tag>
            </View>
          </Card>
        ))}
      </>
      :
      <>
        <Link to={`/comics`} style={{textDecoration: 'none'}}>
          <Card variant={categoryIds ? undefined : 'tertiary'} style={{flex: 1}}>
            <Text variant="inhirit">Tất cả</Text>
          </Card>
        </Link>
        {categoryQuery.data?.categories.map((item: Category) => (
          <Link to={`/comics?category_id=${item.id}`} style={{textDecoration: 'none', display: 'flex'}}>
            <Card variant={categoryIds?.includes(item.id!) ? 'tertiary' : undefined} style={{flex: 1}}>
              <Text variant="inhirit">{item.name}</Text>
            </Card>
          </Link>
        ))}
      </>
      }
    </NavigationPanelContianer>
  )
}

export default NavigationPanel;
