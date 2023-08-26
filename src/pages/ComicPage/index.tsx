import {View} from '@components';

import NavigationPanel from './NavigationPanel';
import ComicsList from './ComicsList';
import OptionBar from './OptionBar';

function ComicPage() {
    return (
        <View horizontal gap={16} style={{paddingRight: 8, paddingLeft: 8}}>
            <NavigationPanel />
            <View flex={1} style={{flexShrink: 1, paddingBottom: 8}}>
                <OptionBar/>
                <ComicsList/>
            </View>
        </View>
    );
}

export default ComicPage;
