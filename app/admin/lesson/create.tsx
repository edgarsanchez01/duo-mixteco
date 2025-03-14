import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
  FileInput,
  FileField,
} from "react-admin";
import { useState } from "react";

export const LessonCreate = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const uploadFile = async (file: File, type: "image" | "audio") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url; // Devuelve la URL de la imagen/audio subida
  };

  return (
    <Create>
      <SimpleForm
        onSubmit={async (values) => {
          if (values.image) {
            const url = await uploadFile(values.image.rawFile, "image");
            setImageUrl(url);
          }
          if (values.audio) {
            const url = await uploadFile(values.audio.rawFile, "audio");
            setAudioUrl(url);
          }

          return {
            ...values,
            imageUrl,
            audioUrl,
          };
        }}
      >
        <TextInput source="title" validate={[required()]} label="Title" />
        <ReferenceInput source="unitId" reference="units" />
        <NumberInput source="order" validate={required()} label="Order" />

        {/* Input para subir imágenes */}
        <FileInput source="image" label="Imagen de la lección" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>

        {/* Input para subir audios */}
        <FileInput source="audio" label="Audio de la lección" accept="audio/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
