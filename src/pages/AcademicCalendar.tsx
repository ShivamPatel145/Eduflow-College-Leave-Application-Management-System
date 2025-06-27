import { useState, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { PlusIcon, TrashIcon, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import '@/pages/AcademicCalendar.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from "framer-motion";
import { pageFade, cardMotion, buttonMotion } from "@/lib/motion";

const initialEvents = [
  { id: '1', title: 'Semester Start', start: '2024-07-01', description: 'Classes for the new semester begin.', color: '#6366f1' },
  { id: '2', title: 'Independence Day', start: '2024-08-15', description: 'No classes. Campus closed.', color: '#facc15' },
  { id: '3', title: 'Mid-Sem Exams', start: '2024-09-10', end: '2024-09-15', description: 'First round of exams.', color: '#a21caf' },
  { id: '4', title: 'Gandhi Jayanti', start: '2024-10-02', description: 'No classes. Campus closed.', color: '#facc15' },
  { id: '5', title: 'End-Sem Exams', start: '2024-11-20', end: '2024-11-25', description: 'Final exams.', color: '#a21caf' },
  { id: '6', title: 'Semester End', start: '2024-12-05', description: 'Last day of classes and exams.', color: '#2563eb' },
];

const AcademicCalendar = () => {
  const { user } = useAuth();
  const isEditor = user && (user.role === 'hod' || user.role === 'faculty');
  const [events, setEvents] = useState(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', start: '', end: '', color: '#6366f1' });
  const [isNew, setIsNew] = useState(false);
  const [dateEventsModal, setDateEventsModal] = useState<{ date: string, events: any[] } | null>(null);

  // Open modal for new or existing event
  const openModal = (info: any, isNewEvent = false) => {
    setIsNew(isNewEvent);
    if (isNewEvent) {
      setForm({ title: '', description: '', start: info.dateStr, end: '', color: '#6366f1' });
      setSelectedEvent(null);
    } else {
      setForm({
        title: info.event.title,
        description: info.event.extendedProps.description || '',
        start: info.event.startStr,
        end: info.event.endStr || '',
        color: info.event.backgroundColor || '#6366f1',
      });
      setSelectedEvent(info.event);
    }
    setModalOpen(true);
  };

  // Add or update event
  const handleSave = () => {
    if (isNew) {
      setEvents(evts => [
        ...evts,
        {
          id: Date.now().toString(),
          title: form.title,
          start: form.start,
          end: form.end || undefined,
          description: form.description,
          color: form.color,
        },
      ]);
    } else if (selectedEvent) {
      setEvents(evts => evts.map(e => e.id === selectedEvent.id ? { ...e, ...form } : e));
    }
    setModalOpen(false);
  };

  // Delete event
  const handleDelete = () => {
    if (selectedEvent) {
      setEvents(evts => evts.filter(e => e.id !== selectedEvent.id));
    }
    setModalOpen(false);
  };

  // Drag/drop or resize event
  const handleEventChange = (changeInfo: any) => {
    setEvents(evts => evts.map(e =>
      e.id === changeInfo.event.id
        ? {
            ...e,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr || undefined,
          }
        : e
    ));
  };

  // On date click, show all events for that date
  const handleDateClick = (info: any) => {
    const dateStr = info.dateStr;
    const eventsForDate = events.filter(e => e.start === dateStr || (e.start <= dateStr && e.end && e.end >= dateStr));
    setDateEventsModal({ date: dateStr, events: eventsForDate });
  };

  // On event click, open the date events modal for that event's date
  const handleEventClick = (info: any) => {
    const dateStr = info.event.startStr;
    const eventsForDate = events.filter(e => e.start === dateStr || (e.start <= dateStr && e.end && e.end >= dateStr));
    setDateEventsModal({ date: dateStr, events: eventsForDate });
  };

  return (
    <motion.div className="max-w-[900px] mx-auto py-8 md:py-12 bg-gray-50 dark:bg-zinc-900 min-h-screen" {...pageFade}>
      <motion.div className="..." {...cardMotion}>
        <Card className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Academic Calendar</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
              View important dates and events. {isEditor && "You can add, drag, or edit events."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="relative">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev',
                  center: 'title',
                  right: 'next'
                }}
                height="auto"
                contentHeight="auto"
                fixedWeekCount={false}
                events={events}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                editable={!!isEditor}
                selectable={!!isEditor}
                eventDrop={isEditor ? handleEventChange : undefined}
                eventResize={isEditor ? handleEventChange : undefined}
                eventBackgroundColor={(event) => event.color}
                dayMaxEventRows={3}
                eventDisplay="block"
                eventContent={renderEventContent}
              />
              {isEditor && (
                <motion.div {...buttonMotion}>
                  <Button
                    className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full p-4 bg-primary hover:bg-primary/90 text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:bg-primary dark:hover:bg-primary/90"
                    onClick={() => {
                      setIsNew(true);
                      setForm({ title: '', description: '', start: new Date().toISOString().slice(0, 10), end: '', color: '#6366f1' });
                      setModalOpen(true);
                    }}
                    aria-label="Add Event"
                  >
                    <PlusIcon className="h-6 w-6" />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Date Events Modal */}
        <Dialog open={!!dateEventsModal} onOpenChange={open => setDateEventsModal(open ? dateEventsModal : null)}>
          <DialogContent className="max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <div className="mb-2 font-semibold text-lg text-gray-900 dark:text-gray-100">
              {dateEventsModal && new Date(dateEventsModal.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {dateEventsModal && dateEventsModal.events.length > 0 ? (
              <div className="space-y-3">
                {dateEventsModal.events.map(ev => (
                  <Card key={ev.id} className="p-3 flex items-center gap-3 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow">
                    <span className="rounded-full p-2" style={{ background: ev.color, color: '#fff' }}>
                      <CalendarIcon className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-900 dark:text-gray-100">{ev.title}</div>
                      <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">{ev.start}{ev.end ? ` - ${ev.end}` : ''}</div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{ev.description}</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground dark:text-gray-400 text-center py-8">
                No events for this day.
              </div>
            )}
            {isEditor && dateEventsModal && (
              <Button className="w-full mt-4" onClick={() => {
                setIsNew(true);
                setForm({ title: '', description: '', start: dateEventsModal.date, end: '', color: '#6366f1' });
                setModalOpen(true);
                setDateEventsModal(null);
              }}>
                <PlusIcon className="h-4 w-4 mr-1" /> Add Event
              </Button>
            )}
          </DialogContent>
        </Dialog>
        {/* Event Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-lg w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">{isNew ? 'Add Event' : 'Edit Event'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Event Title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="mb-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
              />
              <Input
                placeholder="Description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="mb-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={form.start}
                  onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                  className="mb-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                />
                <Input
                  type="date"
                  value={form.end}
                  onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                  className="mb-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-900 dark:text-gray-100">Color:</span>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-8 h-8 border rounded"
                />
              </div>
            </div>
            <DialogFooter>
              {!isNew && (
                <Button variant="destructive" onClick={handleDelete}>
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
              <Button onClick={handleSave}>{isNew ? 'Add' : 'Update'} Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
};

function renderEventContent(eventInfo: any) {
  return (
    <div className="px-1 py-0.5 rounded text-xs font-medium flex flex-col gap-0.5 leading-tight" style={{ background: eventInfo.backgroundColor || eventInfo.event.backgroundColor, color: '#fff', fontSize: '12px' }}>
      <span className="truncate font-semibold">{eventInfo.event.title}</span>
      {eventInfo.event.extendedProps.description && (
        <span className="truncate text-[10px] opacity-80">{eventInfo.event.extendedProps.description}</span>
      )}
    </div>
  );
}

export default AcademicCalendar; 