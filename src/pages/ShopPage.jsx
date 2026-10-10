import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crown, Sparkles, Filter, ChevronDown, Check, Search, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useShop();

  const categoryParam = searchParams.get('cat') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState(searchParam);

  // Sync state if url changes
  React.useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tamilName && p.tamilName.includes(searchQuery)) ||
        (p.sanskritName && p.sanskritName.includes(searchQuery)) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ padding: '4rem 0 6rem 0', background: 'var(--color-ivory)' }}>
      <div className="mn-container">
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <div className="mn-section-ornament">
            <span className="mn-ornament-line" />
            <Crown size={18} color="#c5a15b" />
            <span className="mn-ornament-line" />
          </div>
          <span className="mn-section-subtitle">The Royal Apothecary</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--color-deep-brown)', marginBottom: '0.6rem' }}>
            All Ayurvedic Formulations
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-brown-muted)' }}>
            Each botanical grain, tailam, and wild honey is prepared following classical Ayurvedic principles with zero chemical adulteration.
          </p>
        </div>

        {/* Filter & Sorting Controls */}
        <div style={{
          background: 'var(--color-ivory-pure)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem 1.8rem',
          boxShadow: 'var(--shadow-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.2rem'
        }}>
          
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-burgundy)', letterSpacing: '0.5px', marginRight: '6px' }}>
              Collection:
            </span>
            {categories.map(c => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: `1.5px solid ${isActive ? 'var(--color-gold)' : 'var(--border-ivory)'}`,
                    background: isActive ? 'var(--color-burgundy)' : '#ffffff',
                    color: isActive ? 'var(--color-ivory-pure)' : 'var(--color-deep-brown)',
                    boxShadow: isActive ? '0 2px 8px rgba(114, 47, 55, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Right Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-brown-muted)' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-gold)',
                background: '#ffffff',
                color: 'var(--color-deep-brown)',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="recommended">Curated / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated by Patrons</option>
            </select>
          </div>

        </div>

        {/* Results Count & Active Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--color-brown-muted)' }}>
          <div>
            Showing <strong>{filteredProducts.length}</strong> authentic Ayurvedic treasures
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </div>

          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery("");
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
              style={{ color: 'var(--color-burgundy)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <X size={14} /> Clear Search
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            background: 'var(--color-ivory-pure)',
            border: '1.5px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '5rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-deep-brown)', marginBottom: '0.5rem' }}>
              No formulations match your criteria
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-brown-muted)', marginBottom: '1.5rem' }}>
              Try adjusting your category filter or searching for another botanical grain or remedy.
            </p>
            <button 
              className="mn-btn mn-btn-burgundy"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                searchParams.delete('cat');
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mn-products-grid">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
