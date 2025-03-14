import { Create, SimpleForm, TextInput, required, FileInput, FileField, useRedirect } from "react-admin";
import { useState } from "react";

export const CourseCreate = () => {
  const [imageUrl, setImageUrl] = useState("");
  const redirect = useRedirect(); // ✅ Hook para redirigir después de crear

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url; // Devuelve la URL de Cloudinary
  };

  return (
    <Create>
      <SimpleForm
        onSubmit={async (values) => {
          let uploadedImageUrl = imageUrl;

          if (values.image) {
            uploadedImageUrl = await uploadImage(values.image.rawFile);
            console.log("URL de imagen subida:", uploadedImageUrl);
            setImageUrl(uploadedImageUrl);
          }

          console.log("Enviando a la API:", {
            title: values.title,
            imageSrc: uploadedImageUrl,
          });

          const response = await fetch("/api/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              imageSrc: uploadedImageUrl,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la API:", errorText);
            alert("Error al crear el curso: " + errorText);
            return;
          }

          alert("Curso creado con éxito");
          redirect("/courses"); // ✅ Redirigir después de crear
        }}
      >
        <TextInput source="title" validate={[required()]} label="Title" />

        {/* Input para subir imágenes */}
        <FileInput source="image" label="Imagen del curso" accept="image/*">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
