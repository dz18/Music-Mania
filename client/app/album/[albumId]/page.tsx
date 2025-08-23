'use client'

import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import Nav from "@/app/components/ui/NavigationBar";
import axios from "axios";
import { use, useEffect } from "react";

export default function AlbumPage ({
  params
} : {
  params: Promise<{albumId : string}>
}) {

  const { albumId } = use(params)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const album = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getAlbum`, {
          params: {albumId: albumId}
        })
        console.log(album.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Nav/>
      <Container>
        <div className="min-w-full min-h-screen mt-15 mb-10 flex flex-col">
          <div>

          </div>
        </div>
      </Container>
      <Footer/>
    </div>
  )
}