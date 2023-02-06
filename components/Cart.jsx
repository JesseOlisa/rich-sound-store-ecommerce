import Link from 'next/link';
import React, { useRef } from 'react';
import {
	AiOutlineMinus,
	AiOutlinePlus,
	AiOutlineLeft,
	AiOutlineShopping,
} from 'react-icons/ai';

import { TiDeleteOutline } from 'react-icons/ti';
import { toast } from 'react-hot-toast';

import { useStateContext } from '@/context/StateContext';
import { urlFor } from '@/lib/client';

import { usePaystackPayment } from 'react-paystack';

const Cart = () => {
	const cartRef = useRef();
	const {
		totalPrice,
		totalQuantities,
		cartItems,
		// setCartItems,
		setShowCart,
		toggleCartItemQunatity,
		onRemove,
		onSuccess,
	} = useStateContext();

	const config = {
		reference: new Date().getTime().toString(),
		email: 'jessesamuel84@gmail.com',
		amount: totalPrice * 100, //it must be in kobo
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
	};

	// const onSuccess = (reference) => {
	// 	alert(`Payment Successful your reference is ${reference}`);
	// setCartItems([]);
	// };
	const onClose = () => {
		alert('transaction closed');
	};

	const payWithPaystack = usePaystackPayment(config);
	// console.log(totalPrice)

	return (
		<div
			className='cart-wrapper'
			ref={cartRef}
		>
			<div className='cart-container'>
				<button
					type='button'
					className='cart-heading'
					onClick={() => setShowCart(false)}
				>
					<AiOutlineLeft />
					<span className='heading'>Your Cart</span>
					<span className='cart-num-items'>{totalQuantities} item(s)</span>
				</button>

				{cartItems.length < 1 && (
					<div className='empty-cart'>
						<AiOutlineShopping size={150} />
						<h3>Your Shopping cart is empty</h3>
						<Link href='/'>
							<button
								type='button'
								onClick={() => setShowCart(false)}
								className='btn'
							>
								Continue Shopping
							</button>
						</Link>
					</div>
				)}

				<div className='product-container'>
					{cartItems.length >= 1 &&
						cartItems.map((item, idx) => (
							<div
								className='product'
								key={item._id}
							>
								<img
									src={urlFor(item?.image[0])}
									alt='product'
									className='cart-product-image'
								/>
								<div className='item-desc'>
									<div className='flex top'>
										<h5>{item.name}</h5>
										<h4>&#x20A6;{item.price.toLocaleString()}</h4>
									</div>
									<div className='flex bottom'>
										<div>
											<p className='quantity-desc'>
												<span
													className='minus'
													onClick={() =>
														toggleCartItemQunatity(item?._id, 'dec')
													}
												>
													<AiOutlineMinus />
												</span>
												<span
													className='num'
													// onClick=''
												>
													{item.quantity}
												</span>
												<span
													className='plus'
													onClick={() =>
														toggleCartItemQunatity(item?._id, 'inc')
													}
												>
													<AiOutlinePlus />
												</span>
											</p>
										</div>
										<button
											type='button'
											className='remove-item'
											onClick={() => onRemove(item)}
										>
											<TiDeleteOutline />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
				{cartItems.length >= 1 && (
					<div className='cart-bottom'>
						<div className='total'>
							<h3>Subtotal:</h3>
							<h3>&#x20A6;{totalPrice.toLocaleString()}</h3>
						</div>
						<div className='btn-container'>
							<button
								type='button'
								className='btn'
								onClick={() => payWithPaystack(onSuccess, onClose)}
							>
								Pay with Paystack
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
