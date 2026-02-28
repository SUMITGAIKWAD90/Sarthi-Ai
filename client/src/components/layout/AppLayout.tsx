import { Link, useLocation } from "wouter";
import { useUser } from "@/context/UserContext";
import { 
  Users, 
  MessageSquareText, 
  Calculator, 
  CheckCircle2, 
  Home,
  Plus,
  User,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/lib/dummyData";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { users, selectedUser, selectUser, addUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Chat Assistant", icon: MessageSquareText, path: "/chat" },
    { label: "Eligibility Check", icon: CheckCircle2, path: "/eligibility" },
    { label: "EMI Calculator", icon: Calculator, path: "/calculator" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src="/attached_assets/Gemini_Generated_Image_qi1alqqi1alqqi1a_1765981525562.png" 
            alt="TataSaarthi" 
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">AI Financial Guide</p>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-hidden">
        <div className="mb-6 shrink-0">
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </h3>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div 
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${location === item.path 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 flex items-center justify-between mb-2 shrink-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dummy Users ({users.length})
            </h3>
            <AddUserDialog />
          </div>
          
          <ScrollArea className="flex-1 pr-3 h-full">
            <div className="space-y-1 px-1 pb-4">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    selectUser(user);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left flex items-start gap-3 px-3 py-3 rounded-md text-sm transition-all border
                    ${selectedUser?.id === user.id 
                      ? "bg-sidebar-accent border-primary/20 shadow-sm" 
                      : "border-transparent hover:bg-sidebar-accent/50"}
                  `}
                >
                  <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center shrink-0
                    ${selectedUser?.id === user.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                  `}>
                    <User className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-medium truncate ${selectedUser?.id === user.id ? "text-primary" : "text-foreground"}`}>
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Credit: {user.creditScore}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                      <span>{user.city}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-muted-foreground">System Operational</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 shrink-0 h-full border-r border-sidebar-border bg-sidebar shadow-sm z-20">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-background z-10">
          <div className="flex items-center gap-2">
            <img 
              src="/attached_assets/Gemini_Generated_Image_qi1alqqi1alqqi1a_1765981525562.png" 
              alt="TataSaarthi" 
              className="h-8 w-auto"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function AddUserDialog() {
  const { addUser } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: "",
    age: 25,
    phone: "",
    city: "",
    creditScore: 750,
    preApprovedLimit: 100000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newUser: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      age: Number(formData.age),
      phone: formData.phone!,
      city: formData.city || "Unknown",
      creditScore: Number(formData.creditScore),
      kycStatus: "Verified",
      preApprovedLimit: Number(formData.preApprovedLimit),
      existingLoan: 0
    };

    addUser(newUser);
    toast({
      title: "User Added",
      description: `${newUser.name} has been added to the system.`,
    });
    setOpen(false);
    setFormData({
      name: "",
      age: 25,
      phone: "",
      city: "",
      creditScore: 750,
      preApprovedLimit: 100000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Dummy User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="col-span-3" 
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input 
              id="phone" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="col-span-3" 
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">City</Label>
            <Input 
              id="city" 
              value={formData.city} 
              onChange={e => setFormData({...formData, city: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">Age</Label>
            <Input 
              id="age" 
              type="number"
              value={formData.age} 
              onChange={e => setFormData({...formData, age: Number(e.target.value)})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="credit" className="text-right">Credit Score</Label>
            <Input 
              id="credit" 
              type="number"
              max={900}
              value={formData.creditScore} 
              onChange={e => setFormData({...formData, creditScore: Number(e.target.value)})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="limit" className="text-right">Pre-Approved</Label>
            <Input 
              id="limit" 
              type="number"
              value={formData.preApprovedLimit} 
              onChange={e => setFormData({...formData, preApprovedLimit: Number(e.target.value)})}
              className="col-span-3" 
            />
          </div>
          <Button type="submit" className="ml-auto">Add User</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
