import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

export const useProductStore = create((set, get) => ({
    // products state
    products: [],
    loading: false,
    error: null,
    rateLimitCount: 0,

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
    }
}))