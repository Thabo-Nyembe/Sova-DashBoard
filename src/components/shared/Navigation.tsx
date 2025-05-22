import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavigationProps {
  variant?: 'header' | 'sidebar';
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  variant = 'header',
  className = ''
}) => {
  const location = useLocation();
  const { user, userRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    // Public navigation items (available to all)
    const publicItems = [
      { label: 'Home', path: '/' },
      { label: 'Features', path: '/features' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Contact', path: '/contact' },
    ];
    
    // Guest app navigation items
    const appItems = [
      { label: 'Guest App', path: '/app' },
      { label: 'Digital Check-In', path: '/check-in' },
      { label: 'Digital Key', path: '/digital-key' },
      { label: 'Room Service', path: '/room-service' },
      { label: 'Shuttle Service', path: '/shuttle' },
    ];
    
    // Dashboard navigation items based on role
    const dashboardItems = [];
    
    if (user) {
      // All authenticated users can access their profile
      dashboardItems.push({ label: 'My Profile', path: '/profile' });
      
      // Role-specific dashboard access
      if (userRole === 'guest' || userRole === 'admin') {
        dashboardItems.push({ label: 'Guest Dashboard', path: '/consumer' });
      }
      
      if (userRole === 'business' || userRole === 'admin') {
        dashboardItems.push({ label: 'Business Dashboard', path: '/business' });
      }
      
      if (userRole === 'investor' || userRole === 'admin') {
        dashboardItems.push({ label: 'Investor Dashboard', path: '/investor' });
      }
      
      if (userRole === 'admin') {
        dashboardItems.push({ label: 'Reporting Suite', path: '/reporting' });
      }
    }
    
    return {
      publicItems,
      appItems,
      dashboardItems
    };
  };
  
  const { publicItems, appItems, dashboardItems } = getNavigationItems();
  
  // Determine if a nav item is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };
  
  // Render header navigation
  if (variant === 'header') {
    return (
      <nav className={`sova-navigation header-navigation ${className}`}>
        <div className="desktop-navigation">
          <ul className="nav-list primary-nav">
            {publicItems.map((item, index) => (
              <li key={`public-${index}`} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
                <Link to={item.path} className="nav-link">{item.label}</Link>
              </li>
            ))}
          </ul>
          
          <div className="nav-actions">
            {user ? (
              <>
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    Dashboards <i className="fas fa-chevron-down"></i>
                  </button>
                  <ul className="dropdown-menu">
                    {dashboardItems.map((item, index) => (
                      <li key={`dashboard-${index}`}>
                        <Link to={item.path} className="dropdown-item">{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    App <i className="fas fa-chevron-down"></i>
                  </button>
                  <ul className="dropdown-menu">
                    {appItems.map((item, index) => (
                      <li key={`app-${index}`}>
                        <Link to={item.path} className="dropdown-item">{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link to="/profile" className="user-profile">
                  <span className="user-initial">{user.email?.charAt(0).toUpperCase()}</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/app" className="btn btn-outline">Try the App</Link>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="mobile-navigation">
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </button>
          
          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="mobile-nav-list">
              {publicItems.map((item, index) => (
                <li key={`mobile-public-${index}`} className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}>
                  <Link to={item.path} className="mobile-nav-link">{item.label}</Link>
                </li>
              ))}
              
              {user ? (
                <>
                  <li className="mobile-nav-section">Dashboards</li>
                  {dashboardItems.map((item, index) => (
                    <li key={`mobile-dashboard-${index}`} className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}>
                      <Link to={item.path} className="mobile-nav-link">{item.label}</Link>
                    </li>
                  ))}
                  
                  <li className="mobile-nav-section">App</li>
                  {appItems.map((item, index) => (
                    <li key={`mobile-app-${index}`} className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}>
                      <Link to={item.path} className="mobile-nav-link">{item.label}</Link>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  <li className="mobile-nav-item">
                    <Link to="/app" className="mobile-nav-link highlight">Try the App</Link>
                  </li>
                  <li className="mobile-nav-item">
                    <Link to="/login" className="mobile-nav-link primary">Sign In</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
  
  // Render sidebar navigation (for dashboards)
  return (
    <nav className={`sova-navigation sidebar-navigation ${className}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">SOVA</Link>
        <button className="sidebar-close" onClick={() => {}}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <ul className="sidebar-nav-list">
        {dashboardItems.map((item, index) => (
          <li key={`sidebar-${index}`} className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}>
            <Link to={item.path} className="sidebar-nav-link">{item.label}</Link>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Guest App</h3>
        <ul className="sidebar-nav-list">
          {appItems.map((item, index) => (
            <li key={`sidebar-app-${index}`} className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <Link to={item.path} className="sidebar-nav-link">{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <Link to="/profile" className="sidebar-profile">
          <span className="user-initial">{user?.email?.charAt(0).toUpperCase()}</span>
          <span className="user-name">{user?.email}</span>
        </Link>
        <button className="sidebar-logout">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
