import {Card, Text} from "@components";
import {useEffect, useState} from "react";
import {Link, matchPath, useLocation, useSearchParams} from "react-router-dom";
import { useTheme } from "styled-components";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (v, i) => currentYear - i);

function ReleaseDatesTray() {
  const [params, setParams] = useState<{release_dates?: string}>({});

  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const isReleaseDates = matchPath("/comics/release_dates/*", pathname);

  const theme = useTheme();

  useEffect(() => {
    let paramable = searchParams.get('release_dates');
    const release_dates = paramable === null || paramable === '' ? undefined : paramable;

    setParams({release_dates});

  }, [searchParams])

  return (
    <>
      {years.map((item: number) => (
        <Link to={`/comics/release_dates?release_dates=${item}-01-01`} style={{textDecoration: 'none', display: 'flex'}}>
          <Card variant={isReleaseDates && new Date(params.release_dates || '').getFullYear() === item ? 'tertiary' : undefined} style={{flex: 1}}>
            <Text variant="inhirit" style={{color: isReleaseDates && new Date(params.release_dates || '').getFullYear() === item ? theme.colors.blue : theme.colors.foreground}}>{item}</Text>
          </Card>
        </Link>
      ))}
    </>
  )
}

export default ReleaseDatesTray;
