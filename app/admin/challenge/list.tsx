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
        <TextField source="question" />
        <SelectField
          source="type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
          ]}
        />
        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" />

        {/* Mostrar las opciones del desafío */}
        <ArrayField source="options">
          <SingleFieldList>
            <ChipField source="text" />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
    </List>
  );
};
