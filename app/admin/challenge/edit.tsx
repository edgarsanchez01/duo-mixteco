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
  FileInput,
  FileField,
  useRedirect,
  useNotify,
} from "react-admin";
import { useWatch } from "react-hook-form";

export const ChallengeEdit = () => {
  const redirect = useRedirect();
  const notify = useNotify();

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
    <Edit>
      <SimpleForm
        onSubmit={async (values) => {
          const uploadField = async (field: any, type: "image" | "audio") => {
            if (field?.rawFile) {
              return await uploadFile(field.rawFile, type);
            }
            return field;
          };
        
          if (
            (values.type !== "FILL-IN" && (!values.question || values.question.trim() === "")) ||
            (values.type === "FILL-IN" && (!values.fillInQuestion || values.fillInQuestion.trim() === ""))
          ) {
            notify("La pregunta es obligatoria", { type: "error" });
            return;
          }
        
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
        
          const imageUrl = values.image?.rawFile
            ? await uploadFile(values.image.rawFile, "image")
            : values.imageSrc ?? "";
        
          // Construimos el payload de forma explícita sin incluir fillInQuestion
          const payload = {
            id: values.id,
            lessonId: values.lessonId,
            type: values.type,
            order: values.order,
            question:
              values.type === "FILL-IN"
                ? values.fillInQuestion.trim()
                : values.question.trim(),
            options: processedOptions,
            imageSrc: imageUrl,
          };
        
          await fetch(`/api/challenges/${values.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        
          notify("Desafío actualizado con éxito", { type: "success" });
          redirect("/challenges");
        }}        
      >
        <SelectInput
          source="type"
          validate={[required()]}
          label="Tipo de Desafío"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
            { id: "WRITE", name: "WRITE" },
            { id: "MATCH", name: "MATCH" },
            { id: "FILL-IN", name: "FILL-IN" },
          ]}
        />

        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Orden" />
        <DynamicFields />
      </SimpleForm>
    </Edit>
  );
};

const DynamicFields = () => {
  const type = useWatch({ name: "type" });
  if (!type) return null;

  return (
    <>
      {type !== "MATCH" && type !== "FILL-IN" && type !== "WRITE" && (
        <TextInput source="question" validate={[required()]} label="Pregunta o Frase" />
      )}

      {type === "SELECT" && (
        <ArrayInput source="options" label="Opciones">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Texto" />
            <BooleanInput source="correct" label="¿Es correcta?" />
            <FileInput source="image" label="Imagen (opcional)" accept="image/*">
              <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="imageSrc" label="URL de imagen (opcional)" />
            <FileInput source="audio" label="Audio (opcional)" accept="audio/*">
              <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="audioSrc" label="URL de audio (opcional)" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      {type === "ASSIST" && (
        <ArrayInput source="options" label="Opciones">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Texto" />
            <BooleanInput source="correct" label="¿Es correcta?" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      {type === "MATCH" && (
        <>
          <TextInput source="question" validate={[required()]} label="Frase" />
          <ArrayInput source="pairs" label="Pares">
            <SimpleFormIterator>
              <TextInput source="left" validate={[required()]} label="Izquierda" />
              <TextInput source="right" validate={[required()]} label="Derecha" />
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
              <TextInput source="text" validate={[required()]} label="Texto" />
              <BooleanInput source="correct" label="¿Es correcta?" />
            </SimpleFormIterator>
          </ArrayInput>
          <FileInput source="image" label="Imagen (opcional)" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="imageSrc" label="URL de imagen (opcional)" />
        </>
      )}

      {type === "WRITE" && (
        <>
          <TextInput
            source="question"
            validate={[required()]}
            label="Pregunta"
            helperText="Usa [corchetes] para marcar la palabra clave que mostrará un tooltip con la respuesta. Ej: ¿Cómo se dice [perro] en inglés?"
          />
          <TextInput source="answer" validate={[required()]} label="Respuesta Correcta" />
          <FileInput source="image" label="Imagen (opcional)" accept="image/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="imageSrc" label="URL de imagen (opcional)" />
          <FileInput source="audio" label="Audio (opcional)" accept="audio/*">
            <FileField source="src" title="title" />
          </FileInput>
          <TextInput source="audioSrc" label="URL de audio (opcional)" />
        </>
      )}
    </>
  );
};
