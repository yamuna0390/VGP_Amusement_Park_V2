"use client";
import ScrollBanner from "@/components/ui/ScrollBanner";

export default function Group() {
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
            <div className="card"><div className="card-media bg-yellow">🎒</div><div className="card-body"><span className="tag">Schools</span><h3>School Day-Long Recess</h3><p>Planning to give the kids a daylong recess? Special school packages with meals, ride access & event coordinators.</p></div></div>
            <div className="card"><div className="card-media bg-blue">🏢</div><div className="card-body"><span className="tag">Corporate</span><h3>Corporate Outings</h3><p>Team days on the beach, banquet spaces & group ride passes for your whole office.</p></div></div>
            <div className="card"><div className="card-media bg-purple">🎓</div><div className="card-body"><span className="tag">Colleges</span><h3>College Groups</h3><p>Show your college ID and unlock special group rates. Our event coordinators plan it end-to-end.</p></div></div>
          </div>
          <div className="panel" style={{ marginTop: "36px" }}>
            <h3>📋 Get a Group Quote</h3>
            <div className="two-col">
              <div className="field"><label>Organisation Name</label><input placeholder="e.g. St. Mary's School" /></div>
              <div className="field"><label>Group Size</label><input type="number" placeholder="e.g. 60" /></div>
              <div className="field"><label>Preferred Date</label><input type="date" /></div>
              <div className="field"><label>Contact Number</label><input placeholder="+91" /></div>
            </div>
            <button className="cta-big cta-red" onClick={() => alert("Quote request sent! Our team will contact you shortly.")}>Request Quote</button>
          </div>
        </div>
      </section>
    </div>
  );
}
