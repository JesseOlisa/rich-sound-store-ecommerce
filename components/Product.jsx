import React from 'react';
import Link from 'next/link';

import { urlFor } from '@/lib/client';

const Product = ({ product }) => {
	const { image, name, slug, price } = product;
	return (
		<div>
			<Link href={`/product/${slug.current}`}>
				<div className='product-card'>
					<img
						src={urlFor(image && image[0])}
						width={250}
						height={250}
						className='product-image'
						alt='product'
					/>
					<p className='product-name'>{name}</p>
					<p className='product-price'>&#x20A6;{`${price.toLocaleString()}`}</p>
				</div>
			</Link>
		</div>
	);
};

export default Product;
