import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { FC, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Divider, List, Modal, Portal, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export const MenuHeader: FC = () => {
  const [visible, setVisible] = useState(false);

  const {
    user,
    area,
    selectedSupplier,
    selectedDealer,
    setSelectedDealer,
    setSelectedSupplier,
    logout,
  } = useAuthStore((state) => state);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Función para manejar el cambio (aquí llamarías a tu store)
  const HandleOnChange = (itemValue: number, type: 'dealer' | 'supplier') => {
    if (type === 'dealer') {
      setSelectedDealer(itemValue);
    } else {
      setSelectedSupplier(itemValue);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
        <Ionicons name='menu' size={30} color='#333' />
      </TouchableOpacity>

      <Image
        source={require('../assets/images/logos/LogoAPB.png')}
        style={styles.logo}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeMenu}
          contentContainerStyle={styles.drawerContainer}
        >
          {/* HEADER DEL DRAWER */}
          <View style={styles.userInfoSection}>
            <Avatar.Text
              size={60}
              label={user?.login?.substring(0, 2).toUpperCase() || 'PDI'}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.login || 'Usuario'}</Text>
              <Text style={styles.userRole}>{area || 'Área'}</Text>
            </View>
          </View>

          <View style={styles.menuItems}>
            <List.Item
              title='Inicio'
              left={(p) => <List.Icon {...p} icon='home' color='#475569' />}
              onPress={() => {
                closeMenu();
                router.replace('/');
              }}
            />

            {/* SECCIÓN DEL PICKER COMO INPUT SELECT */}
            <View style={styles.pickerSection}>
              <Text style={styles.label}>Planta</Text>
              <View style={styles.pickerWrapper}>
                <Ionicons
                  name={'business'}
                  size={20}
                  color='#2563EB'
                  style={styles.pickerIcon}
                />
                <Picker
                  selectedValue={selectedSupplier}
                  onValueChange={(itemValue) =>
                    HandleOnChange(itemValue!, 'supplier')
                  }
                  style={styles.picker}
                  mode='dropdown' // Solo afecta a Android
                  dropdownIconColor='#64748B'
                >
                  {user?.suppliers.map((item, index) => (
                    <Picker.Item
                      key={item.id + index}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.pickerSection}>
              <Text style={styles.label}>Concesionario</Text>
              <View style={styles.pickerWrapper}>
                <Ionicons
                  name={'business'}
                  size={20}
                  color='#2563EB'
                  style={styles.pickerIcon}
                />
                <Picker
                  selectedValue={selectedDealer}
                  onValueChange={(itemValue) =>
                    HandleOnChange(itemValue!, 'dealer')
                  }
                  style={styles.picker}
                  mode='dropdown' // Solo afecta a Android
                  dropdownIconColor='#64748B'
                >
                  {user?.dealers
                    .filter((item) => item.supplierId == selectedSupplier)
                    .map((item, index) => (
                      <Picker.Item
                        key={item.id + index}
                        label={item.name}
                        value={item.id}
                      />
                    ))}
                </Picker>
              </View>
            </View>

            <Divider style={styles.dividerSpace} />

            <List.Item
              title='Cerrar Sesión'
              titleStyle={{ color: '#EF4444' }}
              left={(p) => <List.Icon {...p} icon='logout' color='#EF4444' />}
              onPress={() => {
                closeMenu();
                logout();
              }}
            />
          </View>

          <View style={styles.drawerFooter}>
            <Image
              source={require('../assets/images/logos/LogoAPB.png')}
              style={styles.logoFooter}
            />
            <Text style={styles.versionText}>Sistema PDI v1.0.0</Text>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  menuButton: { padding: 5 },
  logo: { width: 90, height: 60, resizeMode: 'contain' },
  drawerContainer: {
    backgroundColor: 'white',
    width: width * 0.8,
    height: height,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  userInfoSection: {
    padding: 25,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: { backgroundColor: '#3B82F6' },
  userDetails: { marginLeft: 15, flex: 1 },
  userName: { color: 'white', fontSize: 18, fontWeight: '800' },
  userRole: { color: '#94A3B8', fontSize: 13 },
  menuItems: { flex: 1, paddingTop: 10 },
  pickerSection: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    overflow: 'hidden', // Importante para que el picker no se salga del radio
  },
  pickerIcon: {
    marginLeft: 12,
  },
  picker: {
    flex: 1,
    color: '#334155',
    ...Platform.select({
      android: {
        marginLeft: -5, // Ajuste fino para Android
      },
    }),
  },

  dividerSpace: { marginVertical: 10 },
  drawerFooter: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  logoFooter: { width: 80, height: 40, resizeMode: 'contain', opacity: 0.5 },
  versionText: { fontSize: 11, color: '#CBD5E1', marginTop: 5 },
});
