import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchProfile (id: string) {

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [profile, setProfile] = useState<UserProfile | null>(null)

	const fetchProfilePage = useCallback( async () => {
		try {
			setLoading(true)
			setError(null)

			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
				params : { id }
			})

			console.log(res.data)
			setProfile(res.data)

		} catch (error: any) {
			setError(error.response?.data?.error || error.message)
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		if (!id) return

		fetchProfilePage()
	}, [fetchProfilePage])

	return { profile, loading, error, fetchProfilePage }
}