import React, { Dispatch, FC } from 'react';
import { AccordionObservation } from '../Accordion/AccordionObservation';
import { CardCar } from '../card/CardCar';
import { ListFeatures } from '../features/ListFeatures';

type Props = {
  id: number;
  inspection: any;
  userId: number;
  isReadOnly: boolean;
  observation: string;
  setObservation: Dispatch<React.SetStateAction<string>>;
  showObservation: boolean;
  setShowObservation: Dispatch<React.SetStateAction<boolean>>;
  groups: any[];
  onUpdateQuestionLocal: (
    idDetail: number,
    newValue: number | null,
    newObs: string,
  ) => void;
};

export const Inspection: FC<Props> = (props) => {
  return (
    <>
      {/* Información rápida de la unidad */}
      <CardCar
        model_name={props.inspection.model}
        vin={props.inspection.vin}
        plate={props.inspection.vehiclePlate}
        hasFiles={props.inspection.hasFiles}
        inspectionId={props.id}
        userId={props.userId}
        readOnly={props.isReadOnly}
      />

      {/* Observaciones Generales */}
      <AccordionObservation
        observation={props.observation}
        setObservation={props.setObservation}
        showObservation={props.showObservation}
        setShowObservation={props.setShowObservation}
        inspection={props.inspection}
        readOnly={props.isReadOnly}
      />

      {/* Lista de features */}
      <ListFeatures
        userId={props.userId}
        Groups={props.groups}
        readOnly={props.isReadOnly}
        onUpdateQuestionLocal={props.onUpdateQuestionLocal}
      />
    </>
  );
};
