import { DataUser } from '@/utils/fetchs/login/POST_Login';
import React, { Dispatch, FC } from 'react';
import { AccordionObservation } from '../Accordion/AccordionObservation';
import { CardCar } from '../card/CardCar';
import { ListFeatures } from '../features/ListFeatures';

type Props = {
  id: number;
  inspection: any;
  user: DataUser | null;
  isReadOnly: boolean;
  observation: string;
  setObservation: Dispatch<React.SetStateAction<string>>;
  showObservation: boolean;
  setShowObservation: Dispatch<React.SetStateAction<boolean>>;
  groups: any[];
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
        token={props.user!.token}
        userId={props.user!.userId}
        readOnly={props.isReadOnly}
      />

      {/* Observaciones Generales */}
      <AccordionObservation
        observation={props.observation}
        setObservation={props.setObservation}
        showObservation={props.showObservation}
        setShowObservation={props.setShowObservation}
        inspection={props.inspection}
        token={props.user?.token!}
        readOnly={props.isReadOnly}
      />

      {/* Lista de features */}
      <ListFeatures
        userId={props.user!.userId}
        Groups={props.groups}
        token={props.user!.token}
        readOnly={props.isReadOnly}
      />
    </>
  );
};
