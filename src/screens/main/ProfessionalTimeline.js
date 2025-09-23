import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, PanResponder, Modal, Button, Dimensions } from 'react-native';
import AppointmentTimelineCard from './components/AppointmentTimelineCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfessionalTimeline = ({ navigation }) => {
  const { height: screenHeight } = Dimensions.get('window');
  const hourRowHeight = 90; // px per hour
  const timeslots = 4; // 15 min
  const slotHeight = hourRowHeight / timeslots;

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const scrollRef = useRef(null);
  const timelineHeightRef = useRef(0);
  const scrollPosRef = useRef(0);

  // Drag refs/state
  const [draggingId, setDraggingId] = useState(null);
  const draggingIdRef = useRef(null);
  const [dragTranslateY, setDragTranslateY] = useState(0);
  const initialIndexRef = useRef(0);
  const initialFingerRef = useRef(null);
  const initialSlotHeightRef = useRef(slotHeight);
  const dragOverlayTopRef = useRef(0);
  const dragActiveRef = useRef(false);

  const [pendingNewTime, setPendingNewTime] = useState(null);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('proEvents');
        if (raw) {
          const parsed = JSON.parse(raw).map(ev => ({ ...ev, start: new Date(ev.start), end: new Date(ev.end) }));
          setEvents(parsed);
          return;
        }
      } catch (e) {
        console.warn('load pro events', e);
      }
      // seed
      const today = new Date();
      today.setHours(0,0,0,0);
      const seed = [
        { id: 'p1', clientName: 'Roberto Sánchez', service: 'Corte', start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0), duration: 60, status: 'confirmed' },
        { id: 'p2', clientName: 'Laura Torres', service: 'Afeitado', start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 15), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30), duration: 15, status: 'confirmed' },
        { id: 'p3', clientName: 'Carlos Méndez', service: 'Color', start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), duration: 60, status: 'confirmed' },
      ];
      setEvents(seed);
    })();
  }, []);

  // Generate 15-min slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour=9; hour<=18; hour++){
      for (let m=0; m<60; m+=15){
        if (hour===18 && m>0) continue;
        const d = `${String(hour).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        slots.push(d);
      }
    }
    return slots;
  };

  // Helper get appointments at slot
  const getAppointmentsForSlot = (slot) => {
    const [h,m] = slot.split(':').map(Number);
    const list = events.filter(ev => {
      const s = ev.start; const e = ev.end;
      const slotMinutes = h*60 + m;
      return (s.getHours()*60 + s.getMinutes()) <= slotMinutes && slotMinutes < (e.getHours()*60 + e.getMinutes());
    });
    return list;
  };

  // PanResponder to control drag globally
  const panResponderRef = useRef(null);
  if (!panResponderRef.current) {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gs) => draggingIdRef.current != null && Math.abs(gs.dy) > 2,
      onPanResponderMove: (evt, gs) => {
        if (!draggingIdRef.current) return;
        const native = evt.nativeEvent;
        const viewportY = (native.locationY != null) ? native.locationY : native.pageY - (timelineHeightRef.current || 0);
        const contentY = viewportY + (scrollPosRef.current || 0);
        const slotH = initialSlotHeightRef.current || slotHeight;
        const delta = contentY - (initialFingerRef.current || contentY);
        let candidate = Math.round((initialIndexRef.current || 0) + delta / slotH);
        const slots = generateTimeSlots();
        candidate = Math.max(0, Math.min(candidate, slots.length-1));
        setDragTranslateY((candidate - (initialIndexRef.current||0)) * slotH);
        // compute time
        const hours = Math.floor(candidate / timeslots);
        const minutes = (candidate % timeslots) * 15;
        const base = new Date(selectedDate);
        base.setHours(hours, minutes, 0, 0);
        setPendingNewTime(base);
        setPendingEvent(events.find(ev => ev.id===draggingIdRef.current));

        // auto-scroll near edges
        const EDGE = 80;
        const visible = timelineHeightRef.current || 0;
        if (viewportY < EDGE && scrollPosRef.current > 0) {
          const newY = Math.max(0, scrollPosRef.current - 10);
          scrollRef.current && scrollRef.current.scrollTo({ y: newY, animated: false });
          scrollPosRef.current = newY;
        }
        if (viewportY > visible - EDGE) {
          const newY = scrollPosRef.current + 10;
          scrollRef.current && scrollRef.current.scrollTo({ y: newY, animated: false });
          scrollPosRef.current = newY;
        }
      },
      onPanResponderRelease: () => {
        if (!draggingIdRef.current) return;
        setShowConfirm(true);
        dragActiveRef.current = false;
        setDraggingId(null);
        draggingIdRef.current = null;
      }
    });
  }

  const startDrag = (ev, slotIndex) => {
    setDraggingId(ev.id);
    draggingIdRef.current = ev.id;
    dragActiveRef.current = true;
    initialIndexRef.current = slotIndex;
    initialFingerRef.current = slotIndex * slotHeight + (scrollPosRef.current||0);
    initialSlotHeightRef.current = slotHeight;
    dragOverlayTopRef.current = slotIndex * slotHeight;
    setDragTranslateY(0);
    setPendingEvent(ev);
  };

  const confirmMove = async () => {
    if (!pendingEvent || !pendingNewTime) return;
    const duration = pendingEvent.end - pendingEvent.start;
    const updated = events.map(ev => ev.id === pendingEvent.id ? { ...ev, start: new Date(pendingNewTime), end: new Date(pendingNewTime.getTime() + duration)} : ev);
    setEvents(updated);
    try { await AsyncStorage.setItem('proEvents', JSON.stringify(updated)); } catch(e){console.warn(e)}
    setShowConfirm(false);
    setPendingEvent(null);
    setPendingNewTime(null);
    setDragTranslateY(0);
  };

  const cancelMove = () => {
    setShowConfirm(false);
    setPendingEvent(null);
    setPendingNewTime(null);
    setDragTranslateY(0);
  };

  // Render
  const slots = generateTimeSlots();
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} ref={scrollRef} onLayout={(e)=>{timelineHeightRef.current = e.nativeEvent.layout.height}} onScroll={(e)=>{scrollPosRef.current = e.nativeEvent.contentOffset.y}} scrollEventThrottle={16}>
        <View style={styles.timeline} {...(panResponderRef.current ? panResponderRef.current.panHandlers : {})}>
          <View style={styles.labelsColumn}>
            {slots.map((s, idx) => (
              <View key={`l-${idx}`} style={{height: slotHeight, justifyContent:'center'}}><Text style={styles.label}>{s.endsWith(':00') ? s.split(':')[0]+':00' : s.split(':')[1]}</Text></View>
            ))}
          </View>
          <View style={styles.slotsColumn}>
            {slots.map((s, idx) => {
              const apps = getAppointmentsForSlot(s);
              if (apps.length===0) {
                return <TouchableOpacity key={`slot-${idx}`} style={{position:'absolute', left:0, right:0, height:slotHeight, top: idx*slotHeight}} onPress={()=>{}} />;
              }
              // dedupe by id
              const unique = [];
              apps.forEach(a=>{ if(!unique.find(u=>u.id===a.id)) unique.push(a)});
              return unique.map((a,i)=>{
                const colLeft = (i%2===0) ? 4 : '50%';
                const colRight = (i%2===0) ? '50%': 4;
                const height = Math.max(30, (a.end - a.start)/60000/60*hourRowHeight);
                return (
                  <TouchableOpacity key={`a-${a.id}-${idx}`} style={{position:'absolute', left: colLeft, right: colRight, top: idx*slotHeight+2, height: height-4, zIndex:100}} onLongPress={()=>startDrag(a, idx)} onPress={()=>{}}>
                    <AppointmentTimelineCard appointment={{clientName:a.clientName, time: `${String(a.start.getHours()).padStart(2,'0')}:${String(a.start.getMinutes()).padStart(2,'0')}`, duration: (a.end-a.start)/60000, status: a.status}} />
                  </TouchableOpacity>
                )
              })
            })}
          </View>
        </View>
      </ScrollView>

      {/* Overlay visual while dragging */}
      {dragActiveRef.current && pendingEvent && (
        <View style={[styles.overlay, { top: dragOverlayTopRef.current + dragTranslateY }] } pointerEvents="none">
          <Text style={{color:'#fff', fontWeight:'700'}}>{pendingEvent.clientName}</Text>
          <Text style={{color:'#fff'}}>{pendingNewTime ? pendingNewTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</Text>
        </View>
      )}

      <Modal visible={showConfirm} transparent>
        <View style={styles.modalWrap}><View style={styles.modal}><Text style={{fontWeight:'700', marginBottom:6}}>Confirmar movimiento</Text><Text style={{marginBottom:12}}>Mover {pendingEvent?.clientName} a {pendingNewTime ? pendingNewTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}?</Text><View style={{flexDirection:'row', justifyContent:'flex-end'}}><Button title="Cancelar" onPress={cancelMove} /><View style={{width:8}}/><Button title="Aceptar" onPress={confirmMove} /></View></View></View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  scroll: { flex:1 },
  timeline: { flexDirection:'row', minHeight: 1000 },
  labelsColumn: { width:72, paddingTop:8 },
  slotsColumn: { flex:1, paddingRight:12, paddingLeft:4 },
  label: { color:'#6B7280', fontSize:12, textAlign:'right', paddingRight:8 },
  overlay: { position:'absolute', left:80, right:16, backgroundColor:'#DC2626', padding:8, borderRadius:8, zIndex:9999 },
  modalWrap:{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.3)'},
  modal:{width:'86%', backgroundColor:'#fff', padding:16, borderRadius:8}
});

export default ProfessionalTimeline;
