import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './LandingPage.css';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('guest-app');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Initialize tab functionality
    const handleTabClick = (e) => {
      if (e.target.classList.contains('tab-button')) {
        const tabId = e.target.getAttribute('data-tab');
        setActiveTab(tabId);
      }
    };

    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.addEventListener('click', handleTabClick);
    }

    return () => {
      if (tabNavigation) {
        tabNavigation.removeEventListener('click', handleTabClick);
      }
    };
  }, []);

  // Handle video load state
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className="landing-page">
      {/* SEO Optimization */}
      <Helmet>
        <title>SOVA | Luxury Hospitality Management Platform</title>
        <meta name="description" content="Elevate your guest experience with SOVA's luxury hospitality platform. Digital check-in, mobile keys, and real-time analytics for premium hotels." />
        <meta name="keywords" content="luxury hospitality platform, hotel management software, digital guest experience, premium hotel technology" />
        <link rel="canonical" href="https://thabo-nyembe.github.io/Sova-DashBoard/" />
        <meta property="og:title" content="SOVA | Luxury Hospitality Management Platform" />
        <meta property="og:description" content="Elevate your guest experience with SOVA's luxury hospitality platform. Digital check-in, mobile keys, and real-time analytics for premium hotels." />
        <meta property="og:image" content="/images/sova-og-image.jpg" />
        <meta property="og:url" content="https://thabo-nyembe.github.io/Sova-DashBoard/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SOVA Hospitality Platform",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <div className="hero-video-container">
          <video 
            className={`hero-video ${isVideoLoaded ? 'loaded' : ''}`}
            autoPlay 
            muted 
            loop 
            playsInline
            onLoadedData={handleVideoLoad}
            poster="/images/luxury-hotel-poster.jpg"
          >
            <source src="/videos/luxury-hotel-experience.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>Intelligent Luxury Hospitality</h1>
          <p className="hero-tagline">Elevate your guest experience with SOVA's premium hospitality platform</p>
          <div className="hero-cta">
            <Link to="/app" className="cta-button primary">Experience the App</Link>
            <Link to="/contact" className="cta-button secondary">Request Demo</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Luxury Properties</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Guest Satisfaction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">35%</span>
              <span className="stat-label">Revenue Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Monochromatic Design */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-subtitle">Our Platform</span>
          <h2>Transforming Luxury Hospitality</h2>
          <p className="section-description">SOVA delivers a comprehensive suite of tools designed specifically for premium hospitality brands.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <h3>Personalized Guest Experience</h3>
            <p>Tailor every aspect of the guest journey with AI-powered personalization and seamless digital touchpoints.</p>
            <Link to="/features/guest-experience" className="feature-link">Learn more</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Real-time Hotel Operations</h3>
            <p>Monitor and manage your property with real-time insights, automated workflows, and staff coordination tools.</p>
            <Link to="/features/operations" className="feature-link">Learn more</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-coins"></i>
            </div>
            <h3>Revenue Optimization</h3>
            <p>Maximize revenue with dynamic pricing, upsell opportunities, and comprehensive financial analytics.</p>
            <Link to="/features/revenue" className="feature-link">Learn more</Link>
          </div>
        </div>
      </section>

      {/* Product Preview Carousel with Interactive Tabs */}
      <section className="product-preview">
        <div className="section-header">
          <span className="section-subtitle">Interactive Demo</span>
          <h2>Experience SOVA</h2>
          <p className="section-description">Explore our intuitive interfaces designed for guests, staff, and investors.</p>
        </div>
        <div className="preview-tabs">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'guest-app' ? 'active' : ''}`} 
              data-tab="guest-app"
            >
              Guest App
            </button>
            <button 
              className={`tab-button ${activeTab === 'hotel-dashboard' ? 'active' : ''}`} 
              data-tab="hotel-dashboard"
            >
              Hotel Dashboard
            </button>
            <button 
              className={`tab-button ${activeTab === 'investor-view' ? 'active' : ''}`} 
              data-tab="investor-view"
            >
              Investor View
            </button>
          </div>
          <div className="tab-content">
            <div className={`tab-pane ${activeTab === 'guest-app' ? 'active' : ''}`} id="guest-app">
              <div className="preview-content">
                <div className="preview-image">
                  <img src="/images/guest-app-preview.jpg" alt="SOVA Guest App Interface showing digital room key and service menu" />
                </div>
                <div className="preview-text">
                  <h3>Guest Mobile Experience</h3>
                  <p>Empower guests with digital check-in, mobile room keys, and instant service requests. Our intuitive interface ensures a seamless experience from booking to checkout.</p>
                  <ul className="feature-list">
                    <li>Contactless check-in and digital room keys</li>
                    <li>Personalized recommendations and offers</li>
                    <li>Instant room service and amenity booking</li>
                    <li>Real-time communication with staff</li>
                  </ul>
                  <Link to="/app" className="preview-link">Try the Guest App</Link>
                </div>
              </div>
            </div>
            <div className={`tab-pane ${activeTab === 'hotel-dashboard' ? 'active' : ''}`} id="hotel-dashboard">
              <div className="preview-content">
                <div className="preview-image">
                  <img src="/images/hotel-dashboard-preview.jpg" alt="SOVA Hotel Dashboard showing occupancy metrics and staff management tools" />
                </div>
                <div className="preview-text">
                  <h3>Hotel Management Dashboard</h3>
                  <p>Streamline operations with real-time occupancy data, staff coordination, and guest request management. Our comprehensive dashboard gives you complete control over your property.</p>
                  <ul className="feature-list">
                    <li>Real-time occupancy and revenue metrics</li>
                    <li>Staff task assignment and tracking</li>
                    <li>Guest request management and prioritization</li>
                    <li>Inventory and maintenance coordination</li>
                  </ul>
                  <Link to="/dashboard/business" className="preview-link">View Business Dashboard</Link>
                </div>
              </div>
            </div>
            <div className={`tab-pane ${activeTab === 'investor-view' ? 'active' : ''}`} id="investor-view">
              <div className="preview-content">
                <div className="preview-image">
                  <img src="/images/investor-view-preview.jpg" alt="SOVA Investor Dashboard showing financial performance metrics and growth trends" />
                </div>
                <div className="preview-text">
                  <h3>Investor Analytics</h3>
                  <p>Track performance metrics, revenue growth, and market penetration with comprehensive analytics. Our investor dashboard provides the insights needed for strategic decision-making.</p>
                  <ul className="feature-list">
                    <li>Financial performance tracking and forecasting</li>
                    <li>Competitive market analysis</li>
                    <li>Property portfolio management</li>
                    <li>Custom reporting and data exports</li>
                  </ul>
                  <Link to="/dashboard/investor" className="preview-link">View Investor Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Enhanced Social Proof */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-subtitle">Success Stories</span>
          <h2>Trusted by Luxury Properties Worldwide</h2>
          <p className="section-description">Join the growing network of premium hotels elevating their guest experience with SOVA.</p>
        </div>
        <div className="testimonials-carousel">
          <div className="testimonial">
            <div className="testimonial-rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <div className="testimonial-content">
              <p>"SOVA has transformed our guest experience and streamlined our operations. The digital check-in and room key features have been particularly popular with our guests, and the analytics dashboard has given us unprecedented insights into our business performance."</p>
            </div>
            <div className="testimonial-author">
              <img src="/images/testimonial-1.jpg" alt="Sarah Johnson, General Manager at The Royal Palms Hotel" />
              <div>
                <h4>Sarah Johnson</h4>
                <p>General Manager, The Royal Palms Hotel</p>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <div className="testimonial-content">
              <p>"Implementing SOVA has resulted in a 42% increase in ancillary revenue and a 28% improvement in guest satisfaction scores. The platform's intuitive design made staff training simple, and we were fully operational within just two weeks."</p>
            </div>
            <div className="testimonial-author">
              <img src="/images/testimonial-2.jpg" alt="Michael Chen, Director of Operations at Azure Bay Resort" />
              <div>
                <h4>Michael Chen</h4>
                <p>Director of Operations, Azure Bay Resort</p>
              </div>
            </div>
          </div>
        </div>
        <div className="brand-logos">
          <h3>Featured Partners</h3>
          <div className="logo-grid">
            <img src="/images/partner-logo-1.png" alt="Luxury Hotel Partner" />
            <img src="/images/partner-logo-2.png" alt="Luxury Hotel Partner" />
            <img src="/images/partner-logo-3.png" alt="Luxury Hotel Partner" />
            <img src="/images/partner-logo-4.png" alt="Luxury Hotel Partner" />
            <img src="/images/partner-logo-5.png" alt="Luxury Hotel Partner" />
          </div>
        </div>
      </section>

      {/* Waitlist Form with Optimized Conversion */}
      <section className="waitlist-section">
        <div className="waitlist-content">
          <span className="section-subtitle">Limited Availability</span>
          <h2>Join the SOVA Network</h2>
          <p>Be among the first to experience the future of luxury hospitality management. Our platform is currently available by invitation only.</p>
          <form className="waitlist-form">
            <div className="form-group">
              <label htmlFor="hotel-name">Hotel Name</label>
              <input type="text" id="hotel-name" placeholder="Your Hotel or Property Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Your Business Email" required />
            </div>
            <div className="form-group">
              <label htmlFor="property-type">Property Type</label>
              <select id="property-type" required>
                <option value="">Select Property Type</option>
                <option value="boutique">Boutique Hotel</option>
                <option value="luxury">Luxury Resort</option>
                <option value="business">Business Hotel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="privacy-policy" required />
              <label htmlFor="privacy-policy">I agree to the <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms of Service</Link></label>
            </div>
            <button type="submit" className="waitlist-button">Request Early Access</button>
          </form>
          <div className="referral-bonus">
            <p>Refer another property and receive 3 months free when they sign up!</p>
          </div>
        </div>
      </section>

      {/* FAQ Section with Enhanced Schema */}
      <section className="faq-section">
        <div className="section-header">
          <span className="section-subtitle">Common Questions</span>
          <h2>Frequently Asked Questions</h2>
          <p className="section-description">Everything you need to know about the SOVA platform.</p>
        </div>
        <div className="faq-container" itemScope itemType="https://schema.org/FAQPage">
          <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">How does SOVA improve guest experience?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">SOVA enhances guest experience through digital check-in, mobile room keys, personalized recommendations, and instant service requests—all accessible through a user-friendly mobile app. Our platform reduces wait times by up to 70% and increases guest satisfaction scores by an average of 32%.</p>
            </div>
          </div>
          <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">Is SOVA suitable for small boutique hotels?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">Absolutely! SOVA is designed to scale with your business, offering tailored solutions for boutique properties with as few as 10 rooms up to large luxury resorts with 500+ rooms. Our flexible pricing model ensures you only pay for what you need, with packages starting at just $299/month for boutique properties.</p>
            </div>
          </div>
          <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">How long does implementation take?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">Most properties are fully operational with SOVA within 2-4 weeks, including staff training and system integration. Our dedicated implementation team ensures a smooth transition with minimal disruption to your operations. We provide comprehensive training materials, 24/7 support, and a dedicated account manager throughout the onboarding process.</p>
            </div>
          </div>
          <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">How does SOVA integrate with existing hotel management systems?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">SOVA offers seamless integration with all major property management systems (PMS), point of sale (POS) systems, and customer relationship management (CRM) platforms. Our API-first approach ensures compatibility with your existing technology stack, allowing for real-time data synchronization and unified operations.</p>
            </div>
          </div>
          <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">What kind of support does SOVA provide?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">SOVA provides 24/7 technical support via phone, email, and live chat. All clients receive a dedicated account manager, regular system updates, and access to our comprehensive knowledge base. Premium support packages include on-site training, custom development, and priority issue resolution.</p>
            </div>
          </div>
        </div>
        <div className="faq-cta">
          <p>Have more questions? We're here to help.</p>
          <Link to="/contact" className="cta-button secondary">Contact Us</Link>
        </div>
      </section>

      {/* Final CTA with Bold Typography */}
      <section className="final-cta">
        <h2>Ready to Transform Your Hospitality Experience?</h2>
        <p className="cta-description">Join the network of luxury properties elevating their guest experience with SOVA.</p>
        <div className="cta-buttons">
          <Link to="/app" className="cta-button primary">Experience the App</Link>
          <Link to="/contact" className="cta-button secondary">Request Demo</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
