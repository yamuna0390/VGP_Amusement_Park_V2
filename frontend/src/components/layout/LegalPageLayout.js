export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'calc(70px + clamp(18px, 3vw, 32px))' }}>
      <div className="max-w-[1100px] mx-auto w-full">
        {/* Page Title Area */}
        <div className="text-center sm:text-left pl-0 sm:pl-2" style={{ marginBottom: 'clamp(24px, 4vw, 48px)' }}>
          <h1 
            className="text-[28px] sm:text-[32px] lg:text-[40px] font-black uppercase tracking-wide text-[#2e1065]"
            style={{ fontFamily: "var(--font-roboto-condensed), sans-serif", lineHeight: 1.2 }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-3 text-[#475569] font-medium text-[15px] sm:text-[16px]">
              Last Updated: {lastUpdated}
            </p>
          )}
        </div>
        
        {/* Legal Content Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e2e8f0] p-6 sm:p-10 lg:p-16">
          <div 
            className="
              max-w-none 
              text-[#334155] 
              text-[15px] sm:text-[16px] lg:text-[17px]
              leading-[1.7] sm:leading-[1.8]
              [&_h2]:text-[#1e293b] [&_h2]:font-bold [&_h2]:text-[20px] sm:[&_h2]:text-[24px] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-[#f1f5f9]
              first:[&_h2]:mt-0
              [&_p]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-6 [&_ol]:space-y-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-6 [&_ul]:space-y-3
              [&_li]:pl-2
            "
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
