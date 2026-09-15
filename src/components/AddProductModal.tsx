import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  CATEGORY_OPTIONS,
  LEATHER_TYPE_PRESETS,
  TANNING_PRESETS,
  HARDWARE_PRESETS,
  CURATED_LEATHER_IMAGES,
} from '../data/products';
import {
  X,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Info,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const DEFAULT_COLORS = [
  { name: 'Saddle Cognac', hex: '#8B4513' },
  { name: 'Espresso Brown', hex: '#3E2723' },
  { name: 'Midnight Black', hex: '#1C1C1C' },
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct } = useStore();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('bags');
  const [price, setPrice] = useState<number>(12500);
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [inStock, setInStock] = useState<boolean>(true);

  // Leather Specs State
  const [leatherType, setLeatherType] = useState('Full-Grain Vegetable-Tanned Cowhide');
  const [tanning, setTanning] = useState('Traditional Vegetable Pit-Tanned (Natural Bark)');
  const [hardware, setHardware] = useState('Antique Solid Heavyweight Cast Brass');
  const [dimensions, setDimensions] = useState('40cm x 30cm x 10cm');

  // Imagery & Narrative
  const [image, setImage] = useState(CURATED_LEATHER_IMAGES[0].url);
  const [tag, setTag] = useState('Artisan Choice');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [isBespokeHandPainted, setIsBespokeHandPainted] = useState(false);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(DEFAULT_COLORS);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#8B5A2B');

  const [activeTab, setActiveTab] = useState<'basics' | 'specs' | 'media'>('basics');
  const [error, setError] = useState<string | null>(null);

  // Sync state if editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setCompareAtPrice(productToEdit.compareAtPrice ?? '');
      setStockQuantity(productToEdit.stockQuantity ?? 10);
      setInStock(productToEdit.inStock);
      setLeatherType(productToEdit.leatherType);
      setTanning(productToEdit.tanning);
      setHardware(productToEdit.hardware);
      setDimensions(productToEdit.dimensions);
      setImage(productToEdit.image);
      setTag(productToEdit.tag ?? '');
      setDescription(productToEdit.description);
      setStory(productToEdit.story ?? '');
      setIsBespokeHandPainted(!!productToEdit.isBespokeHandPainted);
      setColors(productToEdit.colors && productToEdit.colors.length > 0 ? productToEdit.colors : DEFAULT_COLORS);
    } else {
      // Reset form
      setName('');
      setCategory('bags');
      setPrice(14500);
      setCompareAtPrice(17000);
      setStockQuantity(12);
      setInStock(true);
      setLeatherType('Full-Grain Vegetable-Tanned Cowhide');
      setTanning('Traditional Vegetable Pit-Tanned (Natural Bark)');
      setHardware('Antique Solid Heavyweight Cast Brass');
      setDimensions('38cm x 28cm x 8cm');
      setImage(CURATED_LEATHER_IMAGES[0].url);
      setTag('New Arrival');
      setDescription('Handcrafted with meticulous attention to detail by master leather artisans in our Lahore workshop.');
      setStory('Sourced from ethical Pakistani livestock farms and tanned using historic pit-bark techniques for supreme longevity.');
      setIsBespokeHandPainted(false);
      setColors(DEFAULT_COLORS);
    }
    setError(null);
    setActiveTab('basics');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length <= 1) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a product name.');
      setActiveTab('basics');
      return;
    }
    if (!price || price <= 0) {
      setError('Please provide a valid price in PKR.');
      setActiveTab('basics');
      return;
    }
    if (!leatherType.trim()) {
      setError('Please provide the leather type specifications.');
      setActiveTab('specs');
      return;
    }
    if (!image.trim()) {
      setError('Please select or provide an image URL.');
      setActiveTab('media');
      return;
    }

    const matchedCategory = CATEGORY_OPTIONS.find((c) => c.id === category);
    const categoryLabel = matchedCategory ? matchedCategory.label : 'Leather Goods';

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const finalProduct: Product = {
      id: productToEdit ? productToEdit.id : `tlw-${Date.now().toString(36)}`,
      name: name.trim(),
      slug: productToEdit ? productToEdit.slug : slug,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stockQuantity: Math.max(0, Number(stockQuantity)),
      inStock: stockQuantity > 0 ? inStock : false,
      category,
      categoryLabel,
      image: image.trim(),
      secondaryImages: productToEdit?.secondaryImages ?? [image.trim()],
      tag: tag.trim() || undefined,
      description: description.trim() || 'Handcrafted bespoke leather good from The Leather Workx.',
      story: story.trim() || undefined,
      leatherType: leatherType.trim(),
      tanning: tanning.trim(),
      hardware: hardware.trim(),
      dimensions: dimensions.trim() || 'Standard Atelier Cut',
      rating: productToEdit ? productToEdit.rating : 5.0,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : 1,
      isBespokeHandPainted,
      colors,
    };

    if (productToEdit) {
      updateProduct(finalProduct);
    } else {
      addProduct(finalProduct);
    }

    onClose();
  };

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-[#FCFAF7] rounded-xl shadow-2xl border border-[#E8E1D9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1E1915] text-[#FAF8F5] flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#8B5A2B] flex items-center justify-center text-[#FAF8F5]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold tracking-wide">
                {productToEdit ? 'Edit Product & Leather Specs' : 'Add New Product & Stock to Catalog'}
              </h2>
              <p className="text-xs text-stone-400">
                Lahore Atelier Workshop Master Inventory Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E0D5] bg-[#F5EFEB] px-6">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'basics'
                ? 'border-[#8B5A2B] text-[#8B5A2B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1. Name, Category & Stock</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'specs'
                ? 'border-[#8B5A2B] text-[#8B5A2B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Leather Specifications</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'media'
                ? 'border-[#8B5A2B] text-[#8B5A2B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>3. Images & Colors</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* TAB 1: BASICS, CATEGORY, PRICE & STOCK */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., The Royal Officer Messenger Bag"
                  className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                  required
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product['category'])}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Tag / Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. New Launch, Bestseller, Limited Run"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>

              {/* Pricing in PKR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Selling Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-bold">Rs.</span>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full text-sm font-bold pl-10 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Display: <strong className="text-stone-900">{formatPKR(price || 0)}</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Compare-at Original Price (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-bold">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 17500"
                      className="w-full text-sm pl-10 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Shows crossed-out strike-through price if set
                  </span>
                </div>
              </div>

              {/* STOCK CONTROLS */}
              <div className="bg-[#FAF6F0] p-4 rounded-lg border border-[#EADFCB] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B5A2B]">
                      Workshop Stock & Availability
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Specify available physical units in Lahore workshop
                    </p>
                  </div>

                  {/* Quick Toggle In Stock */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 text-[#8B5A2B] accent-[#8B5A2B] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-stone-800">
                      {inStock ? 'Marked In Stock' : 'Marked Sold Out'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Stock Units Available
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={stockQuantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setStockQuantity(val);
                          if (val === 0) setInStock(false);
                          if (val > 0 && !inStock) setInStock(true);
                        }}
                        className="w-28 text-sm font-bold px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900"
                      />
                      <span className="text-xs text-stone-500">units in atelier</span>
                    </div>
                  </div>

                  {/* Quick restock buttons */}
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">Quick Add Units:</span>
                    <div className="flex items-center gap-1.5">
                      {[+1, +5, +10, +25].map((addNum) => (
                        <button
                          key={addNum}
                          type="button"
                          onClick={() => {
                            setStockQuantity((prev) => prev + addNum);
                            setInStock(true);
                          }}
                          className="px-2.5 py-1 bg-white border border-stone-300 hover:border-[#8B5A2B] hover:text-[#8B5A2B] rounded text-xs font-semibold text-stone-700 transition cursor-pointer"
                        >
                          +{addNum}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bespoke Hand-Painted Flag */}
              <div className="flex items-start gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="handpainted-toggle"
                  checked={isBespokeHandPainted}
                  onChange={(e) => setIsBespokeHandPainted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#8B5A2B] accent-[#8B5A2B] rounded cursor-pointer"
                />
                <label htmlFor="handpainted-toggle" className="text-xs cursor-pointer">
                  <span className="font-bold text-stone-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    Custom Hand-Painted Bespoke Art
                  </span>
                  <span className="text-stone-600 block mt-0.5">
                    Check this if the item receives individually hand-painted artwork, monogram stripes, or lacquer enamel.
                  </span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product craftsmanship, utility, and feel..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LEATHER SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg">
                <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span>Artisanal Leather Specifications</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Displayed prominently to discerning Pakistani customers on the product detail modal and receipt slips.
                </p>
              </div>

              {/* 1. Leather Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Leather Type & Grain *
                </label>
                <input
                  type="text"
                  value={leatherType}
                  onChange={(e) => setLeatherType(e.target.value)}
                  placeholder="e.g. Full-Grain Vegetable-Tanned Cowhide"
                  className="w-full text-xs font-medium px-3.5 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                  required
                />
                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-stone-400 self-center">Presets:</span>
                  {LEATHER_TYPE_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLeatherType(preset)}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Tanning Method */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Tanning Method
                </label>
                <input
                  type="text"
                  value={tanning}
                  onChange={(e) => setTanning(e.target.value)}
                  placeholder="e.g. Traditional Vegetable Pit-Tanned (Natural Bark)"
                  className="w-full text-xs font-medium px-3.5 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-stone-400 self-center">Presets:</span>
                  {TANNING_PRESETS.slice(0, 3).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTanning(preset)}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Hardware & Stitching */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Hardware & Stitching
                </label>
                <input
                  type="text"
                  value={hardware}
                  onChange={(e) => setHardware(e.target.value)}
                  placeholder="e.g. Antique Solid Heavyweight Cast Brass"
                  className="w-full text-xs font-medium px-3.5 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-stone-400 self-center">Presets:</span>
                  {HARDWARE_PRESETS.slice(0, 3).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHardware(preset)}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Dimensions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Dimensions & Sizing
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 42cm x 30cm x 12cm (Fits 15-inch Laptop)"
                  className="w-full text-xs font-medium px-3.5 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              {/* Atelier Story */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Atelier Heritage Story (Optional)
                </label>
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="e.g. Cut from thick, oil-pull hides that develop a rich, luminous patina over years of journeys..."
                  className="w-full text-xs px-3.5 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & COLOR SHADES */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              {/* Product Image Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Primary High-Res Image URL *
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs font-medium px-3.5 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B5A2B]"
                  required
                />
              </div>

              {/* Curated Leather Photo Gallery */}
              <div>
                <span className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Or select from curated leather studio photos:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {CURATED_LEATHER_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative aspect-4/3 rounded-md overflow-hidden border-2 transition cursor-pointer group ${
                        image === preset.url
                          ? 'border-[#8B5A2B] ring-2 ring-[#8B5A2B]/20'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white py-0.5 px-1 truncate text-center">
                        {preset.name}
                      </span>
                      {image === preset.url && (
                        <div className="absolute top-1 right-1 bg-[#8B5A2B] text-white p-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
                  <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded bg-stone-200" />
                  <div className="text-xs">
                    <span className="font-bold text-stone-800 block">Image Preview</span>
                    <span className="text-stone-500 text-[11px]">Valid image loaded for catalog card & detail view.</span>
                  </div>
                </div>
              )}

              {/* Leather Shade Colors */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Available Leather Colors ({colors.length})
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-md text-xs font-medium text-stone-800"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-stone-400 hover:text-red-500 ml-1 transition"
                        title="Remove color"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new color input */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-9 h-9 p-0.5 rounded border border-stone-300 cursor-pointer bg-white"
                  />
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="New shade name (e.g. British Tan)"
                    className="flex-1 text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Add Shade
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'media' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basics' ? 'specs' : 'media')}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Next Step &rarr;
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#8B5A2B] hover:bg-[#70421B] text-white text-xs font-bold tracking-wide rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {productToEdit ? 'Save Changes' : 'Publish Product & Stock'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
