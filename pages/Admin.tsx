import React, { useState, useEffect, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Package, LayoutDashboard, Search, RefreshCw, Tag, Building2, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Product {
  id: string; name: string; generic_name?: string; category?: string;
  company?: string; manufacturer?: string; price: number; stock?: number;
  pack_size?: string; package_size?: string; status: 'Available' | 'Out of Stock';
}
type AdminView = 'upload' | 'products';

// ─── Shared Styles ────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', minHeight: '100vh', background: '#13161f', fontFamily: 'Inter, Segoe UI, sans-serif', color: '#f1f5f9' },
  sidebar: { width: 220, minWidth: 220, background: '#0f1117', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, overflowY: 'auto', zIndex: 40 },
  sidebarBrand: { display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 18px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.15s', textAlign: 'left' },
  sidebarFooter: { marginTop: 'auto', padding: '16px 18px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 },
  main: { marginLeft: 220, flex: 1, padding: 32, overflowY: 'auto' },
  panelWrap: { maxWidth: 1100 },
  panelHeader: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 },
  panelTitle: { fontSize: 22, fontWeight: 700, margin: 0, color: '#f1f5f9' },
  panelSubtitle: { fontSize: 13, color: '#94a3b8', margin: '2px 0 0' },
  uploadBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 32px', border: '2px dashed rgba(99,102,241,0.35)', borderRadius: 16, background: 'rgba(99,102,241,0.04)', marginBottom: 20 },
  selectFileBtn: { padding: '10px 24px', background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  statusBanner: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, border: '1px solid', fontSize: 14, marginBottom: 8 },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  dangerBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  secondaryBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  helpBox: { marginTop: 24, padding: '18px 20px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 },
  iconBtn: { display: 'flex', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: '#94a3b8', cursor: 'pointer' },
  actionBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: '#94a3b8', cursor: 'pointer' },
  statPill: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', background: '#1a1e2a', border: '1px solid', borderRadius: 12, minWidth: 110, gap: 2 },
  toolbar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 8, background: '#1a1e2a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0 14px', flex: 1, minWidth: 220 },
  searchInput: { background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 13, padding: '10px 0', width: '100%' },
  filterBtn: { padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  tableWrap: { overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#1a1e2a' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 14px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap', textAlign: 'left' },
  td: { padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#94a3b8', verticalAlign: 'middle' },
  rowNum: { display: 'inline-block', width: 24, height: 24, lineHeight: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 11, color: '#94a3b8' },
  companyBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1px solid', whiteSpace: 'nowrap' },
  toggleBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  centerMsg: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' },
  toast: { position: 'fixed', bottom: 28, right: 28, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 12, border: '1px solid', fontSize: 14, fontWeight: 500, zIndex: 9999, backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalContent: { background: '#13161f', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9', outline: 'none', fontSize: 14, transition: 'border 0.2s' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 },
  formGroup: { marginBottom: 16 }
};

// ─── Upload Panel ─────────────────────────────────────────────────────────────

const UploadPanel: React.FC<{ token: string }> = ({ token }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'merge' | 'replace'>('merge');
  const [fileStatuses, setFileStatuses] = useState<Record<string, { type: 'pending' | 'success' | 'error' | 'uploading'; message: string }>>({});
  const [overallStatus, setOverallStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const picked = Array.from(e.target.files);
      setFiles(prev => {
        const existingNames = new Set(prev.map(f => f.name));
        const deduped = picked.filter(f => !existingNames.has(f.name));
        return [...prev, ...deduped];
      });
      setOverallStatus({ type: null, message: '' });
      // reset input so same file can be re-added if removed
      e.target.value = '';
    }
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
    setFileStatuses(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const readFileAsItems = (file: File): Promise<any[]> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          resolve(XLSX.utils.sheet_to_json(worksheet));
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });

  const handleUpload = async () => {
    if (files.length === 0) { setOverallStatus({ type: 'error', message: 'Please select at least one file.' }); return; }
    setIsUploading(true);
    setOverallStatus({ type: null, message: '' });

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    let totalAdded = 0;
    let totalUpdated = 0;
    let errors = 0;
    // First file in replace mode clears existing; subsequent files always merge
    let isFirst = true;

    for (const file of files) {
      setFileStatuses(prev => ({ ...prev, [file.name]: { type: 'uploading', message: 'Processing…' } }));
      try {
        const items = await readFileAsItems(file);
        if (!items || items.length === 0) {
          setFileStatuses(prev => ({ ...prev, [file.name]: { type: 'error', message: 'File is empty or unreadable.' } }));
          errors++;
          isFirst = false;
          continue;
        }
        const shouldClear = uploadMode === 'replace' && isFirst;
        const response = await fetch(`${apiBase}/api/products/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ items, clearExisting: shouldClear }),
        });
        const result = await response.json();
        if (response.ok && result.success) {
          totalAdded += result.added || 0;
          totalUpdated += result.updated || 0;
          setFileStatuses(prev => ({ ...prev, [file.name]: { type: 'success', message: result.message } }));
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (err: any) {
        setFileStatuses(prev => ({ ...prev, [file.name]: { type: 'error', message: err.message || 'Unknown error' } }));
        errors++;
      }
      isFirst = false;
    }

    setIsUploading(false);
    if (errors === 0) {
      setOverallStatus({ type: 'success', message: `✅ All ${files.length} file(s) synced! ${totalAdded} new, ${totalUpdated} updated.` });
    } else {
      setOverallStatus({ type: 'error', message: `⚠️ Done with ${errors} error(s). Check file statuses above.` });
    }
  };

  return (
    <div style={S.panelWrap}>
      <div style={S.panelHeader}>
        <FileSpreadsheet size={22} style={{ color: '#6366f1' }} />
        <div>
          <h2 style={S.panelTitle}>Upload Inventory</h2>
          <p style={S.panelSubtitle}>Upload one or multiple Excel files to update or replace the pharmacy inventory.</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div
          onClick={() => setUploadMode('merge')}
          style={{ flex: 1, padding: '16px', border: `2px solid ${uploadMode === 'merge' ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', background: uploadMode === 'merge' ? 'rgba(99,102,241,0.1)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
          <h3 style={{ fontSize: '15px', color: uploadMode === 'merge' ? '#818cf8' : '#f1f5f9', margin: '0 0 4px', fontWeight: 600 }}>Merge with existing</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Adds new products and accumulates stock for duplicates.</p>
        </div>
        <div
          onClick={() => setUploadMode('replace')}
          style={{ flex: 1, padding: '16px', border: `2px solid ${uploadMode === 'replace' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', background: uploadMode === 'replace' ? 'rgba(239,68,68,0.1)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
          <h3 style={{ fontSize: '15px', color: uploadMode === 'replace' ? '#f87171' : '#f1f5f9', margin: '0 0 4px', fontWeight: 600 }}>Replace all data</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>First file wipes the catalog; additional files merge in.</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div style={S.uploadBox}>
        <FileSpreadsheet size={48} style={{ color: '#6366f1', marginBottom: 12 }} />
        <p style={{ color: '#94a3b8', marginBottom: 16, fontSize: 14 }}>
          Select one or more <strong>.xlsx / .xls</strong> files
        </p>
        <input type="file" accept=".xlsx, .xls" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
        <label htmlFor="file-upload" style={S.selectFileBtn}>Select Excel Files</label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map(f => {
            const st = fileStatuses[f.name];
            const color = !st ? '#94a3b8' : st.type === 'success' ? '#4ade80' : st.type === 'error' ? '#f87171' : st.type === 'uploading' ? '#818cf8' : '#94a3b8';
            return (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#1a1e2a', borderRadius: 10, border: `1px solid ${color}33` }}>
                <FileSpreadsheet size={16} style={{ color: '#6366f1', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                {st && (
                  <span style={{ fontSize: 12, color, whiteSpace: 'nowrap', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {st.type === 'uploading' ? <><Loader2 size={12} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} /> {st.message}</> : st.message}
                  </span>
                )}
                {!isUploading && (
                  <button onClick={() => removeFile(f.name)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2, display: 'flex' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Overall Status */}
      {overallStatus.message && (
        <div style={{
          ...S.statusBanner,
          background: overallStatus.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          borderColor: overallStatus.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
          color: overallStatus.type === 'success' ? '#4ade80' : '#f87171',
        }}>
          {overallStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{overallStatus.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button onClick={handleUpload} disabled={files.length === 0 || isUploading}
          style={{ ...S.primaryBtn, opacity: files.length === 0 || isUploading ? 0.5 : 1, cursor: files.length === 0 || isUploading ? 'not-allowed' : 'pointer' }}>
          {isUploading
            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…</>
            : <><Upload size={18} /> Upload &amp; Sync {files.length > 1 ? `(${files.length} files)` : ''}</>}
        </button>
      </div>

      <div style={S.helpBox}>
        <h4 style={{ color: '#f1f5f9', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Formatting Requirements</h4>
        <ul style={{ paddingLeft: 18, margin: 0, color: '#94a3b8', fontSize: 13, lineHeight: '1.8' }}>
          <li>First row must contain column headers.</li>
          <li>Required: <strong style={{ color: '#f1f5f9' }}>name</strong> (or name_en), <strong style={{ color: '#f1f5f9' }}>price</strong>, <strong style={{ color: '#f1f5f9' }}>stock</strong>.</li>
          <li>Optional: generic_name, company, pack_size.</li>
          <li>In <strong style={{ color: '#f1f5f9' }}>Replace</strong> mode, only the first file wipes existing data; the rest merge in.</li>
        </ul>
      </div>
    </div>
  );
};


// ─── Products Panel ────────────────────────────────────────────────────────────

const ProductsPanel: React.FC<{ token: string }> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Available' | 'Out of Stock'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeProduct, setActiveProduct] = useState<Partial<Product>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingBulk, setDeletingBulk] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
      else setError(data.message || 'Failed to load products.');
    } catch {
      setError('Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = async (product: Product) => {
    const newStatus: 'Available' | 'Out of Stock' = product.status === 'Available' ? 'Out of Stock' : 'Available';
    setUpdatingId(product.id);
    try {
      const res = await fetch(`${apiBase}/api/products/${encodeURIComponent(product.id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
        showToast(`"${product.name}" marked as ${newStatus === 'Available' ? 'In Stock ✅' : 'Out of Stock ❌'}`, true);
      } else {
        showToast(data.message || 'Update failed.', false);
      }
    } catch {
      showToast('Server error. Could not update status.', false);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`${apiBase}/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        showToast('Product deleted.', true);
      } else {
        showToast(data.message || 'Failed to delete product', false);
      }
    } catch {
      showToast('Server error. Could not delete.', false);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected product(s)? This cannot be undone.`)) return;
    setDeletingBulk(true);
    let deleted = 0;
    for (const id of Array.from(selectedIds)) {
      try {
        const res = await fetch(`${apiBase}/api/products/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) deleted++;
      } catch { /* continue */ }
    }
    setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setDeletingBulk(false);
    showToast(`Deleted ${deleted} product(s).`, true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct.name || activeProduct.price === undefined) {
      showToast('Name and Price are required', false);
      return;
    }

    try {
      const isEdit = modalMode === 'edit';
      const endpoint = isEdit ? `/api/products/${encodeURIComponent(activeProduct.id!)}` : `/api/products/add`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(`${apiBase}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(activeProduct)
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setProducts(prev => prev.map(p => p.id === activeProduct.id ? data.product : p));
        } else {
          setProducts(prev => [data.product, ...prev]);
        }
        showToast(isEdit ? 'Product updated successfully' : 'Product added successfully', true);
        setModalMode(null);
      } else {
        showToast(data.message || 'Failed to save product', false);
      }
    } catch {
      showToast('Server error. Could not save product.', false);
    }
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.generic_name || '').toLowerCase().includes(q) ||
      (p.company || '').toLowerCase().includes(q) ||
      (p.manufacturer || '').toLowerCase().includes(q);
    return matchSearch && (filterStatus === 'all' || p.status === filterStatus);
  });

  const inStock = products.filter(p => p.status === 'Available').length;
  const outStock = products.length - inStock;

  return (
    <div style={S.panelWrap}>
      {/* Header */}
      <div style={S.panelHeader}>
        <Package size={22} style={{ color: '#6366f1' }} />
        <div style={{ flex: 1 }}>
          <h2 style={S.panelTitle}>Products</h2>
          <p style={S.panelSubtitle}>{products.length} total &middot; {inStock} in stock &middot; {outStock} out of stock</p>
        </div>
        <button onClick={() => { setActiveProduct({ status: 'Available', price: 0, stock: 0 }); setModalMode('create'); }} style={{ ...S.primaryBtn, padding: '8px 16px' }}>
          <Plus size={16} /> Add Product
        </button>
        <button onClick={fetchProducts} style={S.iconBtn} title="Refresh"><RefreshCw size={16} /></button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Products', value: products.length, color: '#818cf8' },
          { label: 'In Stock', value: inStock, color: '#4ade80' },
          { label: 'Out of Stock', value: outStock, color: '#f87171' },
        ].map(s => (
          <div key={s.label} style={{ ...S.statPill, borderColor: s.color + '55' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={S.toolbar}>
        <div style={S.searchWrap}>
          <Search size={15} style={{ color: '#94a3b8' }} />
          <input
            placeholder="Search by name, generic name, company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={S.searchInput}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={deletingBulk}
              style={{ ...S.dangerBtn, padding: '8px 14px', fontSize: 13 }}
            >
              {deletingBulk
                ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                : <Trash2 size={14} />}
              Delete {selectedIds.size} selected
            </button>
          )}
          {(['all', 'Available', 'Out of Stock'] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} style={{
              ...S.filterBtn,
              background: filterStatus === f ? '#6366f1' : 'rgba(255,255,255,0.05)',
              color: filterStatus === f ? '#fff' : '#94a3b8',
            }}>
              {f === 'all' ? 'All' : f === 'Available' ? 'In Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Table / States */}
      {loading ? (
        <div style={S.centerMsg}>
          <Loader2 size={32} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#94a3b8', marginTop: 12 }}>Loading products…</p>
        </div>
      ) : error ? (
        <div style={S.centerMsg}>
          <AlertCircle size={32} style={{ color: '#f87171' }} />
          <p style={{ color: '#f87171', marginTop: 12 }}>{error}</p>
          <button onClick={fetchProducts} style={{ ...S.primaryBtn, marginTop: 16 }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={S.centerMsg}>
          <Package size={40} style={{ color: '#94a3b8', opacity: 0.4 }} />
          <p style={{ color: '#94a3b8', marginTop: 12 }}>
            {products.length === 0 ? 'No products found. Upload an Excel file to get started.' : 'No products match your search / filter.'}
          </p>
        </div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={S.th}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      title="Select all"
                      style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                      checked={filtered.length > 0 && filtered.every(p => selectedIds.has(p.id))}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(filtered.map(p => p.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                    />
                    Product Name
                  </div>
                </th>
                <th style={S.th}>Stock</th>
                <th style={S.th}>Company</th>
                <th style={S.th}>Price</th>
                <th style={S.th}>Status</th>
                <th style={{ ...S.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => {
                const isInStock = product.status === 'Available';
                const isUpdating = updatingId === product.id;
                return (
                  <tr key={product.id} style={{ background: selectedIds.has(product.id) ? 'rgba(99,102,241,0.08)' : idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ ...S.td, fontWeight: 600, color: '#f1f5f9', maxWidth: 220 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {selectedIds.size > 0 && (
                          <input
                            type="checkbox"
                            style={{ cursor: 'pointer', accentColor: '#6366f1', flexShrink: 0 }}
                            checked={selectedIds.has(product.id)}
                            onChange={e => {
                              setSelectedIds(prev => {
                                const n = new Set(prev);
                                e.target.checked ? n.add(product.id) : n.delete(product.id);
                                return n;
                              });
                            }}
                          />
                        )}
                        <div>
                          {product.name}
                          {product.generic_name && <div style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}>{product.generic_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...S.td, color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>{product.stock != null ? product.stock : '—'}</td>
                    <td style={{ ...S.td, fontSize: 13 }}>
                      <span style={S.companyBadge}>
                        <Building2 size={11} />{product.company || product.manufacturer || '—'}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, color: '#a5f3a5' }}>
                      {product.price != null ? `Rs. ${Number(product.price).toFixed(0)}` : '—'}
                    </td>
                    <td style={S.td}>
                      <span onClick={() => toggleStatus(product)} style={{
                        ...S.statusBadge,
                        background: isInStock ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                        color: isInStock ? '#4ade80' : '#f87171',
                        borderColor: isInStock ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)',
                        cursor: 'pointer',
                        opacity: isUpdating ? 0.5 : 1
                      }}>
                        {isUpdating ? '...' : isInStock ? '● In Stock' : '● Out of Stock'}
                      </span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button onClick={() => { setActiveProduct(product); setModalMode('edit'); }} style={S.actionBtn} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} style={{ ...S.actionBtn, color: '#f87171' }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      {modalMode && (
        <div style={S.modalOverlay}>
          <div style={S.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
                {modalMode === 'edit' ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalMode(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={saveProduct}>
              <div style={S.formGroup}>
                <label style={S.label}>Product Name *</label>
                <input required style={S.input} value={activeProduct.name || ''} onChange={e => setActiveProduct({...activeProduct, name: e.target.value})} placeholder="e.g., PANADOL 500MG" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Generic Name</label>
                <input style={S.input} value={activeProduct.generic_name || ''} onChange={e => setActiveProduct({...activeProduct, generic_name: e.target.value})} placeholder="e.g., Paracetamol" />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...S.formGroup, flex: 1 }}>
                  <label style={S.label}>Price (Rs) *</label>
                  <input required type="number" step="0.01" style={S.input} value={activeProduct.price || 0} onChange={e => setActiveProduct({...activeProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div style={{ ...S.formGroup, flex: 1 }}>
                  <label style={S.label}>Stock</label>
                  <input type="number" style={S.input} value={activeProduct.stock || 0} onChange={e => setActiveProduct({...activeProduct, stock: parseInt(e.target.value)})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...S.formGroup, flex: 1 }}>
                  <label style={S.label}>Company</label>
                  <input style={S.input} value={activeProduct.company || ''} onChange={e => setActiveProduct({...activeProduct, company: e.target.value})} />
                </div>
                <div style={{ ...S.formGroup, flex: 1 }}>
                  <label style={S.label}>Pack Size</label>
                  <input style={S.input} value={activeProduct.pack_size || ''} onChange={e => setActiveProduct({...activeProduct, pack_size: e.target.value})} placeholder="e.g., 200 ml, 10x10" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...S.formGroup, flex: 1 }}>
                  <label style={S.label}>Pack Size</label>
                  <input style={S.input} value={activeProduct.pack_size || ''} onChange={e => setActiveProduct({...activeProduct, pack_size: e.target.value})} placeholder="e.g., 200 ml, 10x10" />
                </div>
                <div style={{ ...S.formGroup, flex: 1 }}>
                  <label style={S.label}>Status</label>
                  <select style={S.input} value={activeProduct.status || 'Available'} onChange={e => setActiveProduct({...activeProduct, status: e.target.value as any})}>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setModalMode(null)} style={S.secondaryBtn}>Cancel</button>
                <button type="submit" style={S.primaryBtn}>
                  {modalMode === 'edit' ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          ...S.toast,
          background: toast.ok ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
          borderColor: toast.ok ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)',
          color: toast.ok ? '#4ade80' : '#f87171',
        }}>
          {toast.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const [activeView, setActiveView] = useState<AdminView>('upload');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 4) return;

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        setError('');
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 4) {
        setError('Maximum login attempts exceeded. Please try again later.');
      } else {
        setError(`Invalid credentials. ${4 - newAttempts} attempts remaining.`);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ ...S.shell, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#0f1117', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <LayoutDashboard size={40} style={{ color: '#6366f1', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>Admin Login</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>Sign in to manage SwiftSales</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={attempts >= 4}
                style={{ width: '100%', padding: '12px 16px', background: '#1a1e2a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#f1f5f9', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={attempts >= 4}
                style={{ width: '100%', padding: '12px 16px', background: '#1a1e2a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#f1f5f9', outline: 'none' }}
              />
            </div>
            
            {error && (
              <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={attempts >= 4 || !username || !password}
              style={{ ...S.primaryBtn, width: '100%', justifyContent: 'center', marginTop: '8px', opacity: (attempts >= 4 || !username || !password) ? 0.5 : 1 }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: 'Upload Inventory', icon: <Upload size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
  ];

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div style={S.shell}>
        {/* Sidebar */}
        <aside style={S.sidebar}>
          <div style={S.sidebarBrand}>
            <LayoutDashboard size={20} style={{ color: '#6366f1' }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>Admin</span>
          </div>
          <nav style={{ marginTop: 8 }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  ...S.navItem,
                  background: activeView === item.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: activeView === item.id ? '#818cf8' : '#94a3b8',
                  borderLeft: activeView === item.id ? '3px solid #6366f1' : '3px solid transparent',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div style={S.sidebarFooter}>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
            >
              <Tag size={13} style={{ opacity: 0.4 }} /> Logout
            </button>
            <span style={{ fontSize: 11, color: '#94a3b8', opacity: 0.6, marginLeft: 'auto' }}>v1.0</span>
          </div>
        </aside>

        {/* Main Content */}
        <main style={S.main}>
          {activeView === 'upload' && <UploadPanel token={token} />}
          {activeView === 'products' && <ProductsPanel token={token} />}
        </main>
      </div>
    </>
  );
};

export default Admin;


