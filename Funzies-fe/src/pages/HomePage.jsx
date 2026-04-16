import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHeart, FiShoppingCart } from "react-icons/fi";
import { GiArcTriomphe } from "react-icons/gi";
import { SiPlaystation, SiSteam } from "react-icons/si";
import { FaXbox } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import AppLayout from "../components/AppLayout";
import { textStyles } from "../theme/typography";
import { useTheme } from "../theme/themeContext";
import { activeProducts, frontBannerImage, frontHeroImage, frontProductImage, price, resolveAssetPath } from "../lib/storeData";

const heroSlides = [
  { src: frontHeroImage, alt: "Featured collectibles banner" },
  { src: frontBannerImage, alt: "Gaming channel banner" },
];

function FrontProductCard({ product }) {
  const { colors } = useTheme();
  const productImage = resolveAssetPath(product.Image) || frontProductImage;
  return (
    <article className="hover-lift rounded-lg p-3 shadow" style={{ backgroundColor: colors.background }}>
      <Link to={`/product-page/${product.ID}`}>
        <img src={productImage} alt={product.Name} className="h-40 w-full rounded object-cover" loading="lazy" />
      </Link>
      <div className="mt-3 space-y-2">
        <Link to={`/product-page/${product.ID}`}><p className="line-clamp-1 text-[13px]" style={{ color: colors.text }}>{product.Name.trim()}</p></Link>
        <p className="text-lg font-semibold" style={{ color: colors.primary }}>{price.format(product.Price)}</p>
        <div className="flex items-center gap-2">
          <button type="button" className="hover-accent h-9 flex-1 rounded px-3 text-sm font-semibold text-white" style={{ backgroundColor: colors.success }}>
            <span className="inline-flex items-center gap-1"><FiShoppingCart size={14} />Add to Cart</span>
          </button>
          <button type="button" className="hover-icon h-9 w-9 rounded text-white" style={{ backgroundColor: colors.primary }} aria-label="Add to wishlist">
            <span className="inline-flex items-center justify-center"><FiHeart size={16} /></span>
          </button>
        </div>
      </div>
    </article>
  );
}

function HeroCarousel({ colors }) {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 4500);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className="relative overflow-hidden rounded-lg shadow" style={{ backgroundColor: colors.panel }}>
      <img src={heroSlides[activeSlide].src} alt={heroSlides[activeSlide].alt} className="h-[180px] w-full object-cover md:h-[220px] lg:h-[280px]" />
      <button type="button" onClick={() => setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)} className="hover-icon absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2" style={{ backgroundColor: "rgba(0,0,0,0.42)", color: "#fff" }} aria-label="Previous slide"><FiChevronLeft size={18} /></button>
      <button type="button" onClick={() => setActiveSlide((current) => (current + 1) % heroSlides.length)} className="hover-icon absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2" style={{ backgroundColor: "rgba(0,0,0,0.42)", color: "#fff" }} aria-label="Next slide"><FiChevronRight size={18} /></button>
    </section>
  );
}

function HomeSection({ title, products }) {
  const { colors } = useTheme();
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between border-b pb-3" style={{ borderColor: colors.primary }}>
        <h2 className="leading-tight" style={{ ...textStyles.sectionTitle, color: colors.text }}>{title}</h2>
        <Link to="/shop" className="text-sm font-semibold hover:opacity-80" style={{ color: colors.primary }}>View more</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product) => <FrontProductCard key={`${title}-${product.ID}`} product={product} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { colors } = useTheme();
  return (
    <AppLayout showPageHeader={false} contentClassName="space-y-8">
      <HeroCarousel colors={colors} />
      <HomeSection title="Newest Products" products={activeProducts.slice(0, 5)} />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <article className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg text-3xl font-bold text-white" style={{ backgroundColor: colors.primary }}><BsNintendoSwitch size={58} /><span style={textStyles.button}>Nintendo</span></article>
        <article className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg text-3xl font-bold text-white" style={{ backgroundColor: colors.info }}><SiPlaystation size={58} /><span style={textStyles.button}>PlayStation</span></article>
        <article className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg text-3xl font-bold text-white" style={{ backgroundColor: colors.success }}><FaXbox size={58} /><span style={textStyles.button}>XBOX</span></article>
        <article className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg text-3xl font-bold text-white" style={{ backgroundColor: colors.warning }}><GiArcTriomphe size={58} /><span style={textStyles.button}>Arcade</span></article>
        <article className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg text-3xl font-bold text-white" style={{ backgroundColor: "#7c3aed" }}><SiSteam size={58} /><span style={textStyles.button}>PC</span></article>
      </section>
      <HomeSection title="Best Sellers" products={activeProducts.slice(1, 6)} />
      <section className="overflow-hidden rounded-lg shadow"><img src={frontBannerImage} alt="Gaming channel banner" className="h-[180px] w-full object-cover" /></section>
      <HomeSection title="Pre-Order" products={activeProducts.slice(2, 7)} />
    </AppLayout>
  );
}

