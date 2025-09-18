import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class BusinessCategoryService {
  constructor() {
    this.collectionName = 'businessCategories';
  }

  // Crear una nueva categoría de negocio
  async createCategory(categoryData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        name: categoryData.name,
        description: categoryData.description || '',
        iconUrl: categoryData.iconUrl || '',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        categoryId: docRef.id,
        message: 'Categoría creada exitosamente'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener todas las categorías activas
  async getActiveCategories() {
    try {
      // Obtener todas las categorías sin ordenar para evitar índice compuesto
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const categories = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filtrar en el cliente para evitar índice compuesto
        if (data.isActive === true) {
          categories.push({
            id: doc.id,
            ...data
          });
        }
      });

      // Ordenar en el cliente
      categories.sort((a, b) => a.name.localeCompare(b.name));

      return {
        success: true,
        categories
      };
    } catch (error) {
      console.error('Error getting categories:', error);
      return {
        success: false,
        error: error.message,
        categories: []
      };
    }
  }

  // Alias para compatibilidad
  async getAllActiveCategories() {
    return this.getActiveCategories();
  }

  // Obtener una categoría específica por ID
  async getCategoryById(categoryId) {
    try {
      const docRef = doc(db, this.collectionName, categoryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          category: {
            id: docSnap.id,
            ...docSnap.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Categoría no encontrada'
        };
      }
    } catch (error) {
      console.error('Error getting category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Actualizar una categoría
  async updateCategory(categoryId, updateData) {
    try {
      const docRef = doc(db, this.collectionName, categoryId);
      
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, dataToUpdate);

      return {
        success: true,
        message: 'Categoría actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Desactivar una categoría (soft delete)
  async deactivateCategory(categoryId) {
    try {
      const docRef = doc(db, this.collectionName, categoryId);
      
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Categoría desactivada exitosamente'
      };
    } catch (error) {
      console.error('Error deactivating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Eliminar permanentemente una categoría
  async deleteCategory(categoryId) {
    try {
      const docRef = doc(db, this.collectionName, categoryId);
      await deleteDoc(docRef);

      return {
        success: true,
        message: 'Categoría eliminada permanentemente'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Buscar categorías por nombre
  async searchCategoriesByName(searchTerm) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isActive', '==', true),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      const categories = [];

      querySnapshot.forEach((doc) => {
        const categoryData = doc.data();
        // Filtro local porque Firestore no soporta búsqueda de texto completo
        if (categoryData.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          categories.push({
            id: doc.id,
            ...categoryData
          });
        }
      });

      return {
        success: true,
        categories
      };
    } catch (error) {
      console.error('Error searching categories:', error);
      return {
        success: false,
        error: error.message,
        categories: []
      };
    }
  }

  // Método para inicializar categorías por defecto (solo para desarrollo)
  async initializeDefaultCategories() {
    const defaultCategories = [
      {
        name: "Peluquería",
        description: "Servicios de belleza y cuidado capilar",
        iconUrl: "https://example.com/icons/peluqueria.png"
      },
      {
        name: "Barbería",
        description: "Servicios de corte y cuidado masculino",
        iconUrl: "https://example.com/icons/barberia.png"
      },
      {
        name: "Spa y Estética",
        description: "Servicios de relajación y cuidado corporal",
        iconUrl: "https://example.com/icons/spa.png"
      },
      {
        name: "Clínica Dental",
        description: "Servicios odontológicos y cuidado dental",
        iconUrl: "https://example.com/icons/dental.png"
      },
      {
        name: "Medicina General",
        description: "Consultas médicas y atención general",
        iconUrl: "https://example.com/icons/medicina.png"
      },
      {
        name: "Psicología",
        description: "Servicios de salud mental y terapia",
        iconUrl: "https://example.com/icons/psicologia.png"
      },
      {
        name: "Nutrición",
        description: "Consultas nutricionales y dietéticas",
        iconUrl: "https://example.com/icons/nutricion.png"
      },
      {
        name: "Fisioterapia",
        description: "Servicios de rehabilitación física",
        iconUrl: "https://example.com/icons/fisioterapia.png"
      },
      {
        name: "Veterinaria",
        description: "Atención médica para mascotas",
        iconUrl: "https://example.com/icons/veterinaria.png"
      },
      {
        name: "Consultoría",
        description: "Servicios de asesoría y consultoría",
        iconUrl: "https://example.com/icons/consultoria.png"
      }
    ];

    try {
      const results = [];
      for (const category of defaultCategories) {
        const result = await this.createCategory(category);
        results.push(result);
      }

      return {
        success: true,
        message: 'Categorías por defecto creadas',
        results
      };
    } catch (error) {
      console.error('Error initializing default categories:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Alias para compatibilidad
  async seedInitialCategories() {
    return this.initializeDefaultCategories();
  }
}

export default new BusinessCategoryService();
