import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { IndianRupee } from "lucide-react";

export default function Calculator() {
  const [amount, setAmount] = useState([500000]);
  const [tenure, setTenure] = useState([24]);
  const [interest, setInterest] = useState([11.5]);

  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const p = amount[0];
    const r = interest[0] / 12 / 100;
    const n = tenure[0];

    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiValue = p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const total = emiValue * n;
    
    setEmi(Math.round(emiValue));
    setTotalPayment(Math.round(total));
    setTotalInterest(Math.round(total - p));
  }, [amount, tenure, interest]);

  const chartData = [
    { name: "Principal Amount", value: amount[0], color: "hsl(var(--chart-1))" },
    { name: "Interest Amount", value: totalInterest, color: "hsl(var(--chart-2))" },
  ];

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">EMI Calculator</h1>
        <p className="text-muted-foreground">
          Plan your loan with our easy-to-use EMI calculator.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Amount */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Loan Amount</Label>
                <div className="relative w-32">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={amount[0]} 
                    onChange={(e) => setAmount([Number(e.target.value)])}
                    className="pl-8 text-right font-mono"
                  />
                </div>
              </div>
              <Slider 
                value={amount} 
                onValueChange={setAmount} 
                min={10000} 
                max={5000000} 
                step={10000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹10K</span>
                <span>₹50L</span>
              </div>
            </div>

            {/* Interest */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Interest Rate (% p.a)</Label>
                <div className="relative w-24">
                  <Input 
                    value={interest[0]} 
                    onChange={(e) => setInterest([Number(e.target.value)])}
                    className="text-right font-mono"
                  />
                </div>
              </div>
              <Slider 
                value={interest} 
                onValueChange={setInterest} 
                min={8} 
                max={24} 
                step={0.1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8%</span>
                <span>24%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Tenure (Months)</Label>
                <div className="relative w-24">
                  <Input 
                    value={tenure[0]} 
                    onChange={(e) => setTenure([Number(e.target.value)])}
                    className="text-right font-mono"
                  />
                </div>
              </div>
              <Slider 
                value={tenure} 
                onValueChange={setTenure} 
                min={6} 
                max={60} 
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6M</span>
                <span>60M</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Repayment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
                <span className="text-muted-foreground font-medium">Monthly EMI</span>
                <span className="text-2xl font-bold text-primary">₹{emi.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center px-4 py-2">
                <span className="text-muted-foreground">Principal Amount</span>
                <span className="font-mono font-semibold">₹{amount[0].toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center px-4 py-2">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-mono font-semibold text-secondary-foreground">₹{totalInterest.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200 mt-2">
                <span className="font-bold text-lg">Total Payment</span>
                <span className="font-bold text-xl">₹{totalPayment.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
