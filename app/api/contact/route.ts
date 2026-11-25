import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, message: "Completa todos los campos." }, { status: 400 });
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, message: "Escribe un correo válido." }, { status: 400 });
    }

    // Punto de integración: conectar aquí un proveedor de correo o almacenamiento.
    // Por ahora valida y confirma la recepción de la solicitud, sin enviar correos.
    return NextResponse.json({
      ok: true,
      message: "¡Gracias! El formulario validó tu mensaje. Para recibirlo por correo, falta configurar un servicio de envío."
    });
  } catch {
    return NextResponse.json({ ok: false, message: "No se pudo procesar el mensaje." }, { status: 400 });
  }
}
