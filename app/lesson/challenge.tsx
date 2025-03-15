import { cn } from "@/lib/utils";
import { Card } from "./card";

type ChallengeProps = {
  options: {
    text: string;
    correct: boolean;
    imageSrc?: string | null;
    audioSrc?: string | null;
  }[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: "SELECT" | "ASSIST";
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled, // 🔥 Usa "disabled" en lugar de "pending"
  type,
}: ChallengeProps) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.text} // 🔥 Usa "option.text" en lugar de "i" para evitar errores de claves únicas
          id={i} // 🔥 Usa el índice si no hay un ID único en la BD
          text={option.text}
          imageSrc={option.imageSrc ?? ""} // 🔥 Asegura que no sea "undefined"
          shortcut={`${i + 1}`}
          selected={selectedOption === i} // 🔥 Comparación correcta con el índice
          onClick={() => onSelect(i)}
          status={status}
          audioSrc={option.audioSrc ?? ""} // 🔥 Evita que sea "undefined"
          disabled={disabled} // 🔥 Usa "disabled", ya que "pending" no existe aquí
          type={type}
        />
      ))}
    </div>
  );
};
