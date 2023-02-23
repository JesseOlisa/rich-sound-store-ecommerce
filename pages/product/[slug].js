import React, { useState, useEffect } from 'react';
import {
	AiOutlineMinus,
	AiOutlinePlus,
	AiFillStar,
	AiOutlineStar,
} from 'react-icons/ai';

import { client, urlFor } from '@/lib/client';
import { Product } from '@/components';

import { useStateContext } from '@/context/StateContext';

const ProductDetails = ({ product, allProducts }) => {
	const { image, name, details, price } = product;

	const [index, setIndex] = useState(0);
	const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

	const handleBuyNow = () => {
		onAdd(product, qty);
		setShowCart(true);
	};

	useEffect(() => {
		setIndex(0);
	}, [product]);

	return (
		<div>
			<div className='product-detail-container'>
				<div>
					<div className='image-container'>
						<img
							src={urlFor(image && image[index])}
							className='product-detail-image'
						/>
					</div>
					<div className='small-images-container'>
						{image?.map((item, idx) => (
							<img
								key={idx}
								src={urlFor(item)}
								className={
									idx === index ? 'small-image selected-image' : 'small-image'
								}
								onMouseEnter={() => setIndex(idx)}
							/>
						))}
					</div>
				</div>
				<div className='product-detail-desc'>
					<h1>{name}</h1>
					<div className='reviews'>
						<div>
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiOutlineStar />
						</div>
						<p>(20)</p>
					</div>
					<h4>Details:</h4>
					<p>{details}</p>
					<p className='price'>&#x20A6;{price.toLocaleString()}</p>
					<div className='quantity'>
						<h3>Quantity:</h3>
						<p className='quantity-desc'>
							<span
								className='minus'
								onClick={decQty}
							>
								<AiOutlineMinus />
							</span>
							<span className='num'>{qty}</span>
							<span
								className='plus'
								onClick={incQty}
							>
								<AiOutlinePlus />
							</span>
						</p>
					</div>
					<div className='buttons'>
						<button
							type='button'
							className='add-to-cart'
							onClick={() => onAdd(product, qty)}
						>
							Add to cart
						</button>
						<button
							type='button'
							className='buy-now'
							onClick={handleBuyNow}
						>
							Buy Now
						</button>
					</div>
				</div>
			</div>

			<div className='maylike-products-wrapper'>
				<h2>You may also like</h2>
				<div className='marquee'>
					<div className='maylike-products-container track'>
						{allProducts.map((item, idx) => (
							<Product
								key={idx}
								product={item}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export const getStaticPaths = async () => {
	const query = `*[_type == "product"]  {
        slug {
            current
        }
    }`;
	const allProducts = await client.fetch(query);

	// This is used to get all the slug name for the static url
	const paths = allProducts.map((product) => {
		return {
			params: {
				slug: product.slug.current,
			},
		};
	});

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps = async ({ params: { slug } }) => {
	const query = `*[_type == 'product' && slug.current == '${slug}'][0]`;
	const product = await client.fetch(query);

	const productsQuery = `*[_type == "product"]`;
	const allProducts = await client.fetch(productsQuery);

	return {
		props: { product, allProducts },
	};
};

export default ProductDetails;
