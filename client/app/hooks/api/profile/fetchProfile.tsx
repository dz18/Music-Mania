import axios from "axios";
import { useEffect, useState } from "react";

export default function fetchProfile (id: string) {

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [profile, setProfile] = useState<UserProfile | null>(null)

	useEffect(() => {
		if (!id) return

		async function fetchArtist () {
			try {
				setLoading(true)
				setError(null)

				const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
					params : { id }
				})

				setProfile(res.data)

			} catch (error: any) {
				setError(error.response?.data?.error || error.message)
			} finally {
				setLoading(false)
			}

		}
		fetchArtist()
	}, [id])

	return { profile, loading, error }
}