"use client";
import { useState } from "react";
import ScrollBanner from "@/components/ui/ScrollBanner";
import { API_BASE_URL } from "@/constants/api";

export default function Group() {
  const [organisationName, setOrganisationName] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    // Frontend Validation
    if (!organisationName.trim() || organisationName.trim().length < 2 || organisationName.trim().length > 150) {
      setError("Organisation Name must be between 2 and 150 characters.");
      return;
    }

    if (!groupSize || isNaN(groupSize)) {
      setError("Group Size must be a valid number.");
      return;
    }

    const size = parseInt(groupSize, 10);
    if (size < 1 || size > 10000) {
      setError("Group Size must be between 1 and 10000.");
      return;
    }

    if (!preferredDate) {
      setError("Preferred Date is required.");
      return;
    }

    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Preferred Date cannot be in the past.");
      return;
    }

    if (!contactNumber.trim() || !/^[6-9]\d{9}$/.test(contactNumber.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    // Submission
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/group-quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organisationName: organisationName.trim(),
          groupSize: size,
          preferredDate,
          contactNumber: contactNumber.trim(),
          email: email.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err.message ||
        "We couldn't submit your request right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page show" id="page-group">
      <section>
        <div className="wrap">
          <div className="section-head">
            <ScrollBanner title="Group Visits" subtitle="From school to kingdom" colorClass="sb-scroll" />
          </div>
          <div className="group-banner-wrapper">
            <img src="/images/groupbanner.png" alt="Group Visits Banner" className="group-banner-img" />
          </div>
          <div className="grid g3">
            <div className="card"><div className="card-media bg-yellow"><img src="/images/school_group.png" alt="School Day Events" className="group-card-img" /></div><div className="card-body"><span className="tag">Schools</span><h3>School Day Events</h3><p>Planning to give the kids a daylong recess? Special school packages with meals, ride access & event coordinators.</p></div></div>
            <div className="card"><div className="card-media bg-blue"><img src="/images/corporate_group.png" alt="Corporate Get-Together" className="group-card-img" /></div><div className="card-body"><span className="tag">Corporate</span><h3>Corporate Get-Together</h3><p>Team days on the beach, banquet spaces & group ride passes for your whole office.</p></div></div>
            <div className="card"><div className="card-media bg-purple"><img src="/images/college_group.png" alt="College Group Outing" className="group-card-img" /></div><div className="card-body"><span className="tag">Colleges</span><h3>College Group Outing</h3><p>Show your college ID and unlock special group rates. Our event coordinators plan it end-to-end.</p></div></div>
          </div>
          <div className="panel" style={{ marginTop: "36px" }}>
            <h3>📋 Get a Group Quote</h3>
            
            {success ? (
              <div style={{ padding: "20px", background: "#f0fdf4", color: "#166534", borderRadius: "8px", border: "1px solid #bbf7d0", marginTop: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>Request Received!</h4>
                <p style={{ margin: 0, lineHeight: "1.5" }}>
                  Thank you for your group booking enquiry.<br/>
                  Our team will contact you shortly via WhatsApp or email.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div style={{ color: "#dc2626", marginBottom: "16px", fontSize: "0.95rem", fontWeight: "500" }}>
                    {error}
                  </div>
                )}
                <div className="two-col">
                  <div className="field">
                    <label>Organisation Name *</label>
                    <input 
                      placeholder="e.g. St. Mary's School" 
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                      disabled={isSubmitting}
                      required
                      minLength={2}
                      maxLength={150}
                    />
                  </div>
                  <div className="field">
                    <label>Group Size *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 60" 
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      disabled={isSubmitting}
                      required
                      min={1}
                      max={10000}
                    />
                  </div>
                  <div className="field">
                    <label>Preferred Date *</label>
                    <input 
                      type="date" 
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Contact Number *</label>
                    <input 
                      placeholder="+91" 
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      disabled={isSubmitting}
                      required
                      pattern="^[6-9]\d{9}$"
                      maxLength={10}
                      title="Enter a valid 10-digit Indian mobile number"
                    />
                  </div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label>Email Address (Optional)</label>
                    <input 
                      type="email"
                      placeholder="contact@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      maxLength={150}
                    />
                  </div>
                </div>
                <button 
                  className="cta-big cta-red" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: "16px" }}
                >
                  {isSubmitting ? "SUBMITTING..." : "REQUEST QUOTE"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
