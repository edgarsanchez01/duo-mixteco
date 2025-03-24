import { Create, SimpleForm, TextInput, required, NumberInput, ReferenceInput, SelectInput, useRedirect } from "react-admin";

export const LessonCreate = () => {
  const redirect = useRedirect(); // 👈 Hook para redirigir después de la creación

  return (
    <Create>
      <SimpleForm
        onSubmit={async (values) => {
          // Guardar la lección en la base de datos (sin imagen ni audio)
          await fetch("/api/lessons", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              unitId: values.unitId,
              order: values.order || 1,
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
      </SimpleForm>
    </Create>
  );
};
