import {useAppDispatch, useAppSelector, useCategoriesQuery} from '@hooks';
import {Icon} from '@iconify/react';
import {addKeyword, removeKeyword} from '@redux/keywordsSlice';
import {Category, SearchingService, Suggestion} from '@services';
import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTheme} from 'styled-components';
import Card from '../Card';
import Dropdown from '../Dropdown';
import Input from '../Input';
import Tag from '../Tag';
import Text from '../Text';
import View from '../View';

type Filter = {
  categoryIds: Array<number>;
}

function Comic() {
    const [searchDropdownOpen, setSearchDropdownOpen] = useState('');
    const [suggestions, setSuggestions] = useState<Array<Suggestion>>([]);
    const [suggestion, setSuggestion] = useState<Suggestion<Filter>>({keyword: '', type: 'Keyword'});

    const { keywords } = useAppSelector((state) => state.keywords);
    const dispatch = useAppDispatch();

    const searchDropDownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const theme = useTheme();
    const categoriesQuery = useCategoriesQuery();

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
        dispatch(addKeyword({...suggestion, keyword: suggestion.keyword.trim()}));

        // Navigate to search page
        if (suggestion.data && suggestion.data.categoryIds.length > 0) {
            navigate(`/comics/searching?category_ids=${suggestion.data.categoryIds.join(',')}&query=${suggestion.keyword.trim()}`);
        } else {
            navigate(`/comics/searching?query=${suggestion.keyword.trim()}`);
        }

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
                onKeyPress={(event) => suggestion.keyword.trim() !== '' && event.key === 'Enter' && submitSearch()}
                onChange={(e) => {
                    setSuggestion({...suggestion, keyword: e.target.value});

                    if (e.target.value.trim() !== '') {
                        fetchSuggestions(e.target.value.trim());
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
                    display: searchDropdownOpen === 'search' && (suggestion.keyword.trim() !== '' || keywords.length !== 0) ? 'flex' : 'none',
                }}>
                <View gap={8} animation="slideTopIn" style={{overflow: 'hidden'}}>
                    <View horizontal style={{alignItems: 'center', display: suggestion.keyword.trim() !== '' ? 'flex' : 'none'}}>
                        <View horizontal gap={4} flex={1} style={{alignItems: 'center'}}>
                            <Tag
                                onClick={submitSearch}
                                style={{gap: 8, color: theme.colors.blue}}
                            >
                                <Icon icon={'mingcute:search-line'} style={{height: 20, width: 20, color: theme.colors.blue}} />
                                {suggestion.keyword}
                            </Tag>
                        </View>
                    </View>
                    <View
                        gap={4}
                        scrollable
                        variant="secondary"
                        style={{borderRadius: 8, padding: 2, display: (suggestions.length !== 0 && suggestion.keyword.trim() !== '') || (keywords.length !== 0 && suggestion.keyword.trim() === '') ? 'flex' : 'none'}}
                    >
                        {suggestions.length !== 0 && suggestions.map((item: Suggestion) => (
                            <Card
                                variant="secondary"
                                onClick={() => {
                                    setSearchDropdownOpen('');
                                    navigate(`/comics/searching?query=${item.keyword}`);
                                }}
                                shadowEffect
                            >
                                <Text>{item.keyword}</Text>
                            </Card>
                        ))}
                        {keywords.map((item, index) => (
                            <Card
                                variant="secondary"
                                horizontal
                                style={{paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8, alignItems: 'center', display: suggestion.keyword.trim() === '' ? 'flex' : 'none'}}
                                key={index.toString()}
                                shadowEffect
                            >
                                <View
                                    flex={1}
                                    horizontal
                                    gap={8}
                                    style={{alignItems: 'center'}}
                                    onClick={() => {
                                        setSearchDropdownOpen('');
                                        if (item.data && item.data.categoryIds) {
                                            navigate(`/comics/searching?category_ids=${item.data.categoryIds.join(',')}&query=${item.keyword}`);
                                        } else {
                                            navigate(`/comics/searching?query=${item.keyword}`);
                                        }
                                    }}
                                >
                                    <Text style={{flex: 1}}>{item.keyword}</Text>
                                    <Tag variant={{ct: 'quaternary'}} style={{gap: 8, display: item.data ? 'flex' : 'none', color: theme.colors.orange}}>
                                        <Icon icon={'mingcute:filter-line'} style={{height: 16, width: 16, color: theme.colors.orange}} />
                                        {item.data ? item.data.categoryIds.length : null}
                                    </Tag>
                                </View>
                                <Tag
                                    variant={{ct: 'secondary'}}
                                    style={{gap: 8}}
                                    onClick={() => {
                                        setSuggestion(item);
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <Icon icon={'mingcute:edit-2-line'} style={{height: 16, width: 16, color: theme.colors.blue}} />
                                </Tag>
                                <Tag variant={{ct: 'secondary'}} style={{gap: 8}} onClick={() => {dispatch(removeKeyword(item));}}>
                                    <Icon icon={'mingcute:delete-2-line'} style={{height: 16, width: 16, color: theme.colors.red}} />
                                </Tag>
                            </Card>
                        ))}
                    </View>
                </View>
            </Dropdown.Content>
        </Dropdown.Container>
    );
}

export default Comic;
