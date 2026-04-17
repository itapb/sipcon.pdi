import { OpenGallery } from '@/hooks/handles/OpenGallery';
import {
  DataAttachment,
  GETALL_Attachment,
} from '@/utils/fetchs/attachment/GETALL_Attachment';
import { POST_DeleteAttachment } from '@/utils/fetchs/attachment/POST_DeleteAttachment';
import { TruncateText } from '@/utils/TruncateText';
import { Entypo, Feather } from '@expo/vector-icons';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

type Props = {
  userId: number;
  moduleName: string;
  recordId: number;
  token: string;
  visible: boolean;
  onDismiss: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  children?: ReactNode;
};

export const ModalFiles: FC<Props> = (props) => {
  const [attachment, setAttachment] = useState<DataAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener/recargar los archivos
  const loadAttachments = async () => {
    setLoading(true);
    try {
      const data = await GETALL_Attachment({
        moduleName: props.moduleName,
        recordId: props.recordId,
        token: props.token,
      });
      if (data) setAttachment(data);
    } catch (error) {
      console.error('Error cargando adjuntos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.visible) {
      loadAttachments();
    }
  }, [props.visible]);

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => props.onDismiss(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Datos Adjuntos ({attachment.length})</Text>
          <IconButton
            icon='close'
            size={20}
            onPress={() => props.onDismiss(false)}
            style={styles.closeButton}
          />
        </View>

        <View style={styles.body}>
          {loading ? (
            <View style={styles.loaderArea}>
              <ActivityIndicator size='large' color='#0C8CE9' />
              <Text style={styles.loaderText}>Actualizando lista...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollWrapper}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={true}
            >
              {attachment.length === 0 ? (
                <Text style={styles.emptyText}>No hay archivos adjuntos.</Text>
              ) : (
                attachment.map((item, index) => (
                  <CardFile
                    key={`${item.id}-${index}`}
                    name={item.fileName}
                    attachmentId={item.id}
                    userId={props.userId}
                    token={props.token}
                    onActionSuccess={loadAttachments} // Recargar tras borrar
                  />
                ))
              )}
            </ScrollView>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.onDismiss(false)}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.blue, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={async () => {
              setLoading(true);
              try {
                // OpenGallery debe realizar los POST internos
                await OpenGallery({
                  moduleName: props.moduleName,
                  recordId: props.recordId,
                  token: props.token,
                  userId: props.userId,
                });
                await loadAttachments(); // Recarga después de subir
              } catch (e) {
                setLoading(false);
              }
            }}
          >
            <Entypo name='attachment' size={20} color='white' />
            <Text style={[styles.buttonText, styles.white]}>Adjuntar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

// --- Sub-componente CardFile ---

type PropsCardFile = {
  name: string;
  attachmentId: number;
  userId: number;
  token: string;
  onActionSuccess: () => void;
};

const CardFile: FC<PropsCardFile> = ({
  name,
  attachmentId,
  userId,
  token,
  onActionSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await POST_DeleteAttachment({
      token,
      attachmentId,
      userId,
    });
    if (success) {
      onActionSuccess();
    }
    setIsDeleting(false);
  };

  return (
    <View style={[styles.cardItem, isDeleting && { opacity: 0.5 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileNameText}>{TruncateText(name)}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <Feather name='download' size={22} color='#64748B' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionIcon}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size='small' color='#EF4444' />
          ) : (
            <Feather name='trash-2' size={22} color='#EF4444' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  body: {
    height: height * 0.4, // Altura fija para el área de contenido
  },
  loaderArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 14,
  },
  scrollWrapper: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 20,
  },
  cardItem: {
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  fileNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 10,
  },
  actionIcon: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 16,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  button: {
    borderRadius: 10,
    height: 48,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  blue: {
    backgroundColor: '#0C8CE9',
    borderColor: '#0C8CE9',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#475569',
  },
  white: {
    color: 'white',
  },
  closeButton: { margin: 0 },
});
