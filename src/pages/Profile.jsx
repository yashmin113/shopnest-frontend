
import { useEffect, useState, useContext } from 'react';
import { AutheContext } from '../context/AutheContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../lib/api.js';

const Profile = () => {
  const { user, logout } = useContext(AutheContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const data = await apiFetch('/api/orders/myorders', {
          token: user.token
        });

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        // Token obsolete or 401: clear and bounce
        if (error.status === 401) {
          logout();
          navigate('/login');
        }

        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    /* Full-screen wrapper ensuring the background behind the content is completely black */
    <div className="w-full min-h-screen bg-black py-10 px-4">
      
      {/* Profile Card Container */}
      <div className="max-w-[1000px] mx-auto p-[30px] bg-[#18181b] rounded-xl border border-white/5 text-[#fafafa]">
        {/* Profile Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-[30px] mb-[30px]">
          <div>
            <h2 className="text-white text-[2.2rem] mb-[10px]">
              My Profile
            </h2>

            <p className="text-[#a1a1aa] text-[1.2rem] mb-[5px]">
              <strong>Name:</strong> {user.name}
            </p>

            <p className="text-[#a1a1aa] text-[1.2rem] mb-[15px]">
              <strong>Email:</strong> {user.email}
            </p>

            <span className="inline-block bg-orange-500/10 text-[#f97316] px-3 py-1.5 rounded-lg text-[0.9rem] font-bold">
              Account Type: {user.role?.toUpperCase() || 'USER'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="btn bg-[#ef4444] shadow-none text-white px-4 py-2 rounded-md hover:bg-[#dc2626] transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Order History Header */}
        <h3 className="text-[#f97316] mb-5 text-2xl font-semibold">
          Order History
        </h3>

        {/* Order History Content */}
        {loading ? (
          <p className="text-[#a1a1aa]">
            Fetching your orders...
          </p>
        ) : orders.length === 0 ? (
          <div className="bg-[#09090b] p-[30px] rounded-lg text-center border border-[#27272a]">
            <p className="text-[#a1a1aa] mb-[15px]">
              You haven't placed any orders yet.
            </p>

            <Link to="/shop" className="btn bg-[#f97316] text-white px-4 py-2 rounded-md inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-[#09090b] p-5 rounded-xl border border-[#27272a] flex flex-wrap justify-between items-center gap-5"
              >
                <div>
                  <p className="text-[#a1a1aa] text-[0.9rem] mb-[5px]">
                    Order ID:{' '}
                    <span className="text-white">
                      {order._id}
                    </span>
                  </p>

                  <p className="text-[#a1a1aa] text-[0.9rem] mb-[5px]">
                    Placed On:{' '}
                    <span className="text-white">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : '—'}
                    </span>
                  </p>

                  <p className="text-[#a1a1aa] text-[0.9rem]">
                    Total:{' '}
                    <strong className="text-[#10b981]">
                      ₹{Number(order.totalAmount ?? 0).toFixed(2)}
                    </strong>
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-block px-4 py-2 rounded-full font-bold ${
                      order.status === 'delivered'
                        ? 'bg-emerald-500/10 text-[#10b981]'
                        : order.status === 'shipped'
                        ? 'bg-blue-500/10 text-[#3b82f6]'
                        : order.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-[#f59e0b]'
                    }`}
                  >
                    {order.status
                      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                      : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
