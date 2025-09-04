import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Filter,
  Send,
  Eye,
  MessageSquare
} from "lucide-react";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { AnalyticsCards } from "./AnalyticsCards";
import { mockEmails } from "../data/mockEmails";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export function Dashboard() {
  const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredEmails = mockEmails.filter(email => {
    if (activeFilter === "all") return true;
    if (activeFilter === "urgent") return email.priority === "urgent";
    if (activeFilter === "positive") return email.sentiment === "positive";
    if (activeFilter === "negative") return email.sentiment === "negative";
    if (activeFilter === "neutral") return email.sentiment === "neutral";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Communication Assistant</h1>
                <p className="text-muted-foreground">Intelligent email management and response system</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
              <Button variant="default" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Responses
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-32 overflow-hidden">
        <img 
          src={dashboardHero} 
          alt="AI Dashboard Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h2 className="text-xl font-semibold mb-1">Support Email Intelligence</h2>
            <p className="text-primary-foreground/80">AI-powered prioritization and response generation</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Analytics Section */}
          <div className="lg:col-span-4">
            <AnalyticsCards emails={mockEmails} />
          </div>

          {/* Email Management */}
          <div className="lg:col-span-4">
            <Tabs defaultValue="inbox" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-auto grid-cols-3">
                  <TabsTrigger value="inbox">
                    <Mail className="h-4 w-4 mr-2" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="processed">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Processed
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={activeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeFilter === "urgent" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("urgent")}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Urgent
                  </Button>
                  <Button
                    variant={activeFilter === "positive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("positive")}
                  >
                    Positive
                  </Button>
                  <Button
                    variant={activeFilter === "negative" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("negative")}
                  >
                    Negative
                  </Button>
                </div>
              </div>

              <TabsContent value="inbox" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EmailList 
                    emails={filteredEmails}
                    selectedEmail={selectedEmail}
                    onSelectEmail={setSelectedEmail}
                  />
                  <EmailDetail email={selectedEmail} />
                </div>
              </TabsContent>

              <TabsContent value="processed">
                <Card>
                  <CardHeader>
                    <CardTitle>Processed Emails</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">No processed emails to review at the moment.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Average Response Time</span>
                          <span className="font-semibold">2.3 minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Accuracy Score</span>
                          <span className="font-semibold text-success">94%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Customer Satisfaction</span>
                          <span className="font-semibold text-success">4.8/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-success/10 rounded-lg">
                          <p className="text-sm text-success-foreground font-medium">✓ Response quality improved by 23%</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm text-primary font-medium">📈 Processing speed increased by 45%</p>
                        </div>
                        <div className="p-3 bg-warning/10 rounded-lg">
                          <p className="text-sm text-warning-foreground font-medium">⚡ Peak hours: 9-11 AM, 2-4 PM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}