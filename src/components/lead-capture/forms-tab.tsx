
'use client';

import { useState } from 'react';
import { StatCard } from './stat-card';
import { FormCard } from './form-card';
import { EmbedCodeModal } from './embed-code-modal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ClipboardList, CheckSquare, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Form {
  id: string;
  name: string;
  type: 'popup' | 'inline' | 'embed' | 'widget';
  status: 'active' | 'paused' | 'draft';
  submissions: number;
  conversionRate: string;
  createdDate: string;
}

const mockForms: Form[] = [
  { id: '1', name: 'Website Contact Form', type: 'embed', status: 'active', submissions: 120, conversionRate: '15.2%', createdDate: '2023-10-01' },
  { id: '2', name: 'Newsletter Signup Popup', type: 'popup', status: 'active', submissions: 98, conversionRate: '22.5%', createdDate: '2023-09-15' },
  { id: '3', name: 'Demo Request Sidebar', type: 'widget', status: 'paused', submissions: 45, conversionRate: '8.1%', createdDate: '2023-08-20' },
  { id: '4', name: 'Feedback Inline Form', type: 'inline', status: 'draft', submissions: 12, conversionRate: '3.7%', createdDate: '2023-10-05' },
];

export function FormsTab() {
  const [forms, setForms] = useState<Form[]>(mockForms);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEmbed = (id: string) => {
    setSelectedFormId(id);
    setIsEmbedModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedFormId(id);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
      if(!selectedFormId) return;
      setForms(forms.filter(f => f.id !== selectedFormId));
      toast({ title: "Form deleted successfully." });
      setIsDeleteModalOpen(false);
      setSelectedFormId(null);
  };

  const handleStatusChange = (id: string, status: 'active' | 'paused') => {
      setForms(forms.map(f => f.id === id ? {...f, status} : f));
  };
  
  const activeForms = forms.filter(f => f.status === 'active').length;
  const draftForms = forms.filter(f => f.status === 'draft').length;
  
  return (
    <div className="space-y-6">
      {selectedFormId && <EmbedCodeModal isOpen={isEmbedModalOpen} onOpenChange={setIsEmbedModalOpen} embedCode={`<iframe src="/forms/${selectedFormId}" width="100%" height="500px" frameborder="0"></iframe>`} />}
      
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the form and all its submissions.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Forms" value={forms.length.toString()} icon={ClipboardList} />
        <StatCard title="Active Forms" value={activeForms.toString()} icon={CheckSquare} />
        <StatCard title="Drafts" value={draftForms.toString()} icon={FileText} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map(form => (
          <FormCard key={form.id} form={form} onEmbed={handleEmbed} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}
