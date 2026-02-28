import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Loader2, IndianRupee, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 18 && Number(val) <= 100, {
    message: "Age must be between 18 and 100.",
  }),
  employmentType: z.enum(["Salaried", "Self-employed"], {
    required_error: "Please select your employment type.",
  }),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  existingEmi: z.string().min(1, "Existing EMI is required (enter 0 if none)"),
  creditScore: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 300 && Number(val) <= 900, {
    message: "Enter a valid credit score between 300 and 900.",
  }),
  loanType: z.enum(["Home", "Personal", "Car"], {
    required_error: "Please select a loan type.",
  }),
  loanTenure: z.string().min(1, "Loan tenure is required"),
});

type EligibilityResult = {
  eligibleLoanAmount: number;
  estimatedEmi: number;
  status: "Low" | "Moderate" | "High";
  advice: string;
};

export default function Eligibility() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: "",
      employmentType: "Salaried",
      monthlyIncome: "",
      existingEmi: "0",
      creditScore: "",
      loanType: "Personal",
      loanTenure: "5",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    // Note: Since we are in mockup mode, we'll simulate the backend logic here
    // but the request asks for a POST /check-eligibility. 
    // In a real scenario, this would be an API call.
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const income = Number(values.monthlyIncome);
      const existingEmi = Number(values.existingEmi);
      const score = Number(values.creditScore);
      const tenureYears = Number(values.loanTenure);
      const tenureMonths = tenureYears * 12;

      let interestRate = 12; // Personal
      if (values.loanType === "Home") interestRate = 8;
      if (values.loanType === "Car") interestRate = 9;

      const maxAllowedEmi = income * 0.5;
      const eligibleEmi = Math.max(0, maxAllowedEmi - existingEmi);

      // EMI Formula: P = E * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
      const r = interestRate / 12 / 100;
      const n = tenureMonths;
      const eligibleLoanAmount = eligibleEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

      let status: "Low" | "Moderate" | "High" = "Low";
      if (score > 750) status = "High";
      else if (score >= 650) status = "Moderate";

      // Mock AI Advice
      const aiAdvice = status === "High" 
        ? `Excellent profile, ${values.fullName}! Your high credit score of ${score} makes you a preferred customer. You can comfortably afford an EMI of ₹${Math.round(eligibleEmi)}. We recommend opting for a shorter tenure to save on interest costs.`
        : status === "Moderate"
        ? `Good standing, ${values.fullName}. Your credit score is in the moderate range. To improve your eligibility for a higher loan amount, consider closing small existing debts or waiting until your score crosses 750 for better interest rates.`
        : `Your credit score is currently low, which impacts loan approval. We suggest focusing on timely bill payments and reducing credit card utilization to improve your score before reapplying.`;

      setResult({
        eligibleLoanAmount: Math.round(eligibleLoanAmount),
        estimatedEmi: Math.round(eligibleEmi),
        status,
        advice: aiAdvice
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High": return "bg-green-500 text-white border-green-600";
      case "Moderate": return "bg-yellow-500 text-white border-yellow-600";
      case "Low": return "bg-red-500 text-white border-red-600";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "High": return "bg-green-50 border-green-200";
      case "Moderate": return "bg-yellow-50 border-yellow-200";
      case "Low": return "bg-red-50 border-red-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">Loan Eligibility Checker</h1>
          <p className="text-muted-foreground text-lg">
            Discover your borrowing power with our AI-enhanced eligibility engine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Financial Profile</CardTitle>
              <CardDescription>
                Provide your details for an instant eligibility assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="25" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Salaried">Salaried</SelectItem>
                              <SelectItem value="Self-employed">Self-employed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="50000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="existingEmi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Existing EMI (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="0" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score</FormLabel>
                          <FormControl>
                            <Input placeholder="750" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="loanType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Home">Home Loan</SelectItem>
                              <SelectItem value="Personal">Personal Loan</SelectItem>
                              <SelectItem value="Car">Car Loan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="loanTenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenure (Years)</FormLabel>
                        <FormControl>
                          <Input placeholder="5" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Calculating...
                      </>
                    ) : "Check Eligibility"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className={`border-2 overflow-hidden shadow-2xl ${getStatusBg(result.status)}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">Eligibility Status</CardTitle>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold border ${getStatusColor(result.status)}`}>
                        {result.status} Eligibility
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Max Loan Amount</p>
                        <p className="text-2xl font-bold text-primary flex items-center">
                          <IndianRupee className="h-5 w-5 mr-1" />
                          {result.eligibleLoanAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Estimated EMI</p>
                        <p className="text-2xl font-bold text-primary flex items-center">
                          <IndianRupee className="h-5 w-5 mr-1" />
                          {result.estimatedEmi.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-bold text-lg">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        AI Financial Advice
                      </div>
                      <div className="bg-white/90 p-5 rounded-xl border border-primary/10 italic text-muted-foreground leading-relaxed shadow-inner">
                        "{result.advice}"
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Start Application Now
                    </Button>
                  </CardFooter>
                </Card>

                {result.status === "Low" && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-800 text-sm">
                    <XCircle className="h-5 w-5 shrink-0" />
                    <p>Tip: A credit score above 750 significantly improves your chances and can lower your interest rates by up to 2%.</p>
                  </div>
                )}
                {result.status === "High" && (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3 text-green-800 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>You qualify for our "Premium Borrower" program with zero processing fees and instant disbursal.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 border-2 border-dashed rounded-xl bg-slate-50/50"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calculator className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Waiting for details</h3>
                  <p className="text-muted-foreground">Fill out the form on the left to see your eligibility result and AI-generated advice.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

