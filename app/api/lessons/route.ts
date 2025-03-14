import { type NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.lessons.findMany();
  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  try {
    const isAdmin = getIsAdmin();
    if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

    const body = await req.json();

    if (!body.title) {
      return new NextResponse("El título es obligatorio", { status: 400 });
    }

    // Guardar la lección con imagen y audio en la base de datos
    const data = await db
      .insert(lessons)
      .values({
        title: body.title,
        unitId: body.unitId,
        order: body.order || 1,
        imageUrl: body.imageUrl || null, // Guardar la URL de la imagen
        audioUrl: body.audioUrl || null, // Guardar la URL del audio
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error al guardar en la base de datos:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
};
