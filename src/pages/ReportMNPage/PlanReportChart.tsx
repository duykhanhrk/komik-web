import {Card, View, Text, Button, Dropdown} from '@components';
import {PlanMNService} from '@services';
import {useEffect, useState} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useTheme} from 'styled-components';
import LoadingPage from '../LoadingPage';

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    label: `Tháng ${index + 1}`,
    value: index + 1,
}));

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const startYear = 2020;

const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, index) => ({
    label: `Năm ${startYear + index}`,
    value: startYear + index,
}));

const statObjectOptions: Array<{label: string, value: 'subscriptions' | 'revenue'}> = [
    { label: 'Số lượt đăng ký', value: 'subscriptions' },
    { label: 'Doanh thu', value: 'revenue' }
];

function generateColor(num: number) {
    const red = num % 256;
    const green = (num * 124) % 256;
    const blue = (num * 224) % 256;

    const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  
    console.log(color);

    return color;
}

function PlanReportChart() {
    const theme = useTheme();
    const [chart, setChart] = useState<{
    mode: 'day' | 'month' | 'year',
    params: {
      year?: number,
      month?: number,
      statObject?: 'subscriptions' | 'revenue'
    },
    data: { objects: any[], stats: any[] },
    status: 'idle' | 'loading' | 'error'
  }>({
      mode: 'day',
      params: {
          year: currentYear,
          month: currentMonth,
          statObject: 'subscriptions'
      },
      data: { objects: [], stats: [] },
      status: 'idle'
  });

    const fetchStats = async () => {
        setChart({...chart, status: 'loading'});
        try {
            let res: any;

            if (chart.mode === 'day') {
                res = await PlanMNService.getStatisticsBySubscriptionsAsync(chart.params.statObject, chart.params.year, chart.params.month);
            } else if (chart.mode === 'month') {
                res = await PlanMNService.getStatisticsBySubscriptionsAsync(chart.params.statObject, chart.params.year);
            } else {
                res = await PlanMNService.getStatisticsBySubscriptionsAsync(chart.params.statObject);
            }
            console.log(res);
            setChart({...chart, data: res, status: 'idle'});
        } catch (e) {
            setChart({...chart, status: 'error'});
        }
    };

    useEffect(() => {
        fetchStats();
    }, [chart.mode, chart.params]);

    return (
        <Card animation="slideTopIn">
            <Text variant="medium-title">Thống kê</Text>
            <View horizontal gap={8}>
                <Dropdown.SelectionList<{label: string, value: 'subscriptions' | 'revenue'}>
                    _data={statObjectOptions}
                    style={{width: 180, zIndex: 24}}
                    buttonContent={(item) => item ? <Text>{item.label}</Text> : 'Chọn đối tượng'}
                    buttonStyle={{height: 36, backgroundColor: theme.colors.tertiaryBackground}}
                    renderItem={(item: {label: string, value: string}) => (<Card><Text>{item.label}</Text></Card>)}
                    selectedItem={statObjectOptions.find(item => item.value === chart.params.statObject)}
                    onItemSelected={(item) => setChart({...chart, params: {...chart.params, statObject: item!.value}})}
                />
                {chart.mode === 'day' &&
        <Dropdown.SelectionList<{label: string, value: number}>
            _data={monthOptions}
            style={{width: 160, zIndex: 24}}
            buttonContent={(item) => item ? <Text>{item.label}</Text> : 'Chọn tháng'}
            buttonStyle={{height: 36, backgroundColor: theme.colors.tertiaryBackground}}
            renderItem={(item: {label: string, value: number}) => (<Card><Text>{item.label}</Text></Card>)}
            selectedItem={monthOptions.find(item => item.value === chart.params.month)}
            onItemSelected={(item) => setChart({...chart, params: {...chart.params, month: item!.value}})}
        />
                }
                {chart.mode !== 'year' &&
        <Dropdown.SelectionList<{label: string, value: number}>
            _data={yearOptions}
            style={{width: 160, zIndex: 24}}
            buttonContent={(item) => item ? <Text>{item.label}</Text> : 'Chọn năm'}
            buttonStyle={{height: 36, backgroundColor: theme.colors.tertiaryBackground}}
            renderItem={(item: {label: string, value: number}) => (<Card><Text>{item.label}</Text></Card>)}
            selectedItem={yearOptions.find(item => item.value === chart.params.year)}
            onItemSelected={(item) => setChart({...chart, params: {...chart.params, year: item!.value}})}
        />
                }
                <View flex={1}></View>
                <Button
                    selected={chart.mode === 'day'}
                    variant="secondary"
                    style={{width: 120}}
                    onClick={() => setChart({...chart, mode: 'day' })}
                    shadowEffect
                >Theo ngày</Button>
                <Button
                    selected={chart.mode === 'month'}
                    variant="secondary"
                    style={{width: 120}}
                    onClick={() => setChart({...chart, mode: 'month' })}
                    shadowEffect
                >Theo tháng</Button>
                <Button
                    selected={chart.mode === 'year'}
                    variant="secondary"
                    style={{width: 120}}
                    onClick={() => setChart({...chart, mode: 'year' })}
                    shadowEffect
                >Theo năm</Button>
            </View>
            {chart.status === 'loading' ?
                <View style={{height: 480}}>
                    <LoadingPage/>
                </View>
                :
                <ResponsiveContainer width="100%" height={480}>
                    <BarChart
                        width={500}
                        height={300}
                        data={chart.data.stats}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.data.objects.map((item, index) => (
                            <Bar name={item.name} dataKey={`id_${item.id}`} fill={generateColor(index)} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            }
        </Card>
    );
}

export default PlanReportChart;
