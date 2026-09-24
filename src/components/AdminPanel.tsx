import { useState, useRef, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Image as ImageIcon,
  Heart,
  Music,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  Key,
  Palette,
} from 'lucide-react';
import { type BirthdayConfigType, getAdminPin, saveAdminPin, THEME_PRESETS } from '../config/configStore';

interface AdminPanelProps {
  config: BirthdayConfigType;
  onSave: (newConfig: BirthdayConfigType) => void;
  onReset: () => void;
}

export default function AdminPanel({ config, onSave, onReset }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'letter' | 'photos' | 'timeline' | 'cake' | 'music' | 'theme' | 'system'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable local state
  const [form, setForm] = useState<BirthdayConfigType>(config);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  const [uploadTargetIndex, setUploadTargetIndex] = useState<{ type: 'orbit' | 'gallery' | 'timeline'; index: number } | null>(null);

  // Sync with prop when opened
  const handleOpen = () => {
    setForm(config);
    setIsOpen(true);
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const correctPin = getAdminPin();
    if (pinInput === correctPin) {
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleChangePin = () => {
    if (newPinInput.trim().length >= 4) {
      saveAdminPin(newPinInput.trim());
      setPinChangeSuccess(true);
      setNewPinInput('');
      setTimeout(() => setPinChangeSuccess(false), 3000);
    } else {
      alert('PIN minimal 4 karakter!');
    }
  };

  const handleSave = () => {
    onSave(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah kamu yakin ingin mengembalikan semua data ke pengaturan awal?')) {
      onReset();
      setForm(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cosmic_birthday_config_${form.partnerName || 'pacar'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setForm(parsed);
        onSave(parsed);
        alert('Konfigurasi berhasil diimpor!');
      } catch (err) {
        alert('File JSON tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  // Handle Photo Upload (Convert to Base64 dataURL)
  const triggerPhotoUpload = (type: 'orbit' | 'gallery' | 'timeline', index: number) => {
    setUploadTargetIndex({ type, index });
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetIndex) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const { type, index } = uploadTargetIndex;

      if (type === 'orbit') {
        const updated = [...form.orbitPhotos];
        updated[index] = { ...updated[index], src: dataUrl };
        setForm({ ...form, orbitPhotos: updated });
      } else if (type === 'gallery') {
        const updated = [...form.galleryPhotos];
        updated[index] = { ...updated[index], src: dataUrl };
        setForm({ ...form, galleryPhotos: updated });
      } else if (type === 'timeline') {
        const updated = [...form.timeline];
        updated[index] = { ...updated[index], image: dataUrl };
        setForm({ ...form, timeline: updated });
      }
      setUploadTargetIndex(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Music Audio Upload
  const handleMusicUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const audioUrl = evt.target?.result as string;
      setForm({ ...form, music: audioUrl, musicTitle: file.name.replace(/\.[^/.]+$/, '') });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      {/* Floating Admin Trigger Button */}
      <button
        onClick={handleOpen}
        title="Buka Admin Panel (Edit Website)"
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full glass-card hover:border-pink-500/50 text-purple-300 hover:text-white transition-all shadow-xl flex items-center gap-2 group cursor-pointer"
        style={{ background: 'rgba(18, 8, 42, 0.85)', border: '1px solid rgba(167,139,250,0.3)' }}
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 text-pink-400" />
        <span className="text-xs font-mono font-medium hidden group-hover:inline transition-all">
          Admin Panel
        </span>
      </button>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={musicInputRef}
        onChange={handleMusicUpload}
        accept="audio/*"
        className="hidden"
      />
      <input
        type="file"
        ref={importFileRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />

      {/* Admin Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f0a1c] border border-purple-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between bg-purple-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">
                      Cosmic Love Admin Dashboard
                    </h2>
                    <p className="text-xs text-purple-300/70">
                      Ubah nama, surat, foto, timeline, dan lagu secara langsung
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {savedSuccess && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-emerald-400 flex items-center gap-1 font-mono"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Tersimpan!
                    </motion.span>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Pin Authentication Screen */}
              {!isUnlocked ? (
                <div className="p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                  <div className="p-4 rounded-full bg-purple-900/30 text-amber-400 mb-4 border border-amber-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Masuk Sebagai Admin</h3>
                  <p className="text-sm text-purple-300/70 mb-6">
                    Masukkan PIN keamanan untuk mengakses panel pengaturan.
                  </p>

                  <form onSubmit={handleUnlock} className="w-full space-y-4">
                    <input
                      type="password"
                      placeholder="••••"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-500/30 text-center text-xl tracking-widest text-white focus:outline-none focus:border-pink-500 font-mono"
                      maxLength={16}
                      autoFocus
                    />

                    {pinError && (
                      <p className="text-xs text-rose-400">PIN salah! Silakan coba lagi.</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20"
                    >
                      <Unlock className="w-4 h-4" /> Masuk
                    </button>
                  </form>
                </div>
              ) : (
                /* Unlocked Admin Interface */
                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                  {/* Left Tabs Sidebar */}
                  <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-purple-500/20 p-3 flex md:flex-col gap-1 bg-purple-950/20 overflow-x-auto">
                    {[
                      { id: 'profile', label: 'Nama & Judul', icon: Heart },
                      { id: 'letter', label: 'Surat Cinta', icon: Sparkles },
                      { id: 'photos', label: 'Kelola Foto', icon: ImageIcon },
                      { id: 'timeline', label: 'Timeline Kenangan', icon: Clock },
                      { id: 'cake', label: 'Kue & Harapan', icon: Sparkles },
                      { id: 'music', label: 'Musik & Audio', icon: Music },
                      { id: 'theme', label: 'Warna & Seller', icon: Palette },
                      { id: 'system', label: 'Backup & Reset', icon: Settings },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/30 text-white border border-pink-500/40'
                              : 'text-purple-300/70 hover:text-white hover:bg-purple-900/30'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-purple-400'}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Main Tab Content */}
                  <div className="flex-1 p-6 overflow-y-auto min-h-0 space-y-6">
                    {/* TAB 1: Profile & Titles */}
                    {activeTab === 'profile' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-white">Identitas & Judul Utama</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-purple-300/80 mb-1 block">Nama Pasangan (Pacar)</label>
                            <input
                              type="text"
                              value={form.partnerName}
                              onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-purple-300/80 mb-1 block">Nama Kamu (Pengirim)</label>
                            <input
                              type="text"
                              value={form.senderName}
                              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Teks Intro Pembuka</label>
                          <input
                            type="text"
                            value={form.openingLine}
                            onChange={(e) => setForm({ ...form, openingLine: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Judul Layar Pembuka</label>
                          <input
                            type="text"
                            value={form.openingTitle}
                            onChange={(e) => setForm({ ...form, openingTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Judul Hero (Bisa pakai baris baru)</label>
                          <textarea
                            rows={2}
                            value={form.heroTitle}
                            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Sub-judul Hero</label>
                          <input
                            type="text"
                            value={form.heroSubtitle}
                            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 2: Love Letter */}
                    {activeTab === 'letter' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-white">Surat Cinta Ulang Tahun</h3>
                          <span className="text-xs text-purple-400">Mendukung paragraf panjang</span>
                        </div>
                        <textarea
                          rows={14}
                          value={form.birthdayMessage}
                          onChange={(e) => setForm({ ...form, birthdayMessage: e.target.value })}
                          className="w-full p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-white text-sm leading-relaxed focus:outline-none focus:border-pink-500 font-sans"
                        />
                      </div>
                    )}

                    {/* TAB 3: Photos Management */}
                    {activeTab === 'photos' && (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold text-white">Foto Orbit 3D (Planet Mengitari Matahari)</h3>
                            <span className="text-xs text-pink-400 font-mono">5 Foto Utama</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {form.orbitPhotos.map((photo, i) => (
                              <div key={i} className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col gap-2">
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 group">
                                  <img src={photo.src} alt="" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => triggerPhotoUpload('orbit', i)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs text-white transition-opacity font-medium"
                                  >
                                    <Upload className="w-3.5 h-3.5" /> Ganti Foto
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={photo.caption}
                                  placeholder="Caption foto..."
                                  onChange={(e) => {
                                    const updated = [...form.orbitPhotos];
                                    updated[i] = { ...updated[i], caption: e.target.value };
                                    setForm({ ...form, orbitPhotos: updated });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-xs text-white focus:outline-none focus:border-pink-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gallery Photos */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold text-white">Galeri Foto Kenangan</h3>
                            <button
                              onClick={() => {
                                setForm({
                                  ...form,
                                  galleryPhotos: [
                                    ...form.galleryPhotos,
                                    { src: '/photos/photo1.jpg', caption: 'Kenangan baru' },
                                  ],
                                });
                              }}
                              className="text-xs text-pink-400 flex items-center gap-1 hover:underline"
                            >
                              <Plus className="w-3.5 h-3.5" /> Tambah Foto
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {form.galleryPhotos.map((photo, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col gap-2 relative group">
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40">
                                  <img src={photo.src} alt="" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => triggerPhotoUpload('gallery', i)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-[11px] text-white transition-opacity"
                                  >
                                    <Upload className="w-3 h-3" /> Ganti
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={photo.caption}
                                  onChange={(e) => {
                                    const updated = [...form.galleryPhotos];
                                    updated[i] = { ...updated[i], caption: e.target.value };
                                    setForm({ ...form, galleryPhotos: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-purple-950/60 border border-purple-500/20 text-[11px] text-white"
                                />
                                {form.galleryPhotos.length > 1 && (
                                  <button
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        galleryPhotos: form.galleryPhotos.filter((_, idx) => idx !== i),
                                      });
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-rose-900/80 rounded-full text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: Timeline */}
                    {activeTab === 'timeline' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-white">Timeline Cerita Kita</h3>
                          <button
                            onClick={() => {
                              setForm({
                                ...form,
                                timeline: [
                                  ...form.timeline,
                                  {
                                    date: 'Momen Baru',
                                    title: 'Judul Cerita',
                                    description: 'Ceritakan apa yang terjadi di sini...',
                                    image: '/photos/photo1.jpg',
                                    emoji: '💖',
                                  },
                                ],
                              });
                            }}
                            className="text-xs text-pink-400 flex items-center gap-1 hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Momen
                          </button>
                        </div>

                        <div className="space-y-3">
                          {form.timeline.map((item, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col md:flex-row gap-4 items-start">
                              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 group">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                <button
                                  onClick={() => triggerPhotoUpload('timeline', i)}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white"
                                >
                                  Ganti
                                </button>
                              </div>

                              <div className="flex-1 space-y-2 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    value={item.date}
                                    placeholder="Tanggal / Waktu"
                                    onChange={(e) => {
                                      const updated = [...form.timeline];
                                      updated[i] = { ...updated[i], date: e.target.value };
                                      setForm({ ...form, timeline: updated });
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-xs text-amber-300 font-mono"
                                  />
                                  <input
                                    type="text"
                                    value={item.title}
                                    placeholder="Judul Momen"
                                    onChange={(e) => {
                                      const updated = [...form.timeline];
                                      updated[i] = { ...updated[i], title: e.target.value };
                                      setForm({ ...form, timeline: updated });
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-xs text-white"
                                  />
                                  <input
                                    type="text"
                                    value={item.emoji}
                                    placeholder="Emoji (e.g. ⭐)"
                                    onChange={(e) => {
                                      const updated = [...form.timeline];
                                      updated[i] = { ...updated[i], emoji: e.target.value };
                                      setForm({ ...form, timeline: updated });
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-xs text-center text-white"
                                  />
                                </div>
                                <textarea
                                  rows={2}
                                  value={item.description}
                                  placeholder="Deskripsi cerita..."
                                  onChange={(e) => {
                                    const updated = [...form.timeline];
                                    updated[i] = { ...updated[i], description: e.target.value };
                                    setForm({ ...form, timeline: updated });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-xs text-white/90"
                                />
                              </div>

                              {form.timeline.length > 1 && (
                                <button
                                  onClick={() => {
                                    setForm({
                                      ...form,
                                      timeline: form.timeline.filter((_, idx) => idx !== i),
                                    });
                                  }}
                                  className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 5: Cake & Final Wishes */}
                    {activeTab === 'cake' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-white">Kue Ulang Tahun & Penutup</h3>
                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Pesan Saat Lilin Ditiup</label>
                          <input
                            type="text"
                            value={form.candleMessage}
                            onChange={(e) => setForm({ ...form, candleMessage: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Balasan Harapan (Wish Response)</label>
                          <input
                            type="text"
                            value={form.wishResponse}
                            onChange={(e) => setForm({ ...form, wishResponse: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Pesan Bagian Akhir (Final Message)</label>
                          <input
                            type="text"
                            value={form.finalMessage}
                            onChange={(e) => setForm({ ...form, finalMessage: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Kata Penutup Terakhir</label>
                          <input
                            type="text"
                            value={form.closingWords}
                            onChange={(e) => setForm({ ...form, closingWords: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 6: Music */}
                    {activeTab === 'music' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-white">Musik Latar Romantis</h3>
                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">Judul Lagu</label>
                          <input
                            type="text"
                            value={form.musicTitle}
                            onChange={(e) => setForm({ ...form, musicTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-purple-300/80 mb-1 block">File / URL Musik</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={form.music}
                              onChange={(e) => setForm({ ...form, music: e.target.value })}
                              placeholder="/music.mp3 atau URL online"
                              className="flex-1 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm"
                            />
                            <button
                              onClick={() => musicInputRef.current?.click()}
                              className="px-4 py-2 rounded-xl bg-purple-800/40 hover:bg-purple-700/40 text-purple-200 text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload MP3
                            </button>
                          </div>
                          <p className="text-[11px] text-purple-300/60 mt-1">
                            Kamu bisa upload langsung file lagu MP3 favoritmu dari komputer/HP atau gunakan link MP3.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB: Theme Gradation & Seller Branding */}
                    {activeTab === 'theme' && (
                      <div className="space-y-6">
                        {/* Preset Theme Selector */}
                        <div>
                          <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-pink-400" /> Preset Gradasi Warna Kosmik
                          </h3>
                          <p className="text-xs text-purple-300/70 mb-4">
                            Pilih perpaduan gradasi warna galaksi dalam 1 klik
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {THEME_PRESETS.map((preset) => {
                              const isSelected = form.themePreset === preset.id;
                              return (
                                <div
                                  key={preset.id}
                                  onClick={() => {
                                    setForm({
                                      ...form,
                                      themePreset: preset.id,
                                      primaryColor: preset.primaryColor,
                                      secondaryColor: preset.secondaryColor,
                                      accentGlowColor: preset.accentGlowColor,
                                      bgGradientStart: preset.bgGradientStart,
                                      bgGradientEnd: preset.bgGradientEnd,
                                    });
                                  }}
                                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                                    isSelected
                                      ? 'border-pink-500 bg-purple-950/70 ring-2 ring-pink-500/30'
                                      : 'border-purple-500/20 bg-purple-950/30 hover:border-purple-500/40'
                                  }`}
                                >
                                  <div
                                    className="h-10 rounded-xl w-full flex items-center justify-end px-3 shadow-inner"
                                    style={{ background: preset.previewGradient }}
                                  >
                                    {isSelected && <CheckCircle className="w-4 h-4 text-white drop-shadow" />}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-white">{preset.name}</p>
                                    <p className="text-[11px] text-purple-300/60 leading-tight mt-0.5">{preset.description}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Color Pickers */}
                        <div className="border-t border-purple-500/20 pt-4">
                          <h3 className="text-sm font-semibold text-white mb-1">Kustomisasi Warna Manual</h3>
                          <p className="text-xs text-purple-300/70 mb-4">
                            Atur kode warna hex untuk warna utama, sekunder, dan background
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] text-purple-300/80 mb-1 block">Warna Utama (Primary)</label>
                              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-xl p-1.5">
                                <input
                                  type="color"
                                  value={form.primaryColor}
                                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value, themePreset: 'custom' })}
                                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <input
                                  type="text"
                                  value={form.primaryColor}
                                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value, themePreset: 'custom' })}
                                  className="w-full text-xs text-white bg-transparent font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-purple-300/80 mb-1 block">Warna Sekunder (Secondary)</label>
                              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-xl p-1.5">
                                <input
                                  type="color"
                                  value={form.secondaryColor}
                                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value, themePreset: 'custom' })}
                                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <input
                                  type="text"
                                  value={form.secondaryColor}
                                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value, themePreset: 'custom' })}
                                  className="w-full text-xs text-white bg-transparent font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-purple-300/80 mb-1 block">Aksen Cahaya (Glow)</label>
                              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-xl p-1.5">
                                <input
                                  type="color"
                                  value={form.accentGlowColor}
                                  onChange={(e) => setForm({ ...form, accentGlowColor: e.target.value, themePreset: 'custom' })}
                                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <input
                                  type="text"
                                  value={form.accentGlowColor}
                                  onChange={(e) => setForm({ ...form, accentGlowColor: e.target.value, themePreset: 'custom' })}
                                  className="w-full text-xs text-white bg-transparent font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-purple-300/80 mb-1 block">Background Gradasi Atas</label>
                              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-xl p-1.5">
                                <input
                                  type="color"
                                  value={form.bgGradientStart}
                                  onChange={(e) => setForm({ ...form, bgGradientStart: e.target.value, themePreset: 'custom' })}
                                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <input
                                  type="text"
                                  value={form.bgGradientStart}
                                  onChange={(e) => setForm({ ...form, bgGradientStart: e.target.value, themePreset: 'custom' })}
                                  className="w-full text-xs text-white bg-transparent font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-purple-300/80 mb-1 block">Background Gradasi Bawah</label>
                              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-xl p-1.5">
                                <input
                                  type="color"
                                  value={form.bgGradientEnd}
                                  onChange={(e) => setForm({ ...form, bgGradientEnd: e.target.value, themePreset: 'custom' })}
                                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <input
                                  type="text"
                                  value={form.bgGradientEnd}
                                  onChange={(e) => setForm({ ...form, bgGradientEnd: e.target.value, themePreset: 'custom' })}
                                  className="w-full text-xs text-white bg-transparent font-mono focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Seller Branding & Watermark (By Jus_Romance) */}
                        <div className="border-t border-purple-500/20 pt-4 space-y-4">
                          <h3 className="text-base font-semibold text-white mb-1">Branding Seller & Watermark (By Jus_Romance)</h3>
                          <p className="text-xs text-purple-300/70">
                            Identitas pembuat / penjual yang tampil eksklusif di header & footer
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-purple-300/80 mb-1 block">Teks Watermark</label>
                              <input
                                type="text"
                                value={form.watermarkText}
                                onChange={(e) => setForm({ ...form, watermarkText: e.target.value })}
                                placeholder="By Jus_Romance"
                                className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500 font-medium"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-purple-300/80 mb-1 block">Nama Brand Penjual</label>
                              <input
                                type="text"
                                value={form.sellerBrand}
                                onChange={(e) => setForm({ ...form, sellerBrand: e.target.value })}
                                placeholder="Jus_Romance"
                                className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500 font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-purple-300/80 mb-1 block">Link Kontak / Instagram / WhatsApp</label>
                            <input
                              type="text"
                              value={form.sellerContact}
                              onChange={(e) => setForm({ ...form, sellerContact: e.target.value })}
                              placeholder="https://instagram.com/jus_romance"
                              className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <input
                              type="checkbox"
                              id="showWatermark"
                              checked={form.showWatermark}
                              onChange={(e) => setForm({ ...form, showWatermark: e.target.checked })}
                              className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500 bg-purple-950 border-purple-500/30 cursor-pointer"
                            />
                            <label htmlFor="showWatermark" className="text-xs text-purple-200 cursor-pointer">
                              Tampilkan Watermark <strong className="text-pink-300">"{form.watermarkText || 'By Jus_Romance'}"</strong> di website
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 7: System, Backup & Reset */}
                    {activeTab === 'system' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-semibold text-white mb-2">Simpan & Cadangkan Data</h3>
                          <p className="text-xs text-purple-300/70 mb-4">
                            Semua data otomatis tersimpan di browser ini. Kamu juga bisa mengunduh file JSON sebagai cadangan atau membagikannya.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={handleExportJSON}
                              className="px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/50 border border-purple-500/30 text-white text-xs flex items-center gap-2 cursor-pointer"
                            >
                              <Download className="w-4 h-4 text-emerald-400" /> Download Backup (JSON)
                            </button>
                            <button
                              onClick={() => importFileRef.current?.click()}
                              className="px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/50 border border-purple-500/30 text-white text-xs flex items-center gap-2 cursor-pointer"
                            >
                              <Upload className="w-4 h-4 text-amber-400" /> Impor Backup (JSON)
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-purple-500/20 pt-4">
                          <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-400" /> Ubah PIN Admin
                          </h3>
                          <p className="text-xs text-purple-300/70 mb-3">
                            Ubah PIN rahasia untuk membuka panel ini. PIN baru akan tersimpan di browser ini.
                          </p>
                          <div className="flex gap-2 max-w-sm">
                            <input
                              type="password"
                              placeholder="PIN Baru (minimal 4 karakter)"
                              value={newPinInput}
                              onChange={(e) => setNewPinInput(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                              maxLength={16}
                            />
                            <button
                              type="button"
                              onClick={handleChangePin}
                              className="px-4 py-2 rounded-xl bg-purple-700/60 hover:bg-purple-600/70 text-white text-xs font-medium cursor-pointer transition-all"
                            >
                              Simpan PIN
                            </button>
                          </div>
                          {pinChangeSuccess && (
                            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-mono">
                              <CheckCircle className="w-3.5 h-3.5" /> PIN berhasil diperbarui!
                            </p>
                          )}
                        </div>

                        <div className="border-t border-purple-500/20 pt-4">
                          <h3 className="text-base font-semibold text-rose-300 mb-2">Reset Pengaturan</h3>
                          <p className="text-xs text-purple-300/70 mb-4">
                            Kembalikan semua teks, foto, dan musik ke konfigurasi bawaan awal.
                          </p>
                          <button
                            onClick={handleResetToDefault}
                            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" /> Reset ke Bawaan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Actions Footer */}
              {isUnlocked && (
                <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-950/40 flex items-center justify-between">
                  <div className="text-xs text-purple-400">
                    Perubahan langsung aktif saat disimpan ✨
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-xl text-purple-300 hover:text-white text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-pink-500/20 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Simpan Semua Perubahan
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
