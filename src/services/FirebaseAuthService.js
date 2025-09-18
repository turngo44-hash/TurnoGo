import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class FirebaseAuthService {
  // Registrar usuario con email y contraseña (específico para negocios)
  async registerWithEmail(email, password, userData) {
    try {
      // Verificar que Firebase Auth esté disponible
      if (!auth) {
        throw new Error('Firebase Auth no está inicializado');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar perfil con nombre
      if (userData.name) {
        await updateProfile(user, {
          displayName: userData.name
        });
      }

      // Guardar datos del negocio en Firestore
      const businessData = {
        uid: user.uid,
        email: user.email,
        name: userData.name || '',
        phone: userData.phone || '',
        businessCategoryId: userData.businessCategoryId || '', // Referencia a la categoría
        countryId: userData.countryId || '', // Referencia al país
        userType: 'business', // Esta app es solo para negocios
        isVerified: false, // Los negocios necesitan verificación
        subscriptionStatus: 'trial', // trial, active, inactive
        maxAppointments: 50, // límite durante trial
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'business', user.uid), businessData);

      // Crear un profesional "dummy" asociado a este negocio para que el negocio tenga al menos
      // un profesional disponible inmediatamente después del registro.
      try {
        const professionalData = {
          businessId: user.uid,
          name: userData.name ? `${userData.name} - Profesional` : 'Profesional principal',
          role: 'Principal',
          avatar: userData.avatar || '',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'professionals'), professionalData);
      } catch (profError) {
        console.warn('No se pudo crear profesional dummy:', profError);
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          userType: 'business',
          businessName: userData.businessName,
          phone: userData.phone,
          name: userData.name
        }
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Iniciar sesión con email y contraseña
  async loginWithEmail(email, password) {
    try {
      // Verificar que Firebase Auth esté disponible
      if (!auth) {
        throw new Error('Firebase Auth no está inicializado');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener datos adicionales de Firestore
      const userDoc = await getDoc(doc(db, 'business', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userData
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Restablecer contraseña
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    try {
      // Verificar que Firebase Auth esté disponible
      if (!auth) {
        console.warn('Firebase Auth no está inicializado para el listener');
        return () => {}; // Retornar función de limpieza vacía
      }

      return onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            // Usuario autenticado - obtener datos completos
            const userDoc = await getDoc(doc(db, 'business', user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            callback({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...userData
            });
          } else {
            // Usuario no autenticado
            callback(null);
          }
        } catch (error) {
          console.error('Error en onAuthStateChanged callback:', error);
          callback(null);
        }
      });
    } catch (error) {
      console.error('Error configurando auth state listener:', error);
      return () => {}; // Retornar función de limpieza vacía
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      return auth?.currentUser || null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // Actualizar perfil de usuario
  async updateUserProfile(userData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Actualizar en Auth si hay cambios en displayName
      if (userData.name && userData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: userData.name
        });
      }

      // Actualizar en Firestore
      await setDoc(doc(db, 'business', user.uid), {
        ...userData,
        updatedAt: serverTimestamp()
      }, { merge: true });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Traducir códigos de error a mensajes legibles
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No existe un usuario con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este email ya está registrado. ¿Ya tienes una cuenta?',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido. Verifica el formato',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/invalid-credential': 'Credenciales inválidas. Verifica email y contraseña',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta soporte',
      'auth/operation-not-allowed': 'Método de autenticación no permitido',
      'auth/requires-recent-login': 'Por seguridad, inicia sesión nuevamente'
    };

    return errorMessages[errorCode] || 'Error inesperado. Intenta de nuevo';
  }
}

export default new FirebaseAuthService();
