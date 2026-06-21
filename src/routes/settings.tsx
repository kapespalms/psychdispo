import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorialPage } from "@/components/editorial-page";
import { useAuth } from "@/lib/auth";
import { getDefaults, saveDefaults, type UserDefaults } from "@/lib/user-defaults";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () =>
    pageHead({
      path: "/settings",
      title: "Settings · PsychDispo",
      description: "PsychDispo account settings.",
      noindex: true,
    }),
  component: SettingsPage,
});

const SETTING_OPTIONS = [
  { value: "", label: "— No default —" },
  { value: "Acute", label: "Acute / Inpatient (ED, hospital, urgent care)" },
  { value: "Outpatient", label: "Outpatient clinic / office" },
];

const INSURANCE_OPTIONS = [
  { value: "", label: "— No default —" },
  { value: "Medicaid", label: "Medicaid" },
  { value: "Medicare", label: "Medicare" },
  { value: "Commercial", label: "Commercial" },
  { value: "VA", label: "VA / Tricare" },
  { value: "Uninsured", label: "Uninsured" },
];

function SettingsPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [setting, setSetting] = useState("");
  const [insurance, setInsurance] = useState("");
  const [homeLocation, setHomeLocation] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/sign-in", replace: true });
      return;
    }
    const d = getDefaults(user.email);
    setSetting(d.setting ?? "");
    setInsurance(d.insurance ?? "");
    if (d.homeZip) setHomeLocation(d.homeZip);
    else if (d.homeCity) setHomeLocation(d.homeCity);
  }, [ready, user, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const trimmed = homeLocation.trim();
    const defaults: UserDefaults = {
      setting: setting || undefined,
      insurance: insurance || undefined,
    };
    if (/^\d/.test(trimmed)) {
      defaults.homeZip = trimmed.replace(/[^0-9]/g, "").slice(0, 5);
      defaults.homeCity = undefined;
    } else if (trimmed) {
      defaults.homeCity = trimmed;
      defaults.homeZip = undefined;
    }
    saveDefaults(user.email, defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!ready || !user) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center text-sm text-[var(--mut)]">
        Loading…
      </div>
    );
  }

  return (
    <EditorialPage
      kicker="Account"
      title="Your defaults"
      subtitle="Pre-fill new disposition plans with your usual setting, insurance, and home location. Stored on this device only."
      actions={
        <Link to="/plans" className="nav-bar-link">
          my plans
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label htmlFor="setting" className="kicker block mb-2">
            Default discharging setting
          </label>
          <select
            id="setting"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            className="form-input"
          >
            {SETTING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="insurance" className="kicker block mb-2">
            Default insurance
          </label>
          <select
            id="insurance"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="form-input"
          >
            {INSURANCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="homeLocation" className="kicker block mb-2">
            Default patient home — city or ZIP
          </label>
          <input
            id="homeLocation"
            type="text"
            value={homeLocation}
            onChange={(e) => setHomeLocation(e.target.value)}
            placeholder="e.g. Bellingham or 98225"
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-blue w-full text-center">
          Save defaults
        </button>

        {saved && (
          <p className="text-sm text-center text-[var(--ink)]" role="status">
            Defaults saved.
          </p>
        )}
      </form>

      <p className="mt-8 text-[0.8125rem] leading-relaxed text-[var(--mut)]">
        <Link to="/trust" className="text-link-accent">
          How we handle your data
        </Link>
      </p>
    </EditorialPage>
  );
}
