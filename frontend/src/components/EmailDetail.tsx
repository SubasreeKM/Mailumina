import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Edit, 
  Copy, 
  User, 
  Calendar, 
  Mail, 
  Phone,
  AlertTriangle,
  Heart,
  Meh,
  Frown,
  FileText,
  Bot
} from "lucide-react";
import { Email } from "../data/mockEmails";
import { useState } from "react";

interface EmailDetailProps {
  email: Email;
}

export function EmailDetail({ email }: EmailDetailProps) {
  const [aiResponse, setAiResponse] = useState(email.aiResponse);
  const [isEditing, setIsEditing] = useState(false);

  const getSentimentIcon = (sentiment: Email['sentiment']) => {
    switch (sentiment) {
      case 'positive': return <Heart className="h-4 w-4 text-positive" />;
      case 'negative': return <Frown className="h-4 w-4 text-negative" />;
      case 'neutral': return <Meh className="h-4 w-4 text-neutral" />;
    }
  };

  const getSentimentColor = (sentiment: Email['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'bg-gradient-success text-positive-foreground';
      case 'negative': return 'bg-gradient-urgent text-negative-foreground';
      case 'neutral': return 'bg-neutral text-neutral-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Email Details
          </CardTitle>
          <div className="flex items-center gap-2">
            {email.priority === 'urgent' && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                URGENT
              </Badge>
            )}
            <Badge className={getSentimentColor(email.sentiment)}>
              {getSentimentIcon(email.sentiment)}
              <span className="ml-1 capitalize">{email.sentiment}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[520px]">
          <div className="p-4 space-y-6">
            {/* Email Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{email.sender}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatDate(email.dateReceived)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{email.subject}</span>
              </div>
              <Badge variant="outline" className="w-fit">
                {email.category}
              </Badge>
            </div>

            <Separator />

            {/* Original Email */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Original Message
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{email.body}</p>
              </div>
            </div>

            <Separator />

            {/* Extracted Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Extracted Information</h3>
              <div className="grid grid-cols-1 gap-3">
                {email.extractedInfo.contactDetails && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{email.extractedInfo.contactDetails}</span>
                  </div>
                )}
                {email.extractedInfo.requirements && (
                  <div>
                    <p className="text-sm font-medium mb-1">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {email.extractedInfo.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {email.extractedInfo.keywords && (
                  <div>
                    <p className="text-sm font-medium mb-1">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {email.extractedInfo.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* AI Generated Response */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  AI Generated Response
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(aiResponse)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={aiResponse}
                    onChange={(e) => setAiResponse(e.target.value)}
                    className="min-h-[150px] resize-none"
                    placeholder="Edit the AI response..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setAiResponse(email.aiResponse);
                      setIsEditing(false);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-3">
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
                <Button variant="outline">
                  Review Later
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}