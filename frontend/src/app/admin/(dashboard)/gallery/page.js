"use client";

import { useState, useEffect } from "react";
import { adminSettingsService } from "@/services/adminSettingsService";
import { uploadService } from "@/services/uploadService";
import { UploadCloud, Save, PlayCircle, Loader2 } from "lucide-react";
import "@/components/admin/Common/AdminTable.css";

export default function GalleryPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getSettings("HOMEPAGE_HEADER_VIDEO_URL");
      if (data && data["HOMEPAGE_HEADER_VIDEO_URL"]) {
        setVideoUrl(data["HOMEPAGE_HEADER_VIDEO_URL"]);
      }
    } catch (error) {
      console.error("Error fetching video setting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 50 * 1024 * 1024) {
      alert("Video must be less than 50MB");
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleUploadAndSave = async () => {
    if (!file && !videoUrl) return;

    try {
      setSaving(true);
      let finalUrl = videoUrl;

      if (file) {
        setUploading(true);
        const uploadResult = await uploadService.uploadHomepageVideo(file);
        finalUrl = uploadResult.url;
        setVideoUrl(finalUrl);
        setUploading(false);
      }

      await adminSettingsService.updateSetting("HOMEPAGE_HEADER_VIDEO_URL", finalUrl);
      alert("Homepage Header Video saved successfully!");
      setFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save video. Please try again.");
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gallery & Media</h1>
      </div>

      <div style={{ maxWidth: "800px", background: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <PlayCircle size={20} />
          Homepage Header Video
        </h2>
        
        <p style={{ color: "#555", marginBottom: "24px", fontSize: "0.9rem" }}>
          Upload a high-quality video (MP4 or WebM, max 50MB) to be displayed on the public homepage hero section.
        </p>

        <div style={{ marginBottom: "24px" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
              <Loader2 className="animate-spin" style={{ margin: "0 auto", display: "block", marginBottom: "8px" }} />
              Loading video configuration...
            </div>
          ) : (previewUrl || videoUrl) ? (
            <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
              <video 
                src={previewUrl || videoUrl} 
                autoPlay 
                muted 
                loop 
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              {previewUrl && (
                <div style={{ position: "absolute", top: 12, right: 12, background: "var(--yellow)", color: "#000", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                  Preview (Not Saved)
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", background: "#f9f9f9", borderRadius: "8px", border: "1px dashed #ccc" }}>
              No video currently configured.
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <label className="cta-big cta-red" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", fontSize: "14px" }}>
            <UploadCloud size={18} />
            {file ? "Change File" : "Select Video"}
            <input 
              type="file" 
              accept="video/mp4,video/webm" 
              style={{ display: "none" }} 
              onChange={handleFileChange} 
            />
          </label>
          
          <button 
            onClick={handleUploadAndSave} 
            disabled={(!file && !videoUrl) || saving}
            className="cta-big cta-green"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", fontSize: "14px", opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {uploading ? "Uploading..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
