import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-auto bg-white text-gray-900 shadow-lg text-center">
        <CardHeader>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-bold mt-4">
            ¡Registro Exitoso!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Gracias por registrarte en el Congreso Internacional de Reactivación
            Petrolera.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            Tu registro ha sido completado con éxito. Te hemos enviado un correo
            electrónico con los detalles de tu inscripción.
          </p>
          <Link href="/" className="text-orange-500 hover:underline">
            Volver al inicio
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
