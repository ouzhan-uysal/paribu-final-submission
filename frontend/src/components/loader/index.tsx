import React from 'react'
import styled from 'styled-components';

const Loader = () => {
	return (
		<LoaderWrapper>
			<div className='loaderSpin'>
				<span className='loaderDot loaderDotSpin'>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
				</span>
			</div>
		</LoaderWrapper>
	)
}

export default Loader;

const LoaderWrapper = styled.div`
	height: 100%;
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99999;

	.loaderSpin {
		text-align: center;
	}

	.loaderDot {
		position: relative;
		display: inline-block;
		font-size: 20px;
		width: 30px;
		height: 30px;
	}

	.loaderDotSpin {
		transform: rotate(45deg);
		animation: hipsterRotate 1.2s infinite linear;
	}

	.loaderDot i {
		width: 9px;
		height: 9px;
		border-radius: 100%;
		background-color: #2624c0;
		transform: scale(0.75);
		display: block;
		position: absolute;
		opacity: 0.5;
		animation: hipsterSpinMove 1s infinite linear alternate;
		transform-origin: 50% 50%;
	}

	.loaderDot i:nth-child(1) {
		left: 10px;
		top: 0;
	}

	.loaderDot i:nth-child(2) {
		right: 0;
		top: 8px;
		animation-delay: 0.4s;
	}

	.loaderDot i:nth-child(3) {
		right: 4px;
		bottom: 0;
		animation-delay: 0.8s;
	}

	.loaderDot i:nth-child(4) {
		left: 4px;
		bottom: 0;
		animation-delay: 1.2s;
	}

	.loaderDot i:nth-child(5) {
		left: 0;
		top: 8px;
		animation-delay: 1.2s;
	}

	@keyframes hipsterSpinMove {
		to {
			opacity: 1;
		}
	}

	@keyframes hipsterRotate {
		to {
			transform: rotate(405deg);
		}
	}
`;
