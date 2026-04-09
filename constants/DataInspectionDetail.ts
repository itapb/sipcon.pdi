export const INSPECTIONGROUPS = [
  // --- FASE: RECEPCION ---
  {
    phaseId: 'RECEPCION',
    title: 'Estado de Arribo',
    questions: [
      {
        id: 101,
        text: '¿Se recibió manual de usuario y duplicado de llaves?',
        files: 1,
      },
      {
        id: 102,
        text: 'Verificar daños por transporte en techo y capó',
        files: 3,
      },
    ],
  },
  {
    phaseId: 'RECEPCION',
    title: 'Identificación de Unidad',
    questions: [
      {
        id: 103,
        text: '¿El VIN físico coincide con el de la guía de despacho?',
        files: 1,
      },
    ],
  },

  // --- FASE: CHEQUEO ---
  {
    phaseId: 'CHEQUEO',
    title: 'Inventario y Accesorios',
    questions: [
      { id: 201, text: 'Presencia de antena y ganchos de remolque', files: 0 },
      { id: 202, text: 'Estado de alfombras y kit de herramientas', files: 1 },
    ],
  },

  // --- FASE: MECANICA ---
  {
    phaseId: 'MECANICA',
    title: 'Fluidos y Compartimiento',
    questions: [
      { id: 301, text: 'Nivel de refrigerante y líquido de frenos', files: 1 },
      { id: 302, text: 'Verificar fugas de aceite en el cárter', files: 2 },
    ],
  },

  // --- FASE: CARROCERIA ---
  {
    phaseId: 'CARROCERIA',
    title: 'Exterior y Ajustes',
    questions: [
      { id: 401, text: 'Alineación de puertas y cierre de maletera', files: 1 },
      { id: 402, text: 'Revisar rayones en parachoques y laterales', files: 3 },
    ],
  },

  // --- FASE: LIMPIEZA ---
  {
    phaseId: 'LIMPIEZA',
    title: 'Detallado Estético',
    questions: [
      {
        id: 501,
        text: 'Eliminación completa de parafinas protectoras',
        files: 0,
      },
      { id: 502, text: 'Limpieza de rines y neumáticos', files: 1 },
    ],
  },

  // --- FASE: PDI ---
  {
    phaseId: 'PDI',
    title: 'Sistemas Eléctricos y Luces',
    questions: [
      { id: 601, text: 'Funcionamiento de pantalla táctil y GPS', files: 0 },
      { id: 602, text: 'Prueba de luces (Altas, Bajas, Frenos)', files: 2 },
    ],
  },

  // --- FASE: AUDITORIA ---
  {
    phaseId: 'AUDITORIA',
    title: 'Certificación Final',
    questions: [
      {
        id: 701,
        text: 'Aprobación visual final para vitrina de ventas',
        files: 1,
      },
    ],
  },
];
