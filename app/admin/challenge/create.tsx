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
import { useWatch } from "react-hook-form";

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
    return data.url;
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

          // Validación
          if (
            (values.type !== "FILL-IN" && (!values.question || values.question.trim() === "")) ||
            (values.type === "FILL-IN" && (!values.fillInQuestion || values.fillInQuestion.trim() === ""))
          ) {
            alert("La pregunta es obligatoria.");
            return;
          }

          // Opciones
          const processedOptions = await Promise.all(
            (values.options || []).map(async (option: any) => {
              const imageSrc = option.image?.rawFile
                ? await uploadField(option.image, "image")
                : option.imageSrc ?? "";
          
              const audioSrc = option.audio?.rawFile
                ? await uploadField(option.audio, "audio")
                : option.audioSrc ?? "";
          
              return {
                text: option.text,
                correct: option.correct,
                imageSrc,
                audioSrc,
              };
            })
          );          

          // Imagen general
          const imageUrl = values.image?.rawFile
            ? await uploadFile(values.image.rawFile, "image")
            : values.imageSrc ?? "";

          // Enviar
          await fetch("/api/challenges", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              question:
                values.type === "FILL-IN"
                  ? values.fillInQuestion.trim()
                  : values.question.trim(),
              options: processedOptions,
              imageSrc: imageUrl,
            }),
          });

          alert("Desafío creado con éxito");
        }}
      >
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
        <DynamicFields />
      </SimpleForm>
    </Create>
  );
};

const DynamicFields = () => {
  const type = useWatch({ name: "type" });
  if (!type) return null;

  return (
    <>
      {type !== "MATCH" && type !== "FILL-IN" && type !== "WRITE" &&(
        <TextInput source="question" validate={[required()]} label="Pregunta o Frase" />
      )}

      {type === "SELECT" && (
        <ArrayInput source="options" label="Options">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Option Text" />
            <BooleanInput source="correct" label="Is Correct?" />
            <FileInput source="image" label="Subir imagen (opcional)" accept="image/*">
              <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="imageSrc" label="O ingresa una URL de imagen" />
            <FileInput source="audio" label="Subir audio (opcional)" accept="audio/*">
              <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="audioSrc" label="O ingresa una URL de audio" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      {type === "ASSIST" && (
        <ArrayInput source="options" label="Options">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Option Text" />
            <BooleanInput source="correct" label="Is Correct?" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

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

      {type === "FILL-IN" && (
        <>
          <TextInput
            source="fillInQuestion"
            validate={[required()]}
            label="Frase con espacio en blanco (usa '____')"
          />
          <ArrayInput source="options" label="Opciones (marca la correcta)">
            <SimpleFormIterator>
              <TextInput source="text" validate={[required()]} label="Texto de la opción" />
              <BooleanInput source="correct" label="¿Es correcta?" />
            </SimpleFormIterator>
          </ArrayInput>
          <FileInput source="image" label="Subir imagen (opcional)" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="imageSrc" label="O URL de imagen (opcional)" />
        </>
      )}
     {type === "WRITE" && (
        <>
          <TextInput
            source="question"
            validate={[required()]}
            label="Pregunta"
            helperText="Usa [corchetes] para marcar la palabra clave que mostrará un tooltip con la respuesta. Ej: ¿Cómo se dice [perro] en inglés?"
            fullWidth
          />
          <TextInput
            source="answer"
            validate={[required()]}
            label="Respuesta Correcta"
            fullWidth
          />
      
          <FileInput source="image" label="Subir imagen de referencia (opcional)" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="imageSrc" label="O ingresa una URL de imagen (opcional)" fullWidth />
      
          <FileInput source="audio" label="Subir audio de referencia (opcional)" accept="audio/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="audioSrc" label="O ingresa una URL de audio (opcional)" fullWidth />
        </>
      )}      
    </>
  );
};
