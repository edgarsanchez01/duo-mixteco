import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
  FileInput,
  FileField,
} from "react-admin";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const LessonEdit = () => {
  const { id } = useParams(); // Obtener el ID de la URL
  const navigate = useNavigate(); // Hook para redirigir
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
    return data.url; // Devuelve la URL del archivo subido
  };

  return (
    <Edit>
      <SimpleForm
        onSubmit={async (values) => {
          if (!id) {
            alert("Error: La lección no tiene un ID válido.");
            return;
          }

          let uploadedImageUrl = values.imageUrl;
          let uploadedAudioUrl = values.audioUrl;

          // Si el usuario sube una nueva imagen, la subimos a Cloudinary
          if (values.image) {
            uploadedImageUrl = await uploadFile(values.image.rawFile, "image");
            setImageUrl(uploadedImageUrl);
          }

          // Si el usuario sube un nuevo audio, lo subimos a Cloudinary
          if (values.audio) {
            uploadedAudioUrl = await uploadFile(values.audio.rawFile, "audio");
            setAudioUrl(uploadedAudioUrl);
          }

          // Actualizar la lección con la imagen/audio nuevos
          const response = await fetch(`/api/lessons/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              unitId: values.unitId,
              order: values.order,
              imageUrl: uploadedImageUrl || values.imageUrl,
              audioUrl: uploadedAudioUrl || values.audioUrl,
            }),
          });

          if (response.ok) {
            alert("Lección actualizada con éxito");
            navigate("/lessons"); // 👈 Redirigir a la lista de lecciones
          } else {
            alert("Error al actualizar la lección");
          }
        }}
      >
        {/* ID de la lección */}
        <NumberInput source="id" validate={[required()]} label="ID" disabled />

        {/* Título de la lección */}
        <TextInput source="title" validate={[required()]} label="Título" />

        {/* Unidad a la que pertenece */}
        <ReferenceInput source="unitId" reference="units" />

        {/* Orden de la lección */}
        <NumberInput source="order" validate={required()} label="Orden" />

        {/* Imagen actual y opción de cambiar */}
        <FileInput source="image" label="Cambiar Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>

        {/* Audio actual y opción de cambiar */}
        <FileInput source="audio" label="Cambiar Audio" accept="audio/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  );
};
