import { type NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.courses.findMany();
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

    if (!body.imageSrc) { // 🔹 Asegurar que coincida con `schema.ts`
      return new NextResponse("La imagen es obligatoria", { status: 400 });
    }

    const data = await db
      .insert(courses)
      .values({
        title: body.title,
        imageSrc: body.imageSrc, // 🔹 Usar `imageSrc` en lugar de `image_src`
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error al guardar en la base de datos:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
};
