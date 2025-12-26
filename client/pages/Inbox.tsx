import { useState, useEffect } from 'react';
import { useAPI } from '@/hooks/useAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Package, User } from 'lucide-react';

interface Conversation {
  id: string;
  conversationId?: string;
  type: 'rental' | 'inquiry';
  otherUser: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  item: {
    _id: string;
    title: string;
    images: string[];
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
    senderId: string;
  } | null;
  updatedAt: string;
}

export default function Inbox() {
  const { api } = useAPI();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [api]);

  const handleConversationClick = (conv: Conversation) => {
    if (conv.type === 'rental') {
      navigate(`/lending/${conv.id}/chat`);
    } else {
      // For inquiries, we go to the item contact page, but we need to specify who we are talking to
      // if we are the owner. The backend handles this via query param.
      navigate(`/items/${conv.item._id}/contact?userId=${conv.otherUser._id}`);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      {conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No messages yet</h3>
            <p className="text-muted-foreground">
              When you contact item owners or receive inquiries, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <Card 
              key={conv.conversationId || conv.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleConversationClick(conv)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.otherUser.profileImage} />
                    <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold truncate">{conv.otherUser.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Package className="h-3 w-3 mr-1" />
                          <span className="truncate">{conv.item.title}</span>
                          {conv.type === 'rental' && (
                            <Badge variant="secondary" className="ml-2 text-xs">Rental</Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {conv.lastMessage?.createdAt && formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
