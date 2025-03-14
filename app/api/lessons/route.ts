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
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof lessons.$inferSelect;

  // Validar que la imagen y el audio sean URLs
  if (!body.imageUrl || !body.audioUrl) {
    return new NextResponse("Faltan la imagen o el audio.", { status: 400 });
  }

  // Insertar la nueva lección con imagen y audio
  const data = await db
    .insert(lessons)
    .values({
      title: body.title,
      unitId: body.unitId,
      order: body.order,
      imageUrl: body.imageUrl, // Guardar la URL de la imagen
      audioUrl: body.audioUrl, // Guardar la URL del audio
    })
    .returning();

  return NextResponse.json(data[0]);
};
