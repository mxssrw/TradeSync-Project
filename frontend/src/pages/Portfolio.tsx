import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

interface BuyOrder {
    id: string;
    shares: number;
    price: number;
    date: string;
}

const Portfolio = () => {
    const [positions, setPositions] = useState<Record<string, BuyOrder[]>>({});
    const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
    const [newOrder, setNewOrder] = useState({
        symbol: '',
        shares: '',
        price: '',
        currentPrice: '',
    });

    const portfolioData = useMemo(() => {
        return Object.entries(positions).map(([symbol, orders]) => {
            const totalShares = orders.reduce((sum, order) => sum + order.shares, 0);
            const totalCost = orders.reduce((sum, order) => sum + (order.shares * order.price), 0);
            const averageCost = totalCost / totalShares;
            const currentPrice = currentPrices[symbol] || averageCost; // Use symbol-specific price or fallback to avg cost
            const totalValue = totalShares * currentPrice;
            const pnl = totalValue - totalCost;
            const pnlPercent = (pnl / totalCost) * 100;
            return {
                symbol,
                totalShares,
                averageCost,
                totalValue,
                currentPrice,
                pnl,
                pnlPercent,
            };
        });
    }, [positions, currentPrices]);

    const totalPortfolioValue = portfolioData.reduce((sum, pos) => sum + pos.totalValue, 0);

    const pieChartData = portfolioData.map((position, index) => ({
        name: position.symbol,
        value: position.totalValue,
        percentage: ((position.totalValue / totalPortfolioValue) * 100).toFixed(1),
        fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
    }));

    const addBuyOrder = () => {
        if (!newOrder.symbol || !newOrder.shares || !newOrder.price) return;

        const order: BuyOrder = {
            id: Date.now().toString(),
            shares: parseFloat(newOrder.shares),
            price: parseFloat(newOrder.price),
            date: new Date().toISOString().split('T')[0],
        };

        const symbolUpper = newOrder.symbol.toUpperCase();
        
        setPositions(prev => ({
            ...prev,
            [symbolUpper]: [
                ...(prev[symbolUpper] || []),
                order
            ]
        }));

        // Update current price if provided
        if (newOrder.currentPrice) {
            setCurrentPrices(prev => ({
                ...prev,
                [symbolUpper]: parseFloat(newOrder.currentPrice)
            }));
        }

        setNewOrder({ symbol: '', shares: '', price: '', currentPrice: '' });
    };

    const removeBuyOrder = (symbol: string, orderId: string) => {
        setPositions(prev => ({
            ...prev,
            [symbol]: prev[symbol].filter(order => order.id !== orderId)
        }));
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                        Value: ${data.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Share: {data.percentage}%
                    </p>
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        const fetchBTCPrice = async () => {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
                );
                const data = await response.json();
                setCurrentPrices(prev => ({
                    ...prev,
                    'BTC': data.bitcoin.usd
                }));
            } catch (error) {
                console.error('Error fetching BTC price:', error);
            }
        };

        fetchBTCPrice();

        // Update every 10 seconds
        const interval = setInterval(fetchBTCPrice, 10000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Portfolio</h1>
                <p className="text-muted-foreground">
                    Track your positions and calculate average costs
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Portfolio Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Portfolio Allocation</CardTitle>
                        <CardDescription>
                            Total Value: ${totalPortfolioValue.toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pieChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, percentage }) => `${name} ${percentage}%`}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No positions to display
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add Buy Order */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add Buy Order</CardTitle>
                        <CardDescription>
                            Add trades to calculate average cost
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="symbol">Symbol</Label>
                                <Input
                                    id="symbol"
                                    placeholder="BTC"
                                    value={newOrder.symbol}
                                    onChange={(e) => {
                                        const symbol = e.target.value.toUpperCase();
                                        setNewOrder(prev => ({ 
                                            ...prev, 
                                            symbol: e.target.value,
                                            currentPrice: symbol === 'BTC' && currentPrices['BTC'] 
                                                ? currentPrices['BTC'].toString() 
                                                : prev.currentPrice
                                        }));
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="shares">Shares/Amount</Label>
                                <Input
                                    id="shares"
                                    type="number"
                                    placeholder="100"
                                    value={newOrder.shares}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, shares: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Buy Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="50.00"
                                    value={newOrder.price}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, price: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="currentPrice">Current Price (Optional)</Label>
                                <Input
                                    id="currentPrice"
                                    type="number"
                                    placeholder="55.00"
                                    value={newOrder.currentPrice}
                                    onChange={(e) => setNewOrder(prev => ({ ...prev, currentPrice: e.target.value }))}
                                />
                                {newOrder.symbol.toUpperCase() === 'BTC' && currentPrices['BTC'] && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Live BTC Price: ${currentPrices['BTC'].toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button onClick={addBuyOrder} className="w-full bg-black text-white hover:bg-white hover:text-black transition-colors duration-500">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Buy Order
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Positions Summary */}
            {portfolioData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Positions Summary</CardTitle>
                        <CardDescription>
                            Average cost and P&L for each position
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {portfolioData.map((position) => (
                                <div key={position.symbol} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{position.symbol}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {position.totalShares} shares
                                            </p>
                                        </div>
                                        <Badge variant={position.pnl >= 0 ? "default" : "destructive"}>
                                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(1)}%)
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Average Cost</p>
                                            <p className="font-medium">${position.averageCost.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Current Price</p>
                                            <p className="font-medium">
                                                ${position.currentPrice.toFixed(2)}
                                                {!currentPrices[position.symbol] && (
                                                    <span className="text-xs text-muted-foreground ml-1">(avg cost)</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Total Value</p>
                                            <p className="font-medium">${position.totalValue.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Portfolio %</p>
                                            <p className="font-medium">
                                                {((position.totalValue / totalPortfolioValue) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Buy Orders History */}
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Buy Orders:</h4>
                                        <div className="space-y-2">
                                            {positions[position.symbol]?.map((order) => (
                                                <div key={order.id} className="flex justify-between items-center bg-muted rounded p-2 text-sm">
                                                    <span>{order.shares} shares @ ${order.price}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">{order.date}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeBuyOrder(position.symbol, order.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Portfolio;