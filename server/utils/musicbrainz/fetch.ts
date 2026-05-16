import { mbQueue } from "../musicbrainzQue"

const userAgent = process.env.USER_AGENT!

export const mbFetch = async (url: string) => {
  const response = await mbQueue.add(() => fetch(url, {
    headers: { 'User-Agent': userAgent as string }
  }))
  if (!response.ok) throw { status: response.status }
  return response.json()
} 