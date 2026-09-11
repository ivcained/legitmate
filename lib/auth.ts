import { PrivyClient, verifyAccessToken } from '@privy-io/node'
import { Agent37Error } from './agent37'

export type Principal = { subject: string; scope: string; mode: 'privy' | 'single-user' }

function safeSubject(value: string): string {
  const normalized = value.trim()
  if (!/^[A-Za-z0-9:_-]{3,160}$/.test(normalized)) throw new Agent37Error('INVALID_AUTH_TOKEN', 401)
  return normalized
}

export async function requirePrincipal(request: Request): Promise<Principal> {
  const singleUser = process.env.LEGITMATE_SINGLE_USER_SUBJECT?.trim()
  if (singleUser) {
    const subject = safeSubject(singleUser)
    return { subject, scope: `legitmate:${subject}`, mode: 'single-user' }
  }

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim()
  const verificationKey = process.env.PRIVY_VERIFICATION_KEY?.trim()
  const appSecret = process.env.PRIVY_APP_SECRET?.trim()
  if (!appId || (!verificationKey && !appSecret)) throw new Agent37Error('AUTH_NOT_CONFIGURED', 503)

  const authorization = request.headers.get('authorization')
  const cookieToken = request.headers.get('cookie')?.match(/(?:^|;\s*)privy-token=([^;]+)/)?.[1]
  const accessToken = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : cookieToken
  if (!accessToken) throw new Agent37Error('AUTH_REQUIRED', 401)

  try {
    const claims = verificationKey
      ? await verifyAccessToken({ access_token: accessToken, app_id: appId, verification_key: verificationKey })
      : await new PrivyClient({ appId, appSecret: appSecret! }).utils().auth().verifyAccessToken(accessToken)
    const subject = safeSubject(claims.user_id)
    return { subject, scope: `legitmate:${subject}`, mode: 'privy' }
  } catch {
    throw new Agent37Error('INVALID_AUTH_TOKEN', 401)
  }
}
