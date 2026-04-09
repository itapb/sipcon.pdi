export const INSPECTIONGROUPS = [
  {
    title: 'Documentación y Motor',
    questions: [
      {
        id: 1,
        text: '¿El VIN del auto coincide con la documentación?',
        files: 1,
      },
      { id: 2, text: 'Nivel de aceite y estado del motor', files: 0 },
    ],
  },
  {
    title: 'Exterior',
    questions: [
      {
        id: 3,
        text: 'Estado de la pintura y carrocería (¿Abolladuras?)',
        files: 3,
      },
      {
        id: 4,
        text: 'Funcionamiento de luces (Altas, bajas y frenos)',
        files: 2,
      },
    ],
  },
  {
    title: 'Interior',
    questions: [
      {
        id: 5,
        text: 'Limpieza de interiores y estado de la tapicería',
        files: 1,
      },
      { id: 6, text: 'Verificación de kit de herramientas y llanta', files: 0 },
    ],
  },
];
