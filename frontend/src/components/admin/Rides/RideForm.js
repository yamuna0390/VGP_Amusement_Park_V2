"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminRideService } from "@/services/adminRideService";
import { getImageUrl } from "@/constants/api";
import { Plus, Trash2 } from "lucide-react";
import "./RideForm.css";

const defaultForm = {
  name: "",
  slug: "",
  category: "family",
  sub_category: "",
  manufacturer: "",
  short_description: "",
  overview: "",
  duration: "",
  min_height: "",
  thrill_level: "",
  capacity: "",
  age_group: "",
  card_image_url: "",
  hero_type: "image",
  hero_image_url: "",
  hero_video_url: "",
  hero_youtube_url: "",
  gallery: [],
  safety_rules: [],
  map_zone: "",
  map_lat: "",
  map_lng: "",
  bg_color: "bg-cream",
  photo_text_overlay: "",
  icon_identifier: "",
  emoji_icon: "",
  display_order: 0,
  status: "Active"
};

export default function RideForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const validateImage = (file) => {
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > MAX_IMAGE_SIZE) {
      return "Image is too large. Maximum size is 5 MB.";
    }
    if (!allowedTypes.includes(file.type)) {
      return "Unsupported image format. Please select a JPG, PNG, or WebP image.";
    }
    return null;
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        gallery: initialData.gallery || [],
        safety_rules: initialData.safety_rules || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGalleryChange = (index, field, value) => {
    const newGallery = [...form.gallery];
    newGallery[index] = { ...newGallery[index], [field]: value };
    setForm(prev => ({ ...prev, gallery: newGallery }));
  };

  const addGalleryRow = () => {
    const newOrder = form.gallery.length > 0 
      ? Math.max(...form.gallery.map(g => g.display_order || 0)) + 1 
      : 0;
    setForm(prev => ({
      ...prev,
      gallery: [...prev.gallery, { image_url: "", display_order: newOrder }]
    }));
  };

  const removeGalleryRow = (index) => {
    const newGallery = [...form.gallery];
    newGallery.splice(index, 1);
    setForm(prev => ({ ...prev, gallery: newGallery }));
  };

  const handleSafetyChange = (index, field, value) => {
    const newSafety = [...form.safety_rules];
    newSafety[index] = { ...newSafety[index], [field]: value };
    setForm(prev => ({ ...prev, safety_rules: newSafety }));
  };

  const addSafetyRow = () => {
    const newOrder = form.safety_rules.length > 0 
      ? Math.max(...form.safety_rules.map(s => s.display_order || 0)) + 1 
      : 0;
    setForm(prev => ({
      ...prev,
      safety_rules: [...prev.safety_rules, { rule_text: "", display_order: newOrder }]
    }));
  };

  const removeSafetyRow = (index) => {
    const newSafety = [...form.safety_rules];
    newSafety.splice(index, 1);
    setForm(prev => ({ ...prev, safety_rules: newSafety }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await adminRideService.updateRide(initialData.id, form);
        alert("Ride updated successfully");
      } else {
        await adminRideService.createRide(form);
        alert("Ride created successfully");
      }
      router.push("/admin/rides");
    } catch (error) {
      alert("Error saving ride: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ride-form-container" onSubmit={handleSubmit}>
      <div className="ride-form-header">
        <h2>{isEdit ? `Edit Ride: ${form.name}` : "Create New Ride"}</h2>
        <div className="header-actions">
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Ride"}
          </button>
        </div>
      </div>

      <div className="ride-form-grid">
        
        {/* SECTION A: Basic Info */}
        <section className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Slug * (URL)</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} required disabled={isEdit} />
              {isEdit && <small>Slug cannot be changed after creation.</small>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="family">Family Rides</option>
                <option value="adult">Adult Rides</option>
                <option value="child">Child Rides</option>
                <option value="water">Water Park</option>
                <option value="zoo">Petting Zoo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sub Category (e.g. "Roller Coaster")</label>
              <input type="text" name="sub_category" value={form.sub_category || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input type="text" name="manufacturer" value={form.manufacturer || ""} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION B: Description */}
        <section className="form-section">
          <h3>Description</h3>
          <div className="form-group">
            <label>Short Description</label>
            <textarea name="short_description" value={form.short_description || ""} onChange={handleChange} rows="2" />
          </div>
          <div className="form-group">
            <label>Overview (Rich text/HTML supported by frontend)</label>
            <textarea name="overview" value={form.overview || ""} onChange={handleChange} rows="4" />
          </div>
        </section>

        {/* SECTION C: Ride Details */}
        <section className="form-section">
          <h3>Ride Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (e.g. 3 min)</label>
              <input type="text" name="duration" value={form.duration || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Min Height (e.g. 140 cm)</label>
              <input type="text" name="min_height" value={form.min_height || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Thrill Level</label>
              <input type="text" name="thrill_level" value={form.thrill_level || ""} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input type="text" name="capacity" value={form.capacity || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Age Group</label>
              <input type="text" name="age_group" value={form.age_group || ""} onChange={handleChange} />
            </div>
          </div>
        </section>



        {/* SECTION E: Media */}
        <section className="form-section">
          <h3>Media (URL Paths)</h3>
          <div className="form-group">
            <label>Card Image *</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  const errorMsg = validateImage(file);
                  if (errorMsg) {
                    setImageErrors(prev => ({ ...prev, card: errorMsg }));
                    return;
                  }
                  setImageErrors(prev => ({ ...prev, card: null }));
                  
                  try {
                    const safeSlug = form.slug || form.name.replace(/\s+/g, '-').toLowerCase() || 'new-ride';
                    const url = await adminRideService.uploadRideImage(file, safeSlug, 'card');
                    handleChange({ target: { name: 'card_image_url', value: url } });
                  } catch (err) {
                    setImageErrors(prev => ({ ...prev, card: err.message }));
                  }
                }}
              />
              {form.card_image_url && <img src={getImageUrl(form.card_image_url)} alt="Preview" style={{ height: "40px", borderRadius: "4px" }} />}
            </div>
            {imageErrors.card && <p className="error-text" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", marginBottom: "0" }}>{imageErrors.card}</p>}
            <input type="hidden" name="card_image_url" value={form.card_image_url || ""} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hero Type</label>
              <select name="hero_type" value={form.hero_type} onChange={handleChange}>
                <option value="image">Image</option>
                <option value="video">Local Video</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hero Image</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const errorMsg = validateImage(file);
                    if (errorMsg) {
                      setImageErrors(prev => ({ ...prev, hero: errorMsg }));
                      return;
                    }
                    setImageErrors(prev => ({ ...prev, hero: null }));

                    try {
                      const safeSlug = form.slug || form.name.replace(/\s+/g, '-').toLowerCase() || 'new-ride';
                      const url = await adminRideService.uploadRideImage(file, safeSlug, 'hero');
                      handleChange({ target: { name: 'hero_image_url', value: url } });
                    } catch (err) {
                      setImageErrors(prev => ({ ...prev, hero: err.message }));
                    }
                  }}
                />
                {form.hero_image_url && <img src={getImageUrl(form.hero_image_url)} alt="Preview" style={{ height: "40px", borderRadius: "4px" }} />}
              </div>
              {imageErrors.hero && <p className="error-text" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", marginBottom: "0" }}>{imageErrors.hero}</p>}
              <input type="hidden" name="hero_image_url" value={form.hero_image_url || ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>YouTube ID</label>
              <input type="text" name="hero_youtube_url" value={form.hero_youtube_url || ""} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* SECTION F: Gallery Repeater */}
        <section className="form-section">
          <div className="section-header-flex">
            <h3>Gallery Images</h3>
            <button type="button" className="btn-secondary btn-sm" onClick={addGalleryRow}><Plus size={14}/> Add Image</button>
          </div>
          {form.gallery.map((img, index) => (
            <div key={index} className="repeater-row" style={{ alignItems: "center" }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      const errorMsg = validateImage(file);
                      if (errorMsg) {
                        setImageErrors(prev => ({ ...prev, gallery: { ...(prev.gallery || {}), [index]: errorMsg } }));
                        return;
                      }
                      setImageErrors(prev => {
                        const newGalleryErrs = { ...(prev.gallery || {}) };
                        delete newGalleryErrs[index];
                        return { ...prev, gallery: newGalleryErrs };
                      });

                      try {
                        const safeSlug = form.slug || form.name.replace(/\s+/g, '-').toLowerCase() || 'new-ride';
                        const url = await adminRideService.uploadRideImage(file, safeSlug, 'gallery');
                        handleGalleryChange(index, "image_url", url);
                      } catch (err) {
                        setImageErrors(prev => ({ ...prev, gallery: { ...(prev.gallery || {}), [index]: err.message } }));
                      }
                    }}
                  />
                  {img.image_url && <img src={getImageUrl(img.image_url)} alt="Preview" style={{ height: "40px", borderRadius: "4px" }} />}
                </div>
                {imageErrors.gallery?.[index] && <p className="error-text" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", marginBottom: "0" }}>{imageErrors.gallery[index]}</p>}
              </div>
              <div className="form-group" style={{ width: '100px', marginBottom: 0 }}>
                <input 
                  type="number" 
                  placeholder="Order" 
                  value={img.display_order} 
                  onChange={(e) => handleGalleryChange(index, "display_order", e.target.value)} 
                />
              </div>
              <button type="button" className="btn-icon btn-danger" onClick={() => removeGalleryRow(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {form.gallery.length === 0 && <p className="empty-text">No gallery images added.</p>}
        </section>

        {/* SECTION G: Safety Rules Repeater */}
        <section className="form-section">
          <div className="section-header-flex">
            <h3>Safety Rules</h3>
            <button type="button" className="btn-secondary btn-sm" onClick={addSafetyRow}><Plus size={14}/> Add Rule</button>
          </div>
          {form.safety_rules.map((rule, index) => (
            <div key={index} className="repeater-row">
              <div className="form-group" style={{ flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Rule text..." 
                  value={rule.rule_text} 
                  onChange={(e) => handleSafetyChange(index, "rule_text", e.target.value)} 
                />
              </div>
              <div className="form-group" style={{ width: '100px' }}>
                <input 
                  type="number" 
                  placeholder="Order" 
                  value={rule.display_order} 
                  onChange={(e) => handleSafetyChange(index, "display_order", e.target.value)} 
                />
              </div>
              <button type="button" className="btn-icon btn-danger" onClick={() => removeSafetyRow(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {form.safety_rules.length === 0 && <p className="empty-text">No safety rules added.</p>}
        </section>

        {/* SECTION H: Location */}
        <section className="form-section">
          <h3>Map Location</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Zone (e.g. Thrill Zone)</label>
              <input type="text" name="map_zone" value={form.map_zone || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Latitude (Y)</label>
              <input type="text" name="map_lat" value={form.map_lat || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Longitude (X)</label>
              <input type="text" name="map_lng" value={form.map_lng || ""} onChange={handleChange} />
            </div>
          </div>
        </section>

      </div>
    </form>
  );
}
