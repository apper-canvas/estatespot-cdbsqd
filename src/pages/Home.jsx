import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Mock data for property listings
const MOCK_PROPERTIES = [
  {
    id: "prop1",
    title: "Modern Lakefront Villa",
    type: "house",
    listingType: "sale",
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    location: {
      city: "Seattle",
      state: "WA"
    },
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  },
  {
    id: "prop2",
    title: "Downtown Luxury Apartment",
    type: "apartment",
    listingType: "rent",
    price: 3500,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    location: {
      city: "Portland",
      state: "OR"
    },
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  },
  {
    id: "prop3",
    title: "Suburban Family Home",
    type: "house",
    listingType: "sale",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    location: {
      city: "Bellevue",
      state: "WA"
    },
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  },
  {
    id: "prop4",
    title: "Waterfront Condo",
    type: "condo",
    listingType: "sale",
    price: 620000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    location: {
      city: "San Francisco",
      state: "CA"
    },
    imageUrl: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  },
  {
    id: "prop5",
    title: "Modern Downtown Loft",
    type: "apartment",
    listingType: "rent",
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    area: 950,
    location: {
      city: "Los Angeles",
      state: "CA"
    },
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  },
  {
    id: "prop6",
    title: "Countryside Retreat",
    type: "house",
    listingType: "sale",
    price: 850000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    location: {
      city: "Aspen",
      state: "CO"
    },
    imageUrl: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  }
];

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProperties');
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState({
    type: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: ""
  });
  const [sortBy, setSortBy] = useState("default");
  
  // Icon components
  const HomeIcon = getIcon("Home");
  const BuildingIcon = getIcon("Building");
  const HeartIcon = getIcon("Heart");
  const HeartFilledIcon = getIcon("HeartHandshake");
  const DollarSignIcon = getIcon("DollarSign");
  const BedDoubleIcon = getIcon("BedDouble");
  const BathIcon = getIcon("Bath");
  const RulerIcon = getIcon("Ruler");
  const MapPinIcon = getIcon("MapPin");

  useEffect(() => {
    // Simulate fetching properties
    setProperties(MOCK_PROPERTIES);
    
    // Save favorites to local storage
    localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
      toast.info("Removed from favorites", {
        icon: "💔",
        position: "bottom-right",
        autoClose: 2000
      });
    } else {
      setFavorites([...favorites, propertyId]);
      toast.success("Added to favorites", {
        icon: "❤️",
        position: "bottom-right",
        autoClose: 2000
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Filter and sort properties
  const filteredProperties = properties.filter(property => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.listingType && property.listingType !== filters.listingType) return false;
    if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) return false;
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return new Date(b.id) - new Date(a.id); // Using id as proxy for date in this mock example
      case "featured":
        return b.isFeatured - a.isFeatured;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-surface-50 dark:bg-surface-900 min-h-screen transition-colors duration-200">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Browse thousands of properties for sale and rent across the country.
              Your perfect home is just a few clicks away.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Feature Component */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <MainFeature />
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="py-8 bg-white dark:bg-surface-800 shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-surface-800 dark:text-white">Find Properties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">
                Property Type
              </label>
              <select 
                id="type" 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="select bg-surface-50 dark:bg-surface-700"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="listingType" className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">
                Listing Type
              </label>
              <select 
                id="listingType" 
                name="listingType" 
                value={filters.listingType} 
                onChange={handleFilterChange}
                className="select bg-surface-50 dark:bg-surface-700"
              >
                <option value="">All Listings</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">
                Min Price
              </label>
              <input 
                type="number" 
                id="minPrice" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="input bg-surface-50 dark:bg-surface-700"
              />
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">
                Max Price
              </label>
              <input 
                type="number" 
                id="maxPrice" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="input bg-surface-50 dark:bg-surface-700"
              />
            </div>
            
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">
                Min Bedrooms
              </label>
              <select 
                id="bedrooms" 
                name="bedrooms" 
                value={filters.bedrooms} 
                onChange={handleFilterChange}
                className="select bg-surface-50 dark:bg-surface-700"
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
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-surface-600 dark:text-surface-300">
              {sortedProperties.length} properties found
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Sort by:
              </label>
              <select 
                id="sortBy" 
                value={sortBy} 
                onChange={handleSortChange}
                className="select py-1 text-sm bg-surface-50 dark:bg-surface-700"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section className="py-12 bg-surface-100 dark:bg-surface-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedProperties.length > 0 ? (
              sortedProperties.map(property => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="card group hover:shadow-lg dark:hover:shadow-neu-dark transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className="p-2 bg-white/90 dark:bg-surface-800/90 rounded-full hover:bg-white dark:hover:bg-surface-700 transition-colors"
                        aria-label={favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(property.id) ? (
                          <HeartFilledIcon className="w-5 h-5 text-rose-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-surface-400 group-hover:text-rose-500 transition-colors" />
                        )}
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface-900/80 to-transparent text-white p-4">
                      <div className="flex items-center justify-between">
                        <span className="bg-primary rounded-full px-3 py-1 text-xs font-medium uppercase">
                          {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                        <span className="text-sm font-medium">
                          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-surface-800 dark:text-white line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-lg font-bold text-primary">
                        <DollarSignIcon className="w-4 h-4 mr-1" />
                        {property.listingType === 'rent' 
                          ? `${property.price.toLocaleString()}/mo` 
                          : property.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-surface-500 dark:text-surface-400 mb-4">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {property.location.city}, {property.location.state}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-surface-200 dark:border-surface-700 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-surface-500 dark:text-surface-400 mb-1">
                          <BedDoubleIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.bedrooms}</span>
                        </div>
                        <span className="text-xs text-surface-400 dark:text-surface-500">Beds</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-surface-500 dark:text-surface-400 mb-1">
                          <BathIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.bathrooms}</span>
                        </div>
                        <span className="text-xs text-surface-400 dark:text-surface-500">Baths</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-surface-500 dark:text-surface-400 mb-1">
                          <RulerIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.area}</span>
                        </div>
                        <span className="text-xs text-surface-400 dark:text-surface-500">Sq Ft</span>
                      </div>
                    </div>
                    
                    <Link to={`/property/${property.id}`} className="btn-primary w-full text-center">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="bg-white dark:bg-surface-800 rounded-lg p-8 max-w-md mx-auto">
                  <div className="text-surface-400 mb-4">
                    <BuildingIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-surface-500 dark:text-surface-400 mb-4">
                    Try adjusting your search filters to find more properties.
                  </p>
                  <button 
                    className="btn-outline"
                    onClick={() => {
                      setFilters({
                        type: "",
                        listingType: "",
                        minPrice: "",
                        maxPrice: "",
                        bedrooms: ""
                      });
                      setSortBy("default");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}