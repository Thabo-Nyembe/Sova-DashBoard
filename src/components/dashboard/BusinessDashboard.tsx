import React, { useState, useEffect } from 'react';
import '../sova-theme.css';
import { 
  fetchBookings,
  fetchRoomServiceRequests,
  fetchHousekeepingStatus,
  fetchGuestSatisfaction,
  getAllOrders
} from '../api/supabaseApi';

interface BusinessDashboardProps {
  session: any;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    occupancy: 0,
    adr: 0,
    revPAR: 0,
    dailyRevenue: 0,
    checkIns: 0,
    checkOuts: 0,
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [housekeeping, setHousekeeping] = useState({
    clean: 0,
    dirty: 0,
    maintenance: 0,
    outOfOrder: 0,
  });
  const [satisfaction, setSatisfaction] = useState({
    overall: 0,
    cleanliness: 0,
    service: 0,
    amenities: 0,
    value: 0,
    recentFeedback: [],
  });

  useEffect(() => {
    // Load data from Supabase when component mounts
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Get user ID from session
        const userId = session?.user?.id;
        if (!userId) {
          console.error('No user ID found in session');
          setLoading(false);
          return;
        }

        // Fetch bookings
        const bookingsData = await fetchBookings();
        setBookings(bookingsData);

        // Fetch orders
        const { data: ordersData, error: ordersError } = await getAllOrders();
        if (!ordersError) {
          setOrders(ordersData || []);
        }

        // Calculate KPIs based on bookings
        const today = new Date().toISOString().split('T')[0];
        const checkInsToday = bookingsData.filter((b: any) => b.check_in_date === today).length;
        const checkOutsToday = bookingsData.filter((b: any) => b.check_out_date === today).length;
        
        // For a real app, these would come from actual calculations
        // For now, we'll use some derived values
        const totalRooms = 68; // Example total rooms
        const occupiedRooms = bookingsData.filter((b: any) => 
          new Date(b.check_in_date) <= new Date() && 
          new Date(b.check_out_date) > new Date()
        ).length;
        
        const occupancyRate = (occupiedRooms / totalRooms) * 100;
        const averageDailyRate = 325; // Example ADR
        const revenuePerAvailableRoom = (occupancyRate / 100) * averageDailyRate;
        
        // Calculate daily revenue from orders
        const todayOrders = ordersData ? ordersData.filter((o: any) => 
          new Date(o.created_at).toISOString().split('T')[0] === today
        ) : [];
        
        const dailyRevenue = todayOrders.reduce((sum: number, order: any) => 
          sum + (order.total_amount || 0), 0) || occupiedRooms * averageDailyRate;

        setKpis({
          occupancy: parseFloat(occupancyRate.toFixed(1)),
          adr: averageDailyRate,
          revPAR: parseFloat(revenuePerAvailableRoom.toFixed(2)),
          dailyRevenue: dailyRevenue,
          checkIns: checkInsToday,
          checkOuts: checkOutsToday,
        });

        // Fetch housekeeping status
        const housekeepingData = await fetchHousekeepingStatus();
        setHousekeeping(housekeepingData);

        // Fetch guest satisfaction
        const satisfactionData = await fetchGuestSatisfaction();
        setSatisfaction(satisfactionData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [session]);

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="text-center">
            <div className="spinner-border text-gold" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fade-in">
        {/* KPI Cards */}
        <h2 className="mb-3">Key Performance Indicators</h2>
        <div className="stats-grid mb-4">
          <div className="stat-card">
            <div className="stat-title">Occupancy</div>
            <div className="stat-value">{kpis.occupancy}%</div>
            <div className="stat-change positive">+2.5% from last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Average Daily Rate</div>
            <div className="stat-value">{formatCurrency(kpis.adr)}</div>
            <div className="stat-change positive">+$15 from last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">RevPAR</div>
            <div className="stat-value">{formatCurrency(kpis.revPAR)}</div>
            <div className="stat-change positive">+$12 from last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Daily Revenue</div>
            <div className="stat-value">{formatCurrency(kpis.dailyRevenue)}</div>
            <div className="stat-change positive">+$1,250 from yesterday</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Today's Check-ins</div>
            <div className="stat-value">{kpis.checkIns}</div>
            <div className="stat-change">Expected today</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Today's Check-outs</div>
            <div className="stat-value">{kpis.checkOuts}</div>
            <div className="stat-change">Expected today</div>
          </div>
        </div>

        {/* Booking Overview */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Booking Overview</h2>
          <button className="btn btn-secondary" onClick={() => setActiveTab('bookings')}>View All</button>
        </div>
        <div className="table-container mb-4">
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.users?.name || 'Guest'}</td>
                  <td>{booking.room_type || 'Standard'}</td>
                  <td>{formatDate(booking.check_in_date)}</td>
                  <td>{formatDate(booking.check_out_date)}</td>
                  <td>
                    <span className={`badge ${
                      booking.status === 'checked_in' ? 'badge-success' : 
                      booking.status === 'confirmed' ? 'badge-info' : 
                      booking.status === 'checked_out' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {booking.status === 'checked_in' ? 'Checked In' :
                       booking.status === 'confirmed' ? 'Confirmed' :
                       booking.status === 'checked_out' ? 'Checked Out' : 
                       booking.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders Overview */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Recent Orders</h2>
          <button className="btn btn-secondary" onClick={() => setActiveTab('orders')}>View All</button>
        </div>
        <div className="table-container mb-4">
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>{order.users?.name || 'Guest'}</td>
                  <td>{order.item}</td>
                  <td>{order.quantity}</td>
                  <td>{formatCurrency(order.total_amount || 0)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'completed' ? 'badge-success' : 
                      order.status === 'confirmed' ? 'badge-info' : 
                      order.status === 'pending' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Housekeeping Panel */}
        <h2 className="mb-3">Housekeeping Status</h2>
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="d-inline-block rounded-circle bg-success" style={{width: '12px', height: '12px', marginRight: '8px'}}></div>
                <h3 className="card-title h2 mb-0">{housekeeping.clean}</h3>
                <p className="card-text text-muted">Clean</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="d-inline-block rounded-circle bg-warning" style={{width: '12px', height: '12px', marginRight: '8px'}}></div>
                <h3 className="card-title h2 mb-0">{housekeeping.dirty}</h3>
                <p className="card-text text-muted">Dirty</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="d-inline-block rounded-circle bg-info" style={{width: '12px', height: '12px', marginRight: '8px'}}></div>
                <h3 className="card-title h2 mb-0">{housekeeping.maintenance}</h3>
                <p className="card-text text-muted">Maintenance</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="d-inline-block rounded-circle bg-error" style={{width: '12px', height: '12px', marginRight: '8px'}}></div>
                <h3 className="card-title h2 mb-0">{housekeeping.outOfOrder}</h3>
                <p className="card-text text-muted">Out of Order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Satisfaction */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Guest Satisfaction</h2>
          <button className="btn btn-secondary">View Reports</button>
        </div>
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="h5 mb-0">Overall Rating</h3>
                    <p className="text-muted mb-0">Based on recent stays</p>
                  </div>
                  <div className="text-center">
                    <div className="display-4 text-gold">{satisfaction.overall}</div>
                    <div className="text-muted">out of 5</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Cleanliness</span>
                    <span className="text-gold">{satisfaction.cleanliness}</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-gold" 
                      role="progressbar" 
                      style={{width: `${(satisfaction.cleanliness / 5) * 100}%`}}
                      aria-valuenow={satisfaction.cleanliness} 
                      aria-valuemin={0} 
                      aria-valuemax={5}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Service</span>
                    <span className="text-gold">{satisfaction.service}</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-gold" 
                      role="progressbar" 
                      style={{width: `${(satisfaction.service / 5) * 100}%`}}
                      aria-valuenow={satisfaction.service} 
                      aria-valuemin={0} 
                      aria-valuemax={5}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Amenities</span>
                    <span className="text-gold">{satisfaction.amenities}</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-gold" 
                      role="progressbar" 
                      style={{width: `${(satisfaction.amenities / 5) * 100}%`}}
                      aria-valuenow={satisfaction.amenities} 
                      aria-valuemin={0} 
                      aria-valuemax={5}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Value</span>
                    <span className="text-gold">{satisfaction.value}</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-gold" 
                      role="progressbar" 
                      style={{width: `${(satisfaction.value / 5) * 100}%`}}
                      aria-valuenow={satisfaction.value} 
                      aria-valuemin={0} 
                      aria-valuemax={5}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <h3 className="card-title">Recent Feedback</h3>
              </div>
              <div className="card-body p-0">
                {satisfaction.recentFeedback.map((feedback: any) => (
                  <div key={feedback.id} className="p-3 border-bottom">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="fw-bold">{feedback.guest}</div>
                      <div>
                        <span className="badge bg-gold text-navy">{feedback.rating}/5</span>
                      </div>
                    </div>
                    <p className="mb-1">{feedback.comment}</p>
                    <small className="text-muted">{formatDate(feedback.date)}</small>
                  </div>
                ))}
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-secondary">View All Feedback</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookings = () => (
    <div className="fade-in">
      <h2 className="mb-3">Bookings Management</h2>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Check-out Date</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control">
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary">Apply Filters</button>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.users?.name || 'Guest'}</td>
                <td>{booking.room_type || 'Standard'}</td>
                <td>{formatDate(booking.check_in_date)}</td>
                <td>{formatDate(booking.check_out_date)}</td>
                <td>
                  <span className={`badge ${
                    booking.status === 'checked_in' ? 'badge-success' : 
                    booking.status === 'confirmed' ? 'badge-info' : 
                    booking.status === 'checked_out' ? 'badge-warning' : 
                    booking.status === 'cancelled' ? 'badge-danger' : 'badge-secondary'
                  }`}>
                    {booking.status === 'checked_in' ? 'Checked In' :
                     booking.status === 'confirmed' ? 'Confirmed' :
                     booking.status === 'checked_out' ? 'Checked Out' : 
                     booking.status === 'cancelled' ? 'Cancelled' :
                     booking.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-primary">Details</button>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="fade-in">
      <h2 className="mb-3">Orders Management</h2>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Date Range</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary">Apply Filters</button>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.users?.name || 'Guest'}</td>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>{formatCurrency(order.total_amount || 0)}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'completed' ? 'badge-success' : 
                    order.status === 'confirmed' ? 'badge-info' : 
                    order.status === 'pending' ? 'badge-warning' : 
                    order.status === 'cancelled' ? 'badge-danger' : 'badge-secondary'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-primary">Details</button>
                    <button className="btn btn-sm btn-secondary">Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="business-dashboard">
      <div className="dashboard-header mb-4">
        <h1>Business Dashboard</h1>
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'room-service' ? 'active' : ''}`}
            onClick={() => setActiveTab('room-service')}
          >
            Room Service
          </button>
          <button 
            className={`tab-button ${activeTab === 'shuttle' ? 'active' : ''}`}
            onClick={() => setActiveTab('shuttle')}
          >
            Shuttle
          </button>
          <button 
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'room-service' && <div>Room Service Management</div>}
        {activeTab === 'shuttle' && <div>Shuttle Management</div>}
        {activeTab === 'reports' && <div>Reports</div>}
      </div>
    </div>
  );
};

export default BusinessDashboard;
