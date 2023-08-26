import {Button, Card, View} from '@components';
import {Icon} from '@iconify/react';
import {useEffect, useState} from 'react';
import {matchPath, useLocation} from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import {default as Animations} from '../../components/Animations';

import CategoriesTray from './CategoriesTray';
import ReleaseDatesTray from './ReleaseDatesTray';
import StarsTray from './StarsTray';
import SearchingTray from './SearchingTray';
import FilterTray from './FilterTray';

const NavigationPanelContianer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 256px:
  flex-shrink: 0;
  position: sticky;
  top: 60px;
  bottom: 0;
  height: calc(100vh - 68px);
  overflow: auto;
  width: 256px;
  gap: 8px;
  animation: ${Animations.slideRightIn} 0.5s ease;
`;

function NavigationPanel() {
    const [doki, setDoki] = useState<
    'stars' | 'searching' | 'categories' | 'release_dates' | 'filter'
  >('stars');

    const { pathname } = useLocation();

    const isSearching = matchPath('/comics/searching/*', pathname);
    const isCategories = matchPath('/comics/categories/*', pathname);
    const isReleaseDates = matchPath('/comics/release_dates/*', pathname);
    const isFilter = matchPath('/comics/filter/*', pathname);
    const isStars = matchPath('/comics/stars/*', pathname) || (!isSearching && !isCategories && !isReleaseDates && !isFilter);

    const theme = useTheme();

    useEffect(() => {
        if (isStars) {
            setDoki('stars');
        } else if (isSearching) {
            setDoki('searching');
        } else if (isCategories) {
            setDoki('categories');
        } else if (isReleaseDates) {
            setDoki('release_dates');
        } else if ('isFilter') {
            setDoki('filter');
        }
    }, [pathname]);

    return (
        <NavigationPanelContianer>
            <Card ebonsaiSnippet>
                <Button ebonsai square onClick={() => setDoki('stars')}>
                    <Icon icon={doki === 'stars' ? 'mingcute:star-fill' : 'mingcute:star-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
                </Button>
                <Button ebonsai square onClick={() => setDoki('categories')}>
                    <Icon icon={doki === 'categories' ? 'mingcute:classify-2-fill' : 'mingcute:classify-2-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
                </Button>
                <Button ebonsai square onClick={() => setDoki('release_dates')}>
                    <Icon icon={doki === 'release_dates' ? 'mingcute:calendar-fill' : 'mingcute:calendar-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
                </Button>
                <Button ebonsai square onClick={() => setDoki('searching')}>
                    <Icon icon={doki === 'searching' ? 'mingcute:history-fill' : 'mingcute:history-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
                </Button>
                <View flex={1} />
                <Button ebonsai square onClick={() => setDoki('filter')}>
                    <Icon icon={doki === 'filter' ? 'mingcute:filter-2-fill' : 'mingcute:filter-2-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
                </Button>
            </Card>
            <Card style={{flex: 1}}>
                {doki === 'searching' ? <SearchingTray />
                    : doki === 'categories' ? <CategoriesTray />
                        : doki === 'release_dates' ? <ReleaseDatesTray />
                            : doki === 'stars' ? <StarsTray />
                                : doki === 'filter' ? <FilterTray />
                                    : null
                }
            </Card>
        </NavigationPanelContianer>
    );
}

export default NavigationPanel;
