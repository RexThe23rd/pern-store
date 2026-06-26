import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

export const useProductStore = create((set, get) => ({
    // products state
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
    rateLimitCount: 0,

    // form state
    formData: {
        name: '',
        price: '',
        image: ''
    },

    setFormData: (formData) => set({ formData }),
    resetForm: () => set({ formData: { name: '', price: '', image: '' } }),

    addProduct: async (e) => {
        e.preventDefault();
        set({ loading: true });

        try {
            const { formData } = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetForm();
            toast.success('Product added successfully.');
            document.getElementById('add-product-modal').close()
        } catch (err) {
            console.error("The product didn't consent to being added:", err);
            set({ error: "Something went wrong while adding the product." });
            toast.error('An error occurred while adding the product.');
        } finally {
            set({ loading: false })
        }
    },

    // fetch products from db
    fetchProducts: async () => {
        set({ loading: true });

        try {
            const response = await axios.get(`${BASE_URL}/api/products`);

            set({
                products: response.data.products,
                error: null
            });

        } catch (err) {

            if (err.response?.status === 429) {

                const count = get().rateLimitCount + 1;

                let message = "Too many requests. Slow down you dummy :P";

                if (count >= 3)
                    message = "Too many requests. The server is getting concerned.";

                if (count >= 5)
                    message = "Too many requests. Have you considered not clicking refresh?";

                if (count >= 10)
                    message = "Too many requests. This is why we can't have nice things.";

                if (count >= 15)
                    message = "Too many requests. The API has filed a restraining order.";

                if (count >= 20)
                    message = "Too many requests. Rex, the loading spinner isnt a toy y'know?";

                set({
                    error: message,
                    products: [],
                    rateLimitCount: count
                });

            } else {

                set({
                    error: 'An error occurred while fetching products.',
                    products: []
                });

            }

        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set(prev => ({ products: prev.products.filter(product => product.id !== id) }));
            toast.success('Product deleted successfully.');
        } catch (err) {
            console.error("Either the product doesn't exist or it refused to die:", err);
            set({ error: "Something went wrong while deleting the product." });
            toast.error('An error occurred while deleting the product.');
        } finally {
            set({ loading: false });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({ currentProduct: response.data.data, formData: response.data.data, error: null, });
        } catch (err) {
            console.error("The product was too shy to want to be edited", err);
            set({ error: "Something went wrong", currentProduct: null });
            toast.error('Something went wrong when fetching the product');
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id) => {
        set({ loading: true })
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData)
            set({currentProduct: response.data.data})
            toast.success('Product updated successfully')
        } catch (error) {
            console.error("The product didn't agree with the changes you made and decided not to accept them.", error)
            toast.error('Something went wrong when updating the product')
        } finally {
            set({ loading: false });
        }
    },
}))