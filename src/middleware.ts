import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // <-- arahkan ke halaman login kamu, bukan /api/auth/signin
  },
  // optional: pastikan hanya user dengan token yang lolos
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/admins/:path*"],
};
