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
  FileInput,
  FileField,
} from "react-admin";
import { useState } from "react";
import { useWatch } from "react-hook-form"; // ✅ Detecta cambios en tiempo real

export const ChallengeCreate = () => {
  const uploadFile = async (file: File, type: "image" | "audio") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url; // 🔥 Devuelve la URL del archivo subido
  };

  return (
    <Create>
      <SimpleForm
        onSubmit={async (values) => {
          const uploadField = async (field: any, type: "image" | "audio") => {
            if (field?.rawFile) {
              return await uploadFile(field.rawFile, type);
            }
            return field;
          };

          // 🔹 Validar que la pregunta esté presente (se aplica para todos los tipos)
          if (!values.question || values.question.trim() === "") {
            alert("La pregunta es obligatoria.");
            return;
          }

          // 🔹 Procesar opciones si existen
          const processedOptions = await Promise.all(
            (values.options || []).map(async (option: any) => ({
              ...option,
              imageSrc: option.image?.rawFile
                ? await uploadField(option.image, "image")
                : option.imageSrc,
              audioSrc: option.audio?.rawFile
                ? await uploadField(option.audio, "audio")
                : option.audioSrc,
            }))
          );

          // 🔥 Enviar datos al backend
          await fetch("/api/challenges", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              question: values.question.trim(), // Asegurar que no esté vacío
              options: processedOptions,
            }),
          });

          alert("Desafío creado con éxito");
        }}
      >
        {/* 🔹 Tipo de Pregunta */}
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

        {/* 🔹 ID de la Lección */}
        <ReferenceInput source="lessonId" reference="lessons" />

        {/* 🔹 Orden del Desafío */}
        <NumberInput source="order" validate={[required()]} label="Order" />

        {/* ✅ Mostrar campos dinámicos según el tipo seleccionado */}
        <DynamicFields />
      </SimpleForm>
    </Create>
  );
};

// ✅ Componente para manejar la lógica del formulario dinámico
const DynamicFields = () => {
  const type = useWatch({ name: "type" }); // 🔥 Detecta cambios en tiempo real

  if (!type) return null; // No mostrar nada si no se seleccionó un tipo

  return (
    <>
      {/* 
          Para todos los tipos, pedimos la "Pregunta" o "Frase". 
          Si no es MATCH, se muestra aquí; en MATCH se pedirá junto con los pares.
      */}
      {type !== "MATCH" && (
        <TextInput source="question" validate={[required()]} label="Pregunta o Frase" />
      )}

      {/* ✅ Campos para SELECT */}
      {type === "SELECT" && (
        <ArrayInput source="options" label="Options">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Option Text" />
            <BooleanInput source="correct" label="Is Correct?" />
            {/* 🔹 Subida de imagen o URL */}
            <FileInput source="image" label="Subir imagen (opcional)" accept="image/*">
              <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="imageSrc" label="O ingresa una URL de imagen" />
            {/* 🔹 Subida de audio o URL */}
            <FileInput source="audio" label="Subir audio (opcional)" accept="audio/*">
              <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="audioSrc" label="O ingresa una URL de audio" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      {/* ✅ Campos para ASSIST (solo opciones de texto) */}
      {type === "ASSIST" && (
        <ArrayInput source="options" label="Options">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Option Text" />
            <BooleanInput source="correct" label="Is Correct?" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      {/* ✅ Campos para MATCH (frase + pares de palabras) */}
      {type === "MATCH" && (
        <>
          <TextInput source="question" validate={[required()]} label="Frase" />
          <ArrayInput source="pairs" label="Pairs (for MATCH)">
            <SimpleFormIterator>
              <TextInput source="left" validate={[required()]} label="Left Word" />
              <TextInput source="right" validate={[required()]} label="Right Word" />
            </SimpleFormIterator>
          </ArrayInput>
        </>
      )}

      {/* ✅ Campos para FILL-IN (frase con espacios en blanco, opciones incorrectas y respuestas correctas) */}
      {type === "FILL-IN" && (
  <>
    <TextInput source="question" validate={[required()]} label="Frase con espacios en blanco (usa ___ donde va cada respuesta)" />
    
    {/* Opciones disponibles (incluye correctas e incorrectas) */}
    <ArrayInput source="options" label="Opciones a mostrar (mezcladas)">
      <SimpleFormIterator>
        <TextInput source="text" validate={[required()]} label="Opción" />
      </SimpleFormIterator>
    </ArrayInput>

    {/* Respuestas correctas (en orden) */}
    <ArrayInput source="answer" label="Respuestas correctas (en orden)">
      <SimpleFormIterator>
        <TextInput source="text" validate={[required()]} label="Respuesta correcta" />
      </SimpleFormIterator>
    </ArrayInput>
  </>
)}


      {/* ✅ Campos para WRITE (pregunta + respuesta correcta) */}
      {type === "WRITE" && (
        <>
          <TextInput source="answer" validate={[required()]} label="Respuesta Correcta" />
          {/* Aquí también se pueden incluir imagen y audio opcionales para la referencia, si se desea */}
          <FileInput source="image" label="Subir imagen de referencia (opcional)" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="imageSrc" label="O ingresa una URL de imagen (opcional)" />
          <FileInput source="audio" label="Subir audio de referencia (opcional)" accept="audio/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="audioSrc" label="O ingresa una URL de audio (opcional)" />
        </>
      )}
    </>
  );
};
