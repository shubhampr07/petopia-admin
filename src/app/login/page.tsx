"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="pa-submit pa-submit-blue" disabled={pending}>
      {pending ? "Logging in…" : "Log in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="pa-root">
      <style>{paStyles}</style>

      <div className="pa-card">
        {/* ===================== BRAND PANEL ===================== */}
        <div className="pa-brand">
          <span className="pa-blob pa-blob1" />
          <span className="pa-blob pa-blob2" />
          <span className="pa-blob pa-blob3" />

          <div className="pa-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Petopia" className="pa-logo-img" />
          </div>

          <div className="pa-hero">
            <span className="pa-kicker">ADMIN PANEL</span>
            <h1 className="pa-hero-title">Run the whole store.</h1>
            <p className="pa-hero-body">
              Manage products, brands, orders, and service bookings — everything Petopia, in one place.
            </p>
          </div>

          <div className="pa-pet-wrap">
            <span className="pa-pet-shadow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/avatar.png" alt="Happy Petopia pet" className="pa-pet-img" />
          </div>

          <div className="pa-trust">
            <div>
              <div className="pa-trust-num">20k+</div>
              <div className="pa-trust-label">Happy pets</div>
            </div>
            <div>
              <div className="pa-trust-num">4.9★</div>
              <div className="pa-trust-label">App rating</div>
            </div>
            <div>
              <div className="pa-trust-num">24/7</div>
              <div className="pa-trust-label">Support</div>
            </div>
          </div>
        </div>

        {/* ===================== FORM PANEL ===================== */}
        <div className="pa-form-panel">
          <div className="pa-anim">
            <h2 className="pa-title">Welcome back 🐾</h2>
            <p className="pa-subtitle">Sign in to manage the Petopia store.</p>

            <form action={formAction}>
              <div className="pa-fields">
                <label className="pa-label">
                  <span className="pa-label-text">Email address</span>
                  <div className="pa-input">
                    <span className="pa-input-icon">✉️</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@petopia.com"
                      required
                    />
                  </div>
                </label>
                <label className="pa-label">
                  <span className="pa-label-text">Password</span>
                  <div className="pa-input">
                    <span className="pa-input-icon">🔒</span>
                    <input
                      id="password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                    />
                    <span className="pa-pw-toggle" onClick={() => setShowPw((v) => !v)}>
                      {showPw ? "Hide" : "Show"}
                    </span>
                  </div>
                </label>
              </div>

              <div className="pa-row-between">
                <label className="pa-check-label">
                  <span
                    className={`pa-check ${remember ? "pa-check-on-blue" : ""}`}
                    onClick={() => setRemember((v) => !v)}
                  >
                    {remember ? "✓" : ""}
                  </span>
                  <span className="pa-check-text">Remember me</span>
                </label>
                <span className="pa-link">Forgot password?</span>
              </div>

              {state?.error && (
                <p className="pa-error" role="alert">
                  {state.error}
                </p>
              )}

              <SubmitButton />
            </form>

            <p className="pa-foot">Petopia Admin — Authorized staff only</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const paStyles = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700&display=swap');

.pa-root { font-family: 'Nunito', sans-serif; color: #16243E; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px;
  background: radial-gradient(1100px 600px at 8% -5%, #D4ECF7 0%, rgba(212,236,247,0) 55%), radial-gradient(900px 600px at 100% 110%, #FFF3CC 0%, rgba(255,243,204,0) 55%), #EAF4FA; }
.pa-root *, .pa-root *::before, .pa-root *::after { box-sizing: border-box; }
.pa-root input::placeholder { color: #9AA7C2; }
.pa-root input:focus { outline: none; }

.pa-card { width: 100%; max-width: 1060px; min-height: 660px; background: #FFFFFF; border-radius: 32px; overflow: hidden; display: grid; grid-template-columns: 0.92fr 1.08fr; box-shadow: 0 40px 90px -30px rgba(2,111,195,.42), 0 0 0 1px rgba(255,255,255,.6); }

.pa-brand { position: relative; padding: 44px 42px; background: linear-gradient(165deg, #026FC3 0%, #0267B2 50%, #014E8A 100%); overflow: hidden; display: flex; flex-direction: column; }
.pa-blob { position: absolute; border-radius: 50%; }
.pa-blob1 { top: -80px; right: -70px; width: 260px; height: 260px; background: rgba(255,191,0,.20); }
.pa-blob2 { bottom: -110px; left: -90px; width: 300px; height: 300px; background: rgba(255,255,255,.08); }
.pa-blob3 { top: 38%; left: -30px; width: 120px; height: 120px; background: rgba(102,208,231,.18); }

.pa-logo { position: relative; display: flex; align-items: center; }
.pa-logo-img { height: 34px; width: auto; display: block; border-radius: 6px; }

.pa-hero { position: relative; margin-top: 40px; }
.pa-kicker { display: inline-block; background: rgba(255,255,255,.18); color: #fff; font-weight: 800; font-size: 12px; letter-spacing: 1.6px; padding: 7px 13px; border-radius: 999px; backdrop-filter: blur(4px); }
.pa-hero-title { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 40px; line-height: 1.08; color: #fff; margin: 18px 0 0; letter-spacing: -1px; }
.pa-hero-body { font-size: 16px; line-height: 1.55; color: rgba(255,255,255,.85); margin: 14px 0 0; max-width: 320px; }

.pa-pet-wrap { position: relative; margin-top: auto; display: flex; align-items: flex-end; justify-content: center; padding-top: 28px; }
.pa-pet-shadow { position: absolute; bottom: 10px; width: 210px; height: 24px; border-radius: 50%; background: rgba(0,0,0,.20); filter: blur(9px); }
.pa-pet-img { position: relative; width: 260px; max-width: 80%; height: auto; animation: pa-floaty 5s ease-in-out infinite; filter: drop-shadow(0 16px 22px rgba(0,0,0,.28)); }

.pa-trust { position: relative; margin-top: 26px; display: flex; gap: 22px; }
.pa-trust-num { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 22px; color: #FFBF00; }
.pa-trust-label { font-size: 12.5px; color: rgba(255,255,255,.75); font-weight: 700; }

.pa-form-panel { padding: 48px 56px; display: flex; flex-direction: column; justify-content: center; }
.pa-error { margin: 16px 0 0; padding: 11px 14px; border-radius: 12px; background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; font-size: 13.5px; font-weight: 700; }

.pa-anim { animation: pa-pop .45s ease; }
.pa-title { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 32px; color: #16243E; margin: 0; letter-spacing: -.6px; }
.pa-subtitle { font-size: 15px; color: #67769A; margin: 8px 0 0; font-weight: 600; }

.pa-fields { margin-top: 26px; display: flex; flex-direction: column; gap: 16px; }
.pa-label { display: block; }
.pa-label-text { display: block; font-size: 13px; font-weight: 800; color: #16243E; margin-bottom: 7px; }
.pa-input { display: flex; align-items: center; gap: 10px; background: #F2F8FC; border: 2px solid #DCEBF6; border-radius: 14px; padding: 0 14px; transition: border-color .15s; }
.pa-input:focus-within { border-color: #026FC3; }
.pa-input-icon { font-size: 17px; }
.pa-input input { flex: 1; border: none; background: transparent; font-family: 'Nunito', sans-serif; font-weight: 600; font-size: 15px; color: #16243E; padding: 14px 0; }
.pa-pw-toggle { cursor: pointer; font-size: 13px; font-weight: 800; color: #026FC3; }

.pa-row-between { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }
.pa-check-label { display: flex; align-items: center; gap: 9px; cursor: pointer; }
.pa-check { display: flex; align-items: center; justify-content: center; width: 21px; height: 21px; border-radius: 7px; font-size: 12px; font-weight: 900; color: #fff; cursor: pointer; flex-shrink: 0; border: 2px solid #C4DBEC; background: #fff; }
.pa-check-on-blue { border-color: #026FC3; background: #026FC3; }
.pa-check-text { font-size: 13.5px; font-weight: 700; color: #45557A; line-height: 1.45; }
.pa-link { color: #026FC3; font-weight: 800; cursor: pointer; }

.pa-submit { width: 100%; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 16px; padding: 16px; border-radius: 14px; }
.pa-submit:disabled { opacity: .65; cursor: default; }
.pa-submit-blue { margin-top: 24px; color: #fff; background: linear-gradient(135deg,#0A8AD6,#025FA8); box-shadow: 0 14px 26px -8px rgba(2,111,195,.55); }

.pa-foot { text-align: center; margin: 26px 0 0; font-size: 14.5px; font-weight: 700; color: #67769A; }

@keyframes pa-floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes pa-pop { 0% { transform: translateY(14px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

@media (max-width: 880px) {
  .pa-root { padding: 16px; }
  .pa-card { grid-template-columns: 1fr; min-height: 0; max-width: 460px; }
  .pa-brand { display: none; }
  .pa-form-panel { padding: 32px 24px; }
}
`;
