import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { CAREER_PERKS, OPEN_ROLES } from "../data/careersData";

export default function CareersPage() {
  return (
    <AppLayout
      title="Careers at Funzies Collection"
      description="Join the team building the most trusted gamer-first shop."
    >
      <div className="grid gap-6">
        <ThemedSurface className="p-6 md:p-8">
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-primary/25 px-3 py-1 text-xs font-semibold text-primary">
              Now Hiring
            </p>
            <h2 className="text-2xl font-semibold text-base-content md:text-3xl">
              Build with gamers who care about craft, community, and clean experiences.
            </h2>
            <p className="max-w-3xl leading-7 text-base-content/80">
              We are a small team with big standards. We move fast, stay kind, and obsess over trust - from product
              curation to post-purchase support.
            </p>
          </div>
        </ThemedSurface>

        <ThemedSurface className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-base-content">Why people join us</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CAREER_PERKS.map((perk) => (
              <li key={perk} className="rounded-lg border border-base-300 bg-base-200/30 px-4 py-3 leading-6 text-base-content/80">
                {perk}
              </li>
            ))}
          </ul>
        </ThemedSurface>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-base-content">Open roles</h3>
          <div className="grid gap-4">
            {OPEN_ROLES.map((role) => (
              <ThemedSurface as="article" key={role.id} className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold text-base-content">{role.title}</h4>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{role.team}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-base-300 px-2.5 py-1 text-base-content/80">{role.location}</span>
                  <span className="rounded-full border border-base-300 px-2.5 py-1 text-base-content/80">{role.type}</span>
                </div>
                <p className="leading-7 text-base-content/80">{role.summary}</p>
                <ul className="flex flex-wrap gap-2">
                  {role.skills.map((skill) => (
                    <li key={`${role.title}-${skill}`} className="rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/80">
                      {skill}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Link className="btn btn-outline btn-sm" to={`/careers/${role.id}`}>
                    More information
                  </Link>
                  <Link className="btn btn-primary btn-sm" to={`/careers/${role.id}/apply`}>
                    Apply now
                  </Link>
                </div>
              </ThemedSurface>
            ))}
          </div>
        </section>

        <ThemedSurface className="p-6 space-y-2">
          <h3 className="text-xl font-semibold text-base-content">Do not see your role?</h3>
          <p className="leading-7 text-base-content/80">
            Send your portfolio and a short intro to{" "}
            <a className="link link-primary" href="mailto:careers@funziescollection.com">
              careers@funziescollection.com
            </a>
            . We are always scouting builders, creators, and players with strong taste.
          </p>
        </ThemedSurface>
      </div>
    </AppLayout>
  );
}
