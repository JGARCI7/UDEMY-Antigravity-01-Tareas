import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Tarea, UserProfile, ScreenType } from './types';
import TaskListScreen from './components/TaskListScreen';
import SettingsScreen from './components/SettingsScreen';

const now = new Date().toISOString();

const DEFAULT_TAREAS: Tarea[] = [
  {
    id: crypto.randomUUID(),
    titulo: 'Revisar el diseño del dashboard',
    descripcion: 'Revisar todos los componentes del dashboard y asegurarse de que el diseño sea coherente con la guía de estilos.',
    fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
    prioridad: 'alta',
    fechaVencimiento: new Date(Date.now() + 86400000).toISOString(),
    completada: false,
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Comprar café de especialidad',
    descripcion: 'Ir al supermercado y comprar café molido de especialidad para la oficina.',
    fecha: new Date(Date.now() - 86400000).toISOString(),
    prioridad: 'baja',
    fechaVencimiento: new Date(Date.now() + 86400000 * 7).toISOString(),
    completada: true,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Agendar reunión semanal de sincronización',
    descripcion: 'Coordinar con el equipo la hora y el orden del día para la reunión de sincronización semanal.',
    fecha: now,
    prioridad: 'media',
    fechaVencimiento: new Date(Date.now() + 86400000 * 3).toISOString(),
    completada: false,
    updatedAt: now,
  },
];

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  bio: 'Product Designer focusing on human-centric minimalist interfaces.',
  emailAlerts: true,
  browserNotifications: false,
  darkMode: false,
};

const pageVariants = {
  initial: (direction: 'push' | 'push_back') => ({
    opacity: 0,
    x: direction === 'push' ? 300 : -300,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
  exit: (direction: 'push' | 'push_back') => ({
    opacity: 0,
    x: direction === 'push' ? -300 : 300,
    transition: { duration: 0.25, ease: 'easeInOut' },
  }),
};

export default function App() {
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    // Use a new key to avoid conflicts with the old Task structure
    const stored = localStorage.getItem('tareas_v2');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse tareas', e);
      }
    }
    return DEFAULT_TAREAS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('focusflow_profile');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('tasks');
  const [transitionDirection, setTransitionDirection] = useState<'push' | 'push_back'>('push');

  // Persist tareas
  useEffect(() => {
    localStorage.setItem('tareas_v2', JSON.stringify(tareas));
  }, [tareas]);

  // Persist profile and toggle dark mode
  useEffect(() => {
    localStorage.setItem('focusflow_profile', JSON.stringify(userProfile));
    if (userProfile.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProfile]);

  // Handlers
  const handleAddTarea = (datos: Omit<Tarea, 'id' | 'fecha' | 'updatedAt'>) => {
    const ts = new Date().toISOString();
    const nueva: Tarea = { ...datos, id: crypto.randomUUID(), fecha: ts, updatedAt: ts };
    setTareas((prev) => [nueva, ...prev]);
  };

  const handleToggleTarea = (id: string) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completada: !t.completada, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleDeleteTarea = (id: string) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTarea = (id: string, updates: Partial<Omit<Tarea, 'id' | 'fecha'>>) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const handleUpdateProfile = (profile: UserProfile) => setUserProfile(profile);

  // Navigation
  const navigateToSettings = () => { setTransitionDirection('push'); setCurrentScreen('settings'); };
  const navigateToTasks = () => { setTransitionDirection('push_back'); setCurrentScreen('tasks'); };

  return (
    <div
      id="appContainer"
      className={`min-h-screen ${userProfile.darkMode ? 'dark' : ''} bg-background transition-colors duration-200`}
    >
      <AnimatePresence mode="popLayout" custom={transitionDirection}>
        {currentScreen === 'tasks' ? (
          <motion.div
            key="tasks_screen"
            className="w-full min-h-screen"
            custom={transitionDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <TaskListScreen
              tareas={tareas}
              onAddTarea={handleAddTarea}
              onToggleTarea={handleToggleTarea}
              onDeleteTarea={handleDeleteTarea}
              onUpdateTarea={handleUpdateTarea}
              onNavigateToSettings={navigateToSettings}
              userProfile={userProfile}
            />
          </motion.div>
        ) : (
          <motion.div
            key="settings_screen"
            className="w-full min-h-screen"
            custom={transitionDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SettingsScreen
              userProfile={userProfile}
              onUpdateUserProfile={handleUpdateProfile}
              onNavigateToTasks={navigateToTasks}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
