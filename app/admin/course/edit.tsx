import {
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  required,
  FileInput,
  FileField,
  ImageField,
} from "react-admin";
import { useState } from "react";

export const CourseEdit = () => {
  const [imageUrl, setImageUrl] = useState("");

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url; // Devuelve la URL de la imagen subida a Cloudinary
  };

  return (
    <Edit>
      <SimpleForm
        onSubmit={async (values) => {
          let updatedImageUrl = values.image_src; // Mantener la imagen actual si no se sube una nueva

          if (values.image) {
            updatedImageUrl = await uploadImage(values.image.rawFile);
            setImageUrl(updatedImageUrl);
          }

          // Guardar la información editada en la base de datos
          await fetch(`/api/courses/${values.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              image_src: updatedImageUrl, // Usamos `image_src` en lugar de `imageSrc`
            }),
          });

          alert("Curso actualizado con éxito");
        }}
      >
        <NumberInput source="id" validate={[required()]} label="Id" disabled />
        <TextInput source="title" validate={[required()]} label="Title" />

        {/* Mostrar la imagen actual del curso */}
        <ImageField source="image_src" title="Imagen actual" label="Imagen actual" />

        {/* Input para subir una nueva imagen */}
        <FileInput source="image" label="Actualizar Imagen" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  );
};
