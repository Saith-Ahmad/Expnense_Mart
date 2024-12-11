import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the public routes
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except the ones defined as public
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/dashboard',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
  
};