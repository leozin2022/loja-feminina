
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, Category, SortOption, CartItem } from './types';
import { STEIN_API_URL, CATEGORIES, SHEET_NAME, WHATSAPP_DEFAULT } from './constants';
import ProductCard from './components/ProductCard';
import AdminArea from './components/AdminArea';
import MapSection from './components/MapSection';
import CartDrawer from './components/CartDrawer';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('boutique_auth') === 'true');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('boutique_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setErrorInfo(null);
      const response = await fetch(STEIN_API_URL);
      if (!response.ok) {
        throw new Error(`Erro na conexão com a planilha (Status ${response.status})`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setErrorInfo(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { localStorage.setItem('boutique_cart', JSON.stringify(cart)); }, [cart]);

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const response = await fetch(STEIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([newProduct])
      });
      if (!response.ok) throw new Error("Falha ao salvar produto");
      await fetchProducts();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDeleteProduct = useCallback(async (id: string) => {
    if (!window.confirm("Deseja realmente remover este item?")) return;
    try {
      const response = await fetch(STEIN_API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: { id: id } })
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setCart(prev => prev.filter(p => p.id !== id));
      }
    } catch (error: any) {
      alert(`Erro ao deletar: ${error.message}`);
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const promoProducts = useMemo(() => products.filter(p => p.promocao === 'Sim'), [products]);
  
  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'Todos') {
      result = products.filter(p => p.categoria === activeCategory);
    }
    const parsePrice = (p: any) => {
      if (typeof p === 'number') return p;
      return parseFloat(String(p).replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0;
    };
    if (sortOption === 'price-asc') result.sort((a, b) => parsePrice(a.preco) - parsePrice(b.preco));
    else if (sortOption === 'price-desc') result.sort((a, b) => parsePrice(b.preco) - parsePrice(a.preco));
    return result;
  }, [products, activeCategory, sortOption]);

  const testimonials = [
    { name: "Mariana Silva", comment: "As peças são simplesmente divinas! O atendimento pelo WhatsApp foi impecável.", stars: 5 },
    { name: "Beatriz Costa", comment: "Melhor boutique de Osasco. Comprei um vestido para um evento e todos elogiaram.", stars: 5 },
    { name: "Juliana Mendes", comment: "Entrega super rápida e embalagem muito cheirosa. Virei fã!", stars: 5 },
    { name: "Carla Ferreira", comment: "Qualidade nota 10. As fotos no site são idênticas ao produto real.", stars: 5 },
    { name: "Fernanda Lima", comment: "Amo as promoções do dia! Sempre pego peças incríveis por um preço ótimo.", stars: 5 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* MENU INICIAL ROSA CLARO */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-pink-50/95 backdrop-blur-md shadow-sm h-20 flex items-center border-b border-pink-100">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <h1 className="text-2xl font-serif text-pink-600 tracking-tighter group-hover:scale-105 transition-transform">BOUTIQUE</h1>
            <span className="text-[10px] tracking-[0.4em] text-gray-400 font-bold -mt-1 uppercase">Glamour</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-gray-800 hover:bg-pink-100 rounded-full transition-all active:scale-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {totalItems > 0 && <span className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white">{totalItems}</span>}
            </button>
            <button onClick={() => setIsAdminOpen(true)} className={`text-[10px] font-bold uppercase tracking-widest px-6 py-3 border transition-all rounded-full active:scale-95 ${isAuth ? 'bg-pink-600 text-white border-pink-600 shadow-lg' : 'text-gray-400 border-gray-100 hover:border-pink-200 hover:text-pink-500'}`}>
              {isAuth ? 'Painel' : 'Acesso'}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative h-[50vh] md:h-[60vh] flex items-center bg-black overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-60 animate-ken-burns" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-white reveal-item">
            <span className="text-pink-400 font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Coleção 2024</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-6 italic">Essência & Estilo</h2>
            <button onClick={() => document.getElementById('vitrine')?.scrollIntoView({behavior: 'smooth'})} className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-xl">Ver Vitrine</button>
          </div>
        </section>

        {/* PROMOÇÕES PULSANTES */}
        {!isLoading && promoProducts.length > 0 && activeCategory === 'Todos' && (
          <section className="py-20 bg-pink-50/30 overflow-hidden">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl font-serif text-gray-900 italic mb-10 text-center">Ofertas Especiais</h2>
              <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x">
                {promoProducts.map(product => (
                  <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                    <ProductCard product={product} isAdmin={isAuth} onDelete={handleDeleteProduct} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* VITRINE */}
        <section id="vitrine" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <div className="flex flex-wrap justify-center gap-3">
                {['Todos', ...CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${activeCategory === cat ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:text-pink-500'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <select className="text-[10px] font-bold uppercase bg-transparent border-b border-gray-100 pb-2 outline-none text-gray-500" value={sortOption} onChange={e => setSortOption(e.target.value as any)}>
                <option value="newest">Lançamentos</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>

            {isLoading ? (
              <div className="py-20 text-center animate-pulse text-pink-500 font-bold uppercase text-[10px] tracking-widest">Carregando Peças...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} isAdmin={isAuth} onDelete={handleDeleteProduct} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </section>

        <MapSection />

        {/* DEPOIMENTOS ABAIXO DO MAPA */}
        <section className="py-24 bg-gray-50/50 overflow-hidden">
          <div className="container mx-auto px-6 mb-12 text-center">
            <h2 className="text-4xl font-serif italic mb-2">Feedbacks Reais</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">O que nossas clientes dizem</p>
          </div>
          <div className="relative">
            <div className="animate-marquee">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-[320px] mx-4 p-8 bg-white rounded-2xl border border-pink-100 shadow-sm flex flex-col justify-between">
                  <p className="text-gray-600 italic text-sm leading-relaxed mb-6">"{t.comment}"</p>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-pink-600 font-bold">{t.name}</span>
                    <div className="flex text-yellow-500">
                      {[...Array(t.stars)].map((_, s) => <svg key={s} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RODAPÉ ROSA CLARO */}
        <footer className="bg-pink-100 pt-16 pb-8 border-t border-pink-200">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
            <div>
              <h3 className="text-xl font-serif text-pink-600 italic mb-4">Boutique Glamour</h3>
              <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest leading-loose">Curadoria de luxo acessível em Osasco. Peças selecionadas com amor para mulheres inspiradoras.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-800">Explore</h4>
              {CATEGORIES.slice(0, 4).map(c => <span key={c} className="text-[11px] text-gray-500 font-bold uppercase hover:text-pink-600 cursor-pointer">{c}</span>)}
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-800">Fale Conosco</h4>
              <p className="text-[11px] text-gray-500 font-bold uppercase">WhatsApp: {WHATSAPP_DEFAULT}</p>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <a href={`https://wa.me/${WHATSAPP_DEFAULT}`} target="_blank" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-600 shadow-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.46 14.88l-1.05-1.05c-.18-.18-.45-.22-.67-.1l-.75.4c-.29.15-.64.12-.91-.1l-1.65-1.65c-.22-.27-.25-.62-.1-.91l.4-.75c.13-.22.09-.49-.1-.67l-1.05-1.05c-.27-.27-.72-.27-.99 0l-.82.82c-.44.44-.55 1.1-.28 1.66 1.05 2.15 2.78 3.88 4.93 4.93.56.27 1.22.16 1.66-.28l.82-.82c.28-.27.28-.72 0-.99z"/></svg></a>
              </div>
            </div>
          </div>
          <div className="text-center border-t border-pink-200 pt-8">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">&copy; 2024 Boutique Glamour. Made with Style.</p>
          </div>
        </footer>
      </main>

      <AdminArea isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} products={products} isAuth={isAuth} setIsAuth={(val) => { setIsAuth(val); localStorage.setItem('boutique_auth', val.toString()); }} onLogout={() => { setIsAuth(false); localStorage.removeItem('boutique_auth'); }} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
    </div>
  );
};

export default App;
