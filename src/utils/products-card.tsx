'use client';

import Image from 'next/image';
import { ProductProps } from '@/types/index';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useCart } from '@/components/store/cart';

interface ProductCardProps {
  product: ProductProps;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { inCart, addToCart, singleQuantity, increment, decrement } = useCart();
  const discount = product?.salePrice
    ? Math.ceil(((product.oldPrice! - product.salePrice!) / product.oldPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product as any);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    increment(product as any);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrement(product as any);
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className='flex justify-between items-center'>
        {discount > 0 && (
          <>
            <div className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-4">
              On Sale
            </div>
            <div className="bg-accent-foreground text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-4">
              {discount}% OFF
            </div>
          </>
        )}
      </div>

      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.picture!}
          alt={product.name!}
          fill
          className="object-contain rounded-md"
        />
      </div>

      <h3 className="text-lg mb-2 text-center text-[#535357] line-clamp-2">
        {product.name}
      </h3>

      <div className="flex flex-col items-center gap-1 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#d8480b]">
            {formatPrice(product.salePrice! || product.oldPrice!, product?.ccy! as CurrencyCode)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-[#88888d] line-through">
              {formatPrice(product.oldPrice!, product?.ccy! as CurrencyCode)}
            </span>
          )}
        </div>
        <span className="text-sm text-[#6b7280]">
          ({formatPrice(product.usdPrice!, 'USD')})
        </span>
      </div>

      {singleQuantity(product?.id) <= 0 ? (
        <button
          className="w-full bg-white text-black py-2 px-4 rounded-3xl hover:bg-black hover:text-white transition border-2 border-black hover:border-[#d8480b] font-semibold"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center justify-between w-full bg-[#d8480b] text-white rounded-3xl overflow-hidden">
          <button
            className="h-full px-3 py-2 hover:bg-[#c23c0a] transition-colors"
            onClick={handleDecrement}
          >
            -
          </button>
          <span className="flex-1 text-center font-semibold">
            {singleQuantity(product?.id)}
          </span>
          <button
            className="h-full px-3 py-2 hover:bg-[#c23c0a] transition-colors"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};