import { useState } from 'react';
import { Ticket } from './TicketForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, MessageSquare, Calendar, User, Tag, AlertCircle, Send } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  userRole: 'client' | 'it-executive';
  userEmail: string;
  onBack: () => void;
  onAddComment: (ticketId: string, comment: string, isInternal: boolean) => void;
  onStatusUpdate: (ticketId: string, status: Ticket['status']) => void;
  onAssignTicket: (ticketId: string, assignee: string) => void;
}

export function TicketDetail({ 
  ticket, 
  userRole, 
  userEmail, 
  onBack, 
  onAddComment, 
  onStatusUpdate, 
  onAssignTicket 
}: TicketDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment(ticket.id, newComment.trim(), isInternalComment);
    setNewComment('');
    setIsInternalComment(false);
  };

  const itExecutives = ['john.doe@company.com', 'jane.smith@company.com', 'mike.wilson@company.com'];

  // Filter comments based on user role
  const visibleComments = ticket.comments.filter(comment => {
    if (userRole === 'it-executive') return true; // IT executives see all comments
    return !comment.isInternal; // Clients only see public comments
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos chamados
        </Button>
        <div className="flex-1">
          <h1 className="mb-2">{ticket.title}</h1>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.replace('-', ' ')}
            </Badge>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comentários ({visibleComments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {visibleComments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum comentário registrado no momento</p>
              ) : (
                visibleComments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{comment.author}</span>
                        {comment.isInternal && userRole === 'it-executive' && (
                          <Badge variant="secondary" className="text-xs">Interno</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              )}

              <div className="border-t pt-4">
                <div className="space-y-3">
          <Textarea
            placeholder="Adicionar comentários..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {userRole === 'it-executive' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternalComment}
                            onChange={(e) => setIsInternalComment(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Comentario Interno (visivel apenas para o TI)</span>
                        </label>
                      )}
                    </div>
                    
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Adicionar comentário
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Chamado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Categoria:</span>
                <span>{ticket.category}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Enviado por:</span>
                <span>{ticket.submittedBy}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Criado em:</span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Atualizado em:</span>
                <span>{formatDate(ticket.updatedAt)}</span>
              </div>
              
              {ticket.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Designado para:</span>
                  <span>{ticket.assignedTo}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {userRole === 'it-executive' && (
            <Card>
              <CardHeader>
                <CardTitle>Atividades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={ticket.status}
                    onValueChange={(value: Ticket['status']) => onStatusUpdate(ticket.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in-progress">Em Progresso</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!ticket.assignedTo && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Designado para</label>
                    <Select onValueChange={(value) => onAssignTicket(ticket.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {itExecutives.map((exec) => (
                          <SelectItem key={exec} value={exec}>
                            {exec.split('@')[0]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {userRole === 'client' && (
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Necessita de ajuda urgente?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Se precisar de ajuda urgente, entre em contato diretamente com o TI suporteTi@email.com.br!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}