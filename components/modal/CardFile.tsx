import { GET_AttachmentPreview } from '@/utils/fetchs/attachment/GET_AttachmentPreview';
import { POST_DeleteAttachment } from '@/utils/fetchs/attachment/POST_DeleteAttachment';
import { TruncateText } from '@/utils/TruncateText';
import { Feather } from '@expo/vector-icons';
import { FC, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

type PropsCardFile = {
  name: string;
  attachmentId: number;
  userId: number;
  readonly: boolean;
  onActionSuccess: () => void;
};

export const CardFile: FC<PropsCardFile> = (props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await POST_DeleteAttachment({
      attachmentId: props.attachmentId,
      userId: props.userId,
    });
    if (success.ok) {
      props.onActionSuccess();
    }
    setIsDeleting(false);
  };

  const downloadAttachment = async () => {
    setIsDeleting(true);
    try {
      await GET_AttachmentPreview({
        attachmentId: props.attachmentId,
        fileName: props.name,
        userId: props.userId,
      });
    } catch (error) {
      console.error('Error cargando adjuntos:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={[styles.cardItem, isDeleting && { opacity: 0.5 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileNameText}>{TruncateText(props.name)}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={downloadAttachment}
          disabled={isDeleting}
        >
          <Feather name='download' size={22} color='#64748B' />
        </TouchableOpacity>

        {!props.readonly && (
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
