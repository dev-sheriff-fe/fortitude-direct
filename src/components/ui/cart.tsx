import React from 'react'
import { SheetContent, SheetHeader } from './sheet'
import { ShoppingBag, Plus, Minus, X, ShoppingBagIcon } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'

const Cart = () => {
    const {cart, decrement, increment, removeItem} = useCart()
    
    const totalAmount = cart.reduce((total, item) => total + item.subTotal, 0)
    
    return (
        <SheetContent className='min-w-[400px] lg:min-w-[450px] '>
            <SheetHeader className='w-full items-center border-b gap-1 text-accent text-[18px] font-semibold'>
                <span><ShoppingBag size={20} strokeWidth={2.5} /></span> <span>{cart.length > 1 ? `${cart.length} items` : `${cart.length} item`}</span>
            </SheetHeader>

            <div 
            className='flex-1 h-full overflow-y-auto'
            style={{
              scrollbarWidth: 'none',
              scrollbarColor: 'transparent',
            }}
            >
                {
                    cart.length === 0 && (
                        <div className='flex flex-col items-center justify-center h-full gap-4'>
                            <ShoppingBagIcon className='w-30 h-30 mx-auto text-accent' />
                            <h3 className='font-semibold'>No items in cart</h3>
                        </div>
                    )
                }
                {
                    cart.map((item, index) =>(
                        <div key={item?.id} className={`${cart.length === index + 1 ? 'border-b-0' : 'border-b'}`}>
                            <div className='p-4 flex items-center gap-3'>
                                {/* Quantity Controls */}
                                <div className='flex flex-col items-center gap-2'>
                                    <button 
                                        onClick={() => increment(item)}
                                        className='w-6 h-6 rounded-sm border bg-[#f3f4f6] border-gray-300 flex items-center justify-center hover:bg-gray-100'
                                    >
                                        <Plus size={12} />
                                    </button>
                                    <span className='text-sm font-medium'>{item.quantity}</span>
                                    <button 
                                        onClick={() => decrement(item)}
                                        className='w-6 h-6 rounded-sm bg-[#f3f4f6] border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                                    >
                                        <Minus size={12} />
                                    </button>
                                </div>

                                {/* Product Image */}
                                <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0'>
                                    {item.picture ? (
                                        <img 
                                            src={item.picture} 
                                            alt={item.name} 
                                            className='w-full h-full object-cover rounded'
                                        />
                                    ) : (
                                        <div className='w-8 h-8 bg-gray-300 rounded'></div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-medium text-sm text-gray-900 truncate'>{item.name}</h3>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <span className='text-green-600 font-medium text-sm'>
                                            {formatPrice(item.salePrice, item?.ccy as CurrencyCode)}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            {item.quantity} X 1 pcs
                                        </span>
                                    </div>
                                </div>

                                {/* Subtotal and Remove */}
                                <div className='flex flex-col items-end gap-2'>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className='text-gray-400 hover:text-gray-600'
                                    >
                                        <X size={16} />
                                    </button>
                                    <span className='font-semibold text-sm'>
                                        {formatPrice(item.subTotal,item?.ccy as CurrencyCode)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>

            <div className='p-4 w-full'>
                <Link href='/checkout' className='w-full '>
                        <Button className='w-full bg-accent rounded-full text-white font-semibold p-3 h-full flex items-center justify-between px-4'>
                        <span>Checkout</span>
                        <span className='px-4 py-2 rounded-full bg-white text-accent'>
                            {formatPrice(totalAmount, 'NGN' as CurrencyCode)}
                        </span>
                    </Button>
                        
                    </Link>
                
            </div>
        </SheetContent>
    )
}

export default Cart

// 'use client';

// import React from 'react';
// import { SheetContent, SheetHeader, SheetTitle } from './sheet';
// import { ShoppingBag, Plus, Minus, X } from 'lucide-react';
// import { Button } from './button';
// import Link from 'next/link';
// import { useCart } from '@/store/cart';
// import Image from 'next/image';

// const Cart = () => {
//     const { cart, decrement, increment, removeItem } = useCart();
//     const totalAmount = cart.reduce((total, item) => total + item.subTotal, 0);

//     return (
//         <SheetContent className="relative flex flex-col">
//             {/* Sheet Header with Title and Close Button */}
//             <SheetHeader className="border-b pb-4">
//                 <div className="flex items-center justify-between">
//                     <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
//                         <ShoppingBag size={20} strokeWidth={2.5} />
//                         <span>
//                             {cart.length} {cart.length === 1 ? 'item' : 'items'}
//                         </span>
//                     </SheetTitle>
//                     <button
//                         className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
//                         aria-label="Close cart"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>
//             </SheetHeader>

//             {/* Cart Items - Scrollable Area */}
//             <div className="flex-1 overflow-y-auto py-4" style={{
//                 scrollbarWidth: 'none',
//                 msOverflowStyle: 'none',
//                 '&::-webkit-scrollbar': { display: 'none' }
//             } as React.CSSProperties}>
//                 {cart.length === 0 ? (
//                     <div className="flex h-full flex-col items-center justify-center text-center">
//                         <ShoppingBag size={48} className="mb-4 text-gray-400" />
//                         <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
//                         <p className="text-sm text-gray-400">Start shopping to add items</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {cart.map((item, index) => (
//                             <div 
//                                 key={`${item.id}-${index}`} 
//                                 className={`flex items-center gap-4 p-4 ${index !== cart.length - 1 ? 'border-b' : ''}`}
//                             >
//                                 {/* Quantity Controls */}
//                                 <div className="flex flex-col items-center gap-2">
//                                     <button
//                                         onClick={() => increment(item)}
//                                         className="flex h-6 w-6 items-center justify-center rounded-sm border border-gray-300 bg-[#f3f4f6] hover:bg-gray-100"
//                                         aria-label={`Increase quantity of ${item.name}`}
//                                     >
//                                         <Plus size={12} />
//                                     </button>
//                                     <span className="text-sm font-medium">{item.quantity}</span>
//                                     <button
//                                         onClick={() => decrement(item)}
//                                         className="flex h-6 w-6 items-center justify-center rounded-sm border border-gray-300 bg-[#f3f4f6] hover:bg-gray-100"
//                                         aria-label={`Decrease quantity of ${item.name}`}
//                                         disabled={item.quantity <= 1}
//                                     >
//                                         <Minus size={12} />
//                                     </button>
//                                 </div>

//                                 {/* Product Image */}
//                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gray-100">
//                                     {item.picture ? (
//                                         <Image
//                                             src={item.picture}
//                                             alt={item.name}
//                                             width={48}
//                                             height={48}
//                                             className="h-full w-full rounded object-cover"
//                                             unoptimized // Remove if you have proper image optimization setup
//                                         />
//                                     ) : (
//                                         <div className="h-8 w-8 rounded bg-gray-300" />
//                                     )}
//                                 </div>

//                                 {/* Product Details */}
//                                 <div className="flex-1 min-w-0">
//                                     <h3 className="truncate text-sm font-medium text-gray-900">
//                                         {item.name}
//                                     </h3>
//                                     <div className="mt-1 flex items-center gap-2">
//                                         <span className="text-sm font-medium text-green-600">
//                                             ${item.salePrice.toFixed(2)}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                             {item.quantity} × 1 pcs
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Subtotal and Remove */}
//                                 <div className="flex flex-col items-end gap-2">
//                                     <button
//                                         onClick={() => removeItem(item.id)}
//                                         className="text-gray-400 hover:text-gray-600"
//                                         aria-label={`Remove ${item.name} from cart`}
//                                     >
//                                         <X size={16} />
//                                     </button>
//                                     <span className="text-sm font-semibold">
//                                         ${item.subTotal.toFixed(2)}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Checkout Footer */}
//             {cart.length > 0 && (
//                 <div className="border-t p-4">
//                     <Link href="/checkout" className="w-full" passHref>
//                         <Button
//                             className="flex h-full w-full items-center justify-between rounded-full bg-accent p-3 px-4 font-semibold text-white"
//                             aria-label={`Proceed to checkout with total of $${totalAmount.toFixed(2)}`}
//                         >
//                             <span>Checkout</span>
//                             <span className="rounded-full bg-white px-4 py-2 text-accent">
//                                 ${totalAmount.toFixed(2)}
//                             </span>
//                         </Button>
//                     </Link>
//                 </div>
//             )}
//         </SheetContent>
//     );
// };

// export default Cart;