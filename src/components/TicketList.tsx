import { useState } from 'react';
import { Ticket } from './TicketForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Calendar, Clock, User, AlertCircle, Search, Filter } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  userRole: 'client' | 'it-executive';
  userEmail: string;
  onTicketSelect: (ticket: Ticket) => void;
  onStatusUpdate: (ticketId: string, status: Ticket['status']) => void;
  onAssignTicket: (ticketId: string, assignee: string) => void;
}

export function TicketList({ 
  tickets, 
  userRole, 
  userEmail, 
  onTicketSelect, 
  onStatusUpdate, 
  onAssignTicket 
}: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');


  const filteredTickets = tickets.filter(ticket => {
  
    if (userRole === 'client' && ticket.submittedBy !== userEmail) {
      return false;
    }


    if (searchTerm && !ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }


    if (statusFilter !== 'all' && ticket.status !== statusFilter) {
      return false;
    }

  
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

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
    return new Intl.DateTimeFormat('PT-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const itExecutives = ['john.doe@company.com', 'jane.smith@company.com', 'mike.wilson@company.com'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros & Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar chamados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas Prioridades" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Todas Prioridades</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredTickets.length} chamado{filteredTickets.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="mb-2">Não encontramos nenhum chamado</h3>
              <p className="text-gray-500">
                {userRole === 'client' 
           ? 'Voc\u00ea ainda não enviou nenhum chamado.' 
           : 'Nenhum chamado corresponde aos filtros atuais.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => onTicketSelect(ticket)}>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {userRole === 'it-executive' ? ticket.submittedBy : 'Você'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(ticket.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Atualizado {formatDate(ticket.updatedAt)}
                      </div>
                      {ticket.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Designado para {ticket.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {userRole === 'it-executive' && (
                    <div className="flex gap-2 ml-4">
                      <Select
                        value={ticket.status}
                        onValueChange={(value: Ticket['status']) => onStatusUpdate(ticket.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Aberto</SelectItem>
                          <SelectItem value="in-progress">Em Progresso</SelectItem>
                          <SelectItem value="resolved">Resolvido</SelectItem>
                          <SelectItem value="closed">Fechado</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {!ticket.assignedTo && (
                        <Select onValueChange={(value) => onAssignTicket(ticket.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Atribuir" />
                            </SelectTrigger>
                          <SelectContent>
                            {itExecutives.map((exec) => (
                              <SelectItem key={exec} value={exec}>
                                {exec.split('@')[0]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}