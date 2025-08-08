
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import type { Trade } from '@/types/Trade';

interface EnhancedTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trade: Trade | Omit<Trade, '_id'>) => void;
  trade?: Trade | null;
}

const EnhancedTradeModal = ({ isOpen, onClose, onSubmit, trade }: EnhancedTradeModalProps) => {
  const [formData, setFormData] = useState<Trade>({
    trade: {
      symbol: '',
      side: 'LONG',
      size: 0,
      entry_price: 0,
      entry_date: new Date().toISOString().split('T')[0],
    },
    setup: {},
    stop: {},
    exit: {},
    custom_fields: {},
  });

  // const [customFieldName, setCustomFieldName] = useState('');
  // const [customFieldValue, setCustomFieldValue] = useState('');

  useEffect(() => {
    if (trade) {
      setFormData(trade);
    } else {
      setFormData({
        trade: {
          symbol: '',
          side: 'LONG',
          size: 0,
          entry_price: 0,
          entry_date: new Date().toISOString().split('T')[0],
        },
        setup: {},
        stop: {},
        exit: {},
        custom_fields: {},
      });
    }
  }, [trade, isOpen]);

  useEffect(() => {
    const leverage = formData.trade?.leverage;
    const margin = formData.trade?.margin;

    if (
      leverage !== undefined &&
      !isNaN(leverage) &&
      margin !== undefined &&
      !isNaN(margin)
    ) {
      updateTradeField('size', leverage * margin);
    } else {
      updateTradeField('size', undefined);
    }
  }, [formData.trade?.leverage, formData.trade?.margin]);

  const updateTradeField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      trade: { ...prev.trade, [field]: value }
    }));
  };

  const updateSetupField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      setup: { ...prev.setup, [field]: value }
    }));
  };

  const updateStopField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      stop: { ...prev.stop, [field]: value }
    }));
  };

  const updateExitField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      exit: { ...prev.exit, [field]: value }
    }));
  };

  // const addCustomField = () => {
  //   if (customFieldName && customFieldValue) {
  //     setFormData(prev => ({
  //       ...prev,
  //       custom_fields: {
  //         ...prev.custom_fields,
  //         [customFieldName]: customFieldValue
  //       }
  //     }));
  //     setCustomFieldName('');
  //     setCustomFieldValue('');
  //   }
  // };

  // const removeCustomField = (fieldName: string) => {
  //   setFormData(prev => {
  //     const newCustomFields = { ...prev.custom_fields };
  //     delete newCustomFields[fieldName];
  //     return {
  //       ...prev,
  //       custom_fields: newCustomFields
  //     };
  //   });
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate derived fields
    const updatedFormData = { ...formData };

    if (updatedFormData.trade.exit_price && updatedFormData.trade.entry_price) {
      const pnl = updatedFormData.trade.side === 'LONG'
        ? (updatedFormData.trade.exit_price - updatedFormData.trade.entry_price) * updatedFormData.trade.size
        : (updatedFormData.trade.entry_price - updatedFormData.trade.exit_price) * updatedFormData.trade.size;

      updatedFormData.trade.pnl_usd = pnl;
      updatedFormData.trade.pnl_percent = (pnl / (updatedFormData.trade.entry_price * updatedFormData.trade.size)) * 100;
      updatedFormData.trade.win_loss = pnl > 0 ? 'W' : 'L';
    }

    if (updatedFormData.trade.entry_date && updatedFormData.trade.exit_date) {
      const entryDate = new Date(updatedFormData.trade.entry_date);
      const exitDate = new Date(updatedFormData.trade.exit_date);
      updatedFormData.trade.duration_days = Math.ceil((exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    if (trade) {
      onSubmit({ ...updatedFormData, _id: trade._id });
    } else {
      onSubmit(updatedFormData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {trade ? 'Edit Trade' : 'Add New Trade'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="trade" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1 mb-4">
                <TabsTrigger value="trade">Trade Details</TabsTrigger>
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="stop">Stop Loss</TabsTrigger>
                <TabsTrigger value="exit">Exit</TabsTrigger>
                {/* <TabsTrigger value="custom">Custom Fields</TabsTrigger> */}
              </TabsList>

              <TabsContent value="trade" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Trade Information
                      {formData.trade?.side === 'LONG' ?
                        <TrendingUp className="text-green-600" size={20} /> :
                        <TrendingDown className="text-red-600" size={20} />
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="symbol">Symbol *</Label>
                      <Input
                        id="symbol"
                        value={formData.trade?.symbol || ''}
                        onChange={(e) => updateTradeField('symbol', e.target.value)}
                        placeholder="e.g., SUI, BTC"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="side">Side *</Label>
                      <Select
                        value={formData.trade?.side}
                        onValueChange={(value: 'LONG' | 'SHORT') => updateTradeField('side', value)}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          <SelectItem value="LONG">LONG</SelectItem>
                          <SelectItem value="SHORT">SHORT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="leverage">Leverage *</Label>
                      <Input
                        id="leverage"
                        type="number"
                        value={formData.trade?.leverage || ''}
                        onChange={(e) => updateTradeField('leverage', parseFloat(e.target.value))}
                        placeholder="10"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="margin">Margin *</Label>
                      <Input
                        id="margin"
                        type="number"
                        step="0.01"
                        value={formData.trade?.margin || ''}
                        onChange={(e) => updateTradeField('margin', parseFloat(e.target.value))}
                        placeholder="$100"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="entry_price">Entry Price *</Label>
                      <Input
                        id="entry_price"
                        type="number"
                        step="0.01"
                        value={formData.trade?.entry_price || ''}
                        onChange={(e) => updateTradeField('entry_price', parseFloat(e.target.value))}
                        placeholder="1238.40"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="exit_price">Exit Price</Label>
                      <Input
                        id="exit_price"
                        type="number"
                        step="0.01"
                        value={formData.trade?.exit_price || ''}
                        onChange={(e) => updateTradeField('exit_price', parseFloat(e.target.value))}
                        placeholder="1042.10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="entry_date">Entry Date *</Label>
                      <Input
                        id="entry_date"
                        type="date"
                        value={formData.trade?.entry_date || ''}
                        onChange={(e) => updateTradeField('entry_date', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="exit_date">Exit Date</Label>
                      <Input
                        id="exit_date"
                        type="date"
                        value={formData.trade?.exit_date || ''}
                        onChange={(e) => updateTradeField('exit_date', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        type="number"
                        value={formData.trade?.size || ''}
                        // onChange={(e) => updateTradeField('size', parseFloat(e.target.value))}
                        placeholder="$300"
                        disabled
                        required
                        readOnly
                      />
                    </div>

                    <div>
                      <Label htmlFor="fee_usd">Fee (USD)</Label>
                      <Input
                        id="fee_usd"
                        type="number"
                        step="0.01"
                        value={formData.trade?.fee_usd || ''}
                        onChange={(e) => updateTradeField('fee_usd', parseFloat(e.target.value))}
                        placeholder="74.0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="grade">Grade</Label>
                      <Select
                        value={formData.trade?.grade || ''}
                        onValueChange={(value: 'A' | 'B' | 'C' | 'D' | 'F') => updateTradeField('grade', value)}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          <SelectItem className="hover:bg-gray-100" value="A">A</SelectItem>
                          <SelectItem className="hover:bg-gray-100" value="B">B</SelectItem>
                          <SelectItem className="hover:bg-gray-100" value="C">C</SelectItem>
                          <SelectItem className="hover:bg-gray-100" value="D">D</SelectItem>
                          <SelectItem className="hover:bg-gray-100" value="F">F</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="note">Notes</Label>
                      <Textarea
                        id="note"
                        value={formData.trade?.note || ''}
                        onChange={(e) => updateTradeField('note', e.target.value)}
                        placeholder="Trade notes and observations..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="setup" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Setup Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="setup_name">Setup Name</Label>
                      <Input
                        id="setup_name"
                        value={formData.setup?.name || ''}
                        onChange={(e) => updateSetupField('name', e.target.value)}
                        placeholder="short wave B (sub A)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="setup_reason">Setup Reason</Label>
                      <Textarea
                        id="setup_reason"
                        value={formData.setup?.reason || ''}
                        onChange={(e) => updateSetupField('reason', e.target.value)}
                        placeholder="Analysis and reasoning for the trade setup..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Input
                        id="timeframe"
                        value={formData.setup?.timeframe || ''}
                        onChange={(e) => updateSetupField('timeframe', e.target.value)}
                        placeholder="1H, 4H, 1D"
                      />
                    </div>

                    <div>
                      <Label htmlFor="entry_chart_url">Entry Chart URL</Label>
                      <Input
                        id="entry_chart_url"
                        type="url"
                        value={formData.setup?.entry_chart_url || ''}
                        onChange={(e) => updateSetupField('entry_chart_url', e.target.value)}
                        placeholder="https://your-storage.com/enter_chart.jpg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stop" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Stop Loss Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="stop_condition">Stop Condition</Label>
                      <Input
                        id="stop_condition"
                        value={formData.stop?.condition || ''}
                        onChange={(e) => updateStopField('condition', e.target.value)}
                        placeholder="break B"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sl_percent">Stop Loss %</Label>
                      <Input
                        id="sl_percent"
                        type="number"
                        step="0.01"
                        value={formData.stop?.sl_percent || ''}
                        onChange={(e) => updateStopField('sl_percent', parseFloat(e.target.value))}
                        placeholder="3.14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="risk_usd">Risk (USD)</Label>
                      <Input
                        id="risk_usd"
                        type="number"
                        step="0.01"
                        value={formData.stop?.risk_usd || ''}
                        onChange={(e) => updateStopField('risk_usd', parseFloat(e.target.value))}
                        placeholder="11665.73"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Exit Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="exit_type">Exit Type</Label>
                      <Select
                        value={formData.exit?.type || ''}
                        onValueChange={(value: 'TP' | 'SL' | 'Manual') => updateExitField('type', value)}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select Exit Type" />
                        </SelectTrigger>
                        <SelectContent className='bg-white' >
                          <SelectItem value="TP">Take Profit</SelectItem>
                          <SelectItem value="SL">Stop Loss</SelectItem>
                          <SelectItem value="Stop Profit">Stop Profit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="rrr">Risk-Reward Ratio</Label>
                      <Input
                        id="rrr"
                        type="number"
                        step="0.01"
                        value={formData.exit?.rrr || ''}
                        onChange={(e) => updateExitField('rrr', parseFloat(e.target.value))}
                        placeholder="5.26"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tp_percent">TP %</Label>
                      <Input
                        id="tp_percent"
                        type="number"
                        step="0.01"
                        value={formData.exit?.tp_percent || ''}
                        onChange={(e) => updateExitField('tp_percent', parseFloat(e.target.value))}
                        placeholder="16.51"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exit_chart_url">Exit Chart URL</Label>
                      <Input
                        id="exit_chart_url"
                        type="url"
                        value={formData.exit?.exit_chart_url || ''}
                        onChange={(e) => updateExitField('exit_chart_url', e.target.value)}
                        placeholder="https://your-storage.com/exit_chart.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exit_plan">Exit Plan</Label>
                      <Textarea
                        id="exit_plan"
                        value={formData.exit?.exit_plan || ''}
                        onChange={(e) => updateExitField('exit_plan', e.target.value)}
                        placeholder="wave C Fib 100-123.6 of A + demand zone"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="exit_execution">Exit Execution</Label>
                      <Input
                        id="exit_execution"
                        value={formData.exit?.exit_execution || ''}
                        onChange={(e) => updateExitField('exit_execution', e.target.value)}
                        placeholder="MATCH"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="custom" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Field name"
                        value={customFieldName}
                        onChange={(e) => setCustomFieldName(e.target.value)}
                      />
                      <Input
                        placeholder="Field value"
                        value={customFieldValue}
                        onChange={(e) => setCustomFieldValue(e.target.value)}
                      />
                      <Button type="button" onClick={addCustomField} variant="outline">
                        <Plus size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(formData.custom_fields || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{key}</Badge>
                            <span className="text-sm text-gray-600">{String(value)}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomField(key)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-black text-white hover:bg-white hover:text-black transition-colors duration-500">
                {trade ? 'Update Trade' : 'Add Trade'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTradeModal;
