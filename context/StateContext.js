import product from '@/sanity_ecommerce/schemas/product';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const Context = createContext();

export const StateContext = ({ children }) => {
	let router = useRouter();
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantities, setTotalQuantities] = useState(0);
	const [qty, setQty] = useState(1);

	let foundProduct;
	let index;

	// ADD TO CART FUNCTION
	const onAdd = (product, quantity) => {
		const checkProductinCart = cartItems.find(
			(item) => item?._id === product._id
		);

		setTotalPrice(
			(prevTotalPrice) => prevTotalPrice + product.price * quantity
		);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

		if (checkProductinCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct._id === product._id)
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					};
			});

			setCartItems(updatedCartItems);
		} else {
			product.quantity = quantity;

			setCartItems([...cartItems, { ...product }]);
		}
		toast.success(`${qty} ${product.name} added to cart`);
	};

	const onRemove = (product) => {
		foundProduct = cartItems.find((item) => item?._id === product?._id);
		const newCartItems = cartItems.filter((item) => item._id !== product?._id);

		setTotalPrice(
			(prevTotalPrice) =>
				prevTotalPrice - foundProduct.price * foundProduct.quantity
		);
		setTotalQuantities(
			(prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
		);
		setCartItems(newCartItems);
	};

	const onSuccess = () => {
		setCartItems([]);
		setShowCart(false);
		setTotalQuantities(0);
		setTotalPrice(0);
		router.push('/success');
		// toast.success(`Payment Successful. We hope your enjoy our products`);
	};
	const toggleCartItemQunatity = (id, value) => {
		/* 
			Map thorugh the array 
			check for the product that matches the id
			spread the rest of the products info
			and update the quantity
		*/
		foundProduct = cartItems.find((item) => item?._id === id);
		index = cartItems.findIndex((product) => product?._id === id);
		const newCartItems = cartItems.filter((item) => item._id !== id);

		if (value === 'inc') {
			setCartItems([
				...newCartItems,
				{ ...foundProduct, quantity: foundProduct.quantity + 1 },
			]);
			setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
			setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
		} else if (value === 'dec') {
			if (foundProduct.quantity > 1) {
				setCartItems([
					...newCartItems,
					{ ...foundProduct, quantity: foundProduct.quantity - 1 },
				]);
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
			}
		}
	};
	//FUNCTIONS
	const incQty = () => {
		setQty((prevQty) => prevQty + 1);
	};
	const decQty = () => {
		setQty((prevQty) => {
			if (prevQty - 1 < 1) return 1;

			return prevQty - 1;
		});
	};

	return (
		<Context.Provider
			value={{
				showCart,
				cartItems,
				totalPrice,
				totalQuantities,
				qty,
				incQty,
				decQty,
				onAdd,
				setShowCart,
				toggleCartItemQunatity,
				onRemove,
				onSuccess,
				setCartItems,
				setTotalPrice,
				setTotalQuantities,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useStateContext = () => useContext(Context);
