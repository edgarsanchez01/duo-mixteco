import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary con las credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API de subida de archivos a Cloudinary
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const type = formData.get("type") as string | null; // "image" o "audio"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convertir a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: type === "audio" ? "video" : "image", folder: "duolingo-clone" },
        (error, result) => {
          if (error) {
            console.error("Error al subir a Cloudinary:", error);
            return reject(NextResponse.json({ error: "Error en Cloudinary" }, { status: 500 }));
          }

          if (!result || !result.secure_url) {
            console.error("No se obtuvo una respuesta válida de Cloudinary.");
            return reject(NextResponse.json({ error: "No se obtuvo la URL de Cloudinary" }, { status: 500 }));
          }

          resolve(NextResponse.json({ url: result.secure_url }, { status: 200 }));
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}