import {
  Create,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  BooleanInput,
} from "react-admin";
import { useWatch } from "react-hook-form"; // ✅ Importación correcta


export const ChallengeCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="question" validate={[required()]} label="Question" />

        <SelectInput
          source="type"
          validate={[required()]}
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
            { id: "WRITE", name: "WRITE" },
            { id: "MATCH", name: "MATCH" },
            { id: "FILL-IN", name: "FILL-IN" },
          ]}
        />

        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />

        {/* ✅ Muestra los campos dinámicamente según el tipo seleccionado */}
        <DynamicFields />
      </SimpleForm>
    </Create>
  );
};

// ✅ Componente para manejar la lógica del formulario dinámico
const DynamicFields = () => {
  const type = useWatch({ name: "type" }); // 🔥 Detecta cambios en tiempo real

  if (!type) return null; // No mostrar nada si el usuario no ha seleccionado un tipo

  return (
    <>
      {/* ✅ Campos para SELECCIÓN y ASISTENCIA */}
      {["SELECT", "ASSIST"].includes(type) && (
        <ArrayInput source="options" label="Options">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Option Text" />
            <BooleanInput source="correct" label="Is Correct?" />
            <TextInput source="imageSrc" label="Image URL (optional)" />
            <TextInput source="audioSrc" label="Audio URL (optional)" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      {/* ✅ Campos para ESCRITURA y FILL-IN */}
      {["WRITE", "FILL-IN"].includes(type) && (
        <TextInput source="answer" validate={[required()]} label="Correct Answer" />
      )}

      {/* ✅ Campos para EMPAREJAR */}
      {type === "MATCH" && (
        <ArrayInput source="pairs" label="Pairs (for MATCH)">
          <SimpleFormIterator>
            <TextInput source="left" validate={[required()]} label="Left Word" />
            <TextInput source="right" validate={[required()]} label="Right Word" />
          </SimpleFormIterator>
        </ArrayInput>
      )}
    </>
  );
};
