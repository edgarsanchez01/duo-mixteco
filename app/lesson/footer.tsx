import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterProps = {
  status: "correct" | "wrong" | "none" | "completed";
  onCheck: () => void;
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  status,
  onCheck,
  disabled,
  lessonId,
}: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer
      className={cn(
        "h-[100px] border-t-2 lg:h-[140px]",
        status === "correct" && "border-transparent bg-primary/10",
        status === "wrong" && "border-transparent bg-primary-light/10"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="flex items-center text-base font-bold text-primary lg:text-2xl">
            <CheckCircle className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
            ¡Bien hecho!
          </div>
        )}

        {status === "wrong" && (
          <div className="flex items-center text-base font-bold text-primary-light lg:text-2xl">
            <XCircle className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
            Inténtalo de nuevo.
          </div>
        )}

        <Button
          disabled={disabled}
          aria-disabled={disabled}
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
        >
          {status === "none" && "Verificar"}
          {status === "correct" && "Siguiente"}
          {status === "wrong" && "Reintentar"}
          {status === "completed" && "Continuar"}
        </Button>
      </div>
    </footer>
  );
};
