'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, X, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';

interface Product {
  id: string;
  nameKey: string;
  category: 'Window' | 'Door';
  descKey: string;
  features: string[];
  benefits: string[];
  colors: string[];
  sizes: string;
  priceRange: string;
  image: string;
}

const productsData: Product[] = [
  {
    id: 'sliding-window',
    nameKey: 'products.slidingWindows',
    category: 'Window',
    descKey: 'products.slidingWindowsDesc',
    features: ['Smooth rollers', 'Interlocking tracks', 'Dust gaskets', 'Insect screen mesh integrated'],
    benefits: ['Space saving', 'High ventilation control', 'Easy operation', 'Low friction glide'],
    colors: ['White', 'Black', 'Brown', 'Golden Oak (Woodgrain)'],
    sizes: 'Width: 1000mm - 3000mm, Height: 900mm - 2000mm',
    priceRange: '₹6,500 - ₹15,000 per unit',
    image: '/images/after-window.png'
  },
  {
    id: 'casement-window',
    nameKey: 'products.casementWindows',
    category: 'Window',
    descKey: 'products.casementWindowsDesc',
    features: ['Friction hinges', 'Multi-point locks', 'Double EPDM gaskets', 'Outward/Inward swing'],
    benefits: ['95% airflow opening', 'Maximum noise insulation', 'Completely airtight seal', 'High security locks'],
    colors: ['White', 'Black', 'Brown', 'Walnut Woodgrain'],
    sizes: 'Width: 600mm - 1800mm, Height: 600mm - 1800mm',
    priceRange: '₹7,500 - ₹18,000 per unit',
    image: '/images/hero.png'
  },
  {
    id: 'fixed-window',
    nameKey: 'products.fixedWindows',
    category: 'Window',
    descKey: 'products.fixedWindowsDesc',
    features: ['Non-operating sash', 'Heavy structural mullions', 'Direct glazing'],
    benefits: ['Maximum glass view', 'Lowest price option', 'Highest energy efficiency', 'Acoustic seal'],
    colors: ['White', 'Black', 'Brown'],
    sizes: 'Width: 400mm - 2400mm, Height: 400mm - 2400mm',
    priceRange: '₹4,500 - ₹12,000 per unit',
    image: '/images/hero.png'
  },
  {
    id: 'tilt-turn-window',
    nameKey: 'products.tiltTurnWindows',
    category: 'Window',
    descKey: 'products.tiltTurnWindowsDesc',
    features: ['Dual action hardware', 'Tilt inwards for ventilation', 'Swings open 90 degrees'],
    benefits: ['Safe draft-free ventilation', 'Easy inside cleaning', 'Very tight sound seal', 'Premium locking'],
    colors: ['White', 'Black', 'Brown', 'Mahogany Woodgrain'],
    sizes: 'Width: 600mm - 1500mm, Height: 800mm - 1800mm',
    priceRange: '₹9,500 - ₹22,000 per unit',
    image: '/images/hero.png'
  },
  {
    id: 'bay-window',
    nameKey: 'products.bayWindows',
    category: 'Window',
    descKey: 'products.bayWindowsDesc',
    features: ['3 to 5 window panels', 'Custom angled corners (90, 135 deg)', 'Integrated structural posts'],
    benefits: ['Creates additional indoor space', 'Dynamic architectural look', 'Wide panoramic lighting'],
    colors: ['White', 'Black', 'Brown'],
    sizes: 'Custom built based on alcove size',
    priceRange: '₹25,000 - ₹60,000 per unit',
    image: '/images/hero.png'
  },
  {
    id: 'sliding-door',
    nameKey: 'products.slidingDoors',
    category: 'Door',
    descKey: 'products.slidingDoorsDesc',
    features: ['Heavy track profiles', 'Reinforced sash panels', 'Keyed locks', 'Anti-lift tracks'],
    benefits: ['Unblocked views', 'Easy passage for crowds', 'Weatherproof slider sealing', 'Modern sleek style'],
    colors: ['White', 'Black', 'Brown', 'Golden Oak', 'Walnut'],
    sizes: 'Width: 1500mm - 4500mm, Height: 2000mm - 2400mm',
    priceRange: '₹18,000 - ₹45,000 per unit',
    image: '/images/hero.png'
  },
  {
    id: 'french-door',
    nameKey: 'products.frenchDoors',
    category: 'Door',
    descKey: 'products.frenchDoorsDesc',
    features: ['Double door panel assembly', 'Espag multi-lock systems', 'Low threshold step option'],
    benefits: ['Classic elegance', 'Wide double opening width', 'Excellent security seals', 'Ideal for balconies'],
    colors: ['White', 'Black', 'Brown', 'Mahogany'],
    sizes: 'Width: 1200mm - 2200mm, Height: 2000mm - 2400mm',
    priceRange: '₹22,000 - ₹50,000 per unit',
    image: '/images/hero.png'
  },
  {
    id: 'entrance-door',
    nameKey: 'products.entranceDoors',
    category: 'Door',
    descKey: 'products.entranceDoorsDesc',
    features: ['High thickness panels', 'Steel structural reinforcement', 'Decorative glass option', 'Security multi-locks'],
    benefits: ['Stunning entryway aesthetics', 'Maximum impact security', 'Excellent noise dampening', 'Weather leak protection'],
    colors: ['White', 'Black', 'Brown', 'Teak Woodgrain', 'Walnut'],
    sizes: 'Width: 900mm - 1200mm, Height: 2000mm - 2200mm',
    priceRange: '₹28,000 - ₹65,000 per unit',
    image: '/images/hero.png'
  }
];

function ProductsContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Window' | 'Door'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Set initial filters based on URL search query
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat === 'Window' || cat === 'Door') {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  // Filter products based on search term and category
  const filteredProducts = productsData.filter(p => {
    const matchesSearch = t(p.nameKey).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t(p.descKey).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleNavigateToQuote = (styleName: string, productType: string) => {
    setSelectedProduct(null);
    router.push(`/quote?style=${styleName}&type=${productType}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Catalogue</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Our Products Range
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-slate-450">
          Discover uPVC window and door systems designed with durability, sound insulation, and thermal efficiency.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-350 rounded-xl text-sm focus:border-blue-500 focus:outline-none dark:border-slate-650 dark:bg-slate-900"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories filters */}
        <div className="flex w-full md:w-auto items-center justify-center space-x-2">
          {(['All', 'Window', 'Door'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const query = cat === 'All' ? '' : `?category=${cat}`;
                router.replace(`/products${query}`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat === 'All' ? 'All Products' : cat === 'Window' ? t('products.windows') : t('products.doors')}
            </button>
          ))}
        </div>

      </div>

      {/* Products Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="group flex flex-col justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-blue-500/20 transition-all duration-300"
          >
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
              <Image
                src={product.image}
                alt={t(product.nameKey)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-102"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                {product.category === 'Window' ? t('products.windows') : t('products.doors')}
              </span>
            </div>
            
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {t(product.nameKey)}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {t(product.descKey)}
                </p>
                <div className="pt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Estimated range: <span className="text-slate-700 dark:text-slate-300 font-bold">{product.priceRange}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleSelectProduct(product)}
                  className="flex-1 py-3 text-xs font-bold text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 border border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-650 transition-colors"
                >
                  {t('products.viewDetails')}
                </button>
                <button
                  onClick={() => handleNavigateToQuote(t(product.nameKey).split(' ')[0], product.category)}
                  className="flex-1 py-3 text-xs font-bold bg-amber-600 text-white rounded-xl hover:bg-amber-700 shadow-sm transition-colors"
                >
                  {t('products.getQuote')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-8">
          <p className="text-slate-500">No products found matching your search filters.</p>
        </div>
      )}

      {/* Product Details Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white text-slate-850 shadow-2xl dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Product Image */}
              <div className="relative min-h-[250px] md:h-full bg-slate-200">
                <Image
                  src={selectedProduct.image}
                  alt={t(selectedProduct.nameKey)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Product specs */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {selectedProduct.category === 'Window' ? t('products.windows') : t('products.doors')}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t(selectedProduct.nameKey)}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {t(selectedProduct.descKey)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4 dark:border-slate-800">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Sizes</span>
                    <span className="block text-xs font-semibold mt-1 text-slate-700 dark:text-slate-300">{selectedProduct.sizes}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Price Range</span>
                    <span className="block text-xs font-bold mt-1 text-amber-600 dark:text-amber-400">{selectedProduct.priceRange}</span>
                  </div>
                </div>

                {/* Features & Benefits */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Features</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available Frame Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color, idx) => (
                        <span key={idx} className="text-[10px] font-bold border border-slate-350 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => handleNavigateToQuote(t(selectedProduct.nameKey).split(' ')[0], selectedProduct.category)}
                    className="w-full flex items-center justify-center rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-700"
                  >
                    <span>Get Instant Quotation</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-sm text-slate-500">Loading catalogue...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
