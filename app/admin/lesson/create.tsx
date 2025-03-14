import { Create, SimpleForm, TextInput, required, FileInput, FileField, NumberInput, ReferenceInput, SelectInput, useRedirect } from "react-admin";
import { useState } from "react";

export const LessonCreate = () => {
  const redirect = useRedirect(); // 👈 Hook para redirigir después de la creación
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // Función para subir archivos a Cloudinary
  const uploadFile = async (file: File, type: "image" | "audio") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url; // Devuelve la URL del archivo
  };

  return (
    <Create>
      <SimpleForm
        onSubmit={async (values) => {
          let uploadedImageUrl = imageUrl;
          let uploadedAudioUrl = audioUrl;

          // Subir imagen si el usuario selecciona un archivo
          if (values.image) {
            uploadedImageUrl = await uploadFile(values.image.rawFile, "image");
            setImageUrl(uploadedImageUrl);
          }

          // Subir audio si el usuario selecciona un archivo
          if (values.audio) {
            uploadedAudioUrl = await uploadFile(values.audio.rawFile, "audio");
            setAudioUrl(uploadedAudioUrl);
          }

          // Guardar la lección en la base de datos
          await fetch("/api/lessons", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              unitId: values.unitId,
              order: values.order || 1,
              imageUrl: uploadedImageUrl || null,
              audioUrl: uploadedAudioUrl || null,
            }),
          });

          alert("Lección creada con éxito");

          // 👇 Redirigir a la lista de lecciones después de crear
          redirect("/lessons");
        }}
      >
        <TextInput source="title" validate={[required()]} label="Título" />

        {/* Seleccionar la unidad a la que pertenece la lección */}
        <ReferenceInput source="unitId" reference="units">
          <SelectInput optionText="title" label="Unidad" validate={[required()]} />
        </ReferenceInput>

        {/* Orden de la lección */}
        <NumberInput source="order" label="Orden" defaultValue={1} />

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
