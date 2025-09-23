import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Use the installed Calendar Kit package
import { Calendar } from '@howljs/calendar-kit';
import AppointmentTimelineCard from './components/AppointmentTimelineCard';
import { Ionicons } from '@expo/vector-icons';

const CalendarDemo = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 23));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggingEvent, setDraggingEvent] = useState(null);
  const [dragDy, setDragDy] = useState(0);
  const [overlayTop, setOverlayTop] = useState(0);
  const overlayTopRef = useRef(0);
  const overlayStartRef = useRef(0);
  const [pendingNewTime, setPendingNewTime] = useState(null);
  const pendingNewTimeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const hourRowHeight = 100; // px per hour (reduced for better fit)
  const timeslots = 4; // 15-minute slots
  const slotHeight = hourRowHeight / timeslots;
  const { height: screenHeight } = Dimensions.get('window');
  const panResponder = useRef(null);

  // Load persisted events on mount
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('calendarEvents');
        if (raw) {
          const parsed = JSON.parse(raw);
          // revive Date objects
          const revived = parsed.map((ev) => ({ ...ev, start: new Date(ev.start), end: new Date(ev.end) }));
          setEvents(revived);
          // set calendar date to first event's date
          if (revived.length > 0) setCurrentDate(revived[0].start);
          return;
        }
      } catch (e) {
        console.warn('Failed to load events', e);
      }

      // default seed events if none persisted
      const seed = [
        { id: '1', title: 'Corte - Juan', start: new Date(2025, 8, 23, 9, 0), end: new Date(2025, 8, 23, 9, 30) },
        { id: '2', title: 'Color - Maria', start: new Date(2025, 8, 23, 10, 15), end: new Date(2025, 8, 23, 10, 45) },
        { id: '3', title: 'Ajuste - Pedro', start: new Date(2025, 8, 23, 15, 0), end: new Date(2025, 8, 23, 15, 30) },
      ];
      setEvents(seed);
      setCurrentDate(seed[0].start);
    })();
  }, []);

  // initialize pan responder lazily so it reads refs correctly
  if (!panResponder.current) {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => !!draggingEvent,
      onMoveShouldSetPanResponder: () => !!draggingEvent,
      onPanResponderMove: (evt, gestureState) => {
        // overlayTopRef may be 0; check for null/undefined only
        if (overlayTopRef.current == null) return;
        const newTop = overlayStartRef.current + gestureState.dy;
        setDragDy(gestureState.dy);
        // calculate candidate index (content-relative) with hysteresis to reduce jitter
        const rawIndex = newTop / slotHeight;
        const lastIndex = pendingNewTimeRef.current ? (pendingNewTimeRef.current.getHours() * timeslots + Math.floor(pendingNewTimeRef.current.getMinutes() / (60 / timeslots))) : null;
        const HYSTERESIS = 0.3; // don't snap unless moved more than 30% of slot
        let candidateIndex = Math.round(rawIndex);
        if (lastIndex != null && Math.abs(rawIndex - lastIndex) < HYSTERESIS) {
          candidateIndex = lastIndex;
        }
        // compute candidate time (use the same base date as calendar)
        const baseDate = new Date(2025, 8, 23);
        const hours = Math.floor(candidateIndex / timeslots);
        const minutes = (candidateIndex % timeslots) * (60 / timeslots);
        const candidateStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes);
        pendingNewTimeRef.current = candidateStart;
        setPendingNewTime(candidateStart);
      },
      onPanResponderRelease: () => {
        if (!draggingEvent) return;
        // show confirmation modal (we reuse selectedEvent modal)
        setSelectedEvent(draggingEvent);
        // release dragging state - keep visuals until confirmed/cancel
        setIsDragging(false);
      },
    });
  }

  const onPressEvent = (event) => {
    setSelectedEvent(event);
  };

  const onLongPressEvent = (event) => {
    // start drag: compute initial overlay top from event.start
    const start = event.start;
    const index = start.getHours() * timeslots + Math.floor(start.getMinutes() / (60 / timeslots));
    const top = index * slotHeight;
    setOverlayTop(top);
    overlayTopRef.current = top;
    overlayStartRef.current = top;
    setDragDy(0);
    setDraggingEvent(event);
    setIsDragging(true);
    setPendingNewTime(start);
  };

  const goPrevDay = () => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() - 1);
      return next;
    });
  };

  const goNextDay = () => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      return next;
    });
  };

  const applyMove = () => {
    if (!draggingEvent) return;
    const newStart = pendingNewTimeRef.current || pendingNewTime || draggingEvent.start;
    // keep same duration
    const durationMs = draggingEvent.end - draggingEvent.start;
    const newEnd = new Date(newStart.getTime() + durationMs);
    // compute updated events and persist that exact array
    const updated = events.map((ev) => (ev.id === draggingEvent.id ? { ...ev, start: newStart, end: newEnd } : ev));
    setEvents(updated);
    try {
      AsyncStorage.setItem('calendarEvents', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist events', e);
    }
    // clear drag state
    setDraggingEvent(null);
    setDragDy(0);
    setOverlayTop(0);
    overlayTopRef.current = 0;
    overlayStartRef.current = 0;
    pendingNewTimeRef.current = null;
    setSelectedEvent(null);
    setIsDragging(false);
  };

  const cancelMove = () => {
    // revert any candidate and close modal
    setDraggingEvent(null);
    setDragDy(0);
    setOverlayTop(0);
    overlayTopRef.current = 0;
    pendingNewTimeRef.current = null;
    setPendingNewTime(null);
    setSelectedEvent(null);
    setIsDragging(false);
  };

  const onCloseModal = () => setSelectedEvent(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { /* prev day */ }} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo Calendario — 23 Sep 2025</Text>
        <TouchableOpacity onPress={() => { /* next day */ }} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <Calendar
        events={events}
        // Calendar Kit accepts height and shows day/week depending on props
        height={Math.max(600, Math.floor(screenHeight - 200))}
        date={currentDate}
        timeslots={timeslots}
        hourRowHeight={hourRowHeight}
        enablePinchZoom={true}
        // Calendar Kit uses `renderEvent` similarly; use a wrapper to intercept presses
        renderEvent={(event) => (
          <TouchableOpacity onLongPress={() => onLongPressEvent(event)} onPress={() => onPressEvent(event)} style={{ padding: 6 }}>
            <AppointmentTimelineCard appointment={{ clientName: event.title, time: event.start.toTimeString().slice(0,5), duration: (event.end - event.start) / 60000, status: 'confirmed' }} />
          </TouchableOpacity>
        )}
      />

      {/* blocker to prevent calendar interactions while dragging */}
      {isDragging && (
        <View style={styles.blocker} pointerEvents="auto" />
      )}


      {/* overlay draggable */}
      {draggingEvent && (
        <View
          style={[
            styles.overlay,
            {
              top: overlayTop + dragDy,
              height: Math.max(30, (draggingEvent.end - draggingEvent.start) / (1000 * 60) / 60 * hourRowHeight),
            },
          ]}
          {...panResponder.current.panHandlers}
          onLayout={() => {
            // keep ref in sync when layout changes
            overlayTopRef.current = overlayTop;
          }}
        >
          <Text style={styles.overlayTitle}>{draggingEvent.title}</Text>
          <Text style={styles.overlayTime}>{pendingNewTime ? pendingNewTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
        </View>
      )}

      <Modal visible={!!selectedEvent} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text>{selectedEvent ? selectedEvent.start.toLocaleTimeString() : ''} - {selectedEvent ? selectedEvent.end.toLocaleTimeString() : ''}</Text>
            {/* If we're in a drag, show confirm/cancel */}
            {draggingEvent ? (
              <View style={{ marginTop: 12 }}>
                <Text>Confirmar mover a:</Text>
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>{pendingNewTime ? pendingNewTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Button title="Cancelar" onPress={cancelMove} />
                  <Button title="Aceptar" onPress={applyMove} />
                </View>
              </View>
            ) : (
              <Button title="Cerrar" onPress={onCloseModal} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  blocker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#111827',
  },
  navButton: {
    padding: 8,
  },
  overlayTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  overlayTime: {
    color: '#fff',
    fontSize: 12,
  },
  debugList: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFF',
  },
});

// overlay style
styles.overlay = {
  position: 'absolute',
  left: 70,
  right: 16,
  backgroundColor: '#DC2626',
  padding: 8,
  borderRadius: 8,
  zIndex: 9999,
};

export default CalendarDemo;
