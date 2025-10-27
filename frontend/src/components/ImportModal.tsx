// Arquivo: frontend/src/components/ImportModal.tsx (VERSÃO FINAL E CORRIGIDA)
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FaUpload, FaSpinner, FaDownload, FaFileCsv, FaInfoCircle } from 'react-icons/fa';
import { importData } from '../services/api';

// --- CORREÇÃO APLICADA AQUI ---
// Alteramos os caminhos para serem relativos, o que é mais estável.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
// --- FIM DA CORREÇÃO ---


interface ImportModalProps {
  endpoint: string;
  templateName: string;
  columns: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ endpoint, templateName, columns, isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      if (acceptedFiles[0].type !== 'text/csv' && !acceptedFiles[0].name.endsWith('.csv')) {
        toast.error('Por favor, envie apenas ficheiros .csv');
        return;
      }
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor, selecione um ficheiro CSV.');
      return;
    }
    setIsLoading(true);
    const result = await importData(endpoint, file);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      onSuccess();
      handleClose();
    } else {
      toast.error(result.message);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };
  
  const handleDownloadTemplate = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const token = localStorage.getItem('bibliotech_token');
    const url = `${backendUrl}/api/template/${templateName}`;

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => {
      if (!res.ok) throw new Error('Não foi possível baixar o modelo.');
      return res.blob();
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `modelo_${templateName}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    })
    .catch(err => {
      console.error(err);
      toast.error('Falha ao baixar o modelo. Verifique se está logado.');
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Importar Planilha</DialogTitle>
          <DialogDescription>
            Faça o upload de um ficheiro CSV para adicionar múltiplos registos de uma só vez.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <FaUpload className="text-4xl text-gray-400 mb-3" />
              {file ? (
                <p className="text-green-600 font-semibold">{file.name}</p>
              ) : (
                <p className="text-gray-500">
                  {isDragActive ? 'Solte o ficheiro aqui...' : 'Arraste e solte o ficheiro ou clique para selecionar'}
                </p>
              )}
            </div>
          </div>

          <div className="text-center">
            <Button variant="link" onClick={handleDownloadTemplate} className="text-blue-600">
              <FaDownload className="mr-2" />
              Baixe a planilha modelo
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" />
              Colunas da planilha que serão importadas:
            </h3>
            <div className="flex flex-wrap gap-2">
              {columns.map(col => (
                <span key={col} className="bg-gray-200 text-gray-700 text-xs font-mono py-1 px-2 rounded">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isLoading || !file}>
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaFileCsv className="mr-2" />}
            {isLoading ? 'Importando...' : 'Importar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;