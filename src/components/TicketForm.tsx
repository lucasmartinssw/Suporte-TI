import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Plus } from 'lucide-react';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  // internal values use english to match App mock data
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  submittedBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    isInternal: boolean;
  }>;
}

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  userEmail: string;
}

export function TicketForm({ onSubmit, userEmail }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState('');

  const categories = [
    'Hardware',
    'Software',
    'Conexão com Internet',
    'Acessos',
    'Sistemas',
    'Segurança',
    'Impressora',
    'Telefone/Celular',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      submittedBy: userEmail
    });

    // Reset form
    setTitle('');
    setDescription('');
  setPriority('medium');
    setCategory('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Envie um novo chamado para a equipe de TI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Breve Descrição #</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descreva brevemente a sua demanda"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria #</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade #</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Baixo
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Médio
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Alto
                    </span>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      Urgente
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição #</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição detalhada da sua demanda"
              rows={6}
              required
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              Por favor, descreva sua demanda de forma clara e forneça as informações relevantes.
            </p>
          </div>

          <Button type="submit" className="w-full">
            Enviar chamado
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}