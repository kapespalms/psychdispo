import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getDefaults, saveDefaults, type UserDefaults } from "@/lib/user-defaults";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings · PsychDispo" }],
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
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <div className="max-w-lg mx-auto px-6 py-10 md:py-14">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
          Your defaults
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Pre-fill new disposition plans with your usual setting, insurance, and home location.
          Stored on this device only.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 border border-border bg-white p-6 md:p-8 space-y-5 shadow-sm"
        >
          <div>
            <label htmlFor="setting" className="block text-sm font-medium mb-1.5">
              Default discharging setting
            </label>
            <select
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
            >
              {SETTING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="insurance" className="block text-sm font-medium mb-1.5">
              Default insurance
            </label>
            <select
              id="insurance"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
            >
              {INSURANCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="homeLocation" className="block text-sm font-medium mb-1.5">
              Default patient home — city or ZIP
            </label>
            <input
              id="homeLocation"
              type="text"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              placeholder="e.g. Bellingham or 98225"
              className="w-full px-3 py-2.5 border border-border rounded-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2640C8]/30 focus:border-[#2640C8]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2640C8] text-white text-sm font-semibold tracking-wide hover:bg-[#1b2f9c] transition-colors"
          >
            Save defaults
          </button>

          {saved && (
            <p className="text-sm text-center text-[#1c7a3f]">Defaults saved.</p>
          )}
        </form>
      </div>
    </div>
  );
}
