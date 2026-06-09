import React, { useState } from 'react';
import { 
  ClipboardList, Calendar, Inbox, Settings, HelpCircle, 
  Camera, Upload, Trash, Mail, Bell, Sun, Moon, Check, User, Plus
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsScreenProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  onNavigateToTasks: () => void;
}

export default function SettingsScreen({
  userProfile,
  onUpdateUserProfile,
  onNavigateToTasks,
}: SettingsScreenProps) {
  // Inner component states
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [bio, setBio] = useState(userProfile.bio);
  const [emailAlerts, setEmailAlerts] = useState(userProfile.emailAlerts);
  const [browserNotifications, setBrowserNotifications] = useState(userProfile.browserNotifications);
  const [darkMode, setDarkMode] = useState(userProfile.darkMode);
  
  // Tab control inside settings (Profile, Notifications, Security, Account)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'account'>('profile');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const defaultProfileUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA4wfiyp2OkAWYsJUyOEGdUepqi89fL1TcLen7eBXWe68SGoUwuuV9VBHx6UPExhg1Lj4CNdYmbOmgOMBPNtK7QHYegTCVMlimFK46VhEyhq-B6QToh62c6jFvB60D0tM6KVIQ7z0l_biD6h1KIXUf0xbaCs2yDPsw0HmU0s1PuUuMpAWoZx1C2J89CB3ZCjHVowN2sBErWE7eIXlX4BRsNxGDd32RmC-Ma00EJlzI_Kx_GzPsqaoUKPl0ii4Ifw7IWYS0vfwJkvdw";

  const handleSaveChanges = () => {
    onUpdateUserProfile({
      fullName,
      email,
      bio,
      emailAlerts,
      browserNotifications,
      darkMode,
    });
    setAlertMessage('¡Configuración guardada con éxito!');
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  const handleThemeChange = (isDark: boolean) => {
    setDarkMode(isDark);
    onUpdateUserProfile({
      fullName,
      email,
      bio,
      emailAlerts,
      browserNotifications,
      darkMode: isDark,
    });
  };

  return (
    <div id="settingsScreenContainer" className="min-h-screen bg-background text-on-background flex flex-col md:flex-row pb-24 md:pb-0">
      
      {/* TopAppBar (Mobile Only) */}
      <header id="mobileHeader" className="w-full top-0 sticky bg-background flex md:hidden justify-between items-center px-4 py-4 z-40 border-b border-surface-variant">
        <div className="text-xl font-bold text-primary font-sans">FocusFlow</div>
        <div className="flex gap-2 items-center">
          <button className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-container-high rounded-full text-primary">
            <Settings className="w-5 h-5 fill-primary/10" />
          </button>
          <img 
            alt="User profile mini" 
            className="w-8 h-8 rounded-full object-cover ml-1 border border-primary/20" 
            src={defaultProfileUrl}
          />
        </div>
      </header>

      {/* SideNavBar (Desktop Only) - hidden md:flex */}
      <nav 
        id="desktopSideNav"
        className="hidden md:flex flex-col h-screen py-8 px-4 w-64 fixed left-0 top-0 bg-surface-container-low border-r border-surface-variant z-40"
      >
        <div id="sideNavHeader" className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-extrabold text-xl font-mono">F</div>
          <div>
            <div className="font-bold text-lg text-primary tracking-tight leading-none">FocusFlow</div>
            <div className="text-xs text-on-surface-variant font-medium mt-1">Stay Grounded</div>
          </div>
        </div>

        {/* Sidebar Navigation items */}
        <div id="sideNavLinks" className="flex flex-col gap-2 flex-grow">
          {/* IMPORTANT: Element anchor text must contain "Tasks" to satisfy Navigation Flow Spec */}
          <button 
            id="sideNavTasksLink"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all hover:translate-x-1 duration-200 font-semibold text-sm cursor-pointer w-full text-left"
            onClick={onNavigateToTasks}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Tasks</span>
          </button>

          <button 
            id="sideNavTodayLink"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all hover:translate-x-1 duration-200 font-semibold text-sm cursor-pointer w-full text-left"
          >
            <Calendar className="w-5 h-5" />
            <span>Today</span>
          </button>

          <button 
            id="sideNavUpcomingLink"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all hover:translate-x-1 duration-200 font-semibold text-sm cursor-pointer w-full text-left"
          >
            <Inbox className="w-5 h-5" />
            <span>Upcoming</span>
          </button>

          <button 
            id="sideNavSettingsLink"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary font-bold border-r-4 border-primary bg-surface-container text-sm cursor-pointer w-full text-left"
          >
            <Settings className="w-5 h-5 fill-primary/10" />
            <span>Settings</span>
          </button>
        </div>

        <button 
          id="sideAddTaskBtn"
          className="mt-auto w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          onClick={onNavigateToTasks}
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main id="settingsMain" className="flex-grow md:ml-64 w-full max-w-5xl mx-auto p-4 md:p-12">
        
        {/* Desktop Title Header */}
        <header id="desktopSettingsHeader" className="mb-8 hidden md:flex justify-between items-center w-full border-b border-surface-variant/40 pb-4">
          <h1 className="font-sans font-bold text-3xl text-on-background">Settings</h1>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-high">
              <HelpCircle className="w-6 h-6" />
            </button>
            <img 
              alt="User profile settings picture" 
              className="w-10 h-10 rounded-full object-cover border border-primary/20" 
              src={defaultProfileUrl}
            />
          </div>
        </header>

        {/* Mobile Settings Title */}
        <h1 className="font-sans font-bold text-2xl text-on-background mb-4 md:hidden">Settings</h1>

        {/* Alert Messaging banner */}
        {alertMessage && (
          <div className="mb-6 p-4 bg-primary-fixed text-primary border border-outline-variant/30 rounded-xl flex items-center gap-2 text-sm animate-fade-in shadow-sm">
            <Check className="w-4 h-4 stroke-[3px]" />
            <span>{alertMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Settings Category Navigation (Inner Tab-strip) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-8">
            <ul className="flex overflow-x-auto lg:flex-col gap-1 pb-2 lg:pb-0 hide-scrollbar border-b lg:border-b-0 border-surface-variant mb-6 lg:mb-0">
              {(['profile', 'notifications', 'security', 'account'] as const).map((tab) => (
                <li key={tab} className="flex-shrink-0 lg:w-full">
                  <button 
                    className={`whitespace-nowrap px-4 py-2 rounded-full lg:rounded-lg lg:w-full text-left text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-surface-container text-primary font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Settings Form Content Cards Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {activeTab === 'profile' && (
              <section id="profileSettingsCard" className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(45,41,40,0.05)] border border-surface-variant relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl"></div>
                <h2 className="font-sans font-bold text-xl text-on-surface mb-6">Profile Settings</h2>
                
                {/* Profile Picture Header layout */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                  <div className="relative">
                    <img 
                      alt="Avatar large settings" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-surface-container shadow-sm" 
                      src={defaultProfileUrl}
                    />
                    <button className="absolute bottom-0 right-0 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary-container transition-transform shadow-md hover:scale-105 active:scale-95 cursor-pointer">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-on-surface-variant mb-2">Recomendamos usar una imagen de al menos 256x256px.</p>
                    <div className="flex gap-2.5">
                      <button className="bg-surface-container-low text-primary font-semibold text-xs px-4 py-2 rounded-xl hover:bg-surface-container border border-outline-variant transition-colors flex items-center gap-1 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Nueva</span>
                      </button>
                      <button className="text-error font-semibold text-xs px-4 py-2 rounded-xl hover:bg-error-container/40 transition-colors flex items-center gap-1 cursor-pointer">
                        <Trash className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name / Email fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant block">Full Name</label>
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim rounded-xl px-4 py-2.5 text-sm text-on-surface tracking-tight outline-none transition-all placeholder:text-outline"
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant block">Email Address</label>
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim rounded-xl px-4 py-2.5 text-sm text-on-surface tracking-tight outline-none transition-all placeholder:text-outline"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Bio text area */}
                <div className="space-y-1.5 mb-6">
                  <label className="text-xs font-semibold text-on-surface-variant block">Bio</label>
                  <textarea 
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim rounded-xl px-4 py-2.5 text-sm text-on-surface tracking-tight outline-none transition-all resize-none placeholder:text-outline" 
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                {/* Save details action */}
                <div className="flex justify-end border-t border-surface-variant/40 pt-4">
                  <button 
                    className="bg-primary text-on-primary font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-primary-container transition-all shadow-sm active:scale-95 duration-150 cursor-pointer"
                    onClick={handleSaveChanges}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </section>
            )}

            {/* Notifications Card */}
            {activeTab === 'profile' && (
              <section id="notificationsCard" className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(45,41,40,0.05)] border border-surface-variant">
                <h2 className="font-sans font-bold text-xl text-on-surface mb-6">Notificaciones</h2>
                <div className="space-y-4">
                  
                  {/* Email Toggle */}
                  <div className="flex items-center justify-between py-2 border-b border-surface-variant/40">
                    <div className="pr-4">
                      <h3 className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-on-surface-variant" />
                        <span>Email Alerts</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">Receive daily summaries and task reminders via email.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input 
                        checked={emailAlerts}
                        className="sr-only peer" 
                        type="checkbox" 
                        onChange={() => setEmailAlerts(!emailAlerts)}
                      />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Browser notifications Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <div className="pr-4">
                      <h3 className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-on-surface-variant" />
                        <span>Browser Notifications</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">Get pinged when a high-priority task is due.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input 
                        checked={browserNotifications}
                        className="sr-only peer" 
                        type="checkbox" 
                        onChange={() => setBrowserNotifications(!browserNotifications)}
                      />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                </div>
              </section>
            )}

            {/* Appearance selection */}
            {activeTab === 'profile' && (
              <section id="appearanceSettingsCard" className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(45,41,40,0.05)] border border-surface-variant">
                <h2 className="font-sans font-bold text-xl text-on-surface mb-4">Apariencia</h2>
                <p className="text-xs text-on-surface-variant mb-6">Customize the look and feel of your workspace.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Light theme selector card */}
                  <div 
                    className={`flex-1 cursor-pointer border-2 rounded-2xl p-2 transition-all relative ${
                      !darkMode 
                        ? 'border-primary bg-surface-container-low' 
                        : 'border-surface-variant bg-transparent opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => handleThemeChange(false)}
                  >
                    <div className="bg-[#F1F5F9] h-24 rounded-xl border border-surface-variant p-2.5 flex flex-col gap-1.5 overflow-hidden">
                      <div className="bg-white h-4 w-1/2 rounded shadow-sm"></div>
                      <div className="bg-white h-8 w-full rounded shadow-sm"></div>
                      <div className="bg-white h-8 w-full rounded shadow-sm"></div>
                    </div>
                    <div className="mt-3 text-center text-xs font-semibold text-on-surface flex items-center justify-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-primary" />
                      <span>Modo Claro</span>
                    </div>
                    {!darkMode && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      </div>
                    )}
                  </div>

                  {/* Dark theme selector card */}
                  <div 
                    className={`flex-1 cursor-pointer border-2 rounded-2xl p-2 transition-all relative ${
                      darkMode 
                        ? 'border-primary bg-surface-container-low' 
                        : 'border-surface-variant bg-transparent opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => handleThemeChange(true)}
                  >
                    <div className="bg-[#1E293B] h-24 rounded-xl border border-[#475569] p-2.5 flex flex-col gap-1.5 overflow-hidden">
                      <div className="bg-[#334155] h-4 w-1/2 rounded shadow-sm"></div>
                      <div className="bg-[#334155] h-8 w-full rounded shadow-sm"></div>
                      <div className="bg-[#334155] h-8 w-full rounded shadow-sm"></div>
                    </div>
                    <div className="mt-3 text-center text-xs font-semibold text-on-surface flex items-center justify-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-secondary" />
                      <span>Modo Oscuro</span>
                    </div>
                    {darkMode && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Empty views for unused settings categories */}
            {activeTab === 'security' && (
              <section className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-outline" />
                </div>
                <h3 className="font-bold text-lg text-on-surface mb-1">Configuración de Seguridad</h3>
                <p className="text-xs text-on-surface-variant max-w-xs">Las opciones de seguridad de la cuenta están configuradas mediante autenticación segura.</p>
              </section>
            )}

            {activeTab === 'account' && (
              <section className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6 text-outline" />
                </div>
                <h3 className="font-bold text-lg text-on-surface mb-1">Gestión de Cuenta</h3>
                <p className="text-xs text-on-surface-variant max-w-xs">Configuración del espacio de trabajo y exportación de datos.</p>
              </section>
            )}

          </div>

        </div>
      </main>

      {/* BottomNavBar (Mobile Only) - md:hidden fixed bottom nav */}
      <nav 
        id="mobileBottomNav"
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface shadow-[0_-4px_12px_rgba(45,41,40,0.05)] border-t border-surface-variant rounded-t-2xl pb-safe"
      >
        <button 
          id="mobileNavTasksLink"
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all text-[11px] font-semibold py-1 cursor-pointer bg-transparent border-none"
          onClick={onNavigateToTasks}
        >
          <ClipboardList className="w-5 h-5 mb-1" />
          Tasks
        </button>
        
        <button 
          id="mobileNavTodayLink"
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all text-[11px] font-semibold py-1 cursor-pointer bg-transparent border-none"
        >
          <Calendar className="w-5 h-5 mb-1" />
          Today
        </button>
        
        <button 
          id="mobileNavUpcomingLink"
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all text-[11px] font-semibold py-1 cursor-pointer bg-transparent border-none"
        >
          <Inbox className="w-5 h-5 mb-1" />
          Upcoming
        </button>
        
        <button 
          id="mobileNavSettingsLink"
          className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-5 py-1.5 active:scale-95 transition-all text-[11px] font-bold cursor-pointer border-none"
        >
          <Settings className="w-4 h-4 mb-0.5 fill-primary/10" />
          Settings
        </button>
      </nav>

    </div>
  );
}
