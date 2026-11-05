import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Smartphone, Heart, Hospital, BookOpen, Users, NotebookPen, ArrowRight } from 'lucide-react';
import { PHOTOS } from '../data/photos';

// 広告用のLP（旧 kura-mikke.com のデザインを、いまのサイト向けに組み直したもの）。
// どこからもリンクしない「隠しページ」。URL：/lp/kuramikke 。検索エンジンには載せない（noindex）。サイトマップにも入れない。
// 文章は、旧ページの文章をもとに、いまの機能に合わせて直した下書き。広告に使う前に、代表が確認する。
const useLpHead = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'クラミッケ｜大人が活き活きと毎日を過ごすための情報を配信';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap';
    document.head.append(robots, font);
    return () => { document.title = prevTitle; robots.remove(); font.remove(); };
  }, []);
};

const mincho = { fontFamily: '"Sawarabi Mincho", serif' };

const SOCIETY = [
  { Icon: HeartHandshake, title: '気軽につながれる社会', text: '人と人が、積極的につながれる場所をご提供します。' },
  { Icon: ShieldCheck, title: '安心・安全な社会', text: '便利な世の中になった反面、あやしい情報も身近に迫っています。正しく信頼できる情報を、お届けします。' },
  { Icon: Smartphone, title: 'だれもがスマホに親しめる社会', text: 'どの世代の方も、スマートフォンやパソコンに、抵抗なく触れられる社会をめざします。' },
];

const FEATURES = [
  { Icon: Hospital, img: PHOTOS['column:family-doctor'], title: '病院や介護施設の情報', text: '全国の病院・診療所や、老人ホーム・介護施設を、地域や駅名、現在地から近い順などで、ひとつのサイトで比べられます。', to: '/search', label: '病院・介護施設を探す' },
  { Icon: BookOpen, img: PHOTOS['column:smartphone-photo'], title: 'お役立ち情報のコラム', text: '暮らしに役立つ情報から、将来にそなえるための情報まで。正しく信頼できる形で、やさしくお届けします。', to: '/column', label: 'コラムを読む' },
  { Icon: Users, img: PHOTOS['column:first-step-friends'], title: 'コミュニティ・イベント情報', text: '同じ趣味や思いの仲間と、気軽につながれる場をめざしています。（準備中）' },
  { Icon: NotebookPen, img: PHOTOS['guide:ending-note'], title: '終活のサポート', text: 'これまでの思い出や人生観、資産の引き継ぎ、これからへの準備。ご自身の1冊の本をつくるようなイメージで、エンディングノートを書けます。', to: '/shukatsu', label: '終活サポートを見る' },
];

const Btn = ({ to, children, light = false }) => (
  <Link to={to} className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-full font-bold tracking-[0.08em] transition ${light ? 'border-2 border-white text-white hover:bg-white/10' : 'bg-[#83D3C9] text-[#1f3a37] hover:brightness-105'}`}>
    {children}<ArrowRight size={18} aria-hidden="true" />
  </Link>
);

export const LpPage = () => {
  useLpHead();
  return (
    <div className="bg-[#ECECEC] text-[#4C4C4C]" style={mincho}>
      {/* ヘッダー */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 text-white">
        <p className="text-[0.95rem] md:text-[1.05rem]"><span className="font-bold">クラミッケ</span><span className="hidden sm:inline">｜シニア向け情報配信メディア</span></p>
        <nav className="flex items-center gap-3 text-[0.85rem]">
          <Link to="/company" className="hidden sm:inline hover:underline">運営会社</Link>
          <Link to="/contact" className="px-4 py-2 rounded-full bg-[#83D3C9] text-[#1f3a37] font-bold whitespace-nowrap">お問い合わせ</Link>
        </nav>
      </header>

      {/* バナー */}
      <section className="relative min-h-[88vh] flex items-center justify-center text-center text-white px-4 py-28 bg-[#2E3842] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(46,56,66,.72), rgba(46,56,66,.72)), url(${PHOTOS['page:/about']})` }}>
        <div className="max-w-[720px]">
          <h1 className="inline-block border-y-2 border-white/70 px-6 py-3 text-[2.2rem] md:text-[3.2rem] tracking-[0.25em] mb-6">クラミッケ</h1>
          <p className="text-[1.15rem] md:text-[1.35rem] font-bold leading-relaxed mb-5">豊かな暮らし情報ミッケ！<br />大人が活き活きと毎日を過ごせる社会を</p>
          <p className="text-[0.95rem] md:text-[1.05rem] leading-loose mb-10">「クラミッケ」は、病院・介護施設さがしや、生活のお役に立つ情報を、<br className="hidden md:block" />ワンストップで得られるサービスです。<br className="hidden md:block" />スマートフォンやパソコンを、気軽に使えるようになるためのサポートも考えています。</p>
          <Btn to="/">クラミッケを見てみる</Btn>
        </div>
      </section>

      <main className="max-w-[1100px] mx-auto px-4 -mt-16 relative pb-16 space-y-10">
        {/* リード */}
        <section className="bg-white rounded-2xl px-6 md:px-14 py-12 text-center shadow-sm">
          <Heart className="mx-auto mb-4 text-[#83D3C9]" size={40} aria-hidden="true" />
          <h2 className="text-[1.4rem] md:text-[1.9rem] leading-snug mb-5">シニア層が積極的に<strong className="text-[#3E8F86]">人生を楽しむ</strong>時代が来た</h2>
          <p className="leading-loose">正しい情報を自分で判断して、取捨選択しなければならない<strong>「オール情報化時代」</strong>が来ています。<br className="hidden md:block" />私たちは、大人が元気に過ごすためのお役立ち情報を、正しく信頼できる形でお届けします。</p>
        </section>

        {/* ワンストップ */}
        <section className="bg-[#2E3842] text-white rounded-2xl px-6 md:px-14 py-12 grid md:grid-cols-[2fr_1fr] gap-8 items-center">
          <div>
            <h2 className="text-[1.3rem] md:text-[1.7rem] leading-snug mb-4">欲しいサービスに<strong className="text-[#83D3C9]">ワンストップ</strong>で手が届くサービスを目指します。</h2>
            <p className="leading-loose text-white/90">身近な施設情報（病院・介護施設など）、コラムからの情報提供、コミュニティづくりの情報、終活のサポートを、ひとつの場所でご提供します。</p>
          </div>
          <ul className="grid grid-cols-3 gap-3 text-[#83D3C9]" aria-hidden="true">
            {[Hospital, BookOpen, Users, NotebookPen, Smartphone, HeartHandshake].map((I, i) => <li key={i} className="aspect-square rounded-full border-2 border-[#83D3C9]/60 grid place-items-center"><I size={28} /></li>)}
          </ul>
        </section>

        {/* めざす社会 */}
        <section className="bg-white rounded-2xl px-6 md:px-14 py-12 text-center">
          <h2 className="text-[1.4rem] md:text-[1.8rem] mb-10">クラミッケ<strong className="text-[#3E8F86]">の目指す社会</strong></h2>
          <ul className="grid gap-8 md:grid-cols-3">
            {SOCIETY.map(({ Icon, title, text }) => (
              <li key={title}>
                <span className="mx-auto mb-4 grid place-items-center w-16 h-16 rounded-full bg-[#83D3C9] text-white"><Icon size={30} aria-hidden="true" /></span>
                <h3 className="text-[1.1rem] font-bold mb-2">{title}</h3>
                <p className="text-[0.95rem] leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* できること */}
        <section className="bg-white rounded-2xl px-6 md:px-14 py-12">
          <h2 className="text-center text-[1.4rem] md:text-[1.8rem] mb-10"><strong className="text-[#3E8F86]">クラミッケ</strong>でできること</h2>
          <ul className="grid gap-10 md:grid-cols-2">
            {FEATURES.map(({ Icon, img, title, text, to, label }) => (
              <li key={title}>
                {img && <img src={img} alt="" loading="lazy" className="w-full aspect-[16/9] object-cover rounded-xl mb-4" />}
                <h3 className="flex items-center gap-2 text-[1.15rem] font-bold mb-2"><Icon size={22} className="text-[#3E8F86]" aria-hidden="true" />{title}</h3>
                <p className="leading-relaxed mb-4">{text}</p>
                {to && <Link to={to} className="inline-flex items-center gap-1 text-[#3E8F86] font-bold underline underline-offset-4">{label}<ArrowRight size={16} aria-hidden="true" /></Link>}
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* CTA */}
      <section className="bg-[#2E3842] text-white text-center px-4 py-16">
        <h2 className="text-[1.4rem] md:text-[1.8rem] mb-3">お気軽に<strong className="text-[#83D3C9]">お問い合わせ</strong>ください。</h2>
        <p className="mb-8 text-white/90">クラミッケのサービスについて、どのようなことでも、丁寧にご対応いたします。</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Btn to="/contact">お問い合わせ</Btn>
          <Btn to="/company" light>運営会社</Btn>
        </div>
      </section>
      <footer className="bg-[#232B33] text-white/70 text-center text-[0.8rem] py-6">© Happiino LLC.</footer>
    </div>
  );
};
