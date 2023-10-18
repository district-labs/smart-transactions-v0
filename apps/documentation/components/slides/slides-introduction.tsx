import React from 'react';
import ImageGallery from "react-image-gallery";

const slides = [
    {
        name: 'Slide 1',
        original:'/slides/introduction/cover.png'
    },
    {
        name: 'Problem',
        original:'/slides/introduction/problem.png'
    },
    {
      name: 'Solution',
      original:'/slides/introduction/solution.png'
  }
]

export default function SlidesIntroduction() {
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
