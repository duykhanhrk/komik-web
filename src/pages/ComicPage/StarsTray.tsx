import {Card, Text} from "@components";
import {Link, matchPath, useLocation} from "react-router-dom";
import {useTheme} from "styled-components";

function StarsTray() {
  const { pathname } = useLocation();

  const isSearching = matchPath("/comics/searching/*", pathname);
  const isCategories = matchPath("/comics/categories/*", pathname);
  const isReleaseDates = matchPath("/comics/release_dates/*", pathname);
  const isFilters = matchPath("/comics/filter/*", pathname);
  const isStars = matchPath("/comics/stars/*", pathname) || (!isSearching && !isCategories && !isReleaseDates && !isFilters);

  const theme = useTheme();

  return (
    <>
      <Link to={`/comics`} style={{textDecoration: 'none'}}>
        <Card variant={isStars ? 'tertiary' : undefined} style={{flex: 1}}>
          <Text variant="inhirit" style={{color: isStars ? theme.colors.blue : theme.colors.foreground}}>Tất cả</Text>
        </Card>
      </Link>
    </>
  )
}

export default StarsTray;
