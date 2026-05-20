import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

// Instancia global del emisor de eventos
export const inspectionEventEmitter = new EventEmitter();

// Constante para evitar errores de escritura en el nombre del evento
export const TRIGGER_REFRESH_EVENT = 'refresh_inspection_data';
