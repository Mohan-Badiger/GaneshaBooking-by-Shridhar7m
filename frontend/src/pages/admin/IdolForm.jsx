import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Plus, Trash2, Upload, Star, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import Toast from '../../components/Toast';

const IdolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    height: '',
    width: '',
    material: 'Eco-friendly Clay (Shadu Mati)',
    price: '',
    images: [],
    features: [],
    availability: true,
    featured: false,
    displayOrder: 0,
  });

  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    if (isEditMode) {
      const fetchIdolDetails = async () => {
        try {
          const response = await axios.get(`/api/idols/${id}`);
          if (response.data && response.data.success) {
            const data = response.data.data;
            setFormData({
              name: data.name || '',
              description: data.description || '',
              height: data.height || '',
              width: data.width || '',
              material: data.material || 'Eco-friendly Clay (Shadu Mati)',
              price: data.price || '',
              images: data.images || [],
              features: data.features || [],
              availability: data.availability !== undefined ? data.availability : true,
              featured: data.featured !== undefined ? data.featured : false,
              displayOrder: data.displayOrder || 0,
            });
          }
        } catch (error) {
          console.error('Failed to load idol info:', error);
          setToastType('error');
          setToastMessage('Could not load Ganesha details for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchIdolDetails();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Multiple Image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach((file) => {
      uploadData.append('images', file);
    });

    try {
      setUploading(true);
      const response = await axios.post('/api/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...response.data.urls],
        }));
        setToastType('success');
        setToastMessage(`Uploaded ${response.data.urls.length} images successfully.`);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Image upload failed. Allowed: JPG, PNG, WEBP up to 5MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const target = newImages.splice(indexToPrimary, 1)[0];
      newImages.unshift(target); // Move to beginning
      return { ...prev, images: newImages };
    });
    setToastType('info');
    setToastMessage('Selected image is now primary.');
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (idxToRemove) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.height || !formData.price) {
      setToastType('warning');
      setToastMessage('Please complete all required fields');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        height: parseFloat(formData.height),
        width: formData.width ? parseFloat(formData.width) : undefined,
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`/api/admin/idols/${id}`, payload);
      } else {
        response = await axios.post('/api/admin/idols', payload);
      }

      if (response.data && response.data.success) {
        setToastType('success');
        setToastMessage(isEditMode ? 'Ganesha updated successfully!' : 'Ganesha created successfully!');
        setTimeout(() => {
          navigate('/admin/idols');
        }, 1200);
      }
    } catch (err) {
      console.error('Save error:', err);
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Server error saving Ganesha.');
    } finally {
      setSaving(false);
    }
  };

  // Safe absolute path resolving helper
  const getFullImageUrl = (url) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans space-y-3">
        <div className="w-12 h-12 border-4 border-festival-maroon border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-festival-darkLight/70 text-sm font-semibold">Loading Ganesha details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/admin/idols"
          className="inline-flex items-center text-sm font-bold text-festival-maroon/70 hover:text-festival-maroon transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Catalog
        </Link>
      </div>

      <div className="bg-white border border-festival-creamDark rounded-3xl p-6 md:p-8 shadow-sm">
        <h1 className="text-xl md:text-2xl font-serif font-black text-festival-maroon border-b border-festival-creamDark pb-4 mb-6">
          {isEditMode ? 'Edit Ganesha Idol' : 'Add Ganesha Idol'}
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Ganesha Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Royal Shrimant Ganesha"
                className="w-full px-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Material Used *
              </label>
              <input
                type="text"
                name="material"
                required
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g. Eco Clay (Shadu Mati)"
                className="w-full px-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Price (INR) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 8500"
                className="w-full px-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Height (Feet) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="height"
                  required
                  min="0"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g. 3.5"
                  className="w-full px-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Width (Feet)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="width"
                  min="0"
                  value={formData.width}
                  onChange={handleInputChange}
                  placeholder="e.g. 2.2"
                  className="w-full px-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide historical style details, color highlights, packaging details..."
              className="w-full px-4 py-3 bg-festival-cream/30 border border-festival-creamDark focus:ring-festival-maroon/20 focus:border-festival-maroon rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all"
            ></textarea>
          </div>

          {/* Section 2: Image Gallery Manager */}
          <div className="space-y-3 p-5 border border-festival-creamDark bg-festival-cream/20 rounded-3xl">
            <h3 className="text-sm font-bold text-festival-maroon uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> Image Manager
            </h3>
            <p className="text-xs text-festival-darkLight/50 leading-relaxed">
              Upload multiple photos for this idol (Max 5). The first image will be used as the primary card preview. You can click to set any image as primary.
            </p>

            {/* Dropzone/Upload Button */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-festival-creamDark rounded-2xl cursor-pointer bg-white hover:bg-festival-cream/40 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-1.5 text-festival-darkLight/60">
                  <Upload className="w-8 h-8 text-festival-maroon/70" />
                  <p className="text-xs font-bold">Click to upload Ganesha Photos</p>
                  <p className="text-[10px]">PNG, JPG or WEBP (Max 5MB per file)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 justify-center py-2 text-xs text-festival-maroon font-bold">
                <div className="w-4 h-4 border-2 border-festival-maroon border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading files to storage...</span>
              </div>
            )}

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-3">
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border aspect-[4/5] group bg-white shadow-sm transition-all ${
                      idx === 0 ? 'border-2 border-festival-maroon ring-2 ring-festival-maroon/10 scale-95' : 'border-festival-creamDark'
                    }`}
                  >
                    <img
                      src={getFullImageUrl(imgUrl)}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge showing Primary */}
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-festival-maroon text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}

                    {/* Actions Panel on Hover */}
                    <div className="absolute inset-0 bg-[#1C1816]/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-1.5">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="px-2 py-1 bg-festival-maroon text-white text-[9px] font-bold rounded hover:bg-festival-maroonDark transition-all"
                        >
                          Make Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Custom Features / Tags */}
          <div className="space-y-3 p-5 border border-festival-creamDark bg-festival-cream/20 rounded-3xl">
            <h3 className="text-sm font-bold text-festival-maroon uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Custom Specifications / Bullet Points
            </h3>
            <p className="text-xs text-festival-darkLight/50 leading-relaxed">
              Add individual highlight points like "100% Shadu Clay", "Organic natural watercolors", etc.
            </p>

            {/* Input tag */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Free dynamic wooden base"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-grow px-3 py-2 bg-white border border-festival-creamDark rounded-xl text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-festival-cream text-festival-maroon border border-festival-maroon/20 hover:bg-festival-creamDark font-bold rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Features Tags list */}
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-festival-creamDark rounded-full text-xs font-semibold text-festival-darkLight"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm focus:outline-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Switches & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            {/* Display Order */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Display Order Number
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                placeholder="e.g. 0"
                className="w-full px-4 py-2 bg-festival-cream/30 border border-festival-creamDark rounded-xl text-sm focus:outline-none"
              />
            </div>

            {/* Availability switch */}
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="w-5 h-5 accent-festival-maroon cursor-pointer"
              />
              <label htmlFor="availability" className="text-xs font-bold text-festival-maroon uppercase tracking-wider select-none cursor-pointer">
                Available for bookings
              </label>
            </div>

            {/* Featured Switch */}
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 accent-festival-maroon cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-bold text-festival-maroon uppercase tracking-wider select-none cursor-pointer flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current text-festival-saffron" /> Spotlight Featured
              </label>
            </div>
          </div>

          {/* Save CTA */}
          <div className="pt-6 border-t border-festival-creamDark flex justify-end gap-3">
            <Link
              to="/admin/idols"
              className="px-6 py-3 border border-festival-creamDark text-festival-darkLight hover:bg-festival-cream font-bold rounded-xl text-sm transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-festival-maroon hover:bg-festival-maroonDark text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving changes...' : (isEditMode ? 'Update Ganesha' : 'Create Ganesha')}
            </button>
          </div>
        </form>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default IdolForm;
