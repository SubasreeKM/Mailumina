import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Clock, 
  Mail,
  User,
  Calendar
} from "lucide-react";
import { Email } from "../data/mockEmails";
import { cn } from "@/lib/utils";

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  const getSentimentColor = (sentiment: Email['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'bg-gradient-success text-positive-foreground';
      case 'negative': return 'bg-gradient-urgent text-negative-foreground';
      case 'neutral': return 'bg-neutral text-neutral-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: Email['priority']) => {
    return priority === 'urgent' ? (
      <AlertTriangle className="h-4 w-4 text-urgent" />
    ) : (
      <Clock className="h-4 w-4 text-muted-foreground" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Support Emails ({emails.length})
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {emails.filter(e => e.priority === 'urgent').length} urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[520px]">
          <div className="space-y-1 p-4">
            {emails.map((email) => (
              <Button
                key={email.id}
                variant="ghost"
                className={cn(
                  "w-full h-auto p-4 justify-start text-left hover:bg-accent/50 transition-colors",
                  selectedEmail.id === email.id && "bg-accent border border-primary/20"
                )}
                onClick={() => onSelectEmail(email)}
              >
                <div className="w-full space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(email.priority)}
                      <Badge 
                        className={cn("text-xs px-2 py-0.5", getSentimentColor(email.sentiment))}
                      >
                        {email.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(email.dateReceived)}
                    </div>
                  </div>

                  {/* Sender */}
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {email.sender}
                    </span>
                  </div>

                  {/* Subject */}
                  <h4 className="font-semibold text-sm text-foreground leading-tight">
                    {truncateText(email.subject, 60)}
                  </h4>

                  {/* Preview */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {truncateText(email.body, 120)}
                  </p>

                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {email.category}
                    </Badge>
                    {email.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">
                        URGENT
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}