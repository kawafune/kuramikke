import React from 'react';

// 写真が揃うまでの仮イラスト（開発中のみ）。配色は docs/design/spec.md 3章に揃えたフラットな絵柄。
// 本物の写真に差し替えるときは、data/dummy.js の `image` に画像URLを入れる（PhotoPlaceholder が優先して表示する）。
const C = {
  cream: '#F7F3E0', creamDeep: '#F0E7C1', gold: '#CCAD30', goldDeep: '#8A6D0B',
  red: '#E44D32', pink: '#FF9286', teal: '#70BDB5', blue: '#99CDF5', green: '#7DB54A',
  orange: '#FFA100', brown: '#B07A4F', brownDark: '#8A5A33', ink: '#4C4C4C', white: '#FFFFFF',
};

const Sky = ({ fill }) => <rect width="400" height="300" fill={fill} />;
const Table = ({ y = 220, fill = C.brown }) => <rect x="0" y={y} width="400" height={300 - y} fill={fill} />;

const ART = {
  // --- コラム ---
  note: (
    <>
      <Sky fill={C.creamDeep} />
      <Table y={190} fill={C.brown} />
      <g transform="rotate(-6 200 170)">
        <rect x="95" y="70" width="210" height="150" rx="6" fill={C.white} />
        <rect x="95" y="70" width="18" height="150" rx="6" fill={C.gold} />
        {[100, 120, 140, 160, 180].map((y) => <line key={y} x1="130" y1={y} x2="285" y2={y} stroke={C.creamDeep} strokeWidth="3" />)}
        <rect x="130" y="92" width="90" height="8" rx="4" fill={C.gold} />
      </g>
      <g transform="rotate(28 290 190)">
        <rect x="250" y="182" width="110" height="10" rx="5" fill={C.ink} />
        <polygon points="250,182 236,187 250,192" fill={C.ink} />
        <rect x="320" y="182" width="12" height="10" fill={C.gold} />
      </g>
      <g fill="none" stroke={C.goldDeep} strokeWidth="5">
        <circle cx="70" cy="235" r="20" /><circle cx="122" cy="235" r="20" /><path d="M90 232 Q96 224 102 232" />
      </g>
    </>
  ),
  flower: (
    <>
      <Sky fill="#E6F1EA" />
      <Table y={235} fill="#D9D2C5" />
      <g stroke={C.green} strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M200 215 Q190 150 150 100" /><path d="M200 215 Q205 140 210 80" /><path d="M200 215 Q215 150 262 105" />
      </g>
      {[[150, 100], [210, 80], [262, 105]].map(([x, y], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - 16} rx="10" ry="16" fill={i === 1 ? C.pink : '#FFC4BC'} transform={`rotate(${a} ${x} ${y})`} />)}
          <circle cx={x} cy={y} r="8" fill={C.gold} />
        </g>
      ))}
      <ellipse cx="170" cy="160" rx="22" ry="9" fill={C.green} transform="rotate(-30 170 160)" />
      <ellipse cx="238" cy="150" rx="22" ry="9" fill={C.green} transform="rotate(30 238 150)" />
      <path d="M170 170 L230 170 L222 238 Q200 246 178 238 Z" fill={C.blue} opacity=".7" />
      <path d="M176 205 L224 205 L222 238 Q200 246 178 238 Z" fill={C.blue} opacity=".6" />
    </>
  ),
  bento: (
    <>
      <Sky fill="#F7E8D0" />
      <Table y={0} fill="#F7E8D0" />
      <ellipse cx="200" cy="160" rx="150" ry="95" fill={C.brown} />
      <ellipse cx="200" cy="155" rx="132" ry="80" fill={C.brownDark} />
      <ellipse cx="200" cy="152" rx="125" ry="74" fill="#F4D9A8" />
      <path d="M85 150 Q200 90 315 150 Q200 230 85 150Z" fill={C.white} opacity=".95" />
      <ellipse cx="140" cy="140" rx="30" ry="22" fill={C.orange} /><ellipse cx="140" cy="140" rx="18" ry="12" fill="#FFD36B" />
      {[[210, 118], [236, 128], [258, 118], [225, 105]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="14" fill={C.green} />)}
      <rect x="170" y="165" width="70" height="26" rx="8" fill={C.red} />
      <circle cx="268" cy="170" r="12" fill="#FFE08A" /><circle cx="285" cy="158" r="9" fill="#FFE08A" />
      <circle cx="300" cy="136" r="6" fill={C.pink} />
    </>
  ),
  money: (
    <>
      <Sky fill={C.creamDeep} />
      <rect x="70" y="95" width="260" height="150" rx="22" fill={C.goldDeep} />
      <rect x="70" y="80" width="260" height="60" rx="18" fill={C.gold} />
      <rect x="260" y="150" width="90" height="50" rx="22" fill={C.gold} />
      <circle cx="290" cy="175" r="9" fill={C.white} />
      {[[130, 55], [185, 40], [240, 58]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="26" fill={C.gold} stroke={C.goldDeep} strokeWidth="5" />
          <text x={x} y={y + 9} textAnchor="middle" fontSize="26" fontWeight="700" fill={C.goldDeep}>¥</text></g>
      ))}
    </>
  ),
  hobby: (
    <>
      <Sky fill="#EFE9F7" />
      <path d="M90 150 Q70 60 190 60 Q330 60 330 150 Q330 235 240 235 Q215 235 225 200 Q235 170 190 175 Q140 185 120 215 Q95 235 90 150Z" fill="#E9C48C" />
      {[[140, 105, C.red], [185, 90, C.orange], [235, 92, C.green], [283, 115, C.blue], [270, 165, '#A39FFF']].map(([x, y, f], i) => <circle key={i} cx={x} cy={y} r="17" fill={f} />)}
      <circle cx="165" cy="150" r="12" fill="#EFE9F7" />
      <g transform="rotate(35 300 230)">
        <rect x="255" y="222" width="110" height="12" rx="6" fill={C.brownDark} />
        <rect x="235" y="219" width="30" height="18" rx="4" fill={C.ink} />
        <path d="M235 219 Q205 228 235 237Z" fill={C.red} />
      </g>
    </>
  ),

  // --- イベント ---
  seminar: (
    <>
      <Sky fill="#E6F1F8" />
      <rect x="0" y="240" width="400" height="60" fill="#C9DDE9" />
      <rect x="85" y="35" width="230" height="130" rx="6" fill={C.white} stroke={C.gold} strokeWidth="6" />
      {[65, 90, 115].map((y, i) => <rect key={y} x="110" y={y} width={150 - i * 25} height="9" rx="4" fill={i === 0 ? C.gold : C.creamDeep} />)}
      <circle cx="330" cy="150" r="22" fill="#F3C9A0" /><rect x="306" y="172" width="48" height="70" rx="16" fill={C.goldDeep} />
      {[[90, 240], [165, 246], [240, 240]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="22" fill="#F3C9A0" /><path d={`M${x - 34} 300 Q${x} 224 ${x + 34} 300Z`} fill={[C.teal, C.pink, C.blue][i]} /></g>
      ))}
    </>
  ),
  sakura: (
    <>
      <Sky fill="#DDEFFA" />
      <path d="M-10 60 Q120 90 190 150 T410 120" fill="none" stroke={C.brownDark} strokeWidth="14" strokeLinecap="round" />
      <path d="M190 150 Q160 220 120 250" fill="none" stroke={C.brownDark} strokeWidth="8" strokeLinecap="round" />
      {[[50, 70], [100, 90], [150, 120], [200, 150], [250, 150], [310, 135], [360, 120], [130, 215], [175, 190], [85, 50], [280, 118], [335, 95]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="22" fill="#FFC4D2" /><circle cx={x - 12} cy={y + 8} r="14" fill="#FFB0C4" /><circle cx={x + 10} cy={y - 8} r="12" fill="#FFD9E2" /></g>
      ))}
      {[[60, 200], [330, 210], [300, 260], [100, 270]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#FFC4D2" transform={`rotate(${i * 40} ${x} ${y})`} />)}
    </>
  ),
  dining: (
    <>
      <Sky fill="#FFF0D9" />
      <ellipse cx="200" cy="215" rx="190" ry="60" fill="#F0DDBD" />
      <ellipse cx="200" cy="205" rx="170" ry="50" fill={C.white} />
      {[[120, 205, C.red], [200, 195, C.green], [280, 205, C.orange]].map(([x, y, f], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx="42" ry="20" fill={C.creamDeep} /><ellipse cx={x} cy={y - 4} rx="26" ry="11" fill={f} /></g>
      ))}
      {[[110, 120], [200, 105], [290, 120]].map(([x, y], i) => (
        <g key={i}><path d={`M${x - 20} ${y - 40} L${x + 20} ${y - 40} L${x + 14} ${y + 20} L${x - 14} ${y + 20}Z`} fill={C.blue} opacity=".6" />
          <rect x={x - 3} y={y + 20} width="6" height="22" fill={C.blue} /><rect x={x - 18} y={y + 40} width="36" height="6" rx="3" fill={C.blue} />
          <path d={`M${x - 17} ${y - 10} L${x + 17} ${y - 10} L${x + 14} ${y + 20} L${x - 14} ${y + 20}Z`} fill={[C.red, C.orange, C.pink][i]} opacity=".85" /></g>
      ))}
    </>
  ),
  camera: (
    <>
      <Sky fill="#E6F1F8" />
      <rect x="70" y="95" width="260" height="155" rx="22" fill={C.ink} />
      <rect x="95" y="68" width="70" height="40" rx="10" fill="#6B6B6B" />
      <rect x="270" y="75" width="38" height="24" rx="6" fill={C.red} />
      <circle cx="200" cy="172" r="62" fill="#D9D9D9" /><circle cx="200" cy="172" r="48" fill="#6B6B6B" />
      <circle cx="200" cy="172" r="34" fill="#2F3B4A" /><circle cx="186" cy="158" r="9" fill="#8EA6BD" />
      <rect x="90" y="115" width="38" height="14" rx="4" fill={C.gold} />
    </>
  ),
  pottery: (
    <>
      <Sky fill={C.creamDeep} />
      <rect x="0" y="235" width="400" height="65" fill="#D9C79A" />
      <rect x="120" y="215" width="160" height="30" rx="8" fill={C.brownDark} />
      <rect x="185" y="240" width="30" height="40" fill="#6B4A2A" />
      <ellipse cx="200" cy="215" rx="90" ry="16" fill={C.brown} />
      <path d="M150 215 Q135 130 170 90 L230 90 Q265 130 250 215 Q200 232 150 215Z" fill="#E3A978" />
      <ellipse cx="200" cy="90" rx="30" ry="9" fill="#C98E5A" />
      <path d="M160 140 Q200 155 244 140" fill="none" stroke="#C98E5A" strokeWidth="4" />
      <path d="M156 170 Q200 185 248 170" fill="none" stroke="#C98E5A" strokeWidth="4" />
      <ellipse cx="108" cy="170" rx="20" ry="24" fill="#F3C9A0" /><ellipse cx="292" cy="170" rx="20" ry="24" fill="#F3C9A0" />
    </>
  ),
  cooking: (
    <>
      <Sky fill="#FDE9E3" />
      <rect x="0" y="235" width="400" height="65" fill="#E8C9BD" />
      <path d="M150 120 Q145 175 165 215 L235 215 Q255 175 250 120Z" fill="#9AA3AB" />
      <rect x="135" y="112" width="130" height="16" rx="8" fill="#6B747C" />
      <rect x="255" y="118" width="70" height="10" rx="5" fill={C.brownDark} />
      {[175, 200, 225].map((x) => <path key={x} d={`M${x} 95 Q${x - 14} 70 ${x} 50 Q${x + 14} 30 ${x} 12`} fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" opacity=".9" />)}
      <rect x="150" y="215" width="100" height="12" rx="6" fill={C.red} />
      <g><ellipse cx="80" cy="190" rx="38" ry="32" fill={C.white} /><circle cx="55" cy="170" r="22" fill={C.white} /><circle cx="105" cy="168" r="22" fill={C.white} /><circle cx="80" cy="160" r="26" fill={C.white} /><rect x="48" y="200" width="64" height="28" fill={C.white} /></g>
    </>
  ),
  boat: (
    <>
      <Sky fill="#DDEFFA" />
      <rect x="0" y="170" width="400" height="130" fill="#8CC9C4" />
      {[200, 230, 260, 285].map((y, i) => <path key={y} d={`M${-10 + i * 40} ${y} Q${30 + i * 40} ${y - 10} ${70 + i * 40} ${y} T${150 + i * 40} ${y} T${230 + i * 40} ${y} T${310 + i * 40} ${y} T${390 + i * 40} ${y}`} fill="none" stroke="#B9E1DD" strokeWidth="4" />)}
      {[40, 340].map((x) => (
        <g key={x}><rect x={x - 5} y="90" width="10" height="90" fill={C.brownDark} />
          {[-34, -17, 0, 17, 34].map((d) => <path key={d} d={`M${x} 95 Q${x + d * 1.6} 140 ${x + d} 205`} fill="none" stroke={C.green} strokeWidth="9" strokeLinecap="round" />)}</g>
      ))}
      <path d="M120 215 L280 215 L255 250 L145 250Z" fill={C.brownDark} />
      <circle cx="200" cy="170" r="16" fill="#F3C9A0" /><rect x="186" y="184" width="28" height="32" rx="10" fill={C.goldDeep} />
      <rect x="260" y="150" width="6" height="100" fill={C.ink} transform="rotate(20 263 200)" />
    </>
  ),
  beer: (
    <>
      <Sky fill="#FFF0D9" />
      {[[110, -8], [250, 8]].map(([x, r], i) => (
        <g key={i} transform={`rotate(${r} ${x + 40} 170)`}>
          <path d={`M${x} 90 L${x + 80} 90 L${x + 72} 245 Q${x + 40} 255 ${x + 8} 245Z`} fill={C.orange} />
          <path d={`M${x} 90 L${x + 80} 90 L${x + 78} 120 L${x + 2} 120Z`} fill={C.white} />
          <circle cx={x + 18} cy="88" r="16" fill={C.white} /><circle cx={x + 45} cy="80" r="20" fill={C.white} /><circle cx={x + 68} cy="90" r="14" fill={C.white} />
          <path d={`M${x + 80} 125 Q${x + 120} 125 ${x + 118} 170 Q${x + 116} 205 ${x + 76} 205`} fill="none" stroke={C.goldDeep} strokeWidth="12" strokeLinecap="round" />
          <rect x={x + 14} y="140" width="8" height="80" rx="4" fill="#FFD36B" />
        </g>
      ))}
      {[[200, 70], [160, 40], [240, 45], [205, 20]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={C.gold} />)}
    </>
  ),
};

export const Illustration = ({ name, className = '' }) => (
  <svg viewBox="0 0 400 300" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    {ART[name] ?? <Sky fill={C.cream} />}
  </svg>
);
