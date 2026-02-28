import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquareText, ShieldCheck, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-gradient-to-br from-background via-blue-50/50 to-white">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                AI-Powered Personal Loan Assistant
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                Finance sarthi
– <span className="text-primary">AI-Powered</span> Personal Loan Assistant
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Get instant assistance for your personal loan needs. Check eligibility, calculate EMIs, and get sanction letters approved in minutes.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/eligibility">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 shadow-lg shadow-primary/20">
                  Check Eligibility <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg h-12 px-8 border-2 border-secondary/20 hover:bg-secondary/20">
                  <MessageSquareText className="mr-2 h-5 w-5" /> Chat with AI
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose TataSaarthi?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of lending with our agentic AI workflow that simplifies every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="Instant Approvals"
              description="Our AI Master Agent processes your request in real-time against pre-approved limits for instant sanctions."
            />
            <FeatureCard 
              icon={MessageSquareText}
              title="24×7 AI Assistance"
              description="No waiting times. Our intelligent chatbot understands your context and guides you day or night."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Transparent Rules"
              description="Clear eligibility criteria and rule-based underwriting ensure fair and transparent decisions."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-white rounded-xl border shadow-sm px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-medium">What is TataSaarthi?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Finance sarthi
is Tata Capital’s AI-powered personal loan assistant, guiding users through loan options, eligibility, approvals, and sanction letter generation via a web-based chatbot.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-medium">How does Finance sarthi
work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                It uses agentic AI: A Master Agent orchestrates Worker Agents to interact with you, verify your details against our database, and approve loans based on strict underwriting rules.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-medium">Is it safe to share details?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. For this prototype, we only request basic information like mobile number and loan amount. The backend runs on dummy data to demonstrate the capability safely.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-medium">Can I get approved instantly?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, if your loan requirement is within your pre-approved limit and you meet the credit score criteria, approval is instant.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <img 
              src="/attached_assets/Gemini_Generated_Image_qi1alqqi1alqqi1a_1765981525562.png" 
              alt="TataSaarthi" 
              className="h-8 w-auto grayscale opacity-80"
            />
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-2 hover:text-primary cursor-pointer"><div className="w-2 h-2 rounded-full bg-green-500"></div> Support Online</span>
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer">Terms of Service</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 Finance sarthi
Prototype.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
