/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  setPath,
  toggleMobileMenu,
  toggleAuthModal,
  logout,
  showToast,
} from "../store";
import { Menu, X, User, LogOut, Calendar, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import clinicLogo from "/assets/uniquedentalcare.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activePath, mobileMenuOpen } = useSelector(
    (state: RootState) => state.ui,
  );

  const handleNav = (path: string) => {
    dispatch(setPath(path));
    dispatch(toggleMobileMenu(false));

    // Smooth scroll if they Click on marketing layout elements on home
    if (activePath === "home" && ["why-us", "faqs"].includes(path)) {
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const menuItems = [
    { label: "Clinic", path: "home" },
    { label: "Services", path: "services" },
    { label: "Why Us", path: "about" },
    { label: "Gallery", path: "gallery" },
    { label: "FAQs", path: "faqs" },
  ];

  const adminMenuItems = [
    { label: "Admin Panel", path: "admin/dashboard" },
    { label: "Scheduler Matrix", path: "admin/appointments" },
    { label: "Patient Registry", path: "admin/patients" },
    { label: "Billing Suite", path: "admin/billing" },
  ];

  const handleBookClick = () => {
    if (user) {
      if (user.isAdmin) {
        dispatch(setPath("admin/dashboard"));
      } else {
        dispatch(setPath("patient/appointments"));
      }
    } else {
      // Prompt user to sign in first, or scroll them to home page form
      const element = document.getElementById("book-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        dispatch(
          showToast({
            message: "Please scroll to the reservation form below!",
            type: "success",
          }),
        );
      } else {
        dispatch(setPath("home"));
        setTimeout(() => {
          document
            .getElementById("book-section")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setPath("home"));
    dispatch(
      showToast({
        message: "Successfully logged out of secure console.",
        type: "success",
      }),
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div
        id="navbar-container"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          id="navbar-flex"
          className="flex justify-between items-center h-20"
        >
          {/* Logo Brand Brandings */}
          <div
            id="brand-logo"
            className="flex items-center gap-3.5 cursor-pointer group py-1"
            onClick={() =>
              handleNav(user?.isAdmin ? "admin/dashboard" : "home")
            }
          >
            {/* 2. Premium Clinic Logo in Header */}
            <div className="relative flex items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-2xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-amber-100/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <img
                src={clinicLogo}
                alt="Unique Dental Care Logo"
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm"
              />
            </div>

            {/* 3. Title Content (Aligning the image/logo near the website title text) */}
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] sm:text-[24px] font-serif font-bold tracking-tight text-emerald-950 group-hover:text-amber-800 transition-colors">
                  Dr. Mehul Hasti Babel
                </h1>

                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shrink-0" />
              </div>

              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Dental Surgeon • MUHS Mumbai
              </span>
            </div>
          </div>
          {/* Desktop Navigation Links */}
          <div
            id="desktop-nav-links"
            className="hidden md:flex space-x-6 items-center"
          >
            {(user?.isAdmin ? adminMenuItems : menuItems).map((item) => (
              <button
                id={`nav-${item.path}`}
                key={item.label}
                onClick={() => {
                  if (item.path === "faqs") {
                    if (activePath !== "home") {
                      dispatch(setPath("home"));
                      setTimeout(() => {
                        document
                          .getElementById("faqs")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    } else {
                      document
                        .getElementById("faqs")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  } else {
                    handleNav(item.path);
                  }
                }}
                className={`text-sm tracking-wide transition-all uppercase text-[11px] font-semibold py-2 px-1 border-b-2 ${
                  activePath === item.path
                    ? "border-amber-700 text-emerald-950 font-bold"
                    : "border-transparent text-emerald-800/80 hover:text-amber-850 hover:border-amber-600/30"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Patients Portal Access Links */}
            {user ? (
              <div
                id="authorized-profile-pill"
                className="flex items-center gap-4 pl-4 border-l border-gray-100"
              >
                <button
                  id="nav-to-dashboard"
                  onClick={() =>
                    handleNav(
                      user.isAdmin ? "admin/dashboard" : "patient/dashboard",
                    )
                  }
                  className={`text-xs font-mono font-bold tracking-tight px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all ${
                    user.isAdmin
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 border-amber-800 text-white shadow-sm"
                      : activePath.startsWith("patient")
                        ? "bg-emerald-900 border-emerald-950 text-white shadow-sm"
                        : "bg-emerald-50 border-emerald-100 text-emerald-900 hover:bg-emerald-100"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  {user.fullName.split(" ")[0]}{" "}
                  {user.isAdmin ? "(Dr. Babel)" : "(Portal)"}
                </button>
                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-750 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-100 font-serif">
                <button
                  id="btn-open-portal"
                  onClick={() => dispatch(toggleAuthModal(true))}
                  className="text-xs uppercase font-serif font-bold tracking-wider text-emerald-900 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  Patient Log In
                </button>
                <button
                  onClick={() => dispatch(setPath("admin/login"))}
                  className="text-xs uppercase font-serif font-bold tracking-wider text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  Staff Hub
                </button>
              </div>
            )}

            {/* Main Book Button */}
            {!user?.isAdmin && (
              <button
                id="header-book-appointment"
                onClick={handleBookClick}
                className="bg-emerald-950 text-white font-serif uppercase tracking-wider text-xs px-5 py-3 hover:bg-amber-900 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 font-medium cursor-pointer"
              >
                Book Appointment
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div
            id="mobile-nav-toggle-block"
            className="md:hidden flex items-center gap-3"
          >
            {user && (
              <button
                id="mobile-portal-indicator"
                onClick={() => handleNav("patient/dashboard")}
                className="p-1.5 rounded-full bg-emerald-50 text-emerald-900"
              >
                <User className="w-4 h-4" />
              </button>
            )}
            <button
              id="mobile-hamburger-btn"
              onClick={() => dispatch(toggleMobileMenu())}
              className="p-2 rounded-md text-emerald-950 hover:text-amber-800 hover:bg-emerald-50/50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer-overlay"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div id="mobile-drawer-links" className="px-4 pt-2 pb-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  id={`mob-nav-${item.path}`}
                  key={item.label}
                  onClick={() => {
                    if (item.path === "faqs") {
                      dispatch(setPath("home"));
                      dispatch(toggleMobileMenu(false));
                      setTimeout(() => {
                        document
                          .getElementById("faqs")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    } else {
                      handleNav(item.path);
                    }
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium tracking-wide ${
                    activePath === item.path
                      ? "bg-emerald-50 text-emerald-950 font-bold"
                      : "text-emerald-800/80 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-100 my-3 pt-3 space-y-2">
                {user ? (
                  <>
                    <button
                      id="mobile-nav-dashboard"
                      onClick={() => handleNav("patient/dashboard")}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-emerald-950 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" /> Patient Dashboard
                    </button>
                    <button
                      id="mobile-nav-logout"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </>
                ) : (
                  <button
                    id="mobile-nav-login"
                    onClick={() => {
                      dispatch(toggleMobileMenu(false));
                      dispatch(toggleAuthModal(true));
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-emerald-950 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" /> Patient Sign In
                  </button>
                )}

                <button
                  id="mobile-nav-book-appointment"
                  onClick={() => {
                    dispatch(toggleMobileMenu(false));
                    handleBookClick();
                  }}
                  className="w-full mt-2 bg-emerald-950 text-white font-serif uppercase tracking-wider text-xs py-3.5 text-center block"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
