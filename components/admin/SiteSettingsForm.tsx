"use client";

import { useState } from "react";
import Image from "next/image";
import { saveSettings } from "@/lib/actions/settings";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["raw-silk", "chiffon", "organza", "georgette", "net", "velvet"];

export default function SiteSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, { type: 'success' | 'error', text: string }>>({});

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (sectionKeys: string[], sectionName: string) => {
    setSavingSection(sectionName);
    setMessages(prev => ({ ...prev, [sectionName]: null as any }));

    const payload: Record<string, string> = {};
    for (const key of sectionKeys) {
      payload[key] = settings[key] || "";
    }

    const result = await saveSettings(payload);
    
    if (result.error) {
      setMessages(prev => ({ ...prev, [sectionName]: { type: 'error', text: result.error as string } }));
    } else {
      setMessages(prev => ({ ...prev, [sectionName]: { type: 'success', text: 'Saved successfully!' } }));
      setTimeout(() => setMessages(prev => ({ ...prev, [sectionName]: null as any })), 3000);
    }
    
    setSavingSection(null);
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images') // Reusing same bucket for convenience
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      alert(`Error uploading image: ${error.message}`);
      return;
    }

    if (data) {
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(data.path);
      handleChange(key, publicUrlData.publicUrl);
    }
  };

  const renderImageUpload = (key: string, label: string) => {
    const url = settings[key];
    return (
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-wider text-charcoal/60">{label}</label>
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 bg-charcoal/5 border border-charcoal/10 flex-shrink-0">
            {url ? (
              <Image src={url} alt={label} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-charcoal/40 text-center px-2">No image selected</div>
            )}
          </div>
          <div className="space-y-2">
            <input type="file" accept="image/*" onChange={e => handleImageUpload(key, e)} className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-charcoal/5 file:text-charcoal hover:file:bg-charcoal/10" />
            {url && (
              <button type="button" onClick={() => handleChange(key, "")} className="text-sm text-red-500 hover:text-red-700">Remove Image</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      
      {/* 1. Hero Section */}
      <section className="bg-white p-6 rounded border border-charcoal/10 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-6 border-b border-charcoal/10 pb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Headline</label>
            <input type="text" value={settings['hero_headline'] || ""} onChange={e => handleChange('hero_headline', e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Subtext</label>
            <textarea rows={2} value={settings['hero_subtext'] || ""} onChange={e => handleChange('hero_subtext', e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          {/* Slider Images */}
          <div className="pt-4 border-t border-charcoal/10">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Hero Background Slider Images</h3>
            <p className="text-xs text-charcoal/60 mb-4">Upload up to 4 images for the homepage animated slider.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderImageUpload('hero_slider_1', 'Slider Image 1')}
              {renderImageUpload('hero_slider_2', 'Slider Image 2')}
              {renderImageUpload('hero_slider_3', 'Slider Image 3')}
              {renderImageUpload('hero_slider_4', 'Slider Image 4')}
            </div>
          </div>
          
          <div className="pt-4 flex items-center gap-4">
            <Button type="button" variant="primary" onClick={() => handleSave(['hero_headline', 'hero_subtext', 'hero_slider_1', 'hero_slider_2', 'hero_slider_3', 'hero_slider_4'], 'hero')} disabled={savingSection === 'hero'}>
              {savingSection === 'hero' ? 'Saving...' : 'Save Hero Settings'}
            </Button>
            {messages['hero'] && (
              <span className={`text-sm ${messages['hero'].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{messages['hero'].text}</span>
            )}
          </div>
        </div>
      </section>

      {/* 2. Category Photography */}
      <section className="bg-white p-6 rounded border border-charcoal/10 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-6 border-b border-charcoal/10 pb-4">Category Photography</h2>
        <p className="text-sm text-charcoal/60 mb-6">These images appear in the "Shop by Collection" grid on the homepage.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map(cat => (
            <div key={cat} className="p-4 border border-charcoal/10 rounded">
              {renderImageUpload(`category_image_url_${cat}`, cat.replace('-', ' '))}
            </div>
          ))}
        </div>
        
        <div className="pt-6 flex items-center gap-4">
          <Button type="button" variant="primary" onClick={() => handleSave(CATEGORIES.map(c => `category_image_url_${c}`), 'categories')} disabled={savingSection === 'categories'}>
            {savingSection === 'categories' ? 'Saving...' : 'Save Category Photos'}
          </Button>
          {messages['categories'] && (
            <span className={`text-sm ${messages['categories'].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{messages['categories'].text}</span>
          )}
        </div>
      </section>

      {/* 3. About Page */}
      <section className="bg-white p-6 rounded border border-charcoal/10 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-6 border-b border-charcoal/10 pb-4">About Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Heading</label>
            <input type="text" value={settings['about_heading'] || ""} onChange={e => handleChange('about_heading', e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Body Text (Paragraphs separated by newlines)</label>
            <textarea rows={8} value={settings['about_body'] || ""} onChange={e => handleChange('about_body', e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" />
          </div>
          {renderImageUpload('about_image_url', 'About Page Image')}
          
          <div className="pt-4 flex items-center gap-4">
            <Button type="button" variant="primary" onClick={() => handleSave(['about_heading', 'about_body', 'about_image_url'], 'about')} disabled={savingSection === 'about'}>
              {savingSection === 'about' ? 'Saving...' : 'Save About Content'}
            </Button>
            {messages['about'] && (
              <span className={`text-sm ${messages['about'].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{messages['about'].text}</span>
            )}
          </div>
        </div>
      </section>

      {/* 4. Social Media */}
      <section className="bg-white p-6 rounded border border-charcoal/10 shadow-sm">
        <h2 className="font-serif text-xl text-charcoal mb-6 border-b border-charcoal/10 pb-4">Social Media Links</h2>
        <p className="text-sm text-charcoal/60 mb-6">Leave blank to hide the icon from the footer.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Facebook URL</label>
            <input type="url" value={settings['facebook_url'] || ""} onChange={e => handleChange('facebook_url', e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/60 mb-2">Instagram URL</label>
            <input type="url" value={settings['instagram_url'] || ""} onChange={e => handleChange('instagram_url', e.target.value)} className="w-full bg-charcoal/5 border border-charcoal/10 rounded px-4 py-2 text-charcoal focus:outline-none focus:border-gold" placeholder="https://instagram.com/..." />
          </div>
          
          <div className="pt-4 flex items-center gap-4">
            <Button type="button" variant="primary" onClick={() => handleSave(['facebook_url', 'instagram_url'], 'socials')} disabled={savingSection === 'socials'}>
              {savingSection === 'socials' ? 'Saving...' : 'Save Social Links'}
            </Button>
            {messages['socials'] && (
              <span className={`text-sm ${messages['socials'].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{messages['socials'].text}</span>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
