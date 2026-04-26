import { Link } from "react-router-dom";
import { FiArrowRight, FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiUsers } from "react-icons/fi";
import { SiX } from "react-icons/si";
import AppLayout from "../components/AppLayout";
import ThemedButton from "../components/ThemedButton";
import ThemedSurface from "../components/ThemedSurface";
import { COMPANY_OPENING_HOURS, COMPANY_SOCIAL_LINKS, COMPANY_STORE_CONTACT } from "../data/companyPageData";
import { useTheme } from "../theme/themeContext";

const COMPANY_SOCIAL_ICONS = {
  facebook: FiFacebook,
  x: SiX,
  instagram: FiInstagram,
};

function contactRow(icon, children, { primary }) {
  return (
    <div className="flex gap-2">
      <span
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center"
        style={{ color: primary }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-base leading-[22.4px] text-base-content">{children}</div>
    </div>
  );
}

export default function CompanyPage() {
  const { colors } = useTheme();
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(COMPANY_STORE_CONTACT.mapSearchQuery)}&output=embed`;

  return (
    <AppLayout
      title="Company"
      description="Our story, how to team up with us, and where to find the store."
    >
      <div className="grid gap-10 md:gap-12">
        <section className="grid gap-4" aria-labelledby="company-about-heading">
          <h2 id="company-about-heading" className="text-xl font-medium leading-6" style={{ color: colors.primary }}>
            About Funzies
          </h2>
          <ThemedSurface className="p-6 md:p-8">
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-base-content">Our mission</h3>
                <p className="leading-7 text-base-content/80">
                  Founded in [Year], Funzies Collection was built by gamers, for gamers. We realized that finding authentic
                  gear, rare collectibles, and reliable hardware should not feel like a &quot;boss fight.&quot; Our mission
                  is to provide a curated, high-trust marketplace where every player can find their next favorite piece of
                  loot.
                </p>
              </div>

              <div className="space-y-3 border-t pt-8" style={{ borderColor: colors.border }}>
                <h3 className="text-lg font-semibold text-base-content">Why &quot;Funzies&quot;?</h3>
                <p className="leading-7 text-base-content/80">
                  Because shopping should be fun. We have stripped away the &quot;sus&quot; listings and the bot-dominated
                  drops to create a shop that feels like your favorite local gaming lounge - just on your phone.
                </p>
              </div>

              <div className="space-y-3 border-t pt-8" style={{ borderColor: colors.border }}>
                <h3 className="text-lg font-semibold text-base-content">Our partners</h3>
                <p className="leading-7 text-base-content/80">
                  We work with the biggest names in the industry to ensure that every product we sell is 100% authentic. We
                  are an authorized reseller for major gaming peripherals and lifestyle brands.
                </p>
              </div>
            </div>
          </ThemedSurface>
        </section>

        <section className="grid gap-4" aria-labelledby="company-join-heading">
          <h2 id="company-join-heading" className="text-xl font-medium leading-6" style={{ color: colors.primary }}>
            Join the party
          </h2>
          <div
            className="rounded-box border p-6 shadow md:p-8"
            style={{
              borderColor: `${colors.primary}33`,
              background: `linear-gradient(135deg, ${colors.primary}14 0%, ${colors.background} 42%, ${colors.background} 100%)`,
            }}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-xl space-y-3">
                <p className="text-lg font-semibold leading-7 text-base-content">
                  Build with us, or bring a partnership idea.
                </p>
                <p className="leading-7 text-base-content/80">
                  Browse open roles on the careers page, or use the contact form for hiring questions, wholesale, and
                  collaborations—we route partnership topics straight to the right team.
                </p>
                <p className="text-sm leading-6 text-base-content/70">
                  Prefer email only for deals?{" "}
                  <a className="link link-primary font-medium" href="mailto:partners@funziescollection.com">
                    partners@funziescollection.com
                  </a>
                </p>
              </div>
              <div className="flex w-full max-w-sm shrink-0 flex-col gap-3">
                <ThemedButton
                  as={Link}
                  to="/careers"
                  variant="primary"
                  size="md"
                  className="w-full justify-center gap-2"
                >
                  <FiUsers size={18} aria-hidden />
                  View careers
                  <FiArrowRight size={16} className="opacity-90" aria-hidden />
                </ThemedButton>
                <ThemedButton
                  as={Link}
                  to="/contact#contact-form"
                  variant="outline"
                  size="md"
                  className="w-full justify-center gap-2"
                >
                  <FiMail size={18} aria-hidden />
                  Contact us
                </ThemedButton>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4" aria-labelledby="company-visit-heading">
          <h2 id="company-visit-heading" className="text-xl font-medium leading-6" style={{ color: colors.primary }}>
            Visit us
          </h2>
          <ThemedSurface className="overflow-hidden p-0">
            <div className="grid lg:grid-cols-2 lg:items-stretch">
              <div
                className="flex h-full flex-col gap-4 p-4 md:p-6 lg:border-e"
                style={{ borderColor: colors.border }}
              >
                {contactRow(<FiMapPin size={22} aria-hidden />, COMPANY_STORE_CONTACT.address, colors)}
                {contactRow(
                  <FiPhone size={22} aria-hidden />,
                  <a className="hover:underline" style={{ color: colors.text }} href={`tel:${COMPANY_STORE_CONTACT.phone}`}>
                    {COMPANY_STORE_CONTACT.phone}
                  </a>,
                  colors,
                )}
                {contactRow(
                  <FiMail size={22} aria-hidden />,
                  <a
                    className="hover:underline"
                    style={{ color: colors.text }}
                    href={`mailto:${COMPANY_STORE_CONTACT.email}`}
                  >
                    {COMPANY_STORE_CONTACT.email}
                  </a>,
                  colors,
                )}

                <div className="mt-1 border-t pt-4" style={{ borderColor: colors.border }}>
                  <p className="mb-3 text-sm font-medium leading-5 text-base-content/90">Social</p>
                  <div className="flex flex-col gap-4">
                    {COMPANY_SOCIAL_LINKS.map((item) => {
                      const Icon = COMPANY_SOCIAL_ICONS[item.id];
                      if (!Icon) return null;
                      return (
                        <div key={item.id} className="flex gap-2">
                          <span
                            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center"
                            style={{ color: colors.primary }}
                          >
                            <Icon size={22} aria-hidden />
                          </span>
                          <p className="max-w-none text-base leading-[22.4px] text-base-content">
                            <a
                              className="hover:underline"
                              style={{ color: colors.text }}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.name}
                            </a>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t p-4 md:p-6 lg:border-t-0" style={{ borderColor: colors.border }}>
                <h3 className="text-xl font-medium leading-6" style={{ color: colors.primary }}>
                  Opening hours
                </h3>
                <ul className="text-base leading-[22.4px]">
                  {COMPANY_OPENING_HOURS.map((row) => (
                    <li
                      key={row.day}
                      className="flex items-start justify-between gap-4 border-b py-2 last:border-b-0"
                      style={{ borderColor: colors.border }}
                    >
                      <span className="text-base-content">{row.day}</span>
                      <span className="shrink-0 whitespace-nowrap" style={{ color: colors.primary }}>
                        {row.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: colors.border }}>
              <iframe
                title="Funzies Collection store location"
                className="h-64 w-full border-0 md:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapSrc}
              />
            </div>
          </ThemedSurface>
        </section>
      </div>
    </AppLayout>
  );
}
