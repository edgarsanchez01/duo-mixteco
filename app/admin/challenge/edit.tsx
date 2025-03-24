import {
  Edit,
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
import { useWatch } from "react-hook-form"; // ✅ Importación para detectar cambios en el formulario

export const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="question" validate={[required()]} label="Question" />

        <SelectInput
          source="type"
          validate={[required()]}
          label="Challenge Type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
            { id: "WRITE", name: "WRITE" },
            { id: "MATCH", name: "MATCH" },
            { id: "FILL-IN", name: "FILL-IN" },
          ]}
        />

        <ReferenceInput source="lessonId" reference="lessons" optionValue="id" />
        <NumberInput source="order" validate={[required()]} label="Order" />

        {/* ✅ Componente de campos dinámicos */}
        <DynamicFields />
      </SimpleForm>
    </Edit>
  );
};

// ✅ Componente para manejar los campos dinámicos
const DynamicFields = () => {
  const type = useWatch({ name: "type", defaultValue: "" }); // 🔥 Detecta cambios en tiempo real

  if (!type) return null; // Si no se ha seleccionado un tipo, no muestra nada

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

      {/* ✅ Campo para ESCRITURA y FILL-IN */}
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
