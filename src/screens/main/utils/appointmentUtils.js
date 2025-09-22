// Utility functions for AppointmentsScreen
const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Formatear la fecha seleccionada de manera amigable
const formatSelectedDate = (date) => {
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthsOfYear = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const today = new Date();
  
  // Si es hoy, mostrar "Hoy"
  if (isSameDay(date, today)) {
    return "Hoy";
  }
  
  // Si es otro día, formato: "Vie, 19 Sept"
  const dayName = daysOfWeek[date.getDay()];
  const dayNum = date.getDate();
  const monthShort = monthsOfYear[date.getMonth()].substring(0, 4);
  
  return `${dayName}, ${dayNum} ${monthShort}`;
};

// Format time (24h to 12h)
const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  // Para las horas completas - formato simplificado (9AM)
  if (minutes === '00') {
    return `${formattedHour}${ampm}`;
  }
  
  // Para las medias horas - solo mostrar número con formato más sutil (30)
  if (minutes === '30') {
    return `·${minutes}`;
  }
  
  // Para los cuartos de hora - solo mostrar número con formato más sutil (15, 45)
  if (minutes === '15' || minutes === '45') {
    return `·${minutes}`;
  }
  
  // Formato completo para otros casos (aunque no deberían usarse)
  return `${formattedHour}:${minutes}`;
};

// Calculate end time
const calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

export {
  isSameDay,
  formatSelectedDate,
  formatTime,
  calculateEndTime
};