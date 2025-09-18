import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  addDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirebaseAppService {
  // ==================== USUARIOS ====================
  
  // Obtener perfil de usuario
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'Usuario no encontrado' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar perfil de usuario
  async updateUserProfile(userId, userData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== TURNOS/CITAS ====================
  
  // Crear nueva cita
  async createAppointment(appointmentData) {
    try {
      const appointmentRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        status: 'pending', // pending, confirmed, cancelled, completed
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { 
        success: true, 
        appointmentId: appointmentRef.id 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener citas de un usuario
  async getUserAppointments(userId) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', userId),
        orderBy('appointmentDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: appointments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar estado de cita
  async updateAppointmentStatus(appointmentId, status) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Cancelar cita
  async cancelAppointment(appointmentId, reason = '') {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== SERVICIOS ====================
  
  // Obtener lista de servicios disponibles
  async getServices() {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const services = [];
      
      querySnapshot.forEach((doc) => {
        services.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: services };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== ESPECIALISTAS ====================
  
  // Obtener lista de especialistas
  async getSpecialists() {
    try {
      const querySnapshot = await getDocs(collection(db, 'specialists'));
      const specialists = [];
      
      querySnapshot.forEach((doc) => {
        specialists.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: specialists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener especialistas por servicio
  async getSpecialistsByService(serviceId) {
    try {
      const q = query(
        collection(db, 'specialists'),
        where('services', 'array-contains', serviceId)
      );
      
      const querySnapshot = await getDocs(q);
      const specialists = [];
      
      querySnapshot.forEach((doc) => {
        specialists.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: specialists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener profesionales asociados a un negocio (businessId)
  async getProfessionalsByBusiness(businessId) {
    try {
      if (!businessId) return { success: true, data: [] };
      const q = query(
        collection(db, 'professionals'),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const professionals = [];
      querySnapshot.forEach((doc) => {
        professionals.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: professionals };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== NOTIFICACIONES ====================
  
  // Crear notificación
  async createNotification(userId, notificationData) {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: userId,
        ...notificationData,
        read: false,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener notificaciones de usuario
  async getUserNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new FirebaseAppService();
