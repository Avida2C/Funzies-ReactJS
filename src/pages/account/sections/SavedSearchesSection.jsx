import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import { InfoCard } from "../AccountSectionPrimitives";
import { buildShopHref, SORT_LABELS } from "../../../lib/savedSearchesContext";
import { categoriesById } from "../../../lib/storeData";

function filterSummary(search) {
  const parts = [];
  if (search.q) {
    parts.push(`Search: ${search.q}`);
  }
  if (search.category) {
    const categoryName = categoriesById.get(Number(search.category))?.Name?.trim();
    parts.push(`Category: ${categoryName || `#${search.category}`}`);
  }
  if (search.series) {
    parts.push(`Series: ${search.series}`);
  }
  if (search.scale) {
    parts.push(`Scale: ${search.scale}`);
  }
  if (search.sku) {
    parts.push(`SKU: ${search.sku}`);
  }
  if (search.sort && search.sort !== "featured") {
    parts.push(`Sort: ${SORT_LABELS[search.sort] ?? search.sort}`);
  }
  return parts.join(" · ");
}

export default function SavedSearchesSection({
  colors,
  mutedText,
  savedSearches,
  onRemove,
  onRename,
}) {
  return (
    <div className="space-y-6">
      <p style={{ ...textStyles.body, color: mutedText }}>
        Re-open shop filters you saved. Add more from Shop after searching or choosing a category and sort.
      </p>
      {savedSearches.length === 0 ? (
        <InfoCard className="max-w-[640px]">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.primary}22`, color: colors.primary }}
            >
              <FiSearch size={18} />
            </span>
            <div className="min-w-0 space-y-2">
              <p style={{ ...textStyles.body, color: colors.text, fontWeight: 600 }}>No saved searches yet</p>
              <p style={{ ...textStyles.bodySm, color: mutedText }}>
                Run a search or apply filters on Shop, then tap Save search.
              </p>
              <ThemedButton as={Link} to="/shop" variant="redSolid" size="sm">
                Go to Shop
              </ThemedButton>
            </div>
          </div>
        </InfoCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedSearches.map((search) => {
            const href = buildShopHref(search);
            const summary = filterSummary(search);
            return (
              <InfoCard key={search.id} className="flex flex-col gap-3">
                <div className="min-w-0">
                  <p className="truncate" style={{ ...textStyles.sectionTitle, fontSize: "20px", color: colors.text }}>
                    {search.name}
                  </p>
                  <p className="mt-1" style={{ ...textStyles.bodySm, color: mutedText }}>
                    {summary}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <ThemedButton as={Link} to={href} variant="redSolid" size="sm">
                    Open in shop
                  </ThemedButton>
                  <ThemedButton
                    type="button"
                    variant="redOutline"
                    size="sm"
                    onClick={() => {
                      const nextName = window.prompt("Rename saved search", search.name);
                      if (nextName == null) {
                        return;
                      }
                      onRename(search.id, nextName);
                    }}
                  >
                    Rename
                  </ThemedButton>
                  <button
                    type="button"
                    className="underline"
                    style={{ ...textStyles.bodySm, color: mutedText }}
                    onClick={() => {
                      if (!window.confirm(`Remove “${search.name}”?`)) {
                        return;
                      }
                      onRemove(search.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </InfoCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
