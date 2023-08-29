import {Card, View, Text} from '@components';
import {CategoryMNService} from '@services';
import {useEffect, useState} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingPage from '../LoadingPage';

Array.from({ length: 12 }, (_, index) => ({
  label: `Tháng ${index + 1}`,
  value: index + 1,
}));

function generateColor(num: number) {
  const red = num % 256;
  const green = (num * 124) % 256;
  const blue = (num * 224) % 256;

  const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  
  console.log(color);

  return color;
}

function CategoryReportChart() {
  const [chart, setChart] = useState<{
    data: { objects: any[], stats: any[] },
    status: 'idle' | 'loading' | 'error'
  }>({
    data: { objects: [], stats: [] },
    status: 'idle'
  });

  const fetchStats = async () => {
    setChart({...chart, status: 'loading'});
    try {
      const res = await CategoryMNService.getStatisticsAsync();

      setChart({...chart, data: res, status: 'idle'});
    } catch (e) {
      setChart({...chart, status: 'error'});
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Card animation="slideTopIn">
      <Text variant="medium-title">Thống kê</Text>
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
              <Bar key={item.id} name={item.name} dataKey={`id_${item.id}`} fill={generateColor(index)} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      }
    </Card>
  );
}

export default CategoryReportChart;
