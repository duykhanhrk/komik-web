import {useCategoriesQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {Category, SearchingService, Suggestion} from "@services";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "styled-components";
import Card from "../Card";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Tag from "../Tag";
import Text from "../Text";
import View from "../View";

type Filter = {
  categoryIds: Array<number>;
}

function Comic() {
  const [searchDropdownOpen, setSearchDropdownOpen] = useState('');
  const [suggestions, setSuggestions] = useState<Array<Suggestion>>([]);
  const [recentlyKeywords, setRecentlyKeywords] = useState<Array<Suggestion>>([]);
  const [suggestion, setSuggestion] = useState<Suggestion<Filter>>({keyword: '', type: 'Keyword'});

  const searchDropDownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const categoriesQuery = useCategoriesQuery();

  useEffect(() => {
    const keywords = JSON.parse(localStorage.getItem('RecentlyKeywords') || '[]');
    setRecentlyKeywords(keywords);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchDropDownRef.current && !searchDropDownRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen('');
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [searchDropDownRef]);

  function fetchSuggestions(q: string) {
    SearchingService.getSuggestKeywordsAsync(q)
      .then((data) => {
        setSuggestions(data.keywords);
      });
  }

  function resetSearchInput() {
    setSuggestions([]);
    setSuggestion({keyword: '', type: 'Keyword', data: undefined});
    setSearchDropdownOpen('');
    inputRef.current?.blur();
  }

  function submitSearch() {
    // Add to recently keywords
    if (!recentlyKeywords.find((item) => JSON.stringify(item) === JSON.stringify(suggestion))) {
      setRecentlyKeywords([suggestion, ...recentlyKeywords]);
      localStorage.setItem('RecentlyKeywords', JSON.stringify([suggestion, ...recentlyKeywords]));
    }

    // Navigate to search page
    navigate(`/comics?category_id=${suggestion.data ? suggestion.data.categoryIds.join(',') : ''}&query=${suggestion.keyword}`);

    // Reset search input
    resetSearchInput();
  }

  return (
    <Dropdown.Container ref={searchDropDownRef} style={{flex: 1}}>
      <Input
        style={{width: '100%'}}
        ref={inputRef}
        shadowEffect
        placeholder={'Tìm kiếm truyện tranh'}
        value={suggestion.keyword.toLowerCase()}
        onFocus={() => setSearchDropdownOpen('search')}
        onKeyPress={(event) => suggestion.keyword !== '' && event.key === 'Enter' && submitSearch()}
        onChange={(e) => {
          setSuggestion({...suggestion, keyword: e.target.value});

          if (e.target.value !== '') {
            fetchSuggestions(e.target.value);
            if (searchDropdownOpen !== 'search') {
              setSearchDropdownOpen('search');
            }
          } else {
            setSuggestions([]);
          }
        }}
      />
        <Dropdown.Content
          style={{
            left: 0,
            right: 0,
            width: 'auto',
            minHeight: 'auto',
            gap: 8,
            display: searchDropdownOpen === 'search' && (suggestion.keyword !== '' || recentlyKeywords.length !== 0) ? 'flex' : 'none'
        }}>
          <View horizontal style={{alignItems: 'center'}}>
            <View horizontal gap={4} flex={1} style={{alignItems: 'center'}}>
              <Tag
                onClick={submitSearch}
                style={{gap: 8, display: suggestion.keyword !== '' ? 'flex' : 'none'}}
              >
                <Icon icon={'mingcute:search-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                {suggestion.keyword}
              </Tag>
            </View>
            <View horizontal gap={4} style={{alignItems: 'center', justifyContent: 'flex-end'}}>
              <Tag
                variant={{ct: suggestion.data ? 'quinary' : 'tertiary'}}
                style={{gap: 8}}
                onClick={() => {
                  setSuggestion({...suggestion, data: suggestion.data ? undefined : {categoryIds: []}});
                }}
              >
                <Icon icon={suggestion.data ? 'mingcute:filter-fill' : 'mingcute:filter-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                <Text>Tùy chọn lọc</Text>
              </Tag>
            </View>
          </View>
          <View
            horizontal
            gap={4}
            wrap
            style={{alignContent: 'flex-start', display: suggestion.data ? 'flex' : 'none'}}
          >
            {categoriesQuery.isSuccess && categoriesQuery.data.categories.map((item: Category, index: number) => (
              <Tag
                variant={{ct: suggestion.data && suggestion.data.categoryIds.includes(item.id) ? 'quinary' : 'tertiary'}}
                onClick={() => {
                  if (suggestion.data) {
                    if (suggestion.data.categoryIds.includes(item.id)) {
                      setSuggestion({...suggestion, data: {categoryIds: suggestion.data.categoryIds.filter((id)  => id !== item.id)}});
                    } else {
                      setSuggestion({...suggestion, data: {categoryIds: [...suggestion.data.categoryIds, item.id].sort((a, b) => a - b)}});
                    }
                  }
                }}
              >{item.name}</Tag>
            ))}
          </View>
          <View
            gap={8}
            scrollable
            style={{display: suggestions.length !== 0 || recentlyKeywords.length !== 0 ? 'flex' : 'none'}}
          >
            {suggestions.length !== 0 && suggestions.map((item: Suggestion) => (
              <Card
                variant="tertiary"
                onClick={() => {
                  setSearchDropdownOpen('');
                  navigate(`/comics?query=${item.keyword}`);
                }}
              >
                <Text>{item.keyword}</Text>
              </Card>
            ))}
            {recentlyKeywords.map((item, index) => (
              <Card
                variant="tertiary"
                horizontal
                style={{alignItems: 'center', display: suggestion.keyword === '' ? 'flex' : 'none'}}
                key={index.toString()}
              >
                <View
                  flex={1}
                  horizontal
                  gap={8}
                  style={{alignItems: 'center'}}
                  onClick={() => {
                    setSearchDropdownOpen('');
                    if (item.data && item.data.filter && item.data.filter.category_ids) {
                      navigate(`/comics?category_id=${item.data.filter.category_ids.join(',')}&query=${item.keyword}`);
                    } else {
                      navigate(`/comics?query=${item.keyword}`);
                    }
                  }}
                >
                  <Text style={{flex: 1}}>{item.keyword}</Text>
                  <Tag variant={{ct: 'quaternary'}} style={{gap: 8, display: item.data ? 'flex' : 'none'}}>
                    <Icon icon={'mingcute:filter-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                    {item.data ? item.data.categoryIds.length : null}
                  </Tag>
                  <Tag variant={{ct: 'quaternary'}} style={{gap: 8}}>
                    <Icon icon={'mingcute:history-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                  </Tag>
                </View>
                <Tag
                  style={{gap: 8}}
                  onClick={() => {
                    setSuggestion(item);
                    inputRef.current?.focus();
                  }}
                >
                  <Icon icon={'mingcute:edit-2-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                </Tag>
                <Tag
                  style={{gap: 8}}
                  onClick={() => {
                    const keywords = recentlyKeywords.filter((_keyword, _index) => index !== _index);
                    setRecentlyKeywords(keywords);
                    localStorage.setItem('RecentlyKeywords', JSON.stringify(keywords));
                  }}
                >
                  <Icon icon={'mingcute:delete-2-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                </Tag>
              </Card>
            ))}
          </View>
        </Dropdown.Content>
    </Dropdown.Container>
  )
}

export default Comic;
