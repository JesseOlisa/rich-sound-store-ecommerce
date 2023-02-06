import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';

import { runFireworksConfetti } from '@/lib/utils';

const Success = () => {
	useEffect(() => {
		localStorage.clear();
		runFireworksConfetti();
	}, []);

	return (
		<div className='success-wrapper'>
			<div className='success'>
				<p className='icon'>
					<BsBagCheckFill />
				</p>
				<h2>Thank you for your Orders!</h2>
				<p className='email'>Check your email inbox for your receipt</p>
				<p className='description'>
					If you have any questinons, please send us an email
					<a
						className='email'
						href='mailto:jessesamuel84@gmail.com'
					>
						here
					</a>
				</p>
				<Link href='/'>
					<button
						type='button'
						width='300px'
						className='btn'
					>
						Continue Shopping
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Success;
