import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const navigate = useNavigate();
  
  // Icon components
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');

  useEffect(() => {
    // Set page title
    document.title = "Page Not Found - EstateSpot";
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-500 mb-6">
              <AlertTriangleIcon className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-surface-800 dark:text-white mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-surface-700 dark:text-surface-200 mb-2">
              Page Not Found
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}