import { List, Datagrid, TextField, NumberField, ReferenceField, ImageField } from "react-admin";

export const LessonList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="title" label="Título" />
      <ReferenceField source="unitId" reference="units" label="Unidad">
        <TextField source="title" />
      </ReferenceField>
      <NumberField source="order" label="Orden" />

      {/* Mostrar imagen */}
      <ImageField source="imageUrl" label="Imagen" />

      {/* Mostrar audio */}
      <TextField source="audioUrl" label="Audio" />

    </Datagrid>
  </List>
);
