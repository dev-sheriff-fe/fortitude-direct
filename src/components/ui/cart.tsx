import React, { useEffect, useState } from 'react'
import { SheetContent, SheetFooter, SheetHeader } from './sheet'
import { ShoppingBag, Plus, Minus, X, ShoppingBagIcon } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice, generateRandomNumber, getCurrentDate } from '@/utils/helperfns'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import useCustomer from '@/store/customerStore'
import { set } from 'zod'
import CustomerLoginModal from './customer-login-modal'
import { getAuthCredentials } from '@/utils/auth-utils-customer'
import axiosCustomer from '@/utils/fetch-function-customer'
import useUser from '@/store/userStore'

const Cart = () => {
    const { cart, decrement, increment, removeItem, mainCcy, getCartTotal } = useCart();
    const ccy = mainCcy();
    const totalAmount = getCartTotal();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { customer } = useCustomer();
    const { user } = useUser();
    const rand = generateRandomNumber(15);
    const { token, permissions } = getAuthCredentials();
    const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
    const currentDate = getCurrentDate();
    const searchParams = useSearchParams();
    const storeCode = searchParams.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE;

    useEffect(() => {
        console.log('Cart updated:', cart);
    }, [cart]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/store/save-cart',
            method: 'POST',
            params: {
                entityCode: customer?.entityCode,
                storeCode
            },
            data
        }),
        onSuccess: (data) => {
            if (data?.data?.responseCode !== '000') {
                toast.error(data?.data?.desc || data?.data?.responseMessage || 'Something went wrong!')
                return
            }
            
            const cartData = {
                ...data.data,
                cartItems: cart.map(item => ({
                    itemCode: item?.code,
                    itemName: item?.name,
                    price: item?.salePrice,
                    quantity: item?.quantity,
                    amount: item?.subTotal,
                    discount: 0,
                    picture: item?.picture,
                })),
                subtotal: totalAmount,
                shippingFee: 0,
                totalAmount: totalAmount
            };
            
            sessionStorage.setItem('checkout', JSON.stringify(cartData))
            toast.success(data?.data?.desc || data?.data?.responseMessage || 'Order submitted successfully!')
            router.push(`/checkout?storeCode=${storeCode || process.env.NEXT_PUBLIC_STORE_CODE}&orderNo=${data?.data?.orderNo}`)
        },
        onError: (error) => {
            toast.error('An error occurred while submitting the order.')
        }
    })

    const submitOrder = () => {
        if (!isUserAuthenticated) {
            setIsOpen(true)
            return
        }
        
        const orderItems = cart.map(item => ({
            itemCode: item?.code,
            itemName: item?.name,
            price: item?.salePrice,
            quantity: item?.quantity,
            amount: item?.subTotal,
            discount: 0,
            picture: item?.picture,
        }))
        
        const payload = {
            channel: "WEB",
            cartId: `CART${rand}`,
            orderDate: currentDate,
            totalAmount: totalAmount,
            totalDiscount: 0,
            deliveryOption: "",
            paymentMethod: "",
            couponCode: "",
            ccy,
            deliveryFee: 0,
            geolocation: "",
            deviceId: "",
            orderSatus: "",
            paymentStatus: "",
            deliveryAddress: {
                id: 0,
                street: "",
                landmark: "",
                postCode: "",
                city: "",
                state: "",
                country: "",
                addressType: ""
            },
            cartItems: orderItems
        }

        mutate(payload)
    }
    
    return (
        <>
            <SheetContent className='w-screen lg:min-w-[450px] px-2'>
                <SheetHeader className='w-full items-center border-b gap-1 text-accent text-[18px] font-semibold'>
                    <span><ShoppingBag size={20} strokeWidth={2.5} /></span> 
                    <span>{cart.length > 1 ? `${cart.length} items` : `${cart.length} item`}</span>
                </SheetHeader>

                <div className='flex-1 h-full overflow-y-auto'
                     style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                    {cart.length === 0 && (
                        <div className='flex flex-col items-center justify-center h-full gap-4'>
                            <ShoppingBagIcon className='w-30 h-30 mx-auto text-accent' />
                            <h3 className='font-semibold'>No items in cart</h3>
                        </div>
                    )}
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${item.quantity}-${index}`} 
                             className={`${cart.length === index + 1 ? 'border-b-0' : 'border-b'}`}>
                            <div className='p-4 flex items-center gap-3'>
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

                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-medium text-sm text-gray-900 truncate'>{item.name}</h3>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <span className='text-accent font-medium text-sm'>
                                            {formatPrice(item.salePrice, item?.ccy as CurrencyCode)}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            {item.quantity} X 1 pcs
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-col items-end gap-2'>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className='text-gray-400 hover:text-gray-600'
                                    >
                                        <X size={16} />
                                    </button>
                                    <span className='font-semibold text-sm'>
                                        {formatPrice(item.subTotal, item?.ccy as CurrencyCode)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <SheetFooter>
                    <Button 
                        className='w-full bg-accent hover:bg-accent-foreground rounded-full text-white font-semibold p-3 h-full flex items-center text-center justify-between px-4' 
                        disabled={cart.length === 0} 
                        onClick={submitOrder}
                    >
                        {isPending ? 'Processing Order...' : <>
                            <span>Checkout</span>
                            <span className={`${cart.length === 0 && 'hidden'} px-4 py-2 rounded-full bg-white text-accent`}>
                                {formatPrice(totalAmount, ccy as CurrencyCode)}
                            </span>
                        </>}
                    </Button>
                </SheetFooter>
            </SheetContent>

            <CustomerLoginModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Cart