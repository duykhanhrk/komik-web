import {Button, Page, Text, View} from '@components';
import {Icon} from '@iconify/react';
import {useState} from 'react';
import {useTheme} from 'styled-components';
import CategoryReportPage from './CategoryReportSession';
import PlanReportPage from './PlanReportSession';

function ReportMNPage() {
    const theme = useTheme();
    const [selectedButton, setSelectedButton] = useState<'plan' | 'category'>('plan');

    return (
        <Page.Container>
            <Page.Content gap={0}>
                <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background, zIndex: 48}} horizontal>
                    <View horizontal flex={1} gap={8}>
                        <Button
                            shadowEffect
                            style={{width: 180}}
                            selected={selectedButton === 'plan'}
                            onClick={() => setSelectedButton('plan')}
                        >
                            <Icon icon={selectedButton === 'plan' ? 'mingcute:pig-money-fill' : 'mingcute:pig-money-line'} style={{height: 20, width: 20, color: theme.colors.green}} />
                            <Text style={{marginLeft: 8, color: selectedButton === 'plan' ? theme.colors.green : theme.colors.foreground}}>Các gói</Text>
                        </Button>
                        <Button
                            shadowEffect
                            style={{width: 180}}
                            selected={selectedButton === 'category'}
                            onClick={() => setSelectedButton('category')}
                        >
                            <Icon icon={selectedButton === 'category' ? 'mingcute:bling-fill' : 'mingcute:bling-line'} style={{height: 20, width: 20, color: theme.colors.blue}} />
                            <Text style={{marginLeft: 8, color: selectedButton === 'category' ? theme.colors.blue : theme.colors.foreground}}>Truyện tranh</Text>
                        </Button>
                    </View>
                </View>
                <View>
                    {selectedButton === 'plan' && <PlanReportPage />}
                    {selectedButton === 'category' && <CategoryReportPage />}
                </View>
            </Page.Content>
        </Page.Container>
    );
}

export default ReportMNPage;
