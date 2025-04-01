import { InfinityIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type ResultCardProps = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: ResultCardProps) => {
  const imageSrc = variant === "points" ? "/points.svg" : "/heart.svg";

  return (
    <div
      className={cn(
        "w-full rounded-2xl border-2",
        variant === "points" && "border-primary bg-primary",
        variant === "hearts" && "border-primary-light bg-primary-light"
      )}
    >
      <div
        className={cn(
          "rounded-t-xl p-1.5 text-center text-xs font-bold uppercase text-white",
          variant === "points" && "bg-primary",
          variant === "hearts" && "bg-primary-light"
        )}
      >
        {variant === "hearts" ? "Corazones restantes" : "Puntos totales"}
      </div>

      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-white p-6 text-lg font-bold",
          variant === "points" && "text-primary",
          variant === "hearts" && "text-primary-light"
        )}
      >
        <Image
          src={imageSrc}
          alt={variant}
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value === Infinity ? (
          <InfinityIcon className="h-6 w-6 stroke-[3]" />
        ) : (
          value
        )}
      </div>
    </div>
  );
};
