import {
  Create,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  BooleanInput,
} from "react-admin";

export const ChallengeCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="question" validate={[required()]} label="Question" />
        
        <SelectInput
          source="type"
          validate={[required()]}
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
          ]}
        />
        
        <ReferenceInput source="lessonId" reference="lessons" />
        
        <NumberInput source="order" validate={required()} label="Order" />

        {/* Nueva sección para opciones */}
        <ArrayInput source="options" label="Options">
          <SimpleFormIterator>
            <TextInput source="text" validate={[required()]} label="Option Text" />
            <BooleanInput source="correct" label="Is Correct?" />
            <TextInput source="imageSrc" label="Image URL (optional)" />
            <TextInput source="audioSrc" label="Audio URL (optional)" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};
