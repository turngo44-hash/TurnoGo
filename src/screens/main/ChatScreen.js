import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

// Mock data for chat conversations
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    client: {
      id: 'client1',
      name: 'María García',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      status: 'online',
    },
    lastMessage: {
      text: 'Hola! Quisiera agendar un turno para el viernes',
      time: '10:45',
      isRead: true,
      isSent: true,
      sender: 'client'
    },
    unreadCount: 0,
  },
  {
    id: 'c2',
    client: {
      id: 'client2',
      name: 'Carlos Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      status: 'offline',
    },
    lastMessage: {
      text: 'Te confirmo que quedó agendado para el martes a las 15:00',
      time: '09:30',
      isRead: true,
      isSent: true,
      sender: 'professional'
    },
    unreadCount: 0,
  },
  {
    id: 'c3',
    client: {
      id: 'client3',
      name: 'Laura Martínez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
      status: 'online',
    },
    lastMessage: {
      text: 'Gracias por la atención, quedé muy conforme con el servicio',
      time: 'Ayer',
      isRead: false,
      isSent: true,
      sender: 'client'
    },
    unreadCount: 2,
  },
  {
    id: 'c4',
    client: {
      id: 'client4',
      name: 'Javier López',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      status: 'offline',
    },
    lastMessage: {
      text: '¿Tienen disponibilidad para el próximo sábado?',
      time: 'Lun',
      isRead: true,
      isSent: true,
      sender: 'client'
    },
    unreadCount: 0,
  },
  {
    id: 'c5',
    client: {
      id: 'client5',
      name: 'Ana Gómez',
      avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&h=200&fit=crop',
      status: 'online',
    },
    lastMessage: {
      text: 'Perfecto, nos vemos mañana entonces',
      time: '3 días',
      isRead: true,
      isSent: true,
      sender: 'client'
    },
    unreadCount: 0,
  },
  {
    id: 'c6',
    client: {
      id: 'client6',
      name: 'Diego Fernández',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      status: 'offline',
    },
    lastMessage: {
      text: 'Hola! Quisiera saber si vendes productos para el cuidado del cabello',
      time: '5 días',
      isRead: true,
      isSent: true,
      sender: 'client'
    },
    unreadCount: 0,
  },
];

// Individual message mock data
const MOCK_MESSAGES = {
  'c1': [
    {
      id: 'm1',
      text: 'Hola! Quisiera agendar un turno para el viernes',
      time: '10:45',
      sender: 'client',
      status: 'read'
    },
    {
      id: 'm2',
      text: 'Hola María! Claro, tengo disponibilidad para el viernes. ¿Qué horario te vendría mejor?',
      time: '10:47',
      sender: 'professional',
      status: 'sent'
    },
    {
      id: 'm3',
      text: 'Genial! Si es posible, preferiría por la tarde, sobre las 16:00',
      time: '10:50',
      sender: 'client',
      status: 'read'
    },
    {
      id: 'm4',
      text: 'Perfecto, te reservo el viernes a las 16:00. ¿Qué servicio querías realizar?',
      time: '10:52',
      sender: 'professional',
      status: 'sent'
    },
    {
      id: 'm5',
      text: 'Quería un corte de pelo y color',
      time: '10:55',
      sender: 'client',
      status: 'read'
    },
    {
      id: 'm6',
      text: 'Anotado. El turno duraría aproximadamente 2 horas y el precio sería de 95€. ¿Te confirmo la reserva?',
      time: '10:58',
      sender: 'professional',
      status: 'sent'
    },
    {
      id: 'm7',
      text: 'Sí, por favor, confirmámelo. ¡Muchas gracias!',
      time: '11:00',
      sender: 'client',
      status: 'read'
    }
  ]
};

export default function ChatScreen({ route }) {
  const navigation = useNavigation();
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);
  
  // Si llegamos con un professional desde otra pantalla
  const professional = route?.params?.professional;
  
  // Cuando se navega con un profesional, iniciar chat con él
  React.useEffect(() => {
    if (professional && !activeConversation) {
      // Comprobar si ya existe una conversación con este profesional
      const existingConversation = conversations.find(
        c => c.client && c.client.id === professional.id
      );
      
      if (existingConversation) {
        // Si existe, seleccionarla
        handleSelectConversation(existingConversation);
      } else {
        // Si no existe, crear una nueva conversación simulada
        const newConversation = {
          id: `c${Date.now()}`,
          client: {
            id: professional.id || 'prof1',
            name: professional.name || 'Profesional',
            avatar: professional.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
            status: 'online',
          },
          lastMessage: {
            text: '¡Hola! ¿En qué puedo ayudarte?',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            isRead: true,
            isSent: true,
            sender: 'client'
          },
          unreadCount: 1,
        };
        
        // Agregar la nueva conversación y seleccionarla
        setConversations(prev => [newConversation, ...prev]);
        setTimeout(() => handleSelectConversation(newConversation), 100);
      }
    }
  }, [professional]);
  
  // Configuración del header
  React.useLayoutEffect(() => {
    if (activeConversation) {
      navigation.setOptions({
        headerShown: true,
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Image
              source={{ uri: activeConversation.client.avatar }}
              style={styles.headerAvatar}
            />
            <View>
              <Text style={styles.headerTitle}>{activeConversation.client.name}</Text>
              <Text style={styles.headerSubtitle}>
                {activeConversation.client.status === 'online' ? 'En línea' : 'Desconectado'}
              </Text>
            </View>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setActiveConversation(null)}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity style={styles.headerButton} onPress={() => {/* Llamada */}}>
              <Ionicons name="call-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => {/* Opciones */}}>
              <Ionicons name="ellipsis-vertical" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerTitle: 'Mensajes',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1F2937',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 1,
          shadowOpacity: 0.1,
        },
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={() => {/* Nueva conversación */}}>
            <Ionicons name="create-outline" size={24} color="#000" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, activeConversation]);
  
  // Cuando se selecciona una conversación, cargar sus mensajes
  const handleSelectConversation = (conversation) => {
    setLoading(true);
    
    // Simulamos carga
    setTimeout(() => {
      setActiveConversation(conversation);
      
      // Cargar mensajes de la conversación
      const conversationMessages = MOCK_MESSAGES[conversation.id] || [];
      setMessages(conversationMessages);
      
      setLoading(false);
      
      // Marcar como leídos
      const updatedConversations = conversations.map(c => 
        c.id === conversation.id ? {...c, unreadCount: 0} : c
      );
      setConversations(updatedConversations);
    }, 500);
  };
  
  // Enviar un nuevo mensaje
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !activeConversation) return;
    
    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg = {
      id: `m${Date.now()}`,
      text: newMessage.trim(),
      time: timeString,
      sender: 'professional',
      status: 'sending'
    };
    
    // Agregar mensaje a la lista
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Scroll al último mensaje
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
    
    // Simular envío (cambiar estado a "sent")
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === newMsg.id ? {...m, status: 'sent'} : m
        )
      );
      
      // Actualizar la última conversación
      setConversations(prev => 
        prev.map(c => 
          c.id === activeConversation.id 
            ? {
                ...c,
                lastMessage: {
                  text: newMsg.text,
                  time: timeString,
                  isRead: false,
                  isSent: true,
                  sender: 'professional'
                }
              } 
            : c
        )
      );
    }, 1000);
  };
  
  // Renderizar un item de conversación
  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleSelectConversation(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.client.avatar }} style={styles.avatar} />
        {item.client.status === 'online' && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.clientName}>{item.client.name}</Text>
          <Text style={styles.messageTime}>{item.lastMessage.time}</Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text 
            style={[
              styles.lastMessage,
              !item.lastMessage.isRead && item.lastMessage.sender === 'client' && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.sender === 'professional' ? 'Tú: ' : ''}
            {item.lastMessage.text}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Renderizar un mensaje individual
  const renderMessage = ({ item }) => {
    const isFromProfessional = item.sender === 'professional';
    
    return (
      <View style={[
        styles.messageContainer,
        isFromProfessional ? styles.sentMessage : styles.receivedMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isFromProfessional ? styles.sentBubble : styles.receivedBubble
        ]}>
          <Text style={[
            styles.messageText,
            isFromProfessional ? styles.sentMessageText : styles.receivedMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        
        <View style={[
          styles.messageFooter,
          isFromProfessional ? styles.sentFooter : styles.receivedFooter
        ]}>
          <Text style={styles.messageTime}>{item.time}</Text>
          
          {isFromProfessional && (
            <View style={styles.messageStatus}>
              {item.status === 'sending' && (
                <ActivityIndicator size={10} color="#9CA3AF" />
              )}
              {item.status === 'sent' && (
                <Ionicons name="checkmark" size={14} color="#9CA3AF" />
              )}
              {item.status === 'delivered' && (
                <Ionicons name="checkmark-done" size={14} color="#9CA3AF" />
              )}
              {item.status === 'read' && (
                <Ionicons name="checkmark-done" size={14} color={colors.primary} />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Pantalla de chat activo
  if (activeConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />
            
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <TouchableOpacity style={styles.attachButton}>
                  <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.textInput}
                  placeholder="Escribe un mensaje..."
                  placeholderTextColor="#9CA3AF"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    newMessage.trim() === '' && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={newMessage.trim() === ''}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={newMessage.trim() === '' ? "#9CA3AF" : "#FFFFFF"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    );
  }
  
  // Lista de conversaciones
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationsList}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={56} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No hay conversaciones</Text>
            <Text style={styles.emptyStateSubtext}>Tus mensajes con clientes aparecerán aquí</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerButton: {
    padding: 8,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  
  // Lista de conversaciones
  conversationsList: {
    paddingVertical: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Mensajes
  messagesList: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sentBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#1F2937',
  },
  messageFooter: {
    flexDirection: 'row',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sentFooter: {
    justifyContent: 'flex-end',
  },
  receivedFooter: {
    justifyContent: 'flex-start',
  },
  messageStatus: {
    marginLeft: 4,
  },
  
  // Input
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    maxHeight: 120,
    color: '#1F2937',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty state
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});