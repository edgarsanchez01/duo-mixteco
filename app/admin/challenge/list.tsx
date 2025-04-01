import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
  ArrayField,
  SingleFieldList,
  ChipField,
  FunctionField,
} from "react-admin";

const emojiForType = (type: string) => {
  const map: Record<string, string> = {
    SELECT: "✅",
    ASSIST: "🧭",
    WRITE: "✍️",
    MATCH: "🔗",
    "FILL-IN": "🧩",
  };
  return `${map[type] ?? "❓"} ${type}`;
};

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" label="Pregunta" />

        <FunctionField
          label="Tipo"
          render={(record: any) => emojiForType(record.type)}
        />

        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" label="Orden" />

        {/* Opciones (si existen) */}
        <ArrayField source="options" label="Opciones">
          <SingleFieldList>
            <ChipField source="text" />
          </SingleFieldList>
        </ArrayField>

        {/* Respuesta (si existe) */}
        <FunctionField
          source="answer"
          label="Respuesta"
          render={(record: any) => record.answer || "-"}
        />

        {/* Pares (si existen) */}
        <ArrayField source="pairs" label="Pares">
          <Datagrid bulkActionButtons={false}>
            <TextField source="left" label="Izquierda" />
            <TextField source="right" label="Derecha" />
          </Datagrid>
        </ArrayField>
      </Datagrid>
    </List>
  );
};
