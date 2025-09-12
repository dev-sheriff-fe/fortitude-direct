'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent } from './dialog'
import RegisterForm from './register-form'
import { LoginForm } from './login-form'

const CustomerLoginModal = ({ isOpen, setIsOpen }:{isOpen:boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [state,setState] = useState<'login' | 'register'>('login')


  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
            <>
                {state === 'login' ? (
                    <LoginForm setState={setState} setIsOpen={setIsOpen} />
                ) : (
                    <RegisterForm setState={setState} />
                )}
            </>
        </DialogContent>
    </Dialog>
  )
}

export default CustomerLoginModal