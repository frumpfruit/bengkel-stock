import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { StockProvider, useStock } from './context/StockContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './components/templates/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { SpareParts } from './pages/inventory/SpareParts';
import { SparePartDetail } from './pages/inventory/SparePartDetail';
import { SparePartFormPage } from './pages/inventory/SparePartFormPage';
import { Categories } from './pages/inventory/Categories';
import { Locations } from './pages/inventory/Locations';
import { IncomingStock } from './pages/transactions/IncomingStock';
import { OutgoingStock } from './pages/transactions/OutgoingStock';
import { Suppliers } from './pages/management/Suppliers';
import { Reports } from './pages/management/Reports';
import { Settings } from './pages/system/Settings';
import { NotFound } from './pages/system/NotFound';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useStock();
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenAddPart = () => {
    if (isAdmin) {
      navigate('/inventory/parts/add');
    } else {
      navigate('/inventory/parts');
    }
  };

  // If user is not authenticated, render Login route only
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // When authenticated, render Dashboard Layout and protected routes
  return (
    <DashboardLayout onOpenNewPartModal={handleOpenAddPart}>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/"
          element={<Dashboard onOpenNewPartModal={handleOpenAddPart} />}
        />
        {/* SOAL 03 & SOAL 05: Routing Inventaris Suku Cadang (Daftar, Tambah, Detail, Edit) */}
        <Route
          path="/inventory/parts"
          element={
            <SpareParts
              isAddModalOpenFromTopbar={isAddPartModalOpen}
              onCloseAddModalFromTopbar={() => setIsAddPartModalOpen(false)}
            />
          }
        />
        <Route
          path="/inventory/parts/add"
          element={
            <ProtectedRoute adminOnly>
              <SparePartFormPage isEdit={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/parts/:id"
          element={<SparePartDetail />}
        />
        <Route
          path="/inventory/parts/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <SparePartFormPage isEdit={true} />
            </ProtectedRoute>
          }
        />

        <Route path="/inventory/categories" element={<Categories />} />
        <Route path="/inventory/locations" element={<Locations />} />
        <Route
          path="/transactions/incoming"
          element={
            <ProtectedRoute adminOnly>
              <IncomingStock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/outgoing"
          element={
            <ProtectedRoute adminOnly>
              <OutgoingStock />
            </ProtectedRoute>
          }
        />
        <Route path="/management/suppliers" element={<Suppliers />} />
        <Route path="/management/reports" element={<Reports />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute adminOnly>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* SOAL 03: Penanganan alamat yang tidak ditemukan (404 Page) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StockProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </StockProvider>
    </ErrorBoundary>
  );
}
