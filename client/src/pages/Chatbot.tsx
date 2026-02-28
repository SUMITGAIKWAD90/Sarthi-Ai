import { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserData } from "@/lib/dummyData";
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  Download,
  BrainCircuit,
  Cpu,
  Search,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type MessageType = "bot" | "user" | "system";
type AgentType = "Master" | "Sales" | "Underwriter" | "None";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  agent?: AgentType;
  options?: string[];
  isTyping?: boolean;
}

export default function Chatbot() {
  const { users, selectUser, selectedUser } = useUser();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUserSelectionOpen, setIsUserSelectionOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    "greeting" | "purpose" | "identification" | "requirements" | "underwriting" | "salary_slip" | "decision" | "ended"
  >("greeting");
  
  // Loan State
  const [loanDetails, setLoanDetails] = useState({
    purpose: "",
    amount: 0,
    tenure: 0,
    salary: 0,
  });

  const startChat = () => {
     addBotMessage("Hi! I'm TataSaarthi, your AI loan assistant. I can help you get a personal loan approval in just 2 minutes. Shall we get started?", "Master", ["Yes, let's go", "Not now"]);
  };

  // Start chat on load
  useEffect(() => {
    if (messages.length === 0) {
      startChat();
    }
  }, []);

  const resetChat = () => {
    setMessages([]);
    setInputValue("");
    setIsProcessing(false);
    setCurrentPhase("greeting");
    setLoanDetails({
        purpose: "",
        amount: 0,
        tenure: 0,
        salary: 0,
    });
    // We need to trigger the start message again. 
    // Since state updates are async, we can't rely on messages.length === 0 in useEffect immediately if we just set it.
    // So we'll call startChat directly after a small timeout or use a separate effect.
    setTimeout(() => startChat(), 100);
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const addBotMessage = (content: string, agent: AgentType = "Master", options?: string[]) => {
    setIsProcessing(true);
    // Simulate typing delay
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content,
        agent,
        options
      };
      setMessages(prev => [...prev, newMessage]);
      setIsProcessing(false);
    }, 1000); // 1s delay for realism
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
    };
    setMessages(prev => [...prev, newMessage]);
    handleUserResponse(content);
  };

  const addSystemMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUserSelection = (user: UserData) => {
    setIsUserSelectionOpen(false);
    selectUser(user);
    
    // Simulate user sending their phone number
    const userMsg = `My mobile number is ${user.phone}`;
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userMsg,
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Proceed to next step
    handleIdentificationSuccess(user);
  };

  const handleIdentificationSuccess = async (user: UserData) => {
    setIsProcessing(true);
    await simulateThinking(`Fetching details for ${user.phone}...`);
    addBotMessage(`Welcome back, ${user.name}. I see you are from ${user.city}. How much loan amount do you need today?`, "Sales", ["₹50,000", "₹1,00,000", "₹5,00,000", "Custom Amount"]);
    setCurrentPhase("requirements");
    setIsProcessing(false);
  };

  const handleUserResponse = async (response: string) => {
    setIsProcessing(true);

    // MASTER AGENT ORCHESTRATION LOGIC
    
    if (currentPhase === "greeting") {
      if (response.toLowerCase().includes("yes") || response.toLowerCase().includes("go")) {
        setCurrentPhase("purpose");
        await simulateAgentHandoff("Master", "Sales");
        addBotMessage("Great! First, could you tell me what you need this personal loan for?", "Sales", ["Medical", "Travel", "Wedding", "Education", "Debt Consolidation", "Other"]);
      } else {
        addBotMessage("No problem. I'm here whenever you need assistance.", "Master");
        setCurrentPhase("ended");
      }
    } 
    
    else if (currentPhase === "purpose") {
      setLoanDetails(prev => ({ ...prev, purpose: response }));
      setCurrentPhase("identification");
      addBotMessage("Please provide your mobile number to verify your identity.", "Sales", ["Select User from Database"]);
    }

    else if (currentPhase === "identification") {
      if (response === "Select User from Database") {
        setIsUserSelectionOpen(true);
        setIsProcessing(false); // Stop processing so user can interact
        return;
      } 
      
      // Handle manual entry (if they typed something instead of clicking button)
      const isPhone = /^[0-9]{10}$/.test(response.replace(/[^0-9]/g, ''));
      if (isPhone) {
         // In a real app we would fetch, here we just pick the current selected or first
         const user = selectedUser || users[0];
         handleIdentificationSuccess(user);
      } else {
         addBotMessage("That doesn't look like a valid number. Please try 'Select User from Database' for this demo.", "Sales", ["Select User from Database"]);
      }
    }

    else if (currentPhase === "requirements") {
      // Handle Amount
      if (loanDetails.amount === 0) {
        let amount = 0;
        if (response.includes("50,000")) amount = 50000;
        else if (response.includes("1,00,000")) amount = 100000;
        else if (response.includes("5,00,000")) amount = 500000;
        else {
            // Assume user typed a number if they chose custom or typed it
            const extracted = parseInt(response.replace(/[^0-9]/g, ''));
            amount = isNaN(extracted) ? 0 : extracted;
        }

        if (amount > 0) {
            setLoanDetails(prev => ({ ...prev, amount }));
            addBotMessage("Got it. And what tenure would you prefer?", "Sales", ["12 Months", "24 Months", "36 Months", "48 Months"]);
        } else {
            addBotMessage("Please enter a valid amount (e.g., 50000).", "Sales");
        }
      } 
      // Handle Tenure
      else if (loanDetails.tenure === 0) {
        const tenure = parseInt(response);
        if (tenure) {
            setLoanDetails(prev => ({ ...prev, tenure }));
            addBotMessage("Finally, to ensure we find the best offer, could you share your monthly in-hand salary?", "Sales", ["< ₹20,000", "₹20,000 - ₹50,000", "₹50,000 - ₹1 Lakh", "> ₹1 Lakh"]);
        } else {
             addBotMessage("Please select or type a tenure in months.", "Sales");
        }
      }
      // Handle Salary -> Trigger Underwriting
      else {
          let salary = 0;
          if (response.includes("<")) salary = 15000;
          else if (response.includes("20,000")) salary = 35000;
          else if (response.includes("50,000")) salary = 75000;
          else if (response.includes(">")) salary = 150000;
          else {
            const extracted = parseInt(response.replace(/[^0-9]/g, ''));
            salary = isNaN(extracted) ? 0 : extracted;
          }

          if (salary > 0) {
              setLoanDetails(prev => ({ ...prev, salary }));
              
              setCurrentPhase("underwriting");
              await simulateAgentHandoff("Sales", "Underwriter");
              
              addSystemMessage("Master Agent: Initiating Underwriting Workflow...");
              await simulateThinking("Verifying KYC status...", 1000);
              
              if (!selectedUser) return;
              await simulateThinking(`Checking Credit Bureau Score for ${selectedUser.name}...`, 1000);
    
              // LOGIC:
              // 1. If loan <= pre-approved limit -> INSTANT APPROVAL
              // 2. If loan <= 2x limit -> ASK FOR SALARY SLIP (Conditional)
              // 3. If loan > 2x limit OR credit score < 700 -> REJECT
    
              const limit = selectedUser.preApprovedLimit;
              const score = selectedUser.creditScore;
              const reqAmount = loanDetails.amount;
              const tenure = loanDetails.tenure;

              // Calculate EMI
              const r = 12 / 12 / 100; // 12% annual interest
              const emi = Math.round(reqAmount * r * (Math.pow(1 + r, tenure) / (Math.pow(1 + r, tenure) - 1)));
    
              if (score < 700 || reqAmount > limit * 2) {
                  await simulateThinking("Evaluating Risk Parameters...", 1000);
                  setCurrentPhase("decision");
                  addBotMessage(`I've reviewed your application. Unfortunately, we cannot approve this loan at the moment due to ${score < 700 ? "credit score criteria" : "the requested amount exceeding current eligibility limits"}.`, "Underwriter", ["End Chat", "Restart"]);
              } else if (reqAmount <= limit) {
                  await simulateThinking("Generating Sanction Letter...", 1500);
                  setCurrentPhase("decision");
                  showApproval(reqAmount);
              } else {
                  // Conditional Approval Logic: Check EMI vs Salary
                  if (emi <= (salary * 0.5)) {
                      setCurrentPhase("salary_slip");
                      addBotMessage(`Your request exceeds the instant approval limit of ₹${limit.toLocaleString()}. However, you are eligible for a conditional approval.`, "Underwriter");
                      setTimeout(() => {
                        addBotMessage(`To proceed, I need to verify your income. Please upload your latest Salary Slip (PDF format).`, "Underwriter");
                        // Render Upload Card
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            type: "system",
                            content: "UPLOAD_REQUEST_PAYLOAD",
                        } as any]);
                      }, 800);
                  } else {
                      setCurrentPhase("decision");
                       addBotMessage(`Although your profile is good, the calculated EMI of ₹${emi.toLocaleString()} exceeds 50% of your declared monthly income. We recommend applying for a lower amount or longer tenure to reduce the EMI burden.`, "Underwriter", ["Restart"]);
                  }
              }
          } else {
               addBotMessage("Please enter a valid monthly salary amount (e.g., 50000).", "Sales");
          }
      }
    }
    
    else if (currentPhase === "salary_slip") {
        // Mock upload handling happen via the upload button, but if they type text:
         addBotMessage("Please use the 'Upload Salary Slip' button above to submit your document.", "Underwriter");
    }

    else if (currentPhase === "decision") {
        if (response === "Restart") {
            resetChat();
        } else {
            addBotMessage("Thank you for using TataSaarthi. Have a great day!", "Master");
            setCurrentPhase("ended");
        }
    }
  };

  const showApproval = (amount: number) => {
      const emi = Math.round((amount * 1.12) / (loanDetails.tenure || 12)); // Rough mock calc
      addBotMessage(`Congratulations! Your loan of ₹${amount.toLocaleString()} is approved!`, "Underwriter");
      
      setTimeout(() => {
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              type: "system",
              content: "APPROVAL_CARD_PAYLOAD", // Special flag
              payload: { amount, tenure: loanDetails.tenure, emi }
          } as any]);

      }, 1000);
  };

  const simulateThinking = async (text: string, duration = 1000) => {
    setIsProcessing(true);
    addSystemMessage(text);
    return new Promise(resolve => setTimeout(resolve, duration));
  };

  const simulateAgentHandoff = async (from: AgentType, to: AgentType) => {
      addSystemMessage(`🔄 Handoff: ${from} Agent ➔ ${to} Agent`);
      await new Promise(resolve => setTimeout(resolve, 800));
  };

  const handleFileUpload = () => {
      toast({
          title: "File Uploaded",
          description: "Salary Slip verified successfully.",
          className: "bg-green-50 border-green-200"
      });
      // Proceed to approval
      addSystemMessage("✅ Salary Slip Verified successfully.");
      setTimeout(() => {
        showApproval(loanDetails.amount);
        setCurrentPhase("decision");
      }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <UserSelectionDialog 
        open={isUserSelectionOpen} 
        onOpenChange={setIsUserSelectionOpen}
        users={users}
        onSelect={handleUserSelection}
      />

      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm flex justify-between items-center shrink-0 z-10 relative">
        <div>
           <h1 className="text-lg font-bold flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" /> 
            TataSaarthi AI
           </h1>
           <p className="text-xs text-muted-foreground flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Active Session • {selectedUser ? `User: ${selectedUser.name}` : "Guest"}
           </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetChat}>Restart Chat</Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-slate-50/50" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                    
                  {/* Avatar */}
                  {msg.type !== "system" && (
                      <Avatar className={`h-8 w-8 mt-1 shadow-sm border ${msg.type === "bot" ? "bg-primary text-primary-foreground" : "bg-white"}`}>
                        {msg.type === "bot" ? (
                            <AvatarImage src="/bot-avatar.png" />
                        ) : (
                            <AvatarImage src="/user-avatar.png" />
                        )}
                        <AvatarFallback>
                            {msg.type === "bot" ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4 text-foreground" />}
                        </AvatarFallback>
                      </Avatar>
                  )}

                  <div className="flex flex-col gap-1 w-full">
                    {/* Agent Name Label */}
                    {msg.type === "bot" && msg.agent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1">
                            {msg.agent} Agent
                        </span>
                    )}

                    {/* Message Bubble */}
                    {msg.type === "system" ? (
                        msg.content === "APPROVAL_CARD_PAYLOAD" ? (
                            <div className="mx-auto w-full max-w-sm">
                                {/* Using the payload from the message */}
                                <Card className="p-0 overflow-hidden border-green-200 w-full shadow-lg">
                                    <div className="bg-green-600 p-4 text-white">
                                      <div className="flex items-center gap-2 font-bold text-lg">
                                          <CheckCircle2 className="h-6 w-6" /> Sanction Letter
                                      </div>
                                      <p className="text-green-100 text-xs mt-1">Loan Application Approved</p>
                                    </div>
                                    <div className="p-5 space-y-4 bg-white">
                                        <div className="flex justify-between items-center pb-2 border-b border-dashed">
                                            <span className="text-muted-foreground text-sm">Approved Amount</span>
                                            <strong className="text-xl text-green-700">₹{(msg as any).payload.amount.toLocaleString()}</strong>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-sm">Tenure</span>
                                            <strong>{(msg as any).payload.tenure} Months</strong>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-sm">Interest Rate</span>
                                            <strong>12% p.a.</strong>
                                        </div>
                                        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                                            <span className="text-green-800 text-sm font-medium">Monthly EMI</span>
                                            <strong className="text-lg text-green-800">₹{(msg as any).payload.emi.toLocaleString()}</strong>
                                        </div>
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm" onClick={() => toast({ title: "Downloading...", description: "Sanction Letter PDF downloaded successfully." })}>
                                            <Download className="h-4 w-4" /> Download PDF
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ) : msg.content === "UPLOAD_REQUEST_PAYLOAD" ? (
                            <div className="mx-auto w-full max-w-sm mt-2">
                                <Card className="border-dashed border-2 border-primary/20 bg-blue-50/50 p-6 flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-foreground">Salary Slip Required</h4>
                                        <p className="text-xs text-muted-foreground">Please upload your latest salary slip in PDF format to verify your income.</p>
                                    </div>
                                    <div className="w-full pt-2">
                                      <label htmlFor="file-upload" className="w-full cursor-pointer">
                                        <div className="flex items-center justify-center gap-2 w-full h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
                                            <Upload className="h-4 w-4" /> Upload Document
                                        </div>
                                        <input 
                                            id="file-upload" 
                                            type="file" 
                                            accept=".pdf" 
                                            className="hidden" 
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    handleFileUpload();
                                                }
                                            }}
                                        />
                                      </label>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground my-1 py-1 px-4 ml-2">
                                {msg.content.includes("Handoff") ? <Cpu className="h-3 w-3 text-primary" /> : <div className="flex gap-1"><span className="w-1 h-1 bg-muted-foreground rounded-full"></span><span className="w-1 h-1 bg-muted-foreground rounded-full"></span></div>}
                                {msg.content}
                            </div>
                        )
                    ) : (
                        <div
                            className={`
                                p-4 rounded-2xl text-sm shadow-sm leading-relaxed
                                ${msg.type === "user" 
                                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                                    : "bg-white border text-foreground rounded-tl-none"}
                            `}
                        >
                            {msg.content}
                        </div>
                    )}

                    {/* Options Buttons */}
                    {msg.options && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {msg.options.map((opt) => (
                                <Button 
                                    key={opt} 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-white hover:bg-blue-50 hover:text-primary hover:border-primary/50 transition-all rounded-full text-xs h-9 px-4 shadow-sm border-muted-foreground/20"
                                    onClick={() => handleUserResponse(opt)}
                                    disabled={isProcessing}
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Loading/Typing Indicator */}
            {isProcessing && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                    <div className="flex gap-3 max-w-[80%] items-end">
                        <Avatar className="h-8 w-8 border bg-white shadow-sm mb-1">
                             <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-white border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                 </motion.div>
            )}
            
            <div ref={scrollRef} /> 
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 relative">
        <div className="max-w-3xl mx-auto flex gap-3 items-center">
            {currentPhase === "salary_slip" && (
                <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-full" onClick={handleFileUpload}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                </Button>
            )}
            
            <Input 
                placeholder={currentPhase === "salary_slip" ? "Upload required..." : "Type your message..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isProcessing && inputValue && (addUserMessage(inputValue), setInputValue(""))}
                disabled={isProcessing || currentPhase === "ended"}
                className="flex-1 h-11 rounded-full px-5 bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
            />
            
            <Button 
                size="icon" 
                onClick={() => {
                    if (inputValue) {
                        addUserMessage(inputValue);
                        setInputValue("");
                    }
                }}
                disabled={!inputValue || isProcessing || currentPhase === "ended"}
                className="shrink-0 h-10 w-10 rounded-full shadow-md transition-transform active:scale-95"
            >
                <Send className="h-5 w-5" />
            </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-3">
            AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}

function UserSelectionDialog({ 
  open, 
  onOpenChange, 
  users, 
  onSelect 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  users: UserData[];
  onSelect: (user: UserData) => void;
}) {
  const [search, setSearch] = useState("");
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.phone.includes(search)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Demo User</DialogTitle>
          <DialogDescription>
            Choose a dummy profile to auto-fill details for the loan application.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or phone..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onSelect(user)}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-medium truncate">{user.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {user.phone}</span>
                    <span>•</span>
                    <span>Credit: {user.creditScore}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                   <div className="h-4 w-4 rounded-full border border-primary"></div>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
