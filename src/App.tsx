import { useState, useEffect } from 'react';
import { TicketForm, Ticket } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Ticket as TicketIcon,
  Settings, 
  Plus, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function App() {
  const [userRole, setUserRole] = useState<'client' | 'it-executive'>('client');
  const [userEmail, setUserEmail] = useState('user@company.com');
  const [activeView, setActiveView] = useState<'dashboard' | 'tickets' | 'submit' | 'detail'>('dashboard');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Computer won\'t start after Windows update',
        description: 'After the latest Windows update last night, my computer shows a blue screen on startup. I\'ve tried restarting multiple times but the issue persists. Error code: 0x0000007B',
        priority: 'high',
        category: 'Hardware Issues',
        status: 'open',
        submittedBy: 'user@company.com',
        assignedTo: 'john.doe@company.com',
        createdAt: new Date('2024-01-15T09:30:00'),
        updatedAt: new Date('2024-01-15T10:15:00'),
        comments: [
          {
            id: '1',
            author: 'john.doe@company.com',
            content: 'Thanks for reporting this. I\'ll investigate the Windows update compatibility issue. Can you please tell me the exact model of your computer?',
            timestamp: new Date('2024-01-15T10:15:00'),
            isInternal: false
          },
          {
            id: '2',
            author: 'john.doe@company.com',
            content: 'This looks like a driver compatibility issue. Will need to boot from recovery.',
            timestamp: new Date('2024-01-15T10:20:00'),
            isInternal: true
          }
        ]
      },
      {
        id: '2',
        title: 'Unable to access shared network drive',
        description: 'I can\'t access the \\\\server\\shared folder. Getting "Network path not found" error. This worked fine yesterday.',
        priority: 'medium',
        category: 'Network Connectivity',
        status: 'in-progress',
        submittedBy: 'alice.johnson@company.com',
        assignedTo: 'jane.smith@company.com',
        createdAt: new Date('2024-01-14T14:20:00'),
        updatedAt: new Date('2024-01-15T08:45:00'),
        comments: [
          {
            id: '3',
            author: 'jane.smith@company.com',
            content: 'Working on this issue. The network drive permissions have been reset. Should be resolved within the hour.',
            timestamp: new Date('2024-01-15T08:45:00'),
            isInternal: false
          }
        ]
      },
      {
        id: '3',
        title: 'Printer not responding',
        description: 'The HP LaserJet in the office is not printing. The jobs go to queue but nothing comes out.',
        priority: 'low',
        category: 'Printer/Scanner',
        status: 'resolved',
        submittedBy: 'bob.wilson@company.com',
        assignedTo: 'mike.wilson@company.com',
        createdAt: new Date('2024-01-13T11:00:00'),
        updatedAt: new Date('2024-01-14T16:30:00'),
        comments: [
          {
            id: '4',
            author: 'mike.wilson@company.com',
            content: 'Fixed! The printer was out of toner. Replaced the cartridge and cleared the queue.',
            timestamp: new Date('2024-01-14T16:30:00'),
            isInternal: false
          }
        ]
      }
    ];
    setTickets(mockTickets);
  }, []);

  const handleSubmitTicket = (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    
    setTickets(prev => [newTicket, ...prev]);
    setActiveView('tickets');
    toast.success('Chamado enviado com sucesso!');
  };

  const handleStatusUpdate = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status, updatedAt: new Date() }
        : ticket
    ));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status, updatedAt: new Date() } : null);
    }
    
    toast.success(`Status do chamado atualizado para ${status.replace('-', ' ')}`);
  };

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, assignedTo: assignee, updatedAt: new Date() }
        : ticket
    ));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, assignedTo: assignee, updatedAt: new Date() } : null);
    }
    
    toast.success(`Chamado designado para ${assignee.split('@')[0]}`);
  };

  const handleAddComment = (ticketId: string, comment: string, isInternal: boolean) => {
    const newComment = {
      id: Date.now().toString(),
      author: userEmail,
      content: comment,
      timestamp: new Date(),
      isInternal
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            comments: [...ticket.comments, newComment],
            updatedAt: new Date()
          }
        : ticket
    ));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment],
        updatedAt: new Date()
      } : null);
    }
    
    toast.success('Comentario adicionado com sucesso!');
  };

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setActiveView('detail');
  };

  // Dashboard stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    myTickets: userRole === 'client' ? tickets.filter(t => t.submittedBy === userEmail).length : tickets.filter(t => t.assignedTo === userEmail).length
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-gray-600">
            {userRole === 'client' ? 'Enviado e direcionado para a equipe de TI' : 'Suas solicitações atribuídas e status geral'}
          </p>
        </div>
                {userRole === 'client' && (
                  <Button onClick={() => setActiveView('submit')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Chamado
                  </Button>
                )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de chamados</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aberto</p>
              <p className="text-2xl font-semibold">{stats.open}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Em progresso</p>
              <p className="text-2xl font-semibold">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolvido</p>
              <p className="text-2xl font-semibold">{stats.resolved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
            <CardHeader>
          <CardTitle>
            {userRole === 'client' ? 'Seus Chamados Recentes' : 'Chamados Recentes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.slice(0, 5).map((ticket) => (
            <div 
              key={ticket.id} 
              className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
              onClick={() => handleTicketSelect(ticket)}
            >
              <div className="flex-1">
                <h4 className="font-medium">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">
                    {userRole === 'it-executive' ? `Enviado por ${ticket.submittedBy}` : `Categoria: ${ticket.category}`}
                  </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                  ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                  ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                  {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in-progress' ? 'Em progresso' : ticket.status === 'resolved' ? 'Resolvido' : ticket.status.replace('-', ' ')}
                </Badge>
                <Badge className={`${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                  ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                  {ticket.priority === 'urgent' ? 'Urgente' : ticket.priority === 'high' ? 'Alto' : ticket.priority === 'medium' ? 'Médio' : 'Baixo'}
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setActiveView('tickets')}>
              Todos os Chamados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TicketIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-semibold">Suporte TI</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <Button 
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeView === 'tickets' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('tickets')}
                >
                  Todos Chamados
                </Button>
                {userRole === 'client' && (
                  <Button 
                    variant={activeView === 'submit' ? 'default' : 'ghost'}
                    onClick={() => setActiveView('submit')}
                  >
                    Enviar Chamado
                  </Button>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Select value={userRole} onValueChange={(value: 'client' | 'it-executive') => setUserRole(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="it-executive">Analista-TI</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={userEmail} onValueChange={setUserEmail}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user@company.com">user@company.com</SelectItem>
                  <SelectItem value="alice.johnson@company.com">alice.johnson@company.com</SelectItem>
                  <SelectItem value="bob.wilson@company.com">bob.wilson@company.com</SelectItem>
                  <SelectItem value="john.doe@company.com">john.doe@company.com</SelectItem>
                  <SelectItem value="jane.smith@company.com">jane.smith@company.com</SelectItem>
                  <SelectItem value="mike.wilson@company.com">mike.wilson@company.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && renderDashboard()}
        
        {activeView === 'tickets' && (
          <div className="space-y-6">
            <h1>Todos os Chamados</h1>
            <TicketList
              tickets={tickets}
              userRole={userRole}
              userEmail={userEmail}
              onTicketSelect={handleTicketSelect}
              onStatusUpdate={handleStatusUpdate}
              onAssignTicket={handleAssignTicket}
            />
          </div>
        )}
        
        {activeView === 'submit' && userRole === 'client' && (
          <div className="space-y-6">
            <h1>Enviar Novo Chamado</h1>
            <div className="flex justify-center">
              <TicketForm onSubmit={handleSubmitTicket} userEmail={userEmail} />
            </div>
          </div>
        )}
        
        {activeView === 'detail' && selectedTicket && (
          <TicketDetail
            ticket={selectedTicket}
            userRole={userRole}
            userEmail={userEmail}
            onBack={() => setActiveView('tickets')}
            onAddComment={handleAddComment}
            onStatusUpdate={handleStatusUpdate}
            onAssignTicket={handleAssignTicket}
          />
        )}
      </main>
    </div>
  );
}