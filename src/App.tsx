/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState, setPath } from './store';
import { AnimatePresence, motion } from 'motion/react';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

// Page imports
import Home from './pages/marketing/Home';
import About from './pages/marketing/About';
import Services from './pages/marketing/Services';
import Gallery from './pages/marketing/Gallery';
import Dashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import Records from './pages/patient/Records';

function MainLayout() {
  const dispatch = useDispatch();
  const activePath = useSelector((state: RootState) => state.ui.activePath);

  // Auto-handling route anchors from hash if they reload or deep-link
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#dashboard' || hash === '#patient') {
      dispatch(setPath('patient/dashboard'));
    }
  }, [dispatch]);

  const renderActivePage = () => {
    switch (activePath) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'gallery':
        return <Gallery />;
      case 'patient/dashboard':
        return <Dashboard />;
      case 'patient/appointments':
        return <Appointments />;
      case 'patient/records':
        return <Records />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-emerald-950 font-sans">
      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* 3. Main Screen View Switch with Motion Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Contact and Brand Info Footer */}
      <Footer />

      {/* 5. Trigger Windows */}
      <AuthModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
