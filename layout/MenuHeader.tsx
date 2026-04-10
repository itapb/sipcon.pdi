import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FC, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Divider, List, Modal, Portal, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export const MenuHeader: FC = () => {
  const [visible, setVisible] = useState(false);

  const { user, area, logout } = useAuthStore((state) => state);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const router = useRouter();

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
          {/* SECCIÓN DE PERFIL DE USUARIO */}
          <View style={styles.userInfoSection}>
            <Avatar.Text
              size={60}
              label={user?.substring(0, 2).toUpperCase() || 'PDI'}
              style={styles.avatar}
              labelStyle={{ fontSize: 24, fontWeight: '700' }}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user || 'Usuario'}</Text>
              <Text style={styles.userRole}>{area || 'Area'}</Text>
            </View>
          </View>

          <Divider />

          {/* CUERPO DEL MENÚ */}
          <View style={styles.menuItems}>
            <List.Item
              title='Inicio'
              titleStyle={styles.itemTitle}
              left={(props) => (
                <List.Icon {...props} icon='home' color='#475569' />
              )}
              onPress={() => {
                closeMenu();
                router.replace('/');
              }}
            />

            <List.Item
              title='Cambiar de área'
              titleStyle={styles.itemTitle}
              left={(props) => (
                <List.Icon {...props} icon='swap-horizontal' color='#475569' />
              )}
              onPress={() => {
                console.log('Cambiando de área...');
                closeMenu();
              }}
            />

            {/* BOTÓN CAMBIAR DE ÁREA */}
            <Divider style={styles.dividerSpace} />

            {/* BOTÓN CERRAR SESIÓN */}
            <List.Item
              title='Cerrar Sesión'
              titleStyle={[styles.itemTitle, { color: '#EF4444' }]}
              left={(props) => (
                <List.Icon {...props} icon='logout' color='#EF4444' />
              )}
              onPress={() => {
                closeMenu();
                logout();
              }}
            />
          </View>

          {/* FOOTER DEL MENÚ */}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 5,
  },
  logo: {
    width: 90,
    height: 60,
    resizeMode: 'contain',
  },
  drawerContainer: {
    backgroundColor: 'white',
    width: width * 0.8,
    height: height,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-start',
  },
  userInfoSection: {
    padding: 25,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    backgroundColor: '#3B82F6',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  userRole: {
    color: '#94A3B8',
    fontSize: 13,
  },
  menuItems: {
    flex: 1,
    paddingTop: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  changeAreaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  changeAreaText: {
    marginLeft: 10,
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 14,
  },
  dividerSpace: {
    marginVertical: 10,
  },
  drawerFooter: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  logoFooter: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
    opacity: 0.5,
  },
  versionText: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 5,
  },
});
