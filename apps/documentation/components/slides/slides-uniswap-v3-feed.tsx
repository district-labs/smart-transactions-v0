import React from 'react';
import ImageGallery from "react-image-gallery";

const slides = [
    {
        name: 'Cover',
        original:'/slides/uniswap-v3-feed/cover.png'
    },
    {
        name: 'Smart Transactions',
        original:'/slides/uniswap-v3-feed/observing-token-price.png'
    },
]

export default function SlidesUniswapV3Feed() {
  return (
    <ImageGallery items={slides.map((slide) => {
      return {
          original: slide.original,
          thumbnail: slide.original,
          originalAlt: slide.name,
          thumbnailAlt: slide.name
      }
  })} />
  );
}
