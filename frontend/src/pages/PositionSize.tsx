import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  TrendingUp,
  Shield,
} from 'lucide-react';

const PositionSize = () => {
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [stopLossPercentage, setStopLossPercentage] = useState<number>(1);
  const [leverage, setLeverage] = useState<number>(1);
  const [result, setResult] = useState<{
    positionSize: number;
    riskAmount: number;
    riskPerShare: number;
    shares: number;
    remainingTrades: number;
  } | null>(null);

  const calculatePosition = () => {
    if (
      accountBalance <= 0 ||
      riskPercentage <= 0 ||
      stopLossPercentage <= 0 ||
      leverage <= 0
    ) {
      return;
    }

    const riskAmount = (accountBalance * riskPercentage) / 100;
    const positionSize =
      (riskAmount / (stopLossPercentage / 100)) * leverage;
    const remainingTrades = Math.floor(100 / riskPercentage);

    setResult({
      positionSize,
      riskAmount,
      riskPerShare: stopLossPercentage,
      shares: 0, // optional: requires entry price to compute
      remainingTrades,
    });
  };

  const reset = () => {
    setAccountBalance(10000);
    setRiskPercentage(2);
    setStopLossPercentage(1);
    setLeverage(1);
    setResult(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Position Size Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate optimal position sizes based on your risk management
          strategy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trade Parameters
            </CardTitle>
            <CardDescription>
              Enter your trade details to calculate position size
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-balance">Account Balance ($)</Label>
              <Input
                id="account-balance"
                type="number"
                value={accountBalance}
                onChange={(e) =>
                  setAccountBalance(Number(e.target.value))
                }
                placeholder="10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-percentage">Risk Of Ruin (%)</Label>
              <Input
                id="risk-percentage"
                type="number"
                step="0.1"
                value={riskPercentage}
                onChange={(e) =>
                  setRiskPercentage(Number(e.target.value))
                }
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-loss-percentage">Stop Loss (%)</Label>
              <Input
                id="stop-loss-percentage"
                type="number"
                step="0.1"
                value={stopLossPercentage}
                onChange={(e) =>
                  setStopLossPercentage(Number(e.target.value))
                }
                placeholder="1.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">Leverage (×)</Label>
              <Input
                id="leverage"
                type="number"
                step="0.1"
                value={leverage}
                onChange={(e) =>
                  setLeverage(Number(e.target.value))
                }
                placeholder="5"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={calculatePosition} className="flex-1 bg-black text-white hover:bg-white hover:text-black transition-colors duration-500">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Position Size Results
            </CardTitle>
            <CardDescription>
              Calculated position size based on your risk parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-green-700">
                  Position Size ของคุณที่จะต้องเข้าในครั้งนี้คือ{' '}
                  {result.positionSize.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  USDT
                </span>
              </p>
              <p>
                หากคุณเทรดแล้วแพ้ในครั้งนี้ คุณจะเหลือโอกาสอีก{' '}
                <span className="font-semibold text-blue-700">
                  {result.remainingTrades - 1} ครั้ง
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>กรอกข้อมูลและคลิก Calculate เพื่อดูผลลัพธ์</p>
            </div>
          )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Management Tips */}
      {/* <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Risk Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">
                Position Sizing Best Practices
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Never risk more than 1-3% of your account per trade</li>
                <li>• Use stop losses to limit downside risk</li>
                <li>• Consider position correlation to avoid overexposure</li>
                <li>• Adjust position size based on market volatility</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Risk-Reward Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Aim for at least 1:2 risk-reward ratio</li>
                <li>• Higher probability setups can use lower ratios</li>
                <li>• Factor in trading costs and slippage</li>
                <li>
                  • Review and adjust strategy based on performance
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default PositionSize;
