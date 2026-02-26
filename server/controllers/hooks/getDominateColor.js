import sharp from "sharp"
import ColorThief from "colorthief"

export async function getGradientColors(imageUrl) {
  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    const image = await sharp(Buffer.from(buffer)).toFormat("jpeg").toBuffer()
    const palette = await ColorThief.getPalette(image, 5)
    const color1 = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`
    const color2 = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
    return [color1, color2]
  } catch (err) {
    console.error("Failed to get colors for:", imageUrl, err)
    return ["#000000", "#111111"] // fallback gradient
  }
}