import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/currency';

interface MemberData {
    name: string;
    amount: number;
    percentage: number;
}

interface MemberBarChartProps {
    data: MemberData[];
    currency?: string;
}

const MemberBarChart: React.FC<MemberBarChartProps> = ({ data, currency = 'USD' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No member data available
            </div>
        );
    }

    const chartData = data.map(item => ({
        name: item.name.split(' ')[0], // First name only for cleaner display
        amount: item.amount,
        percentage: item.percentage
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                    formatter={(value: number) => formatCurrency(value, currency)}
                    labelFormatter={(label) => `Member: ${label}`}
                />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" name="Amount Spent" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MemberBarChart;
