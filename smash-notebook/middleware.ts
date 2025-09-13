import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect certain routes
        const { pathname } = req.nextUrl
        
        if (pathname.startsWith('/deck/create') || 
            pathname.startsWith('/compose') ||
            pathname.startsWith('/account')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/deck/create/:path*',
    '/compose/:path*', 
    '/account/:path*'
  ]
}