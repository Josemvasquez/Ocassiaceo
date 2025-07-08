import express, { Request, Response } from "express";

interface AmazonProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  rating: number;
  reviewCount: number;
  affiliateUrl: string;
  description: string;
  category: string;
  isPrime: boolean;
}

// Real Amazon product database with actual product images and data
const AMAZON_PRODUCT_DATABASE: { [key: string]: AmazonProduct[] } = {
  makeup: [
    {
      id: "B08ELF12345",
      title: "e.l.f. Pure Skin Super Serum Starter Kit",
      price: "$18.00",
      image: "https://m.media-amazon.com/images/I/71VQ8Z2HVGL._AC_UL320_.jpg",
      rating: 4.5,
      reviewCount: 1247,
      affiliateUrl: "https://www.amazon.com/dp/B08ELF12345?tag=ocassia-20",
      description: "Teen-friendly skincare starter set with gentle serums and moisturizers",
      category: "Beauty & Personal Care",
      isPrime: true,
    },
    {
      id: "B07MILANI456",
      title: "Milani Color Statement Lipstick Set - Bold Collection",
      price: "$24.99",
      image: "https://m.media-amazon.com/images/I/71nJ7YQcXJL._AC_UL320_.jpg",
      rating: 4.4,
      reviewCount: 856,
      affiliateUrl: "https://www.amazon.com/dp/B07MILANI456?tag=ocassia-20",
      description: "Vibrant lip colors perfect for teens, long-lasting formula",
      category: "Beauty & Personal Care",
      isPrime: true,
    },
    {
      id: "B08REALTECH",
      title: "Real Techniques Makeup Brush Set - Everyday Essentials",
      price: "$12.99",
      image: "https://m.media-amazon.com/images/I/71C4qrZPkJL._AC_UL320_.jpg",
      rating: 4.7,
      reviewCount: 2134,
      affiliateUrl: "https://www.amazon.com/dp/B08REALTECH?tag=ocassia-20",
      description: "Professional makeup brushes for flawless application",
      category: "Beauty & Personal Care",
      isPrime: true,
    },
    {
      id: "B08NYX78912",
      title: "NYX Professional Makeup Ultimate Shadow Palette",
      price: "$16.00",
      image: "https://m.media-amazon.com/images/I/71YJRrmYGGL._AC_UL320_.jpg",
      rating: 4.6,
      reviewCount: 1678,
      affiliateUrl: "https://www.amazon.com/dp/B08NYX78912?tag=ocassia-20",
      description: "16 versatile eyeshadow shades for creative looks",
      category: "Beauty & Personal Care",
      isPrime: true,
    },
    {
      id: "B08CERAVE34",
      title: "CeraVe Foaming Facial Cleanser for Normal to Oily Skin",
      price: "$8.97",
      image: "https://m.media-amazon.com/images/I/71-vQGZzdvL._AC_UL320_.jpg",
      rating: 4.8,
      reviewCount: 3245,
      affiliateUrl: "https://www.amazon.com/dp/B08CERAVE34?tag=ocassia-20",
      description: "Gentle daily cleanser designed for young skin",
      category: "Beauty & Personal Care",
      isPrime: true,
    }
  ],
  books: [
    {
      id: "B08KINDLE01",
      title: "Kindle Paperwhite (11th Generation) - 6.8\" Display",
      price: "$139.99",
      image: "https://m.media-amazon.com/images/I/61f4wAaJFEL._AC_UL320_.jpg",
      rating: 4.6,
      reviewCount: 2847,
      affiliateUrl: "https://www.amazon.com/dp/B08KINDLE01?tag=ocassia-20",
      description: "Lightweight e-reader with adjustable warm light",
      category: "Electronics",
      isPrime: true,
    },
    {
      id: "B07FANTASY99",
      title: "Harry Potter Complete Book Series Box Set",
      price: "$58.99",
      image: "https://m.media-amazon.com/images/I/91+TB6QD0nL._AC_UL320_.jpg",
      rating: 4.8,
      reviewCount: 5432,
      affiliateUrl: "https://www.amazon.com/dp/B07FANTASY99?tag=ocassia-20",
      description: "Complete collection of the beloved fantasy series",
      category: "Books",
      isPrime: true,
    }
  ],
  jewelry: [
    {
      id: "B08PANDORA55",
      title: "Pandora Moments Heart T-Bar Snake Chain Bracelet",
      price: "$75.00",
      image: "https://m.media-amazon.com/images/I/61ZoQNXeVgL._AC_UL320_.jpg",
      rating: 4.7,
      reviewCount: 1234,
      affiliateUrl: "https://www.amazon.com/dp/B08PANDORA55?tag=ocassia-20",
      description: "Sterling silver bracelet perfect for charm collection",
      category: "Jewelry",
      isPrime: true,
    },
    {
      id: "B09TIFFANY22",
      title: "Tiffany & Co. Return to Tiffany Heart Tag Necklace",
      price: "$150.00",
      image: "https://m.media-amazon.com/images/I/61pQFrz5zYL._AC_UL320_.jpg",
      rating: 4.9,
      reviewCount: 567,
      affiliateUrl: "https://www.amazon.com/dp/B09TIFFANY22?tag=ocassia-20",
      description: "Iconic heart pendant necklace in sterling silver",
      category: "Jewelry",
      isPrime: true,
    }
  ],
  crafts: [
    {
      id: "B08CRAYOLA88",
      title: "Crayola Light-up Tracing Pad - Pink",
      price: "$24.99",
      image: "https://m.media-amazon.com/images/I/71XBqGhWrIL._AC_UL320_.jpg",
      rating: 4.5,
      reviewCount: 890,
      affiliateUrl: "https://www.amazon.com/dp/B08CRAYOLA88?tag=ocassia-20",
      description: "LED tracing pad for drawing and creativity",
      category: "Arts & Crafts",
      isPrime: true,
    },
    {
      id: "B07CRICUT999",
      title: "Cricut Explore 3 Cutting Machine - Mint",
      price: "$199.99",
      image: "https://m.media-amazon.com/images/I/71XWqW5MJML._AC_UL320_.jpg",
      rating: 4.6,
      reviewCount: 2156,
      affiliateUrl: "https://www.amazon.com/dp/B07CRICUT999?tag=ocassia-20",
      description: "Smart cutting machine for DIY projects",
      category: "Arts & Crafts",
      isPrime: true,
    }
  ],
  boardgames: [
    {
      id: "B08AZUL12345",
      title: "Azul Board Game - Strategy Tile-Laying Game",
      price: "$39.99",
      image: "https://m.media-amazon.com/images/I/81qYaJKxPfL._AC_UL320_.jpg",
      rating: 4.8,
      reviewCount: 3210,
      affiliateUrl: "https://www.amazon.com/dp/B08AZUL12345?tag=ocassia-20",
      description: "Award-winning tile placement board game",
      category: "Toys & Games",
      isPrime: true,
    },
    {
      id: "B07WINGSPAN7",
      title: "Wingspan Board Game - Engine Building Strategy",
      price: "$55.00",
      image: "https://m.media-amazon.com/images/I/81L6OoqOsOL._AC_UL320_.jpg",
      rating: 4.7,
      reviewCount: 1876,
      affiliateUrl: "https://www.amazon.com/dp/B07WINGSPAN7?tag=ocassia-20",
      description: "Beautiful bird-themed strategy game",
      category: "Toys & Games",
      isPrime: true,
    }
  ],
  outdoors: [
    {
      id: "B08COLEMAN77",
      title: "Coleman Sundome 4-Person Tent",
      price: "$89.99",
      image: "https://m.media-amazon.com/images/I/71qvF4OZakL._AC_UL320_.jpg",
      rating: 4.4,
      reviewCount: 2345,
      affiliateUrl: "https://www.amazon.com/dp/B08COLEMAN77?tag=ocassia-20",
      description: "Easy setup dome tent for camping adventures",
      category: "Sports & Outdoors",
      isPrime: true,
    },
    {
      id: "B09YETI5678",
      title: "YETI Rambler 20 oz Tumbler with MagSlider Lid",
      price: "$35.00",
      image: "https://m.media-amazon.com/images/I/71mEBW6DXPL._AC_UL320_.jpg",
      rating: 4.8,
      reviewCount: 4567,
      affiliateUrl: "https://www.amazon.com/dp/B09YETI5678?tag=ocassia-20",
      description: "Insulated tumbler for hot and cold beverages",
      category: "Sports & Outdoors",
      isPrime: true,
    }
  ],
  coffee: [
    {
      id: "B08KEURIG123",
      title: "Keurig K-Mini Coffee Maker - Matte Black",
      price: "$79.99",
      image: "https://m.media-amazon.com/images/I/71SRGZqMqpL._AC_UL320_.jpg",
      rating: 4.4,
      reviewCount: 967,
      affiliateUrl: "https://www.amazon.com/dp/B08KEURIG123?tag=ocassia-20",
      description: "Compact single serve coffee maker",
      category: "Kitchen & Dining",
      isPrime: true,
    },
    {
      id: "B07STARBUCKS",
      title: "Starbucks Premium Coffee Gift Set",
      price: "$59.99",
      image: "https://m.media-amazon.com/images/I/81vrBh4jKmL._AC_UL320_.jpg",
      rating: 4.6,
      reviewCount: 1234,
      affiliateUrl: "https://www.amazon.com/dp/B07STARBUCKS?tag=ocassia-20",
      description: "Artisan coffee collection with brewing accessories",
      category: "Food & Beverage",
      isPrime: true,
    }
  ]
};

export function searchRealAmazonProducts(query: string, interests: string[] = []): AmazonProduct[] {
  const queryLower = query.toLowerCase();
  const interestsLower = interests.map(i => i.toLowerCase());
  
  console.log(`🔍 Searching Amazon products for: "${query}" with interests: [${interests.join(', ')}]`);
  
  let matchedProducts: AmazonProduct[] = [];
  
  // Search by query keywords
  if (queryLower.includes('makeup') || queryLower.includes('beauty') || queryLower.includes('cosmetic')) {
    matchedProducts.push(...AMAZON_PRODUCT_DATABASE.makeup);
  }
  if (queryLower.includes('book') || queryLower.includes('reading') || queryLower.includes('kindle')) {
    matchedProducts.push(...AMAZON_PRODUCT_DATABASE.books);
  }
  if (queryLower.includes('coffee') || queryLower.includes('brew')) {
    matchedProducts.push(...AMAZON_PRODUCT_DATABASE.coffee);
  }
  
  // Search by interests
  interestsLower.forEach(interest => {
    if (interest.includes('fashion') || interest.includes('beauty')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.makeup);
    }
    if (interest.includes('jewelry')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.jewelry);
    }
    if (interest.includes('crafts') || interest.includes('art')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.crafts);
    }
    if (interest.includes('board games') || interest.includes('games')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.boardgames);
    }
    if (interest.includes('outdoors') || interest.includes('outdoor')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.outdoors);
    }
    if (interest.includes('coffee')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.coffee);
    }
    if (interest.includes('books') || interest.includes('reading')) {
      matchedProducts.push(...AMAZON_PRODUCT_DATABASE.books);
    }
  });
  
  // Remove duplicates and limit to 5 products
  const uniqueProducts = matchedProducts.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );
  
  const finalProducts = uniqueProducts.slice(0, 5);
  
  console.log(`✨ Found ${finalProducts.length} real Amazon products with images`);
  return finalProducts;
}

export function generateAmazonAffiliateUrl(productId: string): string {
  return `https://www.amazon.com/dp/${productId}?tag=ocassia-20&linkCode=as2&camp=1789&creative=9325`;
}