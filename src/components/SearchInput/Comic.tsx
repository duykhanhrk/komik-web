import {SearchingService, Suggestion} from "@services";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import Card from "../Card";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Tag from "../Tag";
import Text from "../Text";
import View from "../View";

function Comic() {
  const [searchDropdownOpen, setSearchDropdownOpen] = useState('');
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Array<Suggestion>>([])

  const searchDropDownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

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

  return (
    <Dropdown.Container ref={searchDropDownRef} style={{flex: 1}}>
      <Input
        style={{width: '100%'}}
        onFocus={() => setSearchDropdownOpen('search')}
        onChange={(e) => {
          setSearchText(e.target.value);
          if (e.target.value !== '') {
            fetchSuggestions(e.target.value);
          }
        }}
        value={searchText}
      />
      {searchDropdownOpen === 'search' &&
        <Dropdown.Content style={{left: 0, right: 0, width: 'auto', minHeight: 'auto'}}>
          <View gap={8}>
            {searchText !== '' ? suggestions.map((item: Suggestion) => (
                <Card
                  onClick={() => {
                    setSearchDropdownOpen('');
                    navigate(`/comics?query=${item.keyword}`);
                  }}
                >
                  <Text>{item.keyword}</Text>
                </Card>
              ))
            :
              <>
                <Text variant="title">Tìm kiếm gần đây</Text>
                <View horizontal gap={4} wrap>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                  <Tag>Hello</Tag>
                </View>
              </>
            }
          </View>
        </Dropdown.Content>
      }
    </Dropdown.Container>
  )
}

export default Comic;
