import { NextResponse } from "next/server";

const RECIPIENT = "keyliarevalo8@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "Completa todos los campos." },
        { status: 400 }
      );
    }

    // Acepta direcciones habituales como nombre@dominio.com.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Escribe un correo válido." },
        { status: 400 }
      );
    }

    if (name.length > 120 || email.length > 254 || message.length > 5000) {
      return NextResponse.json(
        { ok: false, message: "Revisa la longitud de los campos e inténtalo de nuevo." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, message: "El servicio de correo aún no está configurado. Inténtalo más tarde." },
        { status: 500 }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portafolio Keyli <onboarding@resend.dev>",
        to: [RECIPIENT],
        reply_to: email,
        subject: "Nuevo mensaje desde tu portafolio",
        text: `Has recibido un mensaje desde tu portafolio.

Nombre: ${name}
Correo: ${email}

Mensaje:
${message}`,
      }),
    });

    if (!resendResponse.ok) {
      // No se devuelve al navegador ningún dato privado del proveedor.
      return NextResponse.json(
        { ok: false, message: "No se pudo enviar el mensaje. Inténtalo de nuevo más tarde." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "¡Gracias! Tu mensaje se envió correctamente.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo procesar el mensaje. Revisa los datos e inténtalo de nuevo." },
      { status: 400 }
    );
  }
}
