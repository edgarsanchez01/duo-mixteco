import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/stripe"],

  afterAuth(auth, req) {
    const isAdmin = auth?.user?.publicMetadata?.role === "admin";

    // Si el usuario es admin y está en la página principal, lo redirige a /admin
    if (isAdmin && req.nextUrl.pathname === "/") {
      return Response.redirect(new URL("/admin", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};






