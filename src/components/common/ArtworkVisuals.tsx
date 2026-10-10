import React from 'react';

// Rich SVG & CSS visual composition for Slide 1 (EV Lifestyle & Fast Charging)
export const SlideArtworkEVLifestyle: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A1F18]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(16,185,129,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(6,45,36,0.9),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06241D] via-[#06241D]/60 to-transparent" />

      {/* Stylized Architectural Pavilion & Electric Vehicle Vector Silhouette */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B2B22" />
            <stop offset="50%" stopColor="#113F33" />
            <stop offset="100%" stopColor="#072019" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15332A" />
            <stop offset="100%" stopColor="#091A14" />
          </linearGradient>
          <linearGradient id="carBodyGrad" x1="600" y1="420" x2="1100" y2="580" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="35%" stopColor="#059669" />
            <stop offset="85%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="750" y1="430" x2="950" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Sky */}
        <rect width="1440" height="800" fill="url(#skyGrad)" opacity="0.6" />

        {/* Distant Hills / Mountain Contours */}
        <path d="M0 480 Q 320 380 720 440 T 1440 420 L 1440 800 L 0 800 Z" fill="#0D2E24" opacity="0.7" />
        <path d="M0 520 Q 420 450 900 510 T 1440 480 L 1440 800 L 0 800 Z" fill="#123B2E" opacity="0.6" />

        {/* Modern Canopy Structure */}
        <path d="M680 180 L1380 260 L1440 330 L740 240 Z" fill="#1A4A3C" opacity="0.8" />
        <line x1="740" y1="240" x2="740" y2="580" stroke="#235A4A" strokeWidth="6" />
        <line x1="1200" y1="280" x2="1200" y2="590" stroke="#235A4A" strokeWidth="6" />
        <line x1="680" y1="180" x2="1380" y2="260" stroke="#34D399" strokeWidth="2" strokeOpacity="0.8" />

        {/* Ground Deck with perspective grid */}
        <path d="M0 550 L1440 550 L1440 800 L0 800 Z" fill="url(#groundGrad)" />
        <line x1="0" y1="550" x2="1440" y2="550" stroke="#225343" strokeWidth="2" />
        <line x1="600" y1="550" x2="400" y2="800" stroke="#1D4336" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="800" y1="550" x2="720" y2="800" stroke="#1D4336" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="1050" y1="550" x2="1150" y2="800" stroke="#1D4336" strokeWidth="1" strokeDasharray="6 6" />

        {/* Modern Rapid Charging Stall */}
        <g transform="translate(680, 390)">
          <rect x="0" y="0" width="34" height="170" rx="6" fill="#15362C" stroke="#2A6653" strokeWidth="2" />
          <rect x="6" y="24" width="22" height="42" rx="3" fill="#031A14" />
          <line x1="10" y1="38" x2="24" y2="38" stroke="#10B981" strokeWidth="2" />
          <circle cx="17" cy="52" r="3" fill="#34D399" />
          {/* Subtle status glow */}
          <circle cx="17" cy="12" r="4" fill="#10B981" />
          {/* Cable */}
          <path d="M28 120 C 50 140 90 150 140 145" stroke="#34D399" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* Sleek Modern EV Silhouette */}
        <g transform="translate(720, 370)">
          {/* Shadow under car */}
          <ellipse cx="260" cy="205" rx="230" ry="22" fill="#04120D" opacity="0.9" />

          {/* Aerodynamic car body */}
          <path
            d="M50 190 C 80 180 120 180 140 170 C 180 145 230 110 320 105 C 380 102 430 115 460 145 C 475 160 485 175 490 190 C 495 198 480 202 460 200 C 430 200 420 175 390 175 C 360 175 350 200 210 200 C 190 200 180 175 150 175 C 120 175 110 200 70 200 Z"
            fill="url(#carBodyGrad)"
          />

          {/* Cabin Windshield & Windows */}
          <path
            d="M175 160 C 200 135 240 115 315 112 C 370 110 410 120 435 145 C 430 152 410 158 370 158 C 300 158 230 158 175 160 Z"
            fill="url(#glassGrad)"
          />

          {/* Character lines & Headlight / Taillight streaks */}
          <path d="M60 182 L120 172" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M440 160 L480 178" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

          {/* Wheels */}
          <circle cx="150" cy="190" r="28" fill="#0D1F19" stroke="#34D399" strokeWidth="2.5" />
          <circle cx="150" cy="190" r="16" fill="#1B3A30" />
          <circle cx="390" cy="190" r="28" fill="#0D1F19" stroke="#34D399" strokeWidth="2.5" />
          <circle cx="390" cy="190" r="16" fill="#1B3A30" />
        </g>

        {/* Ambient atmospheric particles */}
        <circle cx="1100" cy="320" r="120" fill="url(#hubGlow)" />
        <circle cx="320" cy="220" r="2" fill="#6EE7B7" opacity="0.5" />
        <circle cx="480" cy="180" r="3" fill="#6EE7B7" opacity="0.4" />
        <circle cx="880" cy="140" r="2" fill="#6EE7B7" opacity="0.6" />
      </svg>
    </div>
  );
};

// Rich SVG & CSS visual composition for Slide 2 (Sustainability, Forest, Deep Nature, Soil & Canopy)
export const SlideArtworkSustainability: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#07241A]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(16,185,129,0.25),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(5,150,105,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041B13] via-[#041B13]/65 to-transparent" />

      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="forestCanopy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B3828" />
            <stop offset="60%" stopColor="#0E4633" />
            <stop offset="100%" stopColor="#052117" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id="soilLayer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A2B" />
            <stop offset="40%" stopColor="#142B20" />
            <stop offset="100%" stopColor="#0A1812" />
          </linearGradient>
          <radialGradient id="sunbeam" cx="40%" cy="10%" r="60%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient forest light / sunbeams */}
        <polygon points="500,0 720,800 620,800 440,0" fill="url(#sunbeam)" opacity="0.4" />
        <polygon points="700,0 950,800 840,800 640,0" fill="url(#sunbeam)" opacity="0.35" />

        {/* Background Forest Layers */}
        <g opacity="0.6">
          <path d="M0 380 Q 240 280 480 340 T 960 310 T 1440 360 L 1440 800 L 0 800 Z" fill="#0A3224" />
          <path d="M0 450 Q 340 370 740 420 T 1440 410 L 1440 800 L 0 800 Z" fill="#0F3F2E" />
        </g>

        {/* Delicate Tree Silhouettes and Forest Canopy */}
        <g stroke="#134E3A" strokeWidth="5" strokeLinecap="round" opacity="0.7">
          <line x1="880" y1="700" x2="880" y2="280" />
          <line x1="880" y1="420" x2="980" y2="340" />
          <line x1="880" y1="480" x2="790" y2="400" />
          <line x1="1120" y1="720" x2="1120" y2="220" />
          <line x1="1120" y1="360" x2="1240" y2="290" />
          <line x1="1120" y1="440" x2="1030" y2="370" />
        </g>

        {/* Soil & Moss Rolling Foreground */}
        <path d="M0 580 Q 320 530 680 570 T 1440 540 L 1440 800 L 0 800 Z" fill="url(#soilLayer)" />

        {/* Stylized Botanical Leaf Motifs & Sprout Elements (clean organic curves) */}
        <g transform="translate(850, 420)" opacity="0.85">
          {/* Main Leaf */}
          <path
            d="M120 180 C 120 110 180 50 250 40 C 250 110 190 170 120 180 Z"
            fill="url(#leafGrad1)"
          />
          {/* Secondary Leaf */}
          <path
            d="M110 175 C 60 120 70 50 140 20 C 130 90 90 150 110 175 Z"
            fill="url(#leafGrad2)"
          />
          {/* Stem & vein */}
          <path d="M120 180 Q 180 110 250 40" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M115 178 Q 100 100 140 20" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Additional Fern/Foliage foreground accents */}
        <g transform="translate(1080, 520)" opacity="0.75">
          <path d="M0 120 Q 80 40 160 20 C 140 70 90 105 0 120 Z" fill="url(#leafGrad1)" />
          <path d="M20 115 Q 90 80 150 70 C 130 95 80 110 20 115 Z" fill="url(#leafGrad2)" />
        </g>

        {/* Subtle glowing energy dots representing clean closed-loop ecological cycle */}
        <circle cx="940" cy="460" r="3" fill="#6EE7B7" opacity="0.8" />
        <circle cx="1020" cy="410" r="2.5" fill="#A7F3D0" opacity="0.6" />
        <circle cx="780" cy="510" r="3.5" fill="#34D399" opacity="0.7" />
        <circle cx="1180" cy="490" r="2" fill="#6EE7B7" opacity="0.7" />
      </svg>
    </div>
  );
};

// Rich SVG & CSS visual composition for Slide 3 (EVConnect Network — Connected Cities, Digital Routes, Commuters)
// Explicit rule: "DO NOT show EVConnect-owned charging stations because EVConnect is not currently building charging infrastructure."
export const SlideArtworkNetwork: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#051A14]">
      {/* Dynamic network glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_45%,rgba(16,185,129,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_65%,rgba(5,150,105,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041510] via-[#041510]/65 to-transparent" />

      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="routeLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="nodeCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="1" />
            <stop offset="40%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Global Topology / Isometric City Route Lines */}
        <g stroke="#1A4A3C" strokeWidth="1.2" opacity="0.45">
          <line x1="100" y1="650" x2="550" y2="350" />
          <line x1="300" y1="720" x2="850" y2="320" />
          <line x1="600" y1="750" x2="1200" y2="300" />
          <line x1="900" y1="780" x2="1400" y2="400" />

          <line x1="200" y1="280" x2="1300" y2="650" />
          <line x1="350" y1="200" x2="1400" y2="550" />
        </g>

        {/* Active Connected Highway Vectors */}
        <path
          d="M 520 620 C 650 540, 780 460, 920 410 C 1050 360, 1180 340, 1340 330"
          stroke="url(#routeLineGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 680 720 C 760 620, 890 520, 980 430 C 1080 340, 1220 280, 1380 260"
          stroke="url(#routeLineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="8 6"
        />
        <path
          d="M 420 540 C 580 480, 750 430, 950 420 C 1120 410, 1260 460, 1420 480"
          stroke="#059669"
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Network Nodes (Cities, Mobility Hubs, Drivers) */}
        {/* Node A */}
        <circle cx="720" cy="530" r="28" fill="url(#nodeCoreGlow)" />
        <circle cx="720" cy="530" r="5" fill="#ECFDF5" />
        <circle cx="720" cy="530" r="14" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Node B */}
        <circle cx="920" cy="410" r="34" fill="url(#nodeCoreGlow)" />
        <circle cx="920" cy="410" r="7" fill="#FFFFFF" />
        <circle cx="920" cy="410" r="18" stroke="#34D399" strokeWidth="2" />
        <text x="940" y="405" fill="#A7F3D0" fontSize="12" fontFamily="sans-serif" fontWeight="600">
          Metropolitan Corridor
        </text>

        {/* Node C */}
        <circle cx="1120" cy="350" r="26" fill="url(#nodeCoreGlow)" />
        <circle cx="1120" cy="350" r="5" fill="#ECFDF5" />
        <circle cx="1120" cy="350" r="12" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Node D */}
        <circle cx="980" cy="510" r="22" fill="url(#nodeCoreGlow)" />
        <circle cx="980" cy="510" r="4.5" fill="#ECFDF5" />

        {/* Node E */}
        <circle cx="1280" cy="320" r="30" fill="url(#nodeCoreGlow)" />
        <circle cx="1280" cy="320" r="6" fill="#FFFFFF" />
        <text x="1300" y="315" fill="#A7F3D0" fontSize="12" fontFamily="sans-serif" fontWeight="600">
          Intercity Gateway
        </text>

        {/* Connected Interlink arcs */}
        <line x1="720" y1="530" x2="920" y2="410" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
        <line x1="920" y1="410" x2="1120" y2="350" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
        <line x1="1120" y1="350" x2="1280" y2="320" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
        <line x1="920" y1="410" x2="980" y2="510" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />

        {/* Floating Data Pulses */}
        <circle cx="820" cy="470" r="3" fill="#6EE7B7" />
        <circle cx="1020" cy="380" r="3" fill="#6EE7B7" />
        <circle cx="1200" cy="335" r="3" fill="#6EE7B7" />
      </svg>
    </div>
  );
};
