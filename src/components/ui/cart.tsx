import React from 'react'
import { SheetContent, SheetHeader } from './sheet'
import { ShoppingBag, Plus, Minus, X } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'
import { useCart } from '@/store/cart'

const Cart = () => {
    const {cart, decrement, increment, removeItem} = useCart()
    
    const totalAmount = cart.reduce((total, item) => total + item.subTotal, 0)
    
    return (
        <SheetContent className=''>
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
                                            ${item.salePrice.toFixed(2)}
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
                                        ${item.subTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>

            <div className='p-4 w-full'>
                <Link href={`/checkout`} className='w-full '>
                        <Button className='w-full bg-accent rounded-full text-white font-semibold p-3 h-full flex items-center justify-between px-4'>
                        <span>Checkout</span>
                        <span className='px-4 py-2 rounded-full bg-white text-accent'>
                            ${totalAmount.toFixed(2)}
                        </span>
                    </Button>
                        
                    </Link>
                
            </div>
        </SheetContent>
    )
}

export default Cart