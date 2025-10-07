'use client';
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { ProductProps } from '@/types/index';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';

interface ProductDetailsModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    product: ProductProps | null;
}

const ProductDetailsModal = ({ isOpen, setIsOpen, product }: ProductDetailsModalProps) => {
    const { inCart, addToCart, singleQuantity, increment, decrement } = useCart();

    if (!product) return null;

    const discount = product?.salePrice && product.oldPrice
        ? Math.ceil(((product.oldPrice - product.salePrice) / product.oldPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addToCart(product as any);
    };

    const handleIncrement = () => {
        increment(product as any);
    };

    const handleDecrement = () => {
        decrement(product as any);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                    {/* Product Image */}
                    <div className="relative aspect-square">
                        <Image
                            src={product.picture || '/placeholder-image.jpg'}
                            alt={`Image of ${product.name}`}
                            fill
                            className="object-cover rounded-lg"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-accent text-white text-sm rounded-full">
                                    {product.category}
                                </span>
                                {product.topCategory && (
                                    <span className="px-3 py-1 bg-accent-foreground text-white text-sm rounded-full">
                                        {product.topCategory}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-[#d8480b]">
                                    {formatPrice((product.salePrice ?? product.oldPrice)!, product.ccy as CurrencyCode)}
                                </span>
                                {discount > 0 && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.oldPrice!, product.ccy as CurrencyCode)}
                                    </span>
                                )}
                            </div>
                            {/* {product.usdPrice && (
                                <p className="text-sm text-gray-600">
                                    {formatPrice(product.usdPrice, 'USD')}
                                </p>
                            )} */}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {product.description || 'No description available.'}
                    </p>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Product Code</span>
                            <p className="text-sm text-gray-900">{product.code}</p>
                        </div>

                        {product.itemSize && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Size</span>
                                <p className="text-sm text-gray-900">{product.itemSize}</p>
                            </div>
                        )}

                        {product.color && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Color</span>
                                <p className="text-sm text-gray-900">{product.color}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Stock Available</span>
                            <p className="text-sm text-gray-900">{product.qtyInStore || 0} units</p>
                        </div>

                        {product.unit && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Unit</span>
                                <p className="text-sm text-gray-900">{product.unit}</p>
                            </div>
                        )}

                        {product.model && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Model</span>
                                <p className="text-sm text-gray-900">{product.model}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Barcode */}
                {product.barCode && (
                    <div className="pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Barcode</span>
                        <p className="text-sm text-gray-900">{product.barCode}</p>
                    </div>
                )}

                {/* Expiry Date */}
                {product.expiryDate && (
                    <div className="pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Expiry Date</span>
                        <p className="text-sm text-gray-900">
                            {new Date(product.expiryDate).toLocaleDateString()}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                    {singleQuantity(product.id) <= 0 ? (
                        <button
                            className="flex-1 bg-accent text-white py-3 px-6 rounded-lg hover:bg-[#c23d09] transition-colors font-semibold"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center justify-between w-full bg-accent text-white rounded-lg overflow-hidden">
                            <button
                                className="h-full px-4 py-3 hover:bg-[#c23c0a] transition-colors"
                                onClick={handleDecrement}
                            >
                                -
                            </button>
                            <span className="flex-1 text-center font-semibold">
                                {singleQuantity(product.id)}
                            </span>
                            <button
                                className="h-full px-4 py-3 hover:bg-[#c23c0a] transition-colors"
                                onClick={handleIncrement}
                            >
                                +
                            </button>
                        </div>
                    )}
                    <button
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsModal;