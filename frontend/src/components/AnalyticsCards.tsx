import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Heart,
  Frown,
  Meh,
  CheckCircle,
  Users,
  Zap
} from "lucide-react";
import { Email } from "../data/mockEmails";

interface AnalyticsCardsProps {
  emails: Email[];
}

export function AnalyticsCards({ emails }: AnalyticsCardsProps) {
  const totalEmails = emails.length;
  const urgentEmails = emails.filter(e => e.priority === 'urgent').length;
  const positiveEmails = emails.filter(e => e.sentiment === 'positive').length;
  const negativeEmails = emails.filter(e => e.sentiment === 'negative').length;
  const neutralEmails = emails.filter(e => e.sentiment === 'neutral').length;
  const processedEmails = emails.filter(e => e.status === 'processed').length;

  const urgencyPercentage = Math.round((urgentEmails / totalEmails) * 100);
  const positivePercentage = Math.round((positiveEmails / totalEmails) * 100);
  const negativePercentage = Math.round((negativeEmails / totalEmails) * 100);
  const neutralPercentage = Math.round((neutralEmails / totalEmails) * 100);

  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);
  const emailsLast24h = emails.filter(e => new Date(e.dateReceived) > last24Hours).length;

  const analyticsData = [
    {
      title: "Total Emails",
      value: totalEmails,
      description: "In the last 24 hours",
      icon: Mail,
      gradient: "bg-gradient-primary",
      textColor: "text-primary-foreground"
    },
    {
      title: "Urgent Priority",
      value: urgentEmails,
      description: `${urgencyPercentage}% of total emails`,
      icon: AlertTriangle,
      gradient: "bg-gradient-urgent",
      textColor: "text-urgent-foreground"
    },
    {
      title: "Positive Sentiment",
      value: positiveEmails,
      description: `${positivePercentage}% satisfaction rate`,
      icon: Heart,
      gradient: "bg-gradient-success",
      textColor: "text-positive-foreground"
    },
    {
      title: "Processing Speed",
      value: "2.3m",
      description: "Average response time",
      icon: Zap,
      gradient: "bg-gradient-primary",
      textColor: "text-primary-foreground"
    }
  ];

  const sentimentData = [
    {
      label: "Positive",
      count: positiveEmails,
      percentage: positivePercentage,
      icon: Heart,
      color: "text-positive",
      bgColor: "bg-positive/10"
    },
    {
      label: "Negative", 
      count: negativeEmails,
      percentage: negativePercentage,
      icon: Frown,
      color: "text-negative",
      bgColor: "bg-negative/10"
    },
    {
      label: "Neutral",
      count: neutralEmails,
      percentage: neutralPercentage,
      icon: Meh,
      color: "text-neutral",
      bgColor: "bg-neutral/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((item, index) => (
          <Card key={index} className="relative overflow-hidden shadow-card">
            <div className={`absolute inset-0 ${item.gradient} opacity-10`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg ${item.gradient} flex items-center justify-center`}>
                <item.icon className={`h-4 w-4 ${item.textColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sentimentData.map((sentiment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sentiment.bgColor}`}>
                    <sentiment.icon className={`h-4 w-4 ${sentiment.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sentiment.label}</p>
                    <p className="text-xs text-muted-foreground">{sentiment.count} emails</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {sentiment.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Response Time</p>
                  <p className="text-xs text-muted-foreground">Average processing</p>
                </div>
              </div>
              <Badge className="bg-gradient-primary text-primary-foreground">2.3 min</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Resolution Rate</p>
                  <p className="text-xs text-muted-foreground">Successfully resolved</p>
                </div>
              </div>
              <Badge className="bg-gradient-success text-success-foreground">94%</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Urgent Cases</p>
                  <p className="text-xs text-muted-foreground">High priority emails</p>
                </div>
              </div>
              <Badge className="bg-gradient-warning text-warning-foreground">{urgentEmails}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Today's Volume</p>
                  <p className="text-xs text-muted-foreground">Emails received</p>
                </div>
              </div>
              <Badge variant="secondary">{emailsLast24h}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}