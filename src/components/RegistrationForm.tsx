"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import { sendParticipantData, ParticipantData } from "@/lib/connections";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Schema corregido: teléfono como string numérico
const formSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z
    .string()
    .min(1, { message: "El teléfono es requerido" })
    .regex(/^\d+$/, { message: "Solo se permiten números" })
    .min(7, { message: "Mínimo 7 dígitos" })
    .max(15, { message: "Máximo 15 dígitos" }),
  tipo_participante: z.enum([
    "AUSPICIADOR",
    "AUTORIDAD",
    "MEDIA_PARTNER",
    "ALUMNO_UNIVERSITARIO",
  ]),
  codigo: z.string().optional(),
});

function generateAlphanumericCode(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function RegistrationForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      tipo_participante: "AUSPICIADOR",
      codigo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const generatedCode = "RP2025-" + generateAlphanumericCode(8);
    const dataToSend: ParticipantData = {
      ...values,
      codigo: generatedCode,
      dias: "1,2,3",
      metodo_pago: "EFECTIVO",
      monto: null,
      telefono: Number(values.telefono), // Ensure telefono is a number
    };

    // console.log("Data to be sent:", dataToSend);

    try {
      await sendParticipantData(dataToSend);
      toast.success("Registro exitoso!");
      form.reset();
      router.push("/success"); // Redirect to success page
    } catch (error) {
      console.error("Error al registrar participante:", error);
      toast.error("Error en el registro. Por favor, intente de nuevo.");
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-white text-gray-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gray-900">
          Congreso Internacional:{" "}
          <span className="text-orange-500">Reactivación Petrolera</span> en las
          Regiones Piura y Tumbes
        </CardTitle>
        <CardDescription className="text-center text-gray-500">
          Complete el formulario para registrarse en el evento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tipo_participante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Participante</FormLabel>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AUSPICIADOR">Auspiciador</SelectItem>
                        <SelectItem value="AUTORIDAD">Autoridad</SelectItem>
                        <SelectItem value="MEDIA_PARTNER">
                          Media Partner
                        </SelectItem>
                        <SelectItem value="ALUMNO_UNIVERSITARIO">
                          Alumno Universitario
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="pl-10"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <Input
                        placeholder="john.doe@example.com"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <Input
                        placeholder="Maximo 15 digitos"
                        {...field}
                        className="pl-10"
                        type="tel"
                        inputMode="numeric"
                        maxLength={15}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white transition"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <Toaster richColors position="bottom-right" />
    </Card>
  );
}
