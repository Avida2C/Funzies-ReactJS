import { textStyles } from "../../../theme/typography";
import ThemedButton from "../../../components/ThemedButton";
import { InfoCard } from "../AccountSectionPrimitives";

export default function AddressesSection({
  colors,
  mutedText,
  defaultAddress,
  userAddresses,
  formatAddressBlock,
  openCreateAddressModal,
  openEditAddressModal,
  refreshAddresses,
  addressLoading,
  addressError,
  userId,
  deleteRow,
}) {
  const addressCardStyle = { color: colors.text };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Default Shipping Address</h2>
        <InfoCard className="w-full md:max-w-[280px]">
          {defaultAddress ? (
            <p style={{ ...textStyles.body, ...addressCardStyle, whiteSpace: "pre-line" }}>{formatAddressBlock(defaultAddress)}</p>
          ) : (
            <p style={{ ...textStyles.body, color: mutedText }}>No default address yet.</p>
          )}
        </InfoCard>
        <div className="flex flex-wrap items-center gap-2">
          <ThemedButton
            type="button"
            variant="greenSolid"
            size="md"
            style={{ ...textStyles.sectionTitle }}
            onClick={openCreateAddressModal}
            disabled={!userId}
          >
            Add address
          </ThemedButton>
          {addressLoading ? <span style={{ ...textStyles.bodySm, color: mutedText }}>Loading…</span> : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 style={{ ...textStyles.sectionTitle, color: colors.text }}>Other Shipping Addresses</h2>
        {userAddresses.length <= 1 ? (
          <p style={{ ...textStyles.body, color: mutedText }}>No additional addresses.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {userAddresses
              .filter((a) => !defaultAddress || a.ID !== defaultAddress.ID)
              .map((a) => (
                <div key={a.ID} className="space-y-2">
                  <InfoCard className="w-full md:max-w-[280px]">
                    <p style={{ ...textStyles.body, ...addressCardStyle, whiteSpace: "pre-line" }}>{formatAddressBlock(a)}</p>
                  </InfoCard>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="underline"
                      style={{ ...textStyles.bodySm, color: colors.primary }}
                      onClick={() => openEditAddressModal(a)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="underline"
                      style={{ ...textStyles.bodySm, color: colors.text, opacity: 0.85 }}
                      onClick={async () => {
                        if (!window.confirm("Delete this address?")) return;
                        try {
                          await deleteRow("address", a.ID, { hard: false });
                          await refreshAddresses();
                        } catch (e) {
                          window.alert(e instanceof Error ? e.message : "Delete failed");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

