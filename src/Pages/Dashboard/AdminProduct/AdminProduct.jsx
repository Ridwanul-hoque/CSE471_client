import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        image: null
    });

    // Get auth token from localStorage
    const getAuthToken = () => localStorage.getItem('authToken');

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            stockQuantity: '',
            image: null
        });
        setIsEditing(false);
        setSelectedProduct(null);
    };

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            category: product.category || '',
            price: product.price,
            stockQuantity: product.stockQuantity,
            image: null // Can't pre-fill file input
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Create FormData object to handle file upload
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('description', formData.description);
            productData.append('price', formData.price);
            productData.append('category', formData.category);
            productData.append('stockQuantity', formData.stockQuantity);

            if (formData.image) {
                productData.append('image', formData.image);
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (isEditing) {
                // Update existing product
                await axios.put(`http://localhost:5000/api/products/${selectedProduct._id}`, productData, config);
            } else {
                // Create new product
                await axios.post('http://localhost:5000/api/products', productData, config);
            }

            // Refresh product list
            fetchProducts();
            resetForm();

        } catch (err) {
            setError(isEditing ? 'Failed to update product' : 'Failed to add product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoading(true);
                await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
                fetchProducts();
            } catch (err) {
                setError('Failed to delete product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && products.length === 0) {
        return <div className="p-4">Loading products...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Product Administration</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Form */}
                <div className="md:col-span-1 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Price *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Product Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                className="w-full p-2"
                                accept="image/*"
                            />
                            {isEditing && !formData.image && selectedProduct.image && (
                                <div className="mt-2">
                                    <span className="text-sm">Current image: </span>
                                    <span className="text-sm text-blue-600">{selectedProduct.image}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : isEditing ? 'Update Product' : 'Add Product'}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Products List */}
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Products List</h2>

                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">Price</th>
                                        <th className="py-2 px-4 text-left">Stock</th>
                                        <th className="py-2 px-4 text-left">Category</th>
                                        <th className="py-2 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className="border-t">
                                            <td className="py-2 px-4">{product.name}</td>
                                            <td className="py-2 px-4">${parseFloat(product.price).toFixed(2)}</td>
                                            <td className="py-2 px-4">{product.stockQuantity}</td>
                                            <td className="py-2 px-4">{product.category || '-'}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2 hover:bg-blue-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductAdmin;