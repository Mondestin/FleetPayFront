import { Link } from '@tanstack/react-router'
interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Link to="/" className="flex items-center">
            <img src='/images/fleetpay-bgt.png' alt='FleetPay' className='w-80 h-50' />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
