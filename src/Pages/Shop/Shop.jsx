import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Providers/AuthProviders';


const Shop = () => {
    const { user } = useContext(AuthContext);

    // Products and shop states
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(-1); // Initialize to -1 to show products first

    // Checkout form
    const [checkoutForm, setCheckoutForm] = useState({
        shippingAddress: {
            fullName: user?.displayName || '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        },
        paymentMethod: 'credit_card',
        paymentDetails: {}
    });

    // Order states
    const [orders, setOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderMessage, setOrderMessage] = useState('');

    // Payment form state
    const [paymentFormData, setPaymentFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    // Get auth token from localStorage
    const getAuthToken = () => localStorage.getItem('access-token');

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
        if (user) {
            fetchOrders();
        }
    }, [user]);

    // Extract categories from products
    useEffect(() => {
        if (products.length > 0) {
            const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
            setCategories(uniqueCategories);
        }
    }, [products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/products', {
                params: {
                    inStock: 'true',
                    ...(selectedCategory && { category: selectedCategory })
                }
            });
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        if (!user) return;

        try {
            const token = getAuthToken();
            if (!token) {
                console.log('No auth token found, skipping orders fetch');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            // Don't show error to user for orders fetch failure
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const addToCart = (product) => {
        // Check if product is already in cart
        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            // Update quantity if already in cart
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new item to cart
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Check if the new quantity exceeds available stock
        const product = products.find(p => p._id === productId);
        if (product && newQuantity > product.stockQuantity) {
            alert(`Sorry, only ${product.stockQuantity} items available in stock.`);
            return;
        }

        setCart(cart.map(item =>
            item._id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckoutInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setCheckoutForm({
                ...checkoutForm,
                [parent]: {
                    ...checkoutForm[parent],
                    [child]: value
                }
            });
        } else {
            setCheckoutForm({
                ...checkoutForm,
                [name]: value
            });
        }
    };

    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentFormData({
            ...paymentFormData,
            [name]: value
        });
    };

    const validatePaymentDetails = () => {
        if (checkoutForm.paymentMethod === 'credit_card') {
            // Basic validation for credit card details
            if (!paymentFormData.cardNumber || paymentFormData.cardNumber.trim() === '') {
                alert('Please enter a valid card number');
                return false;
            }

            if (!paymentFormData.expiryDate || paymentFormData.expiryDate.trim() === '') {
                alert('Please enter a valid expiry date');
                return false;
            }

            if (!paymentFormData.cvv || paymentFormData.cvv.trim() === '') {
                alert('Please enter a valid CVV');
                return false;
            }

            // Additional validation could be added here (card number format, expiry date format, etc.)
            // For example:
            if (!/^\d{13,19}$/.test(paymentFormData.cardNumber.replace(/\s/g, ''))) {
                alert('Card number should be between 13-19 digits');
                return false;
            }

            if (!/^\d{3,4}$/.test(paymentFormData.cvv)) {
                alert('CVV should be 3 or 4 digits');
                return false;
            }

            // Basic expiry date validation (MM/YY format)
            const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryPattern.test(paymentFormData.expiryDate)) {
                alert('Expiry date should be in MM/YY format');
                return false;
            }

            // Check if card hasn't expired
            const [month, year] = paymentFormData.expiryDate.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            const currentDate = new Date();

            if (expiryDate < currentDate) {
                alert('Card has expired');
                return false;
            }
        }

        return true;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please login to place an order');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            alert('Authentication required. Please log in again.');
            return;
        }

        // Validate payment details before proceeding
        if (!validatePaymentDetails()) {
            return;
        }

        try {
            setLoading(true);

            // Capture payment details based on payment method
            let paymentDetails = {};
            if (checkoutForm.paymentMethod === 'credit_card') {
                paymentDetails = {
                    cardNumber: paymentFormData.cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask all but last 4 digits
                    expiry: paymentFormData.expiryDate,
                    cvv: '***' // Always mask CVV
                };
            }

            const orderData = {
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                shippingAddress: checkoutForm.shippingAddress,
                paymentMethod: checkoutForm.paymentMethod,
                paymentDetails: paymentDetails
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Clear cart
            setCart([]);
            setOrderSuccess(true);
            setOrderMessage(`Order placed successfully! Order ID: ${response.data.orderId}`);

            // Reset payment form data
            setPaymentFormData({
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            });

            // Refresh orders list
            fetchOrders();

            // Reset checkout
            setCheckoutStep(-1);
            setShowCart(false);

            // Refresh products to get updated stock
            fetchProducts();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Order processing failed';
            setError(`Failed to place order: ${errorMessage}`);
            console.error('Order error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderCheckoutStep = () => {
        switch (checkoutStep) {
            case 0: // Shipping information
                return (
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                        <form className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="shippingAddress.fullName"
                                    value={checkoutForm.shippingAddress.fullName}
                                    onChange={handleCheckoutInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                                <input
                                    type="text"
                                    name="shippingAddress.addressLine1"
                                    value={checkoutForm.shippingAddress.addressLine1}
                                    onChange={handleCheckoutInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                                <input
                                    type="text"
                                    name="shippingAddress.addressLine2"
                                    value={checkoutForm.shippingAddress.addressLine2}
                                    onChange={handleCheckoutInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        name="shippingAddress.city"
                                        value={checkoutForm.shippingAddress.city}
                                        onChange={handleCheckoutInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">State/Province</label>
                                    <input
                                        type="text"
                                        name="shippingAddress.state"
                                        value={checkoutForm.shippingAddress.state}
                                        onChange={handleCheckoutInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        name="shippingAddress.postalCode"
                                        value={checkoutForm.shippingAddress.postalCode}
                                        onChange={handleCheckoutInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Country</label>
                                    <input
                                        type="text"
                                        name="shippingAddress.country"
                                        value={checkoutForm.shippingAddress.country}
                                        onChange={handleCheckoutInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCart(true);
                                        setCheckoutStep(-1);
                                    }}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Back to Cart
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        // Validate form
                                        const { fullName, addressLine1, city, state, postalCode, country } = checkoutForm.shippingAddress;
                                        if (fullName && addressLine1 && city && state && postalCode && country) {
                                            setCheckoutStep(1);
                                        } else {
                                            alert('Please fill all required fields');
                                        }
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Next: Payment
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 1: // Payment information
                return (
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                        <form onSubmit={handlePlaceOrder} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={checkoutForm.paymentMethod}
                                    onChange={handleCheckoutInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="credit_card">Credit Card</option>
                                    {/* <option value="paypal">PayPal</option> */}
                                    <option value="cod">Cash on Delivery</option>
                                </select>
                            </div>

                            {checkoutForm.paymentMethod === 'credit_card' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={paymentFormData.cardNumber}
                                            onChange={handlePaymentFormChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={paymentFormData.expiryDate}
                                                onChange={handlePaymentFormChange}
                                                className="w-full p-2 border rounded"
                                                placeholder="MM/YY"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={paymentFormData.cvv}
                                                onChange={handlePaymentFormChange}
                                                className="w-full p-2 border rounded"
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {checkoutForm.paymentMethod === 'paypal' && (
                                <div>
                                    <p className="text-sm">You will be redirected to PayPal to complete your payment.</p>
                                </div>
                            )}

                            {checkoutForm.paymentMethod === 'cod' && (
                                <div>
                                    <p className="text-sm">You will pay in cash when your order is delivered.</p>
                                </div>
                            )}

                            <div className="bg-gray-100 p-3 rounded mt-4">
                                <h4 className="font-medium">Order Summary</h4>
                                <div className="flex justify-between mt-2">
                                    <span>Subtotal:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>$5.00</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                    <span>Total:</span>
                                    <span>${(calculateTotal() + 5).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => setCheckoutStep(0)}
                                    className="btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                                >
                                    Back to Shipping
                                </button>

                                <button
                                    type="submit"
                                    className="btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderCart = () => {
        if (cart.length === 0) {
            return (
                <div className="p-4 text-center">
                    <p>Your cart is empty</p>
                    <button
                        onClick={() => setShowCart(false)}
                        className="mt-4 btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition "
                    >
                        Continue Shopping
                    </button>
                </div>
            );
        }

        return (
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Your Cart</h3>

                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item._id} className="flex items-center border-b pb-4">
                            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-gray-600 text-sm">${parseFloat(item.price).toFixed(2)}</p>
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="px-2 py-1 border rounded-l"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="px-2 py-1 border rounded-r"
                                >
                                    +
                                </button>
                            </div>

                            <div className="ml-4 text-right">
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-600 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 bg-gray-100 p-4 rounded">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping:</span>
                        <span>$5.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${(calculateTotal() + 5).toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => setShowCart(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => {
                            if (!user) {
                                alert('Please login to checkout');
                                return;
                            }
                            setShowCart(false);
                            setCheckoutStep(0);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        );
    };

    const renderOrders = () => {
        if (!user) {
            return (
                <div className="p-4 text-center">
                    <p>Please login to view your orders</p>
                    <button
                        onClick={() => setShowOrders(false)}
                        className="mt-4 btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                    >
                        Browse Products
                    </button>
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <div className="p-4 text-center">
                    <p>You haven't placed any orders yet</p>
                    <button
                        onClick={() => setShowOrders(false)}
                        className="mt-4 btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                    >
                        Browse Products
                    </button>
                </div>
            );
        }

        return (
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Your Orders</h3>

                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="border rounded p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Order #{order._id.substring(0, 8)}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {order.orderStatus.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">
                                Placed on: {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <div className="mt-2">
                                <h5 className="font-medium text-sm">Items:</h5>
                                <div className="space-y-1">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>${item.subtotal.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                                <span>Total:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                <span>Payment Method: </span>
                                <span>{order.paymentMethod || 'N/A'}</span>
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                <span>Payment Status: </span>
                                <span className={`${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'
                                    }`}>
                                    {order.paymentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowOrders(false)}
                    className="mt-6 btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                >
                    Back to Shop
                </button>
            </div>
        );
    };

    const renderProductGrid = () => {
        if (loading && products.length === 0) {
            return <div className="text-center p-8">Loading products...</div>;
        }

        if (products.length === 0) {
            return <div className="text-center p-8">No products found</div>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white rounded shadow overflow-hidden">
                        <div className="h-48 bg-gray-200">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="font-medium text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description || 'No description available'}</p>

                            <div className="mt-2 flex justify-between items-center">
                                <p className="font-bold">${parseFloat(product.price).toFixed(2)}</p>
                                <span className={`text-xs ${product.stockQuantity > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {product.stockQuantity} in stock
                                </span>
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                className="mt-3 w-full btn bg-[#92093b] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                                disabled={product.stockQuantity < 1}
                            >
                                {product.stockQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Auth check notification
    const renderAuthAlert = () => {
        if (!user && (showOrders || checkoutStep >= 0)) {
            return (
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
                    Please log in to proceed with checkout or view orders.
                </div>
            );
        }
        return null;
    };

    // Render main content based on current view
    const renderMainContent = () => {
        if (showOrders) {
            return renderOrders();
        }

        if (showCart) {
            return renderCart();
        }

        if (checkoutStep > -1) {
            return renderCheckoutStep();
        }

        return (
            <>
                <div className="mb-6 bg-white p-4 rounded shadow max-w-[105rem] mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Shop Products</h2>

                    {/* Category filter */}
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`px-3 py-1 rounded ${selectedCategory === '' ? 'btn bg-[#860736] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition' : 'bg-gray-200'
                                    }`}
                            >
                                All
                            </button>

                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-3 py-1 rounded ${selectedCategory === category ? 'btn bg-[#6d072c] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition' : 'bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products grid */}
                    {renderProductGrid()}
                </div>
            </>
        );
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Online Store</h1>

                <div className="flex items-center gap-4">
                    {user ? (
                        <span className="text-sm">Welcome, {user.displayName || user.email}</span>
                    ) : (
                        <span className="text-sm text-orange-600">Please login to checkout</span>
                    )}

                    <button
                        onClick={() => {
                            setShowOrders(!showOrders);
                            setShowCart(false);
                            setCheckoutStep(-1);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        My Orders
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowCart(!showCart);
                                setShowOrders(false);
                                setCheckoutStep(-1);
                            }}
                            className="flex items-center"
                        >
                            <span className="mr-1">Cart</span>
                            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {cart.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {orderSuccess && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {orderMessage}
                </div>
            )}

            {renderAuthAlert()}

            {/* Main content */}
            {renderMainContent()}
        </div>
    );
};

export default Shop;