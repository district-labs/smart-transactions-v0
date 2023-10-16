import React from 'react';
import ImageGallery from "react-image-gallery";

const slides = [
    {
        name: 'Cover',
        original:'/slides/zk-data-hub/cover.png'
    },
    {
        name: 'Smart Transactions',
        original:'/slides/zk-data-hub/smart-transactions.png'
    },
    {
      name: 'Powering Intents',
      original:'/slides/zk-data-hub/powering-intents.png'
    },
    {
      name: 'Open Finance Data',
      original:'/slides/zk-data-hub/open-finance-data.png'
    },
    {
        name: 'Mean Reversion Strategy',
        original:'/slides/zk-data-hub/mean-reversion-strategy.png'
    },
    {
        name: 'User and Searcher Relationship',
        original:'/slides/zk-data-hub/user-searcher-relationship.png'
    },
    {
        name: 'Data Marketplace',
        original:'/slides/zk-data-hub/data-marketplace.png'
    },
    {
        name: 'Public Good',
        original:'/slides/zk-data-hub/public-good.png'
    },
]

export default function SlidesZkDataHub() {
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
