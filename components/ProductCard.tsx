
import React from 'react';
import { Product } from '../types';
import { WHATSAPP_DEFAULT } from '../constants';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onAddToCart: (product: Product) => void;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onAddToCart, isAdmin }) => {
  const whatsappLink = product.whatsapp || WHATSAPP_DEFAULT;
  const isPromo = product.promocao === 'Sim';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Olá! Tenho interesse na peça: ${product.nome} (REF: ${product.id})`;
    window.open(`https://wa.me/${whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div 
      className={`group bg-white relative flex flex-col h-full border border-gray-100 transition-all duration-500 rounded-xl overflow-hidden reveal-item ${
        isPromo ? 'animate-promo-card border-pink-100 shadow-pink-50' : 'hover:border-pink-200 hover:shadow-2xl shadow-sm'
      }`}
    >
      {/* Container da Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 hover-shine">
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Camada de Gradiente ao Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {isPromo && (
          <div className="absolute top-4 left-4 bg-pink-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-30 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            OFERTA DO DIA
          </div>
        )}

        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(product.id); }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-red-600 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all z-40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        
        {/* Botões que aparecem no Hover */}
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30 flex flex-col gap-2">
           <button 
             onClick={() => onAddToCart(product)}
             className="w-full bg-white text-black text-[10px] font-bold uppercase tracking-widest py-4 rounded-full hover:bg-pink-600 hover:text-white transition-all transform active:scale-95 shadow-xl"
           >
             Adicionar à Sacola
           </button>
           <button 
             onClick={handleWhatsApp}
             className="w-full bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-green-600 transition-all transform active:scale-95 flex items-center justify-center gap-2"
           >
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
             WhatsApp
           </button>
        </div>
      </div>

      {/* Info do Produto */}
      <div className="py-5 px-4 space-y-1 bg-white">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-black uppercase text-pink-600 tracking-widest bg-pink-50 px-2 py-0.5 rounded-full">{product.categoria}</span>
          <span className="text-[9px] text-gray-300 font-mono">ID:{product.id.slice(-4).toUpperCase()}</span>
        </div>
        <h3 className="font-serif text-xl text-gray-800 leading-tight truncate group-hover:text-pink-600 transition-colors duration-300">{product.nome}</h3>
        <p className="text-gray-400 text-[11px] font-light italic line-clamp-1">{product.subtitulo}</p>
        <div className="pt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 font-serif">R$ {product.preco}</span>
          {isPromo && <span className="text-[10px] text-gray-400 line-through">R$ {(parseFloat(String(product.preco)) * 1.3).toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
