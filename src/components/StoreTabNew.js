import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const FEATURED_CARD_WIDTH = width * 0.75;

const StoreTabNew = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const scrollRef = useRef(null);

  // Agrupar productos por categoría
  const groupProductsByCategory = (products = []) => {
    const map = {};
    products.forEach(p => {
      const cat = p.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  };

  // Encontrar productos destacados o con descuento (simulado para el ejemplo)
  const getFeaturedProducts = (products) => {
    // En un caso real, estos vendrían marcados en los datos
    return products.filter((_, index) => index % 4 === 0);
  };

  const groupedProducts = groupProductsByCategory(products);
  const categories = Object.keys(groupedProducts);
  const featuredProducts = getFeaturedProducts(products);

  // Abrir modal con detalle del producto
  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Agregar un producto al carrito
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    
    setModalVisible(false);
    Alert.alert('Producto añadido', `${product.name} se ha añadido a tu carrito`);
  };

  // Eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(
      cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Convertir precio de "18€" a 18
      const price = parseFloat(item.price.replace('€', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  // Renderizar las categorías horizontalmente con el carrito integrado
  const renderCategories = () => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
      <View style={styles.headerContainer}>
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContentContainer}
          >
            <TouchableOpacity 
              style={[
                styles.categoryChip,
                !selectedCategory && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryText,
                !selectedCategory && styles.selectedCategoryText
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Botón del carrito a la derecha */}
          <TouchableOpacity 
            style={styles.headerCartButton}
            onPress={() => setCartVisible(true)}
          >
            <Ionicons name="cart-outline" size={20} color="#111827" />
            {itemCount > 0 && (
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Renderizar un producto destacado
  const renderFeaturedProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        <Image 
          source={{ uri: item.image || `https://source.unsplash.com/random/400x400/?${item.category?.toLowerCase() || 'beauty-product'}` }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        {item.stock <= 5 && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>¡Últimas {item.stock} uds!</Text>
          </View>
        )}
      </View>
      <View style={styles.featuredCardContent}>
        <Text style={styles.featuredProductName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.productInfoRow}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.productPrice}>
            {item.price}
          </Text>
        </View>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Renderizar un producto regular en grid
  const renderProductCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.image || `https://source.unsplash.com/random/300x300/?${item.category?.toLowerCase() || 'beauty-product'}` }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.productInfoRow}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={10} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={(e) => {
          e.stopPropagation();
          addToCart(item);
        }}
      >
        <Ionicons name="add" size={18} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Modal de detalle del producto
  const renderProductDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          
          {selectedProduct && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image 
                source={{ uri: selectedProduct.image || `https://source.unsplash.com/random/600x400/?${selectedProduct.category?.toLowerCase() || 'beauty-product'}` }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              
              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                
                <View style={styles.productMetaInfo}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="category" size={16} color="#8B5CF6" />
                    <Text style={styles.metaText}>{selectedProduct.category}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <FontAwesome name="star" size={16} color="#FFD700" />
                    <Text style={styles.metaText}>{selectedProduct.rating} (124 reviews)</Text>
                  </View>
                </View>
                
                <Text style={styles.priceLabel}>Precio</Text>
                <Text style={styles.modalPrice}>{selectedProduct.price}</Text>

                <Text style={styles.stockLabel}>Disponibilidad</Text>
                <Text style={styles.stockInfo}>
                  {selectedProduct.stock > 0 ? 
                    `${selectedProduct.stock} unidades disponibles` : 
                    "Agotado temporalmente"}
                </Text>
                
                <Text style={styles.descriptionLabel}>Descripción</Text>
                <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                
                <View style={styles.quantitySelector}>
                  <Text style={styles.quantityLabel}>Cantidad:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity style={styles.quantityButton}>
                      <Ionicons name="remove" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>1</Text>
                    <TouchableOpacity style={styles.quantityButton}>
                      <Ionicons name="add" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.addToCartButtonLarge}
                  onPress={() => addToCart(selectedProduct)}
                >
                  <Ionicons name="cart-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                  <Text style={styles.addToCartButtonText}>Añadir al Carrito</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  // Modal del carrito de compra
  const renderCartModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={cartVisible}
      onRequestClose={() => setCartVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Mi Carrito</Text>
            <TouchableOpacity 
              style={styles.closeCartButton}
              onPress={() => setCartVisible(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Ionicons name="cart-outline" size={70} color="#ccc" />
              <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
              <TouchableOpacity 
                style={styles.continueShopping}
                onPress={() => setCartVisible(false)}
              >
                <Text style={styles.continueShoppingText}>Continuar comprando</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView>
              {cartItems.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Image 
                    source={{ uri: item.image || `https://source.unsplash.com/random/300x300/?${item.category?.toLowerCase() || 'beauty-product'}` }}
                    style={styles.cartItemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cartItemDetails}>
                    <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>{item.price}</Text>
                    <View style={styles.cartItemQuantity}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <View style={styles.cartSummary}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryTotal}>{calculateTotal().toFixed(2)}€</Text>
              </View>
              
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  // Esta función ya no es necesaria, ya que el carrito está en el encabezado

  // Filtramos por categoría si hay una seleccionada
  const filteredCategories = selectedCategory ? 
    [selectedCategory] : 
    categories;

  return (
    <View style={styles.container}>
      {/* Header con título, carrito y categorías */}
      {renderCategories()}

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        {/* Sección de productos destacados */}
        {featuredProducts.length > 0 && !selectedCategory && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Productos Destacados</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredProducts}
              keyExtractor={(item) => `featured-${item.id}`}
              renderItem={renderFeaturedProduct}
              contentContainerStyle={styles.featuredList}
              snapToInterval={FEATURED_CARD_WIDTH + 16}
              decelerationRate="fast"
              pagingEnabled
            />
          </View>
        )}

        {/* Secciones por categoría */}
        {filteredCategories.map(category => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
            </View>
            
            <View style={styles.productsGrid}>
              {groupedProducts[category].map((product) => (
                <View key={`product-${product.id}`} style={styles.gridItem}>
                  {renderProductCard({item: product})}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        {/* Espaciado final */}
        <View style={{height: 80}} />
      </ScrollView>

      {/* Modal de detalle del producto */}
      {renderProductDetailModal()}
      
      {/* Modal del carrito */}
      {renderCartModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  headerCartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    marginLeft: 8,
  },
  headerCartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  headerCartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  categoriesScroll: {
    flexGrow: 1,
  },
  categoriesContentContainer: {
    paddingHorizontal: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  // Estilos para sección de destacados
  featuredSection: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  featuredCardContent: {
    padding: 12,
  },
  featuredProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  // Estilos para secciones de categoría
  categorySection: {
    paddingTop: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  productCard: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 10,
    paddingBottom: 15,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  // Estilos para el modal de detalle
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  modalImage: {
    width: '100%',
    height: 240,
  },
  modalBody: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  productMetaInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  stockInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginRight: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 12,
  },
  addToCartButtonLarge: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para el carrito
  // Estos estilos ya no son necesarios porque hemos movido el carrito al header
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeCartButton: {
    padding: 4,
  },
  emptyCartContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  continueShopping: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
    alignSelf: 'center',
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  checkoutButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoreTabNew;