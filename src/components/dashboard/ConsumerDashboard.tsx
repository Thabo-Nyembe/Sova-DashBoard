import React, { useState, useEffect } from 'react';
import '../sova-theme.css';
import { fetchUserProfile, fetchUpcomingStay, fetchOffers, createRoomServiceRequest } from '../api/supabaseApi';

interface ConsumerDashboardProps {
  session: any;
}

const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [upcomingStay, setUpcomingStay] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    // Load user data from Supabase when component mounts
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Get user profile data
        const userId = session?.user?.id;
        if (!userId) {
          console.error('No user ID found in session');
          setLoading(false);
          return;
        }

        const profile = await fetchUserProfile(userId);
        const stay = await fetchUpcomingStay(userId);
        const availableOffers = await fetchOffers();

        setUserData({
          name: profile?.name || 'Guest',
          loyaltyTier: 'Gold', // This would come from a loyalty_tiers table in a real app
          points: 2450, // This would come from a user_points table in a real app
        });
        
        setUpcomingStay(stay);
        setOffers(availableOffers);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session]);

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle room service request
  const handleRoomServiceRequest = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) return;
      
      // This would typically open a modal for item selection
      // For demo purposes, we'll create a breakfast request
      await createRoomServiceRequest(userId, 'Breakfast', 1);
      alert('Room service request submitted successfully!');
    } catch (error) {
      console.error('Error creating room service request:', error);
      alert('Failed to submit room service request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container bg-ivory">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="text-center">
            <div className="spinner-border text-gold" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container bg-ivory">
      <div className="dashboard-content fade-in">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {userData?.name}</h1>
          <p className="dashboard-subtitle">Your luxury experience awaits</p>
        </div>

        {/* Loyalty Status */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-gold text-navy">{userData?.loyaltyTier} Member</span>
                <h3 className="mt-2 mb-0">{userData?.points} Points</h3>
                <p className="text-muted">Your current loyalty balance</p>
              </div>
              <div className="text-right">
                <button className="btn btn-gold">View Benefits</button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Stay */}
        {upcomingStay && (
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">Upcoming Stay</h2>
            </div>
            <div className="card-body">
              <h3 className="mb-1">{upcomingStay.hotelName}</h3>
              <p className="text-muted mb-3">{upcomingStay.location}</p>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="p-3 bg-ivory rounded">
                    <small className="text-muted">Check-in</small>
                    <p className="mb-0 fw-bold">{formatDate(upcomingStay.checkIn)}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-ivory rounded">
                    <small className="text-muted">Check-out</small>
                    <p className="mb-0 fw-bold">{formatDate(upcomingStay.checkOut)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${upcomingStay.status === 'confirmed' ? 'bg-success' : 'bg-light'}`} style={{width: '16px', height: '16px'}}></div>
                    <div className="ms-2">Confirmed</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${upcomingStay.status === 'preparing' ? 'bg-warning' : 'bg-light'}`} style={{width: '16px', height: '16px'}}></div>
                    <div className="ms-2">Preparing</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${upcomingStay.status === 'ready' ? 'bg-success' : 'bg-light'}`} style={{width: '16px', height: '16px'}}></div>
                    <div className="ms-2">Ready</div>
                  </div>
                </div>
                <div className="progress" style={{height: '4px'}}>
                  <div 
                    className="progress-bar bg-gold" 
                    role="progressbar" 
                    style={{
                      width: upcomingStay.status === 'confirmed' ? '33%' : 
                             upcomingStay.status === 'preparing' ? '66%' : 
                             upcomingStay.status === 'ready' ? '100%' : '0%'
                    }}
                    aria-valuenow={
                      upcomingStay.status === 'confirmed' ? 33 : 
                      upcomingStay.status === 'preparing' ? 66 : 
                      upcomingStay.status === 'ready' ? 100 : 0
                    }
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary">Manage Reservation</button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="mb-3">Quick Actions</h2>
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="display-4">🔑</span>
                </div>
                <h3 className="card-title h5">Digital Key</h3>
                <p className="card-text text-muted">Access your room with your smartphone</p>
                <button className="btn btn-primary w-100">Access Key</button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="display-4">🍽️</span>
                </div>
                <h3 className="card-title h5">Room Service</h3>
                <p className="card-text text-muted">Order food and beverages to your room</p>
                <button className="btn btn-primary w-100" onClick={handleRoomServiceRequest}>Order Now</button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="display-4">💆</span>
                </div>
                <h3 className="card-title h5">Spa Booking</h3>
                <p className="card-text text-muted">Schedule a relaxing spa treatment</p>
                <button className="btn btn-primary w-100">Book Session</button>
              </div>
            </div>
          </div>
        </div>

        {/* Offers & Rewards */}
        <h2 className="mb-3">Exclusive Offers</h2>
        <div className="row mb-4">
          {offers.map((offer) => (
            <div className="col-md-6 col-lg-4 mb-3" key={offer.id}>
              <div className="card h-100">
                <img 
                  src={offer.image} 
                  className="card-img-top" 
                  alt={offer.title}
                  style={{height: '180px', objectFit: 'cover'}}
                />
                <div className="card-body">
                  <h3 className="card-title h5">{offer.title}</h3>
                  <p className="card-text">{offer.description}</p>
                  <p className="card-text"><small className="text-muted">Valid until {formatDate(offer.validUntil)}</small></p>
                </div>
                <div className="card-footer bg-white">
                  <button className="btn btn-secondary w-100">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Module */}
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">Your Feedback Matters</h2>
          </div>
          <div className="card-body">
            <p>We value your opinion. Please share your experience with us after your stay to help us improve our services.</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-gold text-navy">Earn 500 bonus points</span>
                <p className="mt-2 mb-0">Complete a survey after your stay</p>
              </div>
              <button className="btn btn-primary">View Surveys</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
