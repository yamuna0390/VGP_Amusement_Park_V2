import React from "react";
import { CheckCircle, AlertTriangle, ShieldCheck, HeartHandshake } from "lucide-react";
import "./RideSafety.css";

export default function RideSafety({ safetyRules }) {
  const rules = safetyRules && safetyRules.length > 0
    ? safetyRules
    : [
        "Minimum height 90 cm required.",
        "Children must be accompanied by an adult.",
        "Pregnant guests should avoid this ride.",
        "Secure all loose belongings prior to boarding.",
        "Remain seated with safety restraint fastened until ride stops."
      ];

  return (
    <div className="ride-safety-card">
      <div className="ride-safety-card-header">
        <div className="safety-title-group">
          <ShieldCheck className="safety-header-icon" size={26} />
          <h3 className="ride-safety-card-title">Safety Guidelines</h3>
        </div>
        <span className="safety-badge">Required</span>
      </div>

      <p className="safety-intro-text">
        Your safety is our top priority. Please review and adhere to all safety guidelines before joining the queue.
      </p>

      <ul className="safety-rules-list">
        {rules.map((rule, idx) => {
          const isWarning = rule.toLowerCase().includes("avoid") || rule.toLowerCase().includes("pregnant") || rule.toLowerCase().includes("heart");
          return (
            <li key={idx} className={`safety-rule-item ${isWarning ? "warning" : "standard"}`}>
              <div className="safety-icon-wrapper">
                {isWarning ? (
                  <AlertTriangle className="safety-icon warning" size={20} />
                ) : (
                  <CheckCircle className="safety-icon check" size={20} />
                )}
              </div>
              <span className="safety-rule-text">{rule}</span>
            </li>
          );
        })}
      </ul>

      <div className="safety-footer-box">
        <HeartHandshake size={20} className="safety-footer-icon" />
        <span>For special assistance or queries, please speak to a ride operator on site.</span>
      </div>
    </div>
  );
}
