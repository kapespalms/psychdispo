import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditorialFooterLinks } from "@/components/editorial-footer-links";
import { EditorialPage, EditorialSection } from "@/components/editorial-page";
import {
  clearGuestLocalData,
  deleteSignedInAccount,
  downloadJson,
  exportGuestData,
  exportSignedInAccountData,
} from "@/lib/account-data";
import { useAuth } from "@/lib/auth";
import { getDefaults, saveDefaults, type UserDefaults } from "@/lib/user-defaults";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () =>
    pageHead({
      path: "/settings",
      title: "Settings · PsychDispo",
      description: "PsychDispo account settings, data export, and account deletion.",
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
  const { user, ready, supabaseEnabled, signOut } = useAuth();
  const navigate = useNavigate();
  const [setting, setSetting] = useState("");
  const [insurance, setInsurance] = useState("");
  const [homeLocation, setHomeLocation] = useState("");
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [guestCleared, setGuestCleared] = useState(false);

  useEffect(() => {
    if (!ready || !user) return;
    const d = getDefaults(user.email);
    setSetting(d.setting ?? "");
    setInsurance(d.insurance ?? "");
    if (d.homeZip) setHomeLocation(d.homeZip);
    else if (d.homeCity) setHomeLocation(d.homeCity);
  }, [ready, user]);

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

  async function handleExport() {
    if (!user) return;
    setExporting(true);
    setAccountMessage("");
    try {
      const data = await exportSignedInAccountData(user, supabaseEnabled);
      downloadJson(data, `psychdispo-account-${user.email.replace(/@.*/, "")}.json`);
    } catch (err) {
      setAccountMessage(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    setAccountMessage("");
    const result = await deleteSignedInAccount(user, supabaseEnabled);
    setDeleting(false);
    if (!result.ok) {
      setAccountMessage(result.error);
      return;
    }
    await signOut();
    navigate({ to: "/", replace: true });
  }

  function handleGuestExport() {
    const data = exportGuestData();
    downloadJson(data, "psychdispo-guest-data.json");
  }

  function handleGuestClear() {
    clearGuestLocalData();
    setGuestCleared(true);
  }

  if (!ready) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center text-sm text-[var(--mut)]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <EditorialPage
        kicker="Settings"
        title="Local data"
        subtitle="You are using guest mode. Disposition plans and templates stay in this browser only — we do not upload patient workflow data."
        footer={<EditorialFooterLinks />}
      >
        <div className="space-y-8 max-w-md">
          <EditorialSection title="Your browser storage">
            <p>
              Guest templates, in-progress plans, and defaults live in localStorage on this device.
              Clearing site data or switching browsers removes them unless you export first.
            </p>
          </EditorialSection>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleGuestExport} className="btn-blue">
              Export guest data
            </button>
            <button type="button" onClick={handleGuestClear} className="nav-bar-link">
              Clear local data
            </button>
          </div>

          {guestCleared && (
            <p className="text-sm text-[var(--ink)]" role="status">
              Local guest data cleared. Reload to start fresh.
            </p>
          )}

          <p className="text-[0.8125rem] leading-relaxed text-[var(--mut)]">
            Want cloud template sync?{" "}
            <Link to="/sign-up" className="text-link-accent">
              Create an account
            </Link>
            . See{" "}
            <Link to="/trust" className="text-link-accent">
              trust & data
            </Link>
            .
          </p>
        </div>
      </EditorialPage>
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
      footer={<EditorialFooterLinks />}
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

      <hr className="journal-rule-light my-10" />

      <div className="space-y-5 max-w-md">
        <p className="kicker">Account data</p>
        <h2 className="font-serif text-[1.25rem] font-medium tracking-tight">Export or delete</h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--mut)]">
          Download templates, favorites, and account metadata as JSON. Deleting your account removes
          your Supabase auth record and cloud library. Local disposition plans on this device are not
          included — export those separately from the workflow if needed.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="btn-blue disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {exporting ? "Preparing…" : "Export account data"}
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={deleting}
                className="nav-bar-link disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your cloud templates, favorites, and sign-in record.
                  Local browser defaults and any disposition drafts on this device remain until you
                  clear browser data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? "Deleting…" : "Delete account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {accountMessage && (
          <p className="text-sm text-[var(--ink)]" role="status">
            {accountMessage}
          </p>
        )}
      </div>

      <p className="mt-8 text-[0.8125rem] leading-relaxed text-[var(--mut)]">
        Enterprise SSO is planned for Phase 2.{" "}
        <Link to="/trust" className="text-link-accent">
          How we handle your data
        </Link>
        {" · "}
        <Link to="/privacy" className="text-link-accent">
          Privacy Policy
        </Link>
      </p>
    </EditorialPage>
  );
}
