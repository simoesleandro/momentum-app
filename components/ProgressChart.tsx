import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type ChartType = 'line' | 'bar';
type Timeframe = '7d' | '30d' | '90d' | 'all';

interface ChartData {
  date: string;
  [key: string]: any;
}

interface ProgressChartProps {
  data: ChartData[];
  dataKey: string;
  title: string;
  type: ChartType;
  timeframe: Timeframe;
  onTypeChange: (type: ChartType) => void;
  onTimeframeChange: (timeframe: Timeframe) => void;
  color: string;
  unit?: string;
}

const TimeframeButton: React.FC<{
  value: Timeframe;
  label: string;
  current: Timeframe;
  onClick: (value: Timeframe) => void;
}> = ({ value, label, current, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
      current === value ? 'bg-brand-primary text-white' : 'bg-brand-background dark:bg-brand-surface-dark hover:bg-brand-primary/10'
    }`}
  >
    {label}
  </button>
);

const ChartTypeButton: React.FC<{
  value: ChartType;
  icon: string;
  current: ChartType;
  onClick: (value: ChartType) => void;
}> = ({ value, icon, current, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1 rounded-md transition-colors ${
      current === value ? 'bg-brand-primary text-white' : 'bg-brand-background dark:bg-brand-surface-dark hover:bg-brand-primary/10'
    }`}
  >
    <i className={icon}></i>
  </button>
);


const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  dataKey,
  title,
  type,
  timeframe,
  onTypeChange,
  onTimeframeChange,
  color,
  unit = '',
}) => {
    
  const filteredData = useMemo(() => {
    if (timeframe === 'all' || !data) {
      return data;
    }
    const now = new Date();
    let daysToSubtract = 7;
    if (timeframe === '30d') daysToSubtract = 30;
    if (timeframe === '90d') daysToSubtract = 90;
    
    const startDate = new Date();
    startDate.setDate(now.getDate() - daysToSubtract);
    startDate.setHours(0,0,0,0);

    return data.filter(item => {
        // Parse date in pt-BR format (dd/mm) and assume current year
        const parts = item.date.split('/');
        if (parts.length === 2) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // month is 0-indexed
            // Handle year wrap-around for dates like '31/12' when today is '02/01'
            const itemYear = (now.getMonth() < month) ? now.getFullYear() - 1 : now.getFullYear();
            const itemDate = new Date(itemYear, month, day);
            return itemDate >= startDate;
        }
        // Fallback for full date strings
        try {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        } catch(e) {
            return false;
        }
    });
  }, [data, timeframe]);

  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const ChartElement = type === 'line' ? Line : Bar;

  return (
    <div className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-md border border-gray-200/80 dark:border-gray-700 p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-bold text-brand-text dark:text-brand-text-dark">{title}</h3>
        <div className="flex items-center gap-2">
           <div className="flex space-x-1 border border-gray-200 dark:border-gray-600 rounded-md p-0.5">
                <TimeframeButton value="7d" label="7D" current={timeframe} onClick={onTimeframeChange} />
                <TimeframeButton value="30d" label="30D" current={timeframe} onClick={onTimeframeChange} />
                <TimeframeButton value="90d" label="90D" current={timeframe} onClick={onTimeframeChange} />
                <TimeframeButton value="all" label="Tudo" current={timeframe} onClick={onTimeframeChange} />
            </div>
           <div className="flex space-x-1 border border-gray-200 dark:border-gray-600 rounded-md p-0.5">
                <ChartTypeButton value="line" icon="fas fa-chart-line" current={type} onClick={onTypeChange} />
                <ChartTypeButton value="bar" icon="fas fa-chart-bar" current={type} onClick={onTypeChange} />
            </div>
        </div>
      </div>
      <div className="flex-grow" style={{ minHeight: '300px' }}>
         <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={filteredData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="date" className="text-xs" stroke="currentColor" />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              className="text-xs"
              stroke="currentColor"
              unit={unit}
              width={40}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--brand-surface)', border: '1px solid #e5e7eb' }}
              wrapperClassName="rounded-md shadow-lg dark:!bg-brand-surface-dark dark:!border-gray-700"
              formatter={(value: number, name: string) => [`${typeof value === 'number' ? value.toFixed(1) : value} ${unit}`, name]}
            />
            <Legend wrapperStyle={{fontSize: '0.8rem'}} />
            <ChartElement
              type="monotone"
              dataKey={dataKey}
              name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
              stroke={color}
              fill={color} // Used for Bar chart
              strokeWidth={type === 'line' ? 3 : 0}
              dot={type === 'line' ? { r: 4, className: 'dark:stroke-brand-surface-dark' } : false}
              activeDot={type === 'line' ? { r: 8 } : undefined}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;