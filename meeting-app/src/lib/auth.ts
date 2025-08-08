import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Save the access token to the JWT when we first get it
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      
      // Return the token
      return token
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub
        // Add access token to session for API routes
        ;(session as any).accessToken = token.accessToken
      }
      return session
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
}
