import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialCategories,
  initialLocations,
  initialSuppliers,
  initialSpareParts,
  initialTransactions,
  initialMovementChartData,
  defaultSettings,
} from '../data/initialData';

const StockContext = createContext(null);
const STORAGE_KEY = 'bengkel_stock_app_v2';

export const computePartStatus = (stock, minStock) => {
  const s = Number(stock) || 0;
  const m = Number(minStock) || 0;
  if (s <= 0) return 'Habis';
  if (s <= m) return 'Menipis';
  return 'Aman';
};

export const StockProvider = ({ children }) => {
  // Load from localStorage or fallback to initial data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          spareParts: parsed.spareParts || initialSpareParts,
          categories: parsed.categories || initialCategories,
          locations: parsed.locations || initialLocations,
          suppliers: parsed.suppliers || initialSuppliers,
          transactions: parsed.transactions || initialTransactions,
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          movementChartData: parsed.movementChartData || initialMovementChartData,
        };
      }
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
    }
    return {
      spareParts: initialSpareParts,
      categories: initialCategories,
      locations: initialLocations,
      suppliers: initialSuppliers,
      transactions: initialTransactions,
      settings: defaultSettings,
      movementChartData: initialMovementChartData,
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('bengkel_stock_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user session:', e);
    }
    return {
      name: 'Budi Pratama',
      email: 'admin@bengkelstock.com',
      role: 'admin',
      roleLabel: 'Kepala Gudang & Logistik',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isAuthenticated: true,
    };
  });

  const isAdmin = useMemo(() => {
    if (!currentUser?.isAuthenticated) return false;
    const r = (currentUser?.role || '').toLowerCase();
    return r === 'admin' || r.includes('kepala') || r.includes('admin');
  }, [currentUser]);

  const isViewer = useMemo(() => {
    return !isAdmin;
  }, [isAdmin]);

  const login = (email, password, role = 'admin', customName = null) => {
    const isRoleAdmin =
      role === 'admin' ||
      role.toLowerCase().includes('admin') ||
      role.toLowerCase().includes('kepala');
    const user = {
      name:
        customName ||
        (isRoleAdmin
          ? email.includes('google')
            ? 'Budi (Google Workspace)'
            : 'Budi Pratama'
          : 'Agus Santoso'),
      email: email,
      role: isRoleAdmin ? 'admin' : 'viewer',
      roleLabel: isRoleAdmin
        ? 'Kepala Gudang & Logistik (Admin)'
        : 'Mekanik / Tamu (Viewer)',
      avatar: isRoleAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('bengkel_stock_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist user session:', e);
    }
    return user;
  };

  const logout = () => {
    const user = {
      ...(currentUser || {}),
      isAuthenticated: false,
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('bengkel_stock_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist logout session:', e);
    }
  };

  // Dark mode effect
  useEffect(() => {
    if (data.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.settings.darkMode]);

  // Ensure every part has its computed status
  const sparePartsWithStatus = useMemo(() => {
    return data.spareParts.map((part) => ({
      ...part,
      status: computePartStatus(part.stock, part.minStock),
    }));
  }, [data.spareParts]);

  // Computed KPIs
  const stats = useMemo(() => {
    const parts = sparePartsWithStatus;
    const totalParts = parts.length;
    const totalStock = parts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const lowStockParts = parts.filter((p) => p.status === 'Menipis');
    const outOfStockParts = parts.filter((p) => p.status === 'Habis');
    const safeStockParts = parts.filter((p) => p.status === 'Aman');

    const totalSuppliers = data.suppliers.length;
    const totalAssetValue = parts.reduce(
      (acc, p) => acc + (Number(p.stock) || 0) * (Number(p.purchasePrice) || 0),
      0
    );
    const totalPotentialValue = parts.reduce(
      (acc, p) => acc + (Number(p.stock) || 0) * (Number(p.sellPrice) || 0),
      0
    );

    // Count this month's transactions
    const totalMasukThisMonth = data.transactions
      .filter((t) => t.type === 'IN')
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    const totalKeluarThisMonth = data.transactions
      .filter((t) => t.type === 'OUT')
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    const totalRestockCount = data.transactions.filter((t) => t.type === 'IN').length;

    // Percentages for status
    const safePercent = totalParts > 0 ? Math.round((safeStockParts.length / totalParts) * 100) : 0;
    const lowPercent = totalParts > 0 ? Math.round((lowStockParts.length / totalParts) * 100) : 0;
    const outPercent = totalParts > 0 ? Math.round((outOfStockParts.length / totalParts) * 100) : 0;

    return {
      totalParts,
      totalStock,
      lowStockCount: lowStockParts.length,
      outOfStockCount: outOfStockParts.length,
      safeStockCount: safeStockParts.length,
      safePercent,
      lowPercent,
      outPercent,
      totalSuppliers,
      totalAssetValue,
      totalPotentialValue,
      totalMasukThisMonth,
      totalKeluarThisMonth,
      totalRestockCount,
    };
  }, [sparePartsWithStatus, data.suppliers, data.transactions]);

  // ================= CRUD SPARE PARTS =================
  const addSparePart = (partData) => {
    const id = partData.id || `SP-${String(data.spareParts.length + 1).padStart(3, '0')}`;
    const newPart = {
      ...partData,
      id,
      stock: Number(partData.stock) || 0,
      minStock: Number(partData.minStock) || Number(data.settings.defaultMinStock) || 10,
      purchasePrice: Number(partData.purchasePrice) || 0,
      sellPrice: Number(partData.sellPrice) || 0,
      lastUpdated: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      spareParts: [newPart, ...prev.spareParts],
    }));
    return newPart;
  };

  const updateSparePart = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock,
            minStock: updatedFields.minStock !== undefined ? Number(updatedFields.minStock) : p.minStock,
            purchasePrice: updatedFields.purchasePrice !== undefined ? Number(updatedFields.purchasePrice) : p.purchasePrice,
            sellPrice: updatedFields.sellPrice !== undefined ? Number(updatedFields.sellPrice) : p.sellPrice,
            lastUpdated: new Date().toISOString(),
          };
        }
        return p;
      }),
    }));
  };

  const deleteSparePart = (id) => {
    setData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.filter((p) => p.id !== id),
    }));
  };

  const quickAdjustStock = (id, newStock, reason = 'Penyesuaian Manual') => {
    const part = data.spareParts.find((p) => p.id === id);
    if (!part) return;
    const diff = Number(newStock) - Number(part.stock);
    if (diff === 0) return;

    const trxType = diff > 0 ? 'IN' : 'OUT';
    const absQty = Math.abs(diff);

    // Record adjustment transaction
    const newTrx = {
      id: `TRX-${trxType}-${Date.now().toString().slice(-4)}`,
      type: trxType,
      sparePartId: part.id,
      sparePartName: part.name,
      category: part.category,
      quantity: absQty,
      unitPrice: part.purchasePrice,
      totalAmount: absQty * (trxType === 'IN' ? part.purchasePrice : part.sellPrice),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      referenceNo: `ADJ-${Date.now().toString().slice(-6)}`,
      notes: reason,
      handledBy: data.settings.adminName,
      supplierName: trxType === 'IN' ? 'Penyesuaian Stok Gudang' : undefined,
      customerVehicle: trxType === 'OUT' ? 'Koreksi Stok / Kerusakan' : undefined,
    };

    setData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.map((p) =>
        p.id === id ? { ...p, stock: Number(newStock), lastUpdated: new Date().toISOString() } : p
      ),
      transactions: [newTrx, ...prev.transactions],
    }));
  };

  // ================= TRANSACTIONS =================
  const recordIncomingStock = (trx) => {
    const part = data.spareParts.find((p) => p.id === trx.sparePartId);
    if (!part) {
      throw new Error('Spare part tidak ditemukan.');
    }
    const qty = Number(trx.quantity);
    if (qty <= 0) {
      throw new Error('Jumlah barang masuk harus lebih dari 0.');
    }

    const newTrxId = `TRX-IN-${String(data.transactions.length + 1).padStart(3, '0')}`;
    const unitPrice = Number(trx.unitPrice) || part.purchasePrice;
    const totalAmount = unitPrice * qty;

    const newTransaction = {
      id: newTrxId,
      type: 'IN',
      sparePartId: part.id,
      sparePartName: part.name,
      category: part.category,
      quantity: qty,
      unitPrice,
      totalAmount,
      date: trx.date || new Date().toISOString().split('T')[0],
      time: trx.time || new Date().toTimeString().slice(0, 5),
      referenceNo: trx.referenceNo || `PO-${Date.now().toString().slice(-6)}`,
      supplierName: trx.supplierName || 'Pemasok Umum',
      notes: trx.notes || 'Penerimaan stok gudang',
      handledBy: trx.handledBy || data.settings.adminName,
    };

    setData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.map((p) =>
        p.id === part.id
          ? {
              ...p,
              stock: Number(p.stock) + qty,
              purchasePrice: unitPrice > 0 ? unitPrice : p.purchasePrice,
              lastUpdated: new Date().toISOString(),
            }
          : p
      ),
      transactions: [newTransaction, ...prev.transactions],
    }));

    return newTransaction;
  };

  const recordOutgoingStock = (trx) => {
    const part = data.spareParts.find((p) => p.id === trx.sparePartId);
    if (!part) {
      throw new Error('Spare part tidak ditemukan.');
    }
    const qty = Number(trx.quantity);
    if (qty <= 0) {
      throw new Error('Jumlah barang keluar harus lebih dari 0.');
    }
    if (qty > Number(part.stock)) {
      throw new Error(`Stok tidak mencukupi! Stok saat ini: ${part.stock} ${part.unit || 'unit'}, diminta: ${qty}.`);
    }

    const newTrxId = `TRX-OUT-${String(data.transactions.length + 1).padStart(3, '0')}`;
    const unitPrice = Number(trx.unitPrice) || part.sellPrice;
    const totalAmount = unitPrice * qty;

    const newTransaction = {
      id: newTrxId,
      type: 'OUT',
      sparePartId: part.id,
      sparePartName: part.name,
      category: part.category,
      quantity: qty,
      unitPrice,
      totalAmount,
      date: trx.date || new Date().toISOString().split('T')[0],
      time: trx.time || new Date().toTimeString().slice(0, 5),
      referenceNo: trx.referenceNo || `SRV-${Date.now().toString().slice(-6)}`,
      customerVehicle: trx.customerVehicle || 'Kendaraan Pelanggan',
      notes: trx.notes || 'Penggunaan servis bengkel',
      handledBy: trx.handledBy || data.settings.adminName,
    };

    setData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.map((p) =>
        p.id === part.id
          ? {
              ...p,
              stock: Math.max(0, Number(p.stock) - qty),
              lastUpdated: new Date().toISOString(),
            }
          : p
      ),
      transactions: [newTransaction, ...prev.transactions],
    }));

    return newTransaction;
  };

  const deleteTransaction = (trxId) => {
    const trx = data.transactions.find((t) => t.id === trxId);
    if (!trx) return;

    // Rollback stock
    const part = data.spareParts.find((p) => p.id === trx.sparePartId);
    let updatedParts = data.spareParts;

    if (part) {
      const rollbackStock =
        trx.type === 'IN'
          ? Math.max(0, Number(part.stock) - Number(trx.quantity))
          : Number(part.stock) + Number(trx.quantity);

      updatedParts = data.spareParts.map((p) =>
        p.id === part.id ? { ...p, stock: rollbackStock, lastUpdated: new Date().toISOString() } : p
      );
    }

    setData((prev) => ({
      ...prev,
      spareParts: updatedParts,
      transactions: prev.transactions.filter((t) => t.id !== trxId),
    }));
  };

  // ================= CRUD CATEGORIES =================
  const addCategory = (category) => {
    const id = category.id || `CAT-${String(data.categories.length + 1).padStart(2, '0')}`;
    const newCat = { ...category, id };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
    return newCat;
  };

  const updateCategory = (id, fields) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...fields } : c)),
    }));
  };

  const deleteCategory = (id) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  // ================= CRUD LOCATIONS =================
  const addLocation = (loc) => {
    const id = loc.id || `LOC-${String(data.locations.length + 1).padStart(2, '0')}`;
    const newLoc = { ...loc, id };
    setData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLoc],
    }));
    return newLoc;
  };

  const updateLocation = (id, fields) => {
    setData((prev) => ({
      ...prev,
      locations: prev.locations.map((l) => (l.id === id ? { ...l, ...fields } : l)),
    }));
  };

  const deleteLocation = (id) => {
    setData((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l.id !== id),
    }));
  };

  // ================= CRUD SUPPLIERS =================
  const addSupplier = (sup) => {
    const id = sup.id || `SUP-${String(data.suppliers.length + 1).padStart(2, '0')}`;
    const newSup = { ...sup, id };
    setData((prev) => ({
      ...prev,
      suppliers: [...prev.suppliers, newSup],
    }));
    return newSup;
  };

  const updateSupplier = (id, fields) => {
    setData((prev) => ({
      ...prev,
      suppliers: prev.suppliers.map((s) => (s.id === id ? { ...s, ...fields } : s)),
    }));
  };

  const deleteSupplier = (id) => {
    setData((prev) => ({
      ...prev,
      suppliers: prev.suppliers.filter((s) => s.id !== id),
    }));
  };

  // ================= SYSTEM & SETTINGS =================
  const updateSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const toggleDarkMode = () => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
    }));
  };

  const resetDemoData = () => {
    const fresh = {
      spareParts: initialSpareParts,
      categories: initialCategories,
      locations: initialLocations,
      suppliers: initialSuppliers,
      transactions: initialTransactions,
      settings: defaultSettings,
      movementChartData: initialMovementChartData,
    };
    setData(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  const exportDataJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BengkelStock_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.spareParts || !Array.isArray(parsed.spareParts)) {
        throw new Error('Format file JSON tidak valid untuk data BengkelStock.');
      }
      setData({
        spareParts: parsed.spareParts,
        categories: parsed.categories || initialCategories,
        locations: parsed.locations || initialLocations,
        suppliers: parsed.suppliers || initialSuppliers,
        transactions: parsed.transactions || initialTransactions,
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
        movementChartData: parsed.movementChartData || initialMovementChartData,
      });
      return true;
    } catch (e) {
      throw new Error('Gagal mengimpor file: ' + e.message);
    }
  };

  return (
    <StockContext.Provider
      value={{
        spareParts: sparePartsWithStatus,
        categories: data.categories,
        locations: data.locations,
        suppliers: data.suppliers,
        transactions: data.transactions,
        settings: data.settings,
        movementChartData: data.movementChartData,
        stats,
        // Auth
        currentUser,
        isAuthenticated: Boolean(currentUser?.isAuthenticated),
        isAdmin,
        isViewer,
        login,
        logout,
        // Actions
        addSparePart,
        updateSparePart,
        deleteSparePart,
        quickAdjustStock,
        recordIncomingStock,
        recordOutgoingStock,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        updateSettings,
        toggleDarkMode,
        resetDemoData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
