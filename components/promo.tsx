import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="space-y-4 rounded-xl border-2 p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image src="/unlimited.svg" alt="Pro" height={26} width={26} />

          <h3 className="text-lg font-bold">Mejora a Pro</h3>
        </div>

        <p className="text-muted-foreground">
          Obtén corazones ilimitados y más beneficios.
        </p>
      </div>

      <Button variant="super" className="w-full" size="lg" asChild>
        <Link href="/shop">Mejorar ahora</Link>
      </Button>
    </div>
  );
};
