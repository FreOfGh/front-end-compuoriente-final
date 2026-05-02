import { NextRequest, NextResponse } from "next/server";
import { importPKCS8, SignJWT } from "jose";

const APP_ID = process.env.JITSI_APP_ID!; // Tu vpaas-magic-cookie-...
const PRIVATE_KEY = process.env.JITSI_RSA_PRIVATE_KEY!;
const API_KEY = process.env.API_KEY!;

const roomMap: Record<string, string> = {
    "aula-22": "Salon_2_2",
    "aula-31": "Salon_3_1",
    "aula-32": "Salon_3_2",
    "auditorio": "auditorio",
};

export async function GET(req: NextRequest) {
    const roomKey = req.nextUrl.searchParams.get("room") || "aula-22";
    const cleanRoom = roomMap[roomKey] ?? "Salon_2_2";

    try {
        const privateKey = await importPKCS8(
            PRIVATE_KEY.replace(/\\n/g, "\n"),
            "RS256"
        );

        // ⏱️ Lógica de tiempos manual basada en tu JSON
        const now = Math.floor(Date.now() / 1000);
        const iat = now;
        // Le restamos 60 segundos a nbf para curarnos en salud con el desfase de relojes
        const nbf = now - 60; 
        // 7200 segundos de diferencia = 2 horas de validez (como en tu JSON)
        const exp = now + 30000; 

        // 🚀 Generamos el JWT con tu estructura exacta
        const jwt = await new SignJWT({
            aud: "jitsi",
            iss: "chat",
            iat: iat,
            exp: exp,
            nbf: nbf,
            sub: APP_ID,
            context: {
                features: {
                    "livestreaming": true,
                    "file-upload": true,
                    "outbound-call": true,
                    "sip-outbound-call": false,
                    "transcription": true,
                    "list-visitors": false,
                    "recording": true,
                    "flip": false
                },
                user: {
                    "hidden-from-recorder": false,
                    moderator: true, 
                    name: "estudiante",
                    id: "google-oauth2|101276508057175193011",
                    avatar: "",
                    email: "apodexsoftware@gmail.com"
                }
            },
            room: "*"
        })
            .setProtectedHeader({
                alg: "RS256",
                typ: "JWT",
                kid: API_KEY, 
            })
            // No usamos los métodos de fecha de .jose porque ya los inyectamos en el payload
            .sign(privateKey);

        return NextResponse.json({
            token: jwt,
            room: `${APP_ID}/${cleanRoom}`, 
        });
    } catch (error) {
        console.error("Error generando token Jitsi:", error);
        return NextResponse.json(
            { error: "No se pudo generar token" },
            { status: 500 }
        );
    }
}
