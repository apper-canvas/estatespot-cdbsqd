import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const HomeIcon = getIcon('Home');
  
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-primary mb-6">
          <h1 className="text-9xl font-bold">404</h1>
        </div>
        <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary flex items-center justify-center gap-2 mx-auto w-48">
          <HomeIcon className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}