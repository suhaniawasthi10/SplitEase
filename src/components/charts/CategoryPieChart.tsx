import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currency';

interface CategoryData {
    category: string;
    amount: number;
}

interface CategoryPieChartProps {
    data: CategoryData[];
    currency?: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, currency = 'USD' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No category data available
            </div>
        );
    }

    const chartData = data.map(item => ({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        value: item.amount
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CategoryPieChart;
