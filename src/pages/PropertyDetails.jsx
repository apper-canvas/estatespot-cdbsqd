import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Mock data for property listings (same as in Home.jsx)
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
    description: "This stunning lakefront villa offers breathtaking views and luxurious living spaces. Featuring modern architecture, high ceilings, and floor-to-ceiling windows, this home seamlessly blends indoor and outdoor living. The gourmet kitchen includes top-of-the-line appliances and a large island, perfect for entertaining. The primary suite offers a spa-like bathroom and private balcony overlooking the lake.",
    features: [
      "Lakefront property",
      "Gourmet kitchen",
      "Home theater",
      "Heated floors",
      "Smart home system",
      "3-car garage",
      "Private dock"
    ],
    yearBuilt: 2019,
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
    description: "Located in the heart of downtown Portland, this luxury apartment offers sophisticated urban living. The open-concept design features high-end finishes, including quartz countertops, stainless steel appliances, and hardwood floors. Residents enjoy access to premium amenities including a rooftop terrace, fitness center, and 24-hour concierge service.",
    features: [
      "Concierge service",
      "Rooftop terrace",
      "Fitness center",
      "Pet-friendly",
      "In-unit laundry",
      "Bike storage",
      "EV charging stations"
    ],
    yearBuilt: 2017,
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
    description: "Perfect for families, this welcoming suburban home offers comfort and convenience in a friendly neighborhood. The well-designed floor plan includes a spacious living room, updated kitchen, and a cozy family room. The fenced backyard provides a safe space for children and pets, with a covered patio ideal for outdoor entertaining and relaxation.",
    features: [
      "Fenced backyard",
      "Updated kitchen",
      "Fireplace",
      "Attached garage",
      "Near schools",
      "Community pool",
      "Walking trails nearby"
    ],
    yearBuilt: 2005,
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
    description: "Enjoy spectacular waterfront views from this stylish condo in San Francisco. This beautifully renovated unit features an open floor plan with a gourmet kitchen, luxurious bathrooms, and a private balcony overlooking the bay. Building amenities include secure parking, a fitness center, and a community lounge.",
    features: [
      "Waterfront views",
      "Private balcony",
      "Secure parking",
      "Fitness center",
      "Community lounge",
      "24-hour security",
      "Guest suite"
    ],
    yearBuilt: 2010,
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
    description: "Experience urban loft living in this stunning downtown Los Angeles apartment. The industrial-chic space features exposed brick walls, high ceilings, concrete floors, and large windows that flood the unit with natural light. The efficient layout includes a sleek kitchen with premium appliances and a spa-like bathroom with modern fixtures.",
    features: [
      "Exposed brick walls",
      "High ceilings",
      "Floor-to-ceiling windows",
      "Smart home features",
      "Rooftop pool",
      "Coworking space",
      "Dog park"
    ],
    yearBuilt: 2015,
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
    description: "Escape to this peaceful countryside retreat nestled in the mountains of Aspen. This spacious home sits on 5 acres of picturesque land, offering privacy and stunning natural surroundings. The rustic-modern design features vaulted ceilings, a stone fireplace, and large windows showcasing mountain views. Perfect for nature lovers and those seeking tranquility.",
    features: [
      "5 acres of land",
      "Mountain views",
      "Stone fireplace",
      "Chef's kitchen",
      "Wrap-around deck",
      "Hot tub",
      "Hiking trails"
    ],
    yearBuilt: 2012,
    isFeatured: true
  }
];

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Icons
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const BedDoubleIcon = getIcon("BedDouble");
  const BathIcon = getIcon("Bath");
  const RulerIcon = getIcon("Ruler");
  const CalendarIcon = getIcon("Calendar");
  const MapPinIcon = getIcon("MapPin");
  const CheckIcon = getIcon("Check");
  
  useEffect(() => {
    // Simulate API fetch with delay
    const timer = setTimeout(() => {
      const foundProperty = MOCK_PROPERTIES.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        toast.error("Property not found", {
          position: "bottom-right"
        });
        navigate("/");
      }
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 mb-4"></div>
          <div className="text-surface-600 dark:text-surface-300">Loading property details...</div>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-4">Property Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-surface-50 dark:bg-surface-900 min-h-screen pb-12 transition-colors duration-200">
      {/* Property Header */}
      <div className="bg-white dark:bg-surface-800 shadow-sm mb-6">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link 
                  to="/" 
                  className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  Back to listings
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-white">
                {property.title}
              </h1>
              <div className="flex items-center text-surface-500 dark:text-surface-400 mt-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{property.location.city}, {property.location.state}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <div className="text-2xl font-bold text-primary">
                {property.listingType === 'rent' 
                  ? `$${property.price.toLocaleString()}/mo` 
                  : `$${property.price.toLocaleString()}`}
              </div>
              <div className="flex gap-2 mt-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-3 py-1 rounded-full text-sm font-medium">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card overflow-hidden mb-8"
            >
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-80 md:h-96 object-cover"
              />
            </motion.div>
            
            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6 mb-8"
            >
              <h2 className="text-xl font-bold mb-4 text-surface-800 dark:text-white">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="flex flex-col items-center p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <BedDoubleIcon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold text-surface-800 dark:text-white">{property.bedrooms}</span>
                  <span className="text-sm text-surface-500 dark:text-surface-400">Bedrooms</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <BathIcon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold text-surface-800 dark:text-white">{property.bathrooms}</span>
                  <span className="text-sm text-surface-500 dark:text-surface-400">Bathrooms</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <RulerIcon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold text-surface-800 dark:text-white">{property.area}</span>
                  <span className="text-sm text-surface-500 dark:text-surface-400">Sq Ft</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold text-surface-800 dark:text-white">{property.yearBuilt}</span>
                  <span className="text-sm text-surface-500 dark:text-surface-400">Year Built</span>
                </div>
              </div>
              
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                {property.description}
              </p>
            </motion.div>
            
            {/* Property Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-surface-800 dark:text-white">Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {property.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
                    <span className="text-surface-600 dark:text-surface-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card p-6 mb-6 sticky top-24"
            >
              <h3 className="text-lg font-bold mb-4 text-surface-800 dark:text-white">Contact Agent</h3>
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                  {getIcon("User")({ className: "w-6 h-6" })}
                </div>
                <div>
                  <div className="font-medium text-surface-800 dark:text-white">Estate Agent</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">EstateSpot Realty</div>
                </div>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    className="input" 
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="input" 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="input" 
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="input" 
                    placeholder="I'm interested in this property..."
                    defaultValue={`I'm interested in ${property.title} in ${property.location.city}, ${property.location.state}.`}
                  ></textarea>
                </div>
                
                <button 
                  type="button" 
                  className="btn-primary w-full"
                  onClick={() => {
                    toast.success("Your message has been sent!", {
                      position: "bottom-right"
                    });
                  }}
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}