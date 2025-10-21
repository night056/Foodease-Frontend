import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/AxiosConfig';
import { jwtDecode } from 'jwt-decode';

const RestaurantOrders = () => {
    const { restaurantId } = useParams();
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const username = decoded.sub;

    useEffect(() => {
        API.get(`/orders/owner/restaurant/${restaurantId}/orders`)
            .then((res) => setOrders(res.data))
            .catch((err) => console.error('Error fetching orders:', err));
    }, [restaurantId]);

    const handleAssignDelivery = (orderId) => {
        API.post(`orders/deliveries/assign/${orderId}`)
            .then(() => {
                alert(`Order ${orderId} assigned for delivery.`);
                // Refresh orders to reflect updated status
                API.get(`/orders/owner/restaurant/${restaurantId}/orders`)
                    .then((res) => setOrders(res.data));
            })
            .catch((err) => console.error('Error assigning delivery:', err));
    };

    const handleConfirmOrder = (orderId) => {
        API.put(`/orders/${orderId}/approve`)
            .then(() => {
                alert(`Order ${orderId} confirmed.`);
                API.get(`/orders/owner/restaurant/${restaurantId}/orders`)
                    .then((res) => setOrders(res.data));
            })
            .catch((err) => console.error('Error confirming order:', err));
    };

    const filteredOrders = orders.filter((order) => {
        if (order.status === 'DRAFT') return false;
        if (filter === 'ALL') return true;
        return order.status === filter;
    });

    return (
        <>
            <Navbar role="owner" username={username} />
            <div className="dashboard-content">
                <h2>📦 Orders for Restaurant #{restaurantId}</h2>

                <div style={{ marginBottom: '20px' }}>
                    <button className="explore-button" onClick={() => setFilter('ALL')}>All</button>
                    <button className="explore-button" onClick={() => setFilter('PENDING')}>Pending</button>
                    <button className="explore-button" onClick={() => setFilter('CONFIRMED')}>Confirmed</button>
                    <button className="explore-button" onClick={() => setFilter('DELIVERED')}>Delivered</button>
                </div>

                {filteredOrders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="order-cards-container">
                        {filteredOrders.map((order) => (
                            <div key={order.orderId} className="order-card">
                                <h3>Order #{order.orderId}</h3>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Total:</strong> ₹{order.totalAmt}</p>
                                <p><strong>Items:</strong></p>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.name} × {item.quantity} — ₹{item.price}
                                        </li>
                                    ))}
                                </ul>

                                {order.status === 'CONFIRMED' && (
                                    <button
                                        className="explore-button"
                                        onClick={() => handleAssignDelivery(order.orderId)}
                                    >
                                        Assign for Delivery
                                    </button>
                                )}

                                {order.status === 'PENDING' && (
                                    <button
                                        className="explore-button"
                                        onClick={() => handleConfirmOrder(order.orderId)}
                                    >
                                        Confirm Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default RestaurantOrders;