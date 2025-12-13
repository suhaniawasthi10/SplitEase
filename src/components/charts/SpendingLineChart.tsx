import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/currency';

interface DayData {
    date: string;
    amount: number;
}

interface SpendingLineChartProps {
    data: DayData[];
    currency?: string;
}

const SpendingLineChart: React.FC<SpendingLineChartProps> = ({ data, currency = 'USD' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No spending data for the last 30 days
            </div>
        );
    }

    const chartData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: item.amount
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                    formatter={(value: number) => formatCurrency(value, currency)}
                    labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Daily Spending"
                    dot={{ fill: '#3b82f6' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SpendingLineChart;
