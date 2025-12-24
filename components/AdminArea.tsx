
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES, WHATSAPP_DEFAULT } from '../constants';

interface AdminAreaProps {
  onAddProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (id: string) => void;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  isAuth: boolean;
  setIsAuth: (val: boolean) => void;
  onLogout: () => void;
}

const AdminArea: React.FC<AdminAreaProps> = ({ 
  onAddProduct, 
  onDeleteProduct, 
  products, 
  isOpen, 
  onClose, 
  isAuth, 
  setIsAuth, 
  onLogout 
}) => {
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    subtitulo: '',
    preco: '',
    categoria: 'Vestidos' as Category,
    imagem: '',
    whatsapp: '',
    promocao: false
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '220611') {
      setIsAuth(true);
      setPassword('');
    } else {
      alert('Senha incorreta.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData(prev => ({ ...prev, imagem: dataUrl }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imagem) return alert('Selecione uma imagem para o produto.');
    
    setIsProcessing(true);
    try {
      const newId = `REF-${Date.now()}`;
      // Aqui enviamos "Sim" ou "Não" para a sua coluna 'promocao' na planilha
      await onAddProduct({
        id: newId,
        nome: formData.nome,
        subtitulo: formData.subtitulo,
        preco: formData.preco,
        categoria: formData.categoria,
        imagem: formData.imagem,
        whatsapp: formData.whatsapp || WHATSAPP_DEFAULT,
        promocao: formData.promocao ? 'Sim' : 'Não'
      });
      // Limpa o formulário após o sucesso
      setFormData({ nome: '', subtitulo: '', preco: '', categoria: 'Vestidos', imagem: '', whatsapp: '', promocao: false });
      alert("Produto cadastrado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar na planilha. Verifique a conexão.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header do Modal */}
        <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-serif text-gray-800">{isAuth ? 'Gerenciar Boutique' : 'Acesso Restrito'}</h2>
            <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest">Controle de Estoque via Stein API</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {!isAuth ? (
          <div className="flex-grow flex items-center justify-center bg-gray-50">
            <form onSubmit={handleLogin} className="w-full max-w-xs p-8 bg-white rounded-xl shadow-lg space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Digite sua senha</p>
              </div>
              <input 
                type="password"
                placeholder="••••••"
                className="w-full border-b-2 py-3 text-center text-3xl outline-none focus:border-pink-500 transition-all tracking-widest"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-pink-600 transition-all rounded-lg">Entrar no Painel</button>
            </form>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Coluna de Cadastro */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b pb-4">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">01</span>
                <h3 className="text-sm font-bold uppercase text-gray-800 tracking-widest">Novo Produto</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Informações Básicas</label>
                  <input required type="text" placeholder="Ex: Vestido Midi Floral" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 ring-pink-100 outline-none" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                  <input required type="text" placeholder="Ex: Tecido crepe com forro" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 ring-pink-100 outline-none" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Preço (R$)</label>
                    <input required type="text" placeholder="149.90" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 ring-pink-100 outline-none" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Categoria</label>
                    <select className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 ring-pink-100 outline-none appearance-none bg-white" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value as any})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* CAMPO DE PROMOÇÃO EM DESTAQUE */}
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.promocao ? 'bg-pink-50 border-pink-200 shadow-inner' : 'bg-gray-50 border-gray-100'}`} onClick={() => setFormData({...formData, promocao: !formData.promocao})}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.promocao ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" /></svg>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-tight ${formData.promocao ? 'text-pink-700' : 'text-gray-500'}`}>Promoção do Dia</p>
                      <p className="text-[10px] text-gray-400">Aparecerá na sessão de ofertas</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.promocao ? 'bg-pink-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.promocao ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Mídia do Produto</label>
                   <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-pink-50 transition-all group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-up" />
                    <label htmlFor="file-up" className="cursor-pointer block">
                      {formData.imagem ? (
                        <div className="flex flex-col items-center">
                          <img src={formData.imagem} className="w-24 h-32 object-cover mb-3 rounded-lg shadow-md border-2 border-white" />
                          <span className="text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">✓ IMAGEM PRONTA</span>
                        </div>
                      ) : (
                        <div className="py-4 space-y-2">
                          <div className="w-12 h-12 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto group-hover:bg-pink-100 group-hover:text-pink-400 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Adicionar Foto</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button 
                  disabled={isProcessing}
                  type="submit" 
                  className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all ${
                    isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-black active:scale-95'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sincronizando Planilha...
                    </span>
                  ) : 'Publicar na Loja'}
                </button>
              </form>
            </div>

            {/* Coluna da Lista Atual */}
            <div className="space-y-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">02</span>
                  <h3 className="text-sm font-bold uppercase text-gray-800 tracking-widest">Estoque Atual</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">{products.length} itens</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {products.length === 0 ? (
                  <div className="text-center py-20 text-gray-300 italic text-sm">Nenhum item cadastrado.</div>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl group hover:shadow-md transition-all">
                      <div className="relative">
                        <img src={p.imagem} className="w-12 h-16 object-cover rounded-lg" />
                        {p.promocao === 'Sim' && (
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-serif text-gray-800 truncate">{p.nome}</p>
                        <div className="flex gap-2 items-center">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">REF: {p.id.slice(-6)}</p>
                          {p.promocao === 'Sim' && (
                            <span className="text-[8px] bg-pink-100 text-pink-600 px-2 py-0.5 font-bold rounded uppercase">Promo</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">R$ {p.preco}</p>
                      </div>
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                        title="Remover da planilha"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="pt-4 space-y-3">
                <button onClick={onLogout} className="w-full py-3 border border-red-200 text-red-500 text-[10px] font-bold uppercase hover:bg-red-50 transition-all rounded-xl">Finalizar Sessão Admin</button>
                <p className="text-[8px] text-gray-300 text-center uppercase tracking-widest font-bold">As alterações são permanentes no Google Sheets</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArea;
