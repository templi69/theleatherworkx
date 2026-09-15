import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Artifacts' },
  { id: 'bespoke', label: 'Bespoke Hand-Painted' },
  { id: 'travel', label: 'Travel & Duffles' },
  { id: 'wallets', label: 'Wallets & Cardholders' },
  { id: 'bags', label: 'Executive Bags' },
  { id: 'accessories', label: 'Belts & Cases' },
] as const;

export const ProductList: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }
        // Search query filter
        if (q) {
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchLeather = product.leatherType.toLowerCase().includes(q);
          const matchCat = product.categoryLabel.toLowerCase().includes(q);
          return matchName || matchDesc || matchLeather || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="collection-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E1D9] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#8B5A2B] text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Craftsman Catalog</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1E1915]">
            Curated Leatherwork
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Individually hand-stitched, burnished, and customized with optional foil monogramming.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <SlidersHorizontal className="w-4 h-4 text-stone-500" />
          <span className="text-xs text-stone-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs bg-white border border-[#E2D8CE] rounded-md px-3 py-1.5 text-stone-800 focus:outline-none focus:border-[#8B5A2B]"
          >
            <option value="featured">Featured Artisans</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto py-5 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1E1915] text-[#FAF8F5] shadow-xs'
                  : 'bg-white border border-[#E2D8CE] text-stone-700 hover:border-[#8B5A2B] hover:text-[#8B5A2B]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search status if searching */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between text-xs text-stone-600 bg-[#F5EFEB] px-4 py-2.5 rounded-md">
          <span>
            Showing results for <span className="font-semibold text-stone-900">"{searchQuery}"</span> ({filteredProducts.length} items)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#8B5A2B] font-semibold hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-stone-300">
          <p className="text-sm text-stone-500 mb-2">No leather items found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#8B5A2B] text-white text-xs font-semibold rounded-md hover:bg-[#72451F]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
