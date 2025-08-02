import axios from "axios";
import { z } from "zod";

const participantSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, { message: "El nombre es requerido" })
    .transform((val) => val.replace(/\s+/g, " ").toUpperCase()),
  email: z.email({ message: "Email inválido" }),
  telefono: z.coerce
    .number()
    .int({ message: "El teléfono debe ser un número entero" })
    .positive({ message: "El teléfono debe ser un número positivo" })
    .min(1, { message: "El teléfono es requerido" })
    .refine((val) => val.toString().length <= 9, {
      message: "El teléfono debe tener máximo 9 dígitos",
    }),
  tipo_participante: z.enum([
    "AUSPICIADOR",
    "AUTORIDAD",
    "MEDIA_PARTNER",
    "ALUMNO_UNIVERSITARIO",
  ]),
  codigo: z.string().min(1, { message: "El código es requerido" }),
  dias: z.literal("1,2,3"),
  metodo_pago: z.literal("EFECTIVO"),
  monto: z.coerce.number().nullable(),
});

export type ParticipantData = z.infer<typeof participantSchema>;

export const sendParticipantData = async (data: ParticipantData) => {
  try {
    // console.log("Datos procesados para enviar:", data);
    // Replace with your actual backend endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/participants`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error sending participant data:", error);
    throw new Error("Failed to register participant");
  }
};
