import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  SelectField,
  TextField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" label="Question" />

        <SelectField
          source="type"
          label="Type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
            { id: "WRITE", name: "WRITE" },
            { id: "MATCH", name: "MATCH" },
            { id: "FILL-IN", name: "FILL-IN" },
          ]}
        />

        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" label="Order" />

        {/* ✅ Muestra dinámicamente los datos según el tipo de desafío */}
        <DynamicFields />
      </Datagrid>
    </List>
  );
};

// ✅ Componente para mostrar los datos dinámicamente según el tipo
const DynamicFields = () => {
  return (
    <>
      {/* ✅ Mostrar opciones para SELECT y ASSIST */}
      <ArrayField source="options" label="Options">
        <SingleFieldList>
          <ChipField source="text" />
        </SingleFieldList>
      </ArrayField>

      {/* ✅ Mostrar respuesta para WRITE y FILL-IN */}
      <TextField source="answer" label="Correct Answer" />

      {/* ✅ Mostrar pares de palabras para MATCH */}
      <ArrayField source="pairs" label="Pairs">
        <Datagrid bulkActionButtons={false}>
          <TextField source="left" label="Left" />
          <TextField source="right" label="Right" />
        </Datagrid>
      </ArrayField>
    </>
  );
};
