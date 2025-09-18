const professionalData = {
  id: 'p1',
  name: 'Ana López Ramírez',
  username: '@ana.styles',
  role: 'Estilista Senior & Colorista',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  likes: 1240,
  seguidores: 980,
  posts: 24,
  bio: 'Especialista en cortes modernos y coloración personalizada. 10 años de experiencia en salones premium. ✨ Citas disponibles de martes a sábado.',
  website: 'turnogo.com/booking/ana',
  telefono: '+34 612 345 678',
  email: 'ana@turnogo.com',
  disponibilidad: 'Martes a Sábado',
  especialidades: ['Cortes modernos', 'Coloración', 'Peinados de evento'],
  socialMedia: {
    whatsapp: '+34612345678',
    instagram: 'ana.styles',
    facebook: 'AnaLopezEstilista',
    tiktok: 'ana.styles'
  },
  services: [
    { 
      name: 'Corte de Dama', 
      price: '35€', 
      duration: '45 min', 
      category: 'Cortes',
      description: 'Corte personalizado con acabado de secador'
    },
    { 
      name: 'Corte de Caballero', 
      price: '28€', 
      duration: '30 min', 
      category: 'Cortes',
      description: 'Incluye lavado y peinado'
    },
    { 
      name: 'Coloración Completa', 
      price: '65€', 
      duration: '120 min', 
      category: 'Coloración',
      description: 'Color de raíz a puntas con productos premium'
    },
    { 
      name: 'Balayage', 
      price: '120€', 
      duration: '180 min', 
      category: 'Coloración',
      description: 'Técnica de degradado natural personalizado'
    },
    { 
      name: 'Tratamiento Hidratante', 
      price: '45€', 
      duration: '60 min', 
      category: 'Tratamientos',
      description: 'Tratamiento profundo para cabello dañado o seco'
    },
    { 
      name: 'Tratamiento Anti-Frizz', 
      price: '55€', 
      duration: '75 min', 
      category: 'Tratamientos',
      description: 'Elimina el encrespamiento por hasta 6 semanas'
    },
    { 
      name: 'Peinado para Eventos', 
      price: '55€', 
      duration: '60 min', 
      category: 'Peinados',
      description: 'Peinado elegante para bodas o eventos especiales'
    },
    { 
      name: 'Recogido', 
      price: '60€', 
      duration: '60 min', 
      category: 'Peinados',
      description: 'Recogidos elaborados para ocasiones especiales'
    }
  ],
  products: [
    {
      id: 'prod1',
      name: 'Champú de Keratina',
      price: '18€',
      description: 'Champú profesional con keratina para reparar cabello dañado',
      image: 'https://images.unsplash.com/photo-1617391258031-f8d80b22fb37?w=500&h=500&fit=crop',
      category: 'Cuidado Capilar',
      stock: 15,
      rating: 4.8
    },
    {
      id: 'prod2',
      name: 'Acondicionador Hidratante',
      price: '21€',
      description: 'Acondicionador intensivo para cabello seco y quebradizo',
      image: 'https://images.unsplash.com/photo-1616740244090-224e74401de2?w=500&h=500&fit=crop',
      category: 'Cuidado Capilar',
      stock: 12,
      rating: 4.7
    },
    {
      id: 'prod3',
      name: 'Mascarilla Capilar Repair',
      price: '25€',
      description: 'Tratamiento intensivo semanal para cabello muy dañado',
      image: 'https://images.unsplash.com/photo-1618599538774-0245df7f53d7?w=500&h=500&fit=crop',
      category: 'Tratamientos',
      stock: 8,
      rating: 4.9
    },
    {
      id: 'prod4',
      name: 'Aceite de Argán',
      price: '32€',
      description: 'Aceite natural para dar brillo y proteger las puntas',
      image: 'https://images.unsplash.com/photo-1617391258028-f4763bcabac7?w=500&h=500&fit=crop',
      category: 'Cuidado Capilar',
      stock: 6,
      rating: 4.6
    },
    {
      id: 'prod5',
      name: 'Brocha profesional para tinte',
      price: '9€',
      description: 'Brocha ergonómica para aplicación de tintes',
      image: 'https://images.unsplash.com/photo-1630826028319-41cb9585b89a?w=500&h=500&fit=crop',
      category: 'Accesorios',
      stock: 20,
      rating: 4.4
    },
    {
      id: 'prod6',
      name: 'Protector térmico',
      price: '16€',
      description: 'Spray protector para uso antes del secador o plancha',
      image: 'https://images.unsplash.com/photo-1631469197814-6abc5f6a5b30?w=500&h=500&fit=crop',
      category: 'Styling',
      stock: 14,
      rating: 4.7
    },
  ],
  photos: [
    { 
      id: 'img1',
      uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      title: 'Coloración personalizada',
      description: 'Técnica de balayage con tonos cobrizos adaptados al tono de piel',
      fecha: '15 ago 2024',
      likes: 124
    },
    { 
      id: 'img2',
      uri: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop',
      title: 'Manicura premium',
      description: 'Diseño exclusivo con acabado gel de larga duración',
      fecha: '12 ago 2024',
      likes: 98
    },
    { 
      id: 'img3',
      uri: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop',
      title: 'Corte bob asimétrico',
      description: 'Estilo moderno con capas texturizadas para mayor volumen',
      fecha: '8 ago 2024',
      likes: 156
    },
    { 
      id: 'img4',
      uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      title: 'Peinado para eventos',
      description: 'Recogido elegante con accesorios para ocasiones especiales',
      fecha: '2 ago 2024',
      likes: 87
    },
    { 
      id: 'img5',
      uri: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop',
      title: 'Tratamiento hidratante',
      description: 'Mascarilla de keratina para cabello dañado por coloración',
      fecha: '28 jul 2024',
      likes: 62
    },
    { 
      id: 'img6',
      uri: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop',
      title: 'Mechas balayage',
      description: 'Técnica natural de aclarado para un efecto de luz sin raíces marcadas',
      fecha: '25 jul 2024',
      likes: 143
    },
    { 
      id: 'img7',
      uri: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&h=600&fit=crop',
      title: 'Corte pixie',
      description: 'Estilo corto y versátil con flequillo lateral texturizado',
      fecha: '20 jul 2024',
      likes: 78
    },
    { 
      id: 'img8',
      uri: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=600&fit=crop',
      title: 'Ondas playeras',
      description: 'Peinado casual con ondas naturales y textura suave',
      fecha: '15 jul 2024',
      likes: 91
    },
    { 
      id: 'img9',
      uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      title: 'Tinte fantasy',
      description: 'Color fantasía en tonos pasteles con técnica de decoloración suave',
      fecha: '10 jul 2024',
      likes: 115
    },
  ],
};

export { professionalData };