import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function getPortalSession() {
  const token = cookies().get('portal_token')?.value
  if (!token) return null
  
  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "decorer-secret-2026")
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { id: string }
  } catch (error) {
    return null
  }
}
