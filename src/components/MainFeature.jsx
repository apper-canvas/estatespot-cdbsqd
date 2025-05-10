import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature() {
  // Unique search parameters for property search
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    beds: '',
    baths: ''
  });
  
  // Form input validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchCount, setSearchCount] = useState(0);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  
  // Property types with icons
  const propertyTypes = [
    { id: 'house', label: 'House', icon: 'Home' },
    { id: 'apartment', label: 'Apartment', icon: 'Building' },
    { id: 'condo', label: 'Condo', icon: 'Home' },
    { id: 'land', label: 'Land', icon: 'Map' },
    { id: 'commercial', label: 'Commercial', icon: 'Store' }
  ];
  
  // Price ranges for dropdown
  const priceRanges = [
    { value: '0-100000', label: 'Under $100,000' },
    { value: '100000-300000', label: 'from $100,000 - $300,000' },
    { value: '300000-500000', label: 'from $300,000 - $500,000' },
    { value: '500000-750000', label: 'from $500,000 - $750,000' },
    { value: '750000-1000000', label: 'from $750,000 - $1,000,000' },
    { value: '1000000-0', label: 'Over $1,000,000' }
  ];
  
  // Icon components
  const SearchIcon = getIcon('Search');
  const MapPinIcon = getIcon('MapPin');
  const HomeIcon = getIcon('Home');
  const DollarSignIcon = getIcon('DollarSign');
  const BedDoubleIcon = getIcon('BedDouble');
  const BathIcon = getIcon('Bath');
  const ClockIcon = getIcon('Clock');
  const PlusIcon = getIcon('Plus');
  const MinusIcon = getIcon('Minus');
  const RefreshCcwIcon = getIcon('RefreshCcw');
  const CloseIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const ArrowRightIcon = getIcon('ArrowRight');
  
  // Load recent searches from localStorage
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Format a display string for the search
        const searchString = formatSearchString(searchParams);
        
        // Add to recent searches (avoid duplicates)
        if (!recentSearches.some(search => search.searchString === searchString)) {
          const newSearch = {
            id: Date.now().toString(),
            searchString,
            timestamp: new Date(),
            params: { ...searchParams }
          };
          
          setRecentSearches(prev => [newSearch, ...prev].slice(0, 5)); // Keep only 5 most recent
        }
        
        setSearchCount(prev => prev + 1);
        setIsSubmitting(false);
        
        toast.success("Search complete! Check results below", {
          icon: "🔍",
          position: "bottom-right",
          autoClose: 3000
        });
      }, 1500);
    } else {
      setErrors(validationErrors);
    }
  };
  
  // Format search parameters into readable string
  const formatSearchString = (params) => {
    const parts = [];
    
    if (params.location) parts.push(params.location);
    if (params.propertyType) {
      const typeObj = propertyTypes.find(t => t.id === params.propertyType);
      parts.push(typeObj ? typeObj.label : params.propertyType);
    }
    if (params.priceRange) {
      const rangeObj = priceRanges.find(r => r.value === params.priceRange);
      parts.push(rangeObj ? rangeObj.label : params.priceRange);
    }
    if (params.beds) parts.push(`${params.beds}+ beds`);
    if (params.baths) parts.push(`${params.baths}+ baths`);
    
    return parts.join(' • ') || 'All Properties';
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!searchParams.location.trim()) {
      errors.location = "Please enter a location";
    }
    return errors;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle property type selection
  const handlePropertyTypeSelect = (typeId) => {
    setSearchParams(prev => ({
      ...prev,
      propertyType: prev.propertyType === typeId ? '' : typeId
    }));
  };
  
  // Apply a recent search
  const applyRecentSearch = (search) => {
    setSearchParams(search.params);
    setShowRecentSearches(false);
    
    toast.info("Applied previous search parameters", {
      icon: "🔄",
      position: "bottom-right",
      autoClose: 2000
    });
  };
  
  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    setShowRecentSearches(false);
    
    toast.info("Recent searches cleared", {
      position: "bottom-right",
      autoClose: 2000
    });
  };
  
  // Delete a specific recent search
  const deleteRecentSearch = (e, id) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(search => search.id !== id));
  };
  
  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    return `${Math.floor(diffSec / 86400)} days ago`;
  };
  
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden transition-all duration-200"
      >
        <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-2xl font-bold text-surface-800 dark:text-white flex items-center">
            <SearchIcon className="w-6 h-6 mr-2 text-primary" />
            Property Search
          </h2>
          {searchCount > 0 && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Found properties matching your criteria
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="relative">
              <label htmlFor="location" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.location ? 'border-rose-500 dark:border-rose-500' : ''}`}
                  placeholder="City, neighborhood, or ZIP"
                />
              </div>
              {errors.location && (
                <p className="text-rose-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Price Range
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSignIcon className="h-5 w-5 text-surface-400" />
                </div>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={searchParams.priceRange}
                  onChange={handleChange}
                  className="select pl-10"
                >
                  <option value="">Any Price</option>
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="beds" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Beds
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BedDoubleIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <select
                    id="beds"
                    name="beds"
                    value={searchParams.beds}
                    onChange={handleChange}
                    className="select pl-10"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="baths" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Baths
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BathIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <select
                    id="baths"
                    name="baths"
                    value={searchParams.baths}
                    onChange={handleChange}
                    className="select pl-10"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="1.5">1.5+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Property Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {propertyTypes.map(type => {
                const TypeIcon = getIcon(type.icon);
                const isSelected = searchParams.propertyType === type.id;
                
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handlePropertyTypeSelect(type.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 hover:border-primary/50 dark:hover:border-primary/50 text-surface-700 dark:text-surface-300'
                    }`}
                  >
                    <TypeIcon className={`w-6 h-6 mb-1 ${isSelected ? 'text-primary' : 'text-surface-500 dark:text-surface-400'}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative">
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRecentSearches(!showRecentSearches)}
                  className="btn-outline text-sm py-2"
                >
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {showRecentSearches ? 'Hide' : 'Show'} Recent Searches
                  {showRecentSearches ? <MinusIcon className="w-4 h-4 ml-1" /> : <PlusIcon className="w-4 h-4 ml-1" />}
                </button>
              )}
              
              <AnimatePresence>
                {showRecentSearches && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-12 z-20 w-full sm:w-80 md:w-96 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 p-3"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-surface-200 dark:border-surface-700">
                      <h4 className="font-medium text-surface-800 dark:text-white">Recent Searches</h4>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center"
                      >
                        <RefreshCcwIcon className="w-3 h-3 mr-1" />
                        Clear All
                      </button>
                    </div>
                    
                    <ul className="divide-y divide-surface-200 dark:divide-surface-700 max-h-64 overflow-y-auto">
                      {recentSearches.map(search => (
                        <li 
                          key={search.id}
                          onClick={() => applyRecentSearch(search)}
                          className="py-2 px-1 hover:bg-surface-50 dark:hover:bg-surface-700 rounded cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-surface-800 dark:text-white">
                              {search.searchString}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => deleteRecentSearch(e, search.id)}
                              className="text-surface-400 hover:text-rose-500 p-1"
                            >
                              <CloseIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 mt-1">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatRelativeTime(search.timestamp)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary py-3 px-6 flex items-center justify-center ${isSubmitting ? 'opacity-80' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="w-5 h-5 mr-2" />
                  {searchCount > 0 ? 'Refine Search' : 'Search Properties'}
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Results Summary (shown after first search) */}
        {searchCount > 0 && (
          <div className="px-6 py-4 bg-surface-50 dark:bg-surface-700/50 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-surface-600 dark:text-surface-300">
                <CheckIcon className="w-5 h-5 text-secondary mr-2" />
                <span>Search criteria applied</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: document.getElementById('property-listings') ? document.getElementById('property-listings').offsetTop : 0,
                    behavior: 'smooth'
                  });
                }}
                className="text-primary hover:text-primary-dark dark:hover:text-primary-light flex items-center text-sm font-medium"
              >
                See all results
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}