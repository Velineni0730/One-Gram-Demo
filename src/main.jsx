import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard, Package, ReceiptText, FileText, RotateCcw, ClipboardList,
  Search, Plus, Minus, Trash2, Download, Printer, MessageCircle, Mail,
  ChevronDown, X, Check, ArrowUpRight, ArrowDownRight, Wallet, Boxes,
  Menu, Settings2, Send, CircleDollarSign, CalendarDays, Filter, Eye,
} from 'lucide-react';
import './style.css';

const STORE_KEY = 'one-gram-demo-v1';
const shop = {
  name: import.meta.env.VITE_SHOP_NAME || 'Demo Jewellery Store',
  address: import.meta.env.VITE_SHOP_ADDRESS || '12, Market Road, Visakhapatnam, Andhra Pradesh',
  phone: import.meta.env.VITE_SHOP_PHONE || '9876543210',
};
const currency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n || 0));
const dateTime = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const dateOnly = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const id = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const seed = {
  products: [
    { id: 'p1', name: 'Gold Chain', sku: 'GC-001', category: 'Chain', stock: 8, cost: 4200, price: 5200 },
    { id: 'p2', name: 'Gold Bangles', sku: 'GB-002', category: 'Bangles', stock: 16, cost: 1850, price: 2450 },
    { id: 'p3', name: 'Gold Ring', sku: 'GR-003', category: 'Ring', stock: 12, cost: 950, price: 1450 },
    { id: 'p4', name: 'Small Earrings', sku: 'SE-004', category: 'Earrings', stock: 20, cost: 650, price: 990 },
    { id: 'p5', name: 'Lakshmi Pendant', sku: 'LP-005', category: 'Pendant', stock: 5, cost: 3200, price: 3990 },
    { id: 'p6', name: 'Daily Wear Chain', sku: 'DC-006', category: 'Chain', stock: 14, cost: 1250, price: 1690 },
    { id: 'p7', name: 'Traditional Jhumkas', sku: 'TJ-007', category: 'Earrings', stock: 9, cost: 2100, price: 2790 },
    { id: 'p8', name: 'Kids Bracelet', sku: 'KB-008', category: 'Bracelet', stock: 18, cost: 780, price: 1090 },
    { id: 'p9', name: 'Antique Necklace', sku: 'AN-009', category: 'Necklace', stock: 4, cost: 5100, price: 6490 },
    { id: 'p10', name: 'CZ Stud Earrings', sku: 'CZ-010', category: 'Earrings', stock: 22, cost: 420, price: 690 },
    { id: 'p11', name: 'Temple Kada', sku: 'TK-011', category: 'Bangles', stock: 7, cost: 2850, price: 3690 },
    { id: 'p12', name: 'Heart Pendant', sku: 'HP-012', category: 'Pendant', stock: 11, cost: 990, price: 1390 },
    { id: 'p13', name: 'Men Bracelet', sku: 'MB-013', category: 'Bracelet', stock: 13, cost: 1550, price: 2190 },
    { id: 'p14', name: 'Pearl Drop Earrings', sku: 'PE-014', category: 'Earrings', stock: 6, cost: 1180, price: 1590 },
    { id: 'p15', name: 'Classic Mangalsutra', sku: 'CM-015', category: 'Chain', stock: 3, cost: 3900, price: 4990 },
    { id: 'p16', name: 'Floral Finger Ring', sku: 'FR-016', category: 'Ring', stock: 15, cost: 720, price: 990 },
    { id: 'p17', name: 'Oval Stone Ring', sku: 'OR-017', category: 'Ring', stock: 8, cost: 1350, price: 1890 },
    { id: 'p18', name: 'Coin Pendant', sku: 'CP-018', category: 'Pendant', stock: 10, cost: 1750, price: 2290 },
    { id: 'p19', name: 'Kids Kada', sku: 'KK-019', category: 'Bangles', stock: 12, cost: 890, price: 1190 },
    { id: 'p20', name: 'Layered Chain', sku: 'LC-020', category: 'Chain', stock: 5, cost: 2450, price: 3190 },
    { id: 'p21', name: 'Ruby Look Necklace', sku: 'RN-021', category: 'Necklace', stock: 4, cost: 4300, price: 5590 },
    { id: 'p22', name: 'Daily Wear Tops', sku: 'DT-022', category: 'Earrings', stock: 25, cost: 350, price: 590 },
    { id: 'p23', name: 'Peacock Pendant', sku: 'PP-023', category: 'Pendant', stock: 6, cost: 1980, price: 2590 },
    { id: 'p24', name: ' kada Bracelet', sku: 'BR-024', category: 'Bracelet', stock: 9, cost: 1150, price: 1590 },
  ],
  invoices: [], returns: [], logs: [],
};
function createSampleInvoices() {
  const names = ['Ananya Rao','Sravya K','Kavya Reddy','Priya Sharma','Meghana V','Lakshmi Devi','Harini P','Divya N','Sailaja M','Niharika'];
  const samples = [];
  for (let i=0;i<10;i++) {
    const product = seed.products[(i*3+2)%seed.products.length];
    const second = seed.products[(i*5+7)%seed.products.length];
    const qty = i%3===0 ? 2 : 1;
    const items = [{productId:product.id,name:product.name,qty,price:product.price,cost:product.cost},{productId:second.id,name:second.name,qty:1,price:second.price,cost:second.cost}];
    const subtotal = items.reduce((a,x)=>a+x.qty*x.price,0), discountAmount = i%2 ? Math.round(subtotal*.03) : 0;
    const gstAmount = 0, total = subtotal-discountAmount;
    const date = new Date(); date.setDate(date.getDate()-(i+1)); date.setHours(10+(i%8), (i*7)%60, 0, 0);
    samples.push({id:`INV-DEMO-${String(1001+i)}`,date:date.toISOString(),customer:{name:names[i],phone:`98${String(76543210+i).padStart(8,'0')}`,email:''},items,subtotal,discountMode:'amount',discountInput:discountAmount,discountAmount,gstMode:'amount',gstInput:0,gstAmount,total,amountReceived:total,payment:['UPI','Cash','Card'][i%3],grossProfit:items.reduce((a,x)=>a+(x.price-x.cost)*x.qty,0)-discountAmount,returnedItems:[],status:'PAID'});
  }
  return samples;
}
function loadStore() {
  try { const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); return saved ? { ...seed, ...saved } : { ...seed, invoices:createSampleInvoices(), returns:[], logs:[] }; }
  catch { return { ...seed, invoices:createSampleInvoices() }; }
}
function App() {
  useEffect(() => { const stop = (e) => { if (e.target instanceof HTMLInputElement && e.target.type === 'number') e.target.blur(); }; document.addEventListener('wheel', stop, { passive: true }); return () => document.removeEventListener('wheel', stop); }, []);
  const [db, setDb] = useState(loadStore);
  const [page, setPage] = useState('Dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventorySort, setInventorySort] = useState('name');
  const [qty, setQty] = useState('1');
  const [cart, setCart] = useState([]);
  const [discountMode, setDiscountMode] = useState('percent');
  const [discount, setDiscount] = useState('0');
  const [gstMode, setGstMode] = useState('percent');
  const [gst, setGst] = useState('0');
  const [received, setReceived] = useState('');
  const [payment, setPayment] = useState('Cash');
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [publicInvoice, setPublicInvoice] = useState(null);
  const [returnInvoice, setReturnInvoice] = useState('');
  const [returnItem, setReturnItem] = useState('');
  const [returnQty, setReturnQty] = useState('1');
  const [refundMethod, setRefundMethod] = useState('Cash');
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: 'General', stock: '', cost: '', price: '' });
  const [stockProduct, setStockProduct] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockCost, setStockCost] = useState('');
  const [editingProduct, setEditingProduct] = useState('');
  const [mailRecipients, setMailRecipients] = useState('');
  const [mailSelection, setMailSelection] = useState([]);
  const [mailSending, setMailSending] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');
  const [salesRange, setSalesRange] = useState('1W');

  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }, [db]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const encoded = params.get('invoice');
    if (!encoded) return;
    try {
      const shared = JSON.parse(decodeURIComponent(escape(atob(encoded))));
      if (shared && shared.id && Array.isArray(shared.items)) setPublicInvoice(shared);
    } catch { /* Invalid or legacy invoice link; keep the app usable. */ }
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 4500); return () => clearTimeout(t); }, [toast]);

  const products = db.products;
  const matches = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()));
  const subtotal = cart.reduce((s, line) => s + line.qty * line.price, 0);
  const discountValue = discountMode === 'percent' ? subtotal * Number(discount || 0) / 100 : Number(discount || 0);
  const taxable = Math.max(0, subtotal - discountValue);
  const gstValue = gstMode === 'percent' ? taxable * Number(gst || 0) / 100 : Number(gst || 0);
  const total = Math.max(0, taxable + gstValue);
  const invoiceGrossProfit = cart.reduce((s, line) => s + (line.price - line.cost) * line.qty, 0) - discountValue;

  function log(action, detail) {
    const entry = { id: id('LOG'), action, detail, date: new Date().toISOString() };
    setDb(prev => ({ ...prev, logs: [entry, ...prev.logs] }));
  }
  function addLine() {
    const p = products.find(x => x.id === selected);
    const n = Number(qty);
    if (!p) return setToast('Select a product from inventory.');
    if (!Number.isInteger(n) || n < 1) return setToast('Enter a valid quantity.');
    const already = cart.filter(x => x.productId === p.id).reduce((s, x) => s + x.qty, 0);
    if (already + n > p.stock) return setToast(`Only ${p.stock - already} more available for ${p.name}.`);
    setCart(prev => [...prev, { lineId: id('LINE'), productId: p.id, name: p.name, qty: n, price: Number(p.price), cost: Number(p.cost) }]);
    setQuery(''); setSelected(''); setQty('1');
  }
  function updateLine(lineId, key, value) {
    setCart(prev => prev.map(line => line.lineId === lineId ? { ...line, [key]: key === 'qty' || key === 'price' ? Number(value) : value } : line));
  }
  function completeBill() {
    if (!cart.length) return setToast('Add at least one product.');
    for (const line of cart) {
      const p = products.find(x => x.id === line.productId);
      if (!p || line.qty < 1 || line.qty > p.stock) return setToast(`Check available stock for ${line.name}.`);
    }
    const paid = received === '' ? total : Number(received);
    if (!Number.isFinite(paid) || paid < 0) return setToast('Enter a valid amount received.');
    const now = new Date().toISOString();
    const invoice = {
      id: id('INV'), date: now, customer: { ...customer }, items: cart.map(({ lineId, ...x }) => ({ ...x })),
      subtotal, discountMode, discountInput: Number(discount || 0), discountAmount: discountValue,
      gstMode, gstInput: Number(gst || 0), gstAmount: gstValue, total, amountReceived: paid,
      payment, grossProfit: invoiceGrossProfit, returnedItems: [], status: 'PAID',
    };
    setDb(prev => ({
      ...prev,
      products: prev.products.map(p => {
        const sold = cart.filter(line => line.productId === p.id).reduce((s, line) => s + line.qty, 0);
        return sold ? { ...p, stock: p.stock - sold } : p;
      }),
      invoices: [invoice, ...prev.invoices],
      logs: [{ id: id('LOG'), action: 'INVOICE_CREATED', detail: `${invoice.id} · ${cart.map(x => `${x.name} × ${x.qty}`).join(', ')}`, date: now }, ...prev.logs],
    }));
    setActiveInvoice(invoice); setCart([]); setDiscount('0'); setGst('0'); setReceived(''); setCustomer({ name: '', phone: '', email: '' }); setPage('Invoices');
    setToast(`Invoice ${invoice.id} created.`);
  }
  function invoiceLink(invoice) {
    const base = (import.meta.env.VITE_PUBLIC_APP_URL || 'https://onegramdemo.vercel.app').replace(/\/$/, '');
    const safeSnapshot = { ...invoice, customer: { name: invoice.customer?.name || '' } };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(safeSnapshot))));
    return `${base}/#invoice=${encodeURIComponent(encoded)}`;
  }
  function shareText(invoice) {
    const lines = invoice.items.map(x => `${x.name} × ${x.qty} — ${currency(x.qty * x.price)}`).join('\n');
    return `${shop.name}\nInvoice: ${invoice.id}\nDate: ${dateTime(invoice.date)}\n${lines}\nSubtotal: ${currency(invoice.subtotal)}\nDiscount: -${currency(invoice.discountAmount)}\nGST: ${currency(invoice.gstAmount)}\nTotal: ${currency(invoice.total)}\nPaid: ${currency(invoice.amountReceived)} (${invoice.payment})\nThank you for shopping with us.\nView invoice: ${invoiceLink(invoice)}`;
  }
  function shareWhatsApp(invoice) {
    const phone = (invoice.customer.phone || '').replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(shareText(invoice))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  function emailJsConfiguration() {
    const config = {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    };

    const missing = Object.entries(config).filter(([, value]) => !value).map(([key]) => key);
    if (missing.length) {
      throw new Error(`EmailJS configuration missing: ${missing.join(', ')}. Add the VITE_EMAILJS variables in Vercel and redeploy.`);
    }
    return config;
  }

  function emailJsTemplateParams(invoice, recipient) {
    const itemLines = invoice.items
      .map(item => `${item.name} × ${item.qty} | ${currency(item.price)} each | ${currency(item.qty * item.price)}`)
      .join('\n');

    return {
      to_email: recipient,
      customer_name: invoice.customer?.name || 'Customer',
      invoice_number: invoice.id,
      invoice_date: dateTime(invoice.date),
      invoice_items: itemLines,
      subtotal: currency(invoice.subtotal),
      discount: currency(invoice.discountAmount),
      gst: currency(invoice.gstAmount),
      invoice_total: currency(invoice.total),
      amount_received: currency(invoice.amountReceived),
      payment_method: invoice.payment || 'Not specified',
      invoice_url: invoiceLink(invoice),
      shop_name: shop.name,
      shop_address: shop.address,
      shop_phone: shop.phone,
    };
  }

  async function sendInvoiceWithEmailJs(invoice, recipient) {
    const config = emailJsConfiguration();
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: emailJsTemplateParams(invoice, recipient),
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      let detail = responseText;
      try {
        const parsed = JSON.parse(responseText);
        detail = parsed.text || parsed.message || parsed.error || responseText;
      } catch (_) {}
      throw new Error(`EmailJS error (${response.status}): ${detail || 'Request rejected'}`);
    }
    return responseText;
  }

  function isValidEmailAddress(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function emailInvoice(invoice, recipient) {
    const email = (recipient || invoice.customer?.email || '').trim().toLowerCase();
    if (!email) return setToast('This invoice has no customer email. Enter a recipient email address.');
    if (!isValidEmailAddress(email)) return setToast('Enter a valid recipient email address.');
    if (mailSending) return;

    setMailSending(true);
    try {
      await sendInvoiceWithEmailJs(invoice, email);
      setToast(`EmailJS accepted invoice ${invoice.id} for ${email}.`);
    } catch (error) {
      console.error('Invoice email failed:', error);
      setToast(error.message || 'Invoice email failed. Check EmailJS configuration and template.');
    } finally {
      setMailSending(false);
    }
  }
  async function editAndEmailInvoice(invoice) {
    const currentEmail = invoice.customer?.email || '';
    const enteredEmail = window.prompt(
      `Enter or update the email address for ${invoice.id}:`,
      currentEmail
    );

    if (enteredEmail === null) return;

    const email = enteredEmail.trim().toLowerCase();

    if (!isValidEmailAddress(email)) {
      setToast('Please enter a valid email address.');
      return;
    }

    const updatedInvoice = {
      ...invoice,
      customer: { ...invoice.customer, email }
    };

    setDb(prev => ({
      ...prev,
      invoices: prev.invoices.map(item =>
        item.id === invoice.id ? updatedInvoice : item
      )
    }));

    setActiveInvoice(prev =>
      prev?.id === invoice.id ? updatedInvoice : prev
    );

    await emailInvoice(updatedInvoice, email);
  }

  function printInvoice(invoice) {
    const rows = invoice.items.map(x => `<tr><td>${escapeHtml(x.name)}</td><td>${x.qty}</td><td>${currency(x.price)}</td><td>${currency(x.qty * x.price)}</td></tr>`).join('');
    const html = `<!doctype html><html><head><title>${invoice.id}</title><style>body{font:14px Arial,sans-serif;color:#17233d;padding:32px;max-width:760px;margin:auto}h1{margin:0;color:#173f8a}small{color:#64748b}.top{display:flex;justify-content:space-between;border-bottom:2px solid #173f8a;padding-bottom:18px}table{width:100%;border-collapse:collapse;margin:28px 0}th,td{text-align:left;padding:11px;border-bottom:1px solid #dbe3f0}th{background:#eef3fc}.totals{margin-left:auto;width:280px}.totals div{display:flex;justify-content:space-between;padding:6px}.grand{font-size:20px;font-weight:bold;border-top:2px solid #173f8a;padding-top:12px!important}.thanks{text-align:center;margin-top:40px;color:#64748b}</style></head><body><div class="top"><div><h1>${escapeHtml(shop.name)}</h1><p>${escapeHtml(shop.address)}<br>${escapeHtml(shop.phone)}</p></div><div><h2>INVOICE</h2><b>${invoice.id}</b><p>${dateTime(invoice.date)}</p></div></div><p><b>Bill to:</b> ${escapeHtml(invoice.customer.name || 'Walk-in customer')}<br>${escapeHtml(invoice.customer.phone || '')}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><div class="totals"><div><span>Subtotal</span><b>${currency(invoice.subtotal)}</b></div><div><span>Discount</span><b>-${currency(invoice.discountAmount)}</b></div><div><span>GST</span><b>${currency(invoice.gstAmount)}</b></div><div class="grand"><span>Total</span><span>${currency(invoice.total)}</span></div><div><span>Amount received</span><b>${currency(invoice.amountReceived)}</b></div><div><span>Payment</span><b>${escapeHtml(invoice.payment)}</b></div></div><p class="thanks">Thank you for shopping with us.</p><script>window.onload=()=>window.print()<\/script></body></html>`;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return setToast('Allow pop-ups to preview or download the invoice.');
    w.document.write(html); w.document.close();
  }
  function processReturn() {
    const invoice = db.invoices.find(x => x.id.toLowerCase() === returnInvoice.trim().toLowerCase());
    if (!invoice) return setToast('Invoice number not found.');
    const item = invoice.items.find(x => x.productId === returnItem);
    if (!item) return setToast('Select an item from this invoice.');
    const already = (invoice.returnedItems || []).filter(x => x.productId === item.productId).reduce((s, x) => s + x.qty, 0);
    const n = Number(returnQty);
    if (!Number.isInteger(n) || n < 1 || n > item.qty - already) return setToast(`Only ${item.qty - already} units can be returned.`);
    const lineSubtotal = item.qty * item.price;
    const allocatedDiscount = invoice.subtotal > 0 ? invoice.discountAmount * (lineSubtotal / invoice.subtotal) : 0;
    const taxableSubtotal = Math.max(0, invoice.subtotal - invoice.discountAmount);
    const allocatedGst = taxableSubtotal > 0 ? invoice.gstAmount * ((lineSubtotal - allocatedDiscount) / taxableSubtotal) : 0;
    const refund = n * (item.price - allocatedDiscount / item.qty + allocatedGst / item.qty);
    const now = new Date().toISOString();
    const ret = { id: id('RET'), invoiceId: invoice.id, date: now, productId: item.productId, name: item.name, qty: n, refund, method: refundMethod };
    setDb(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === item.productId ? { ...p, stock: p.stock + n } : p),
      invoices: prev.invoices.map(x => x.id === invoice.id ? { ...x, returnedItems: [...(x.returnedItems || []), { productId: item.productId, qty: n, refund, date: now, method: refundMethod }], total: Math.max(0, Number(x.total || 0) - refund), amountReceived: Math.max(0, Number(x.amountReceived || 0) - refund), status: 'PARTIALLY_RETURNED', revisedAt: now } : x),
      returns: [ret, ...prev.returns],
      logs: [{ id: id('LOG'), action: 'RETURN_PROCESSED', detail: `${ret.id} · ${item.name} × ${n} · Refund ${currency(refund)}`, date: now }, ...prev.logs],
    }));
    setReturnQty('1'); setReturnItem(''); setActiveInvoice(prev=>prev?.id===invoice.id?{...prev,total:Math.max(0,Number(prev.total||0)-refund),amountReceived:Math.max(0,Number(prev.amountReceived||0)-refund),returnedItems:[...(prev.returnedItems||[]),{productId:item.productId,qty:n,refund,date:now,method:refundMethod}]}:prev); setToast(`Return recorded. Revised invoice total: ${currency(Math.max(0,invoice.total-refund))}.`);
  }
  function saveProduct(e) {
    e.preventDefault();
    if (!productForm.name.trim() || Number(productForm.price) <= 0 || Number(productForm.stock) < 0) return setToast('Enter a product name, valid price and stock.');
    const now = new Date().toISOString();
    if (editingProduct) {
      setDb(prev => ({ ...prev, products: prev.products.map(p => p.id === editingProduct ? { ...p, ...productForm, stock: Number(productForm.stock), cost: Number(productForm.cost), price: Number(productForm.price) } : p), logs: [{ id: id('LOG'), action: 'PRODUCT_UPDATED', detail: productForm.name, date: now }, ...prev.logs] }));
      setEditingProduct(''); setToast('Product updated.');
    } else {
      const product = { ...productForm, id: id('PRD'), stock: Number(productForm.stock), cost: Number(productForm.cost), price: Number(productForm.price) };
      setDb(prev => ({ ...prev, products: [product, ...prev.products], logs: [{ id: id('LOG'), action: 'PRODUCT_ADDED', detail: product.name, date: now }, ...prev.logs] }));
      setToast('Product added to inventory.');
    }
    setProductForm({ name: '', sku: '', category: 'General', stock: '', cost: '', price: '' });
  }
  function receiveStock(e) {
    e.preventDefault(); const n = Number(stockQty); const p = products.find(x => x.id === stockProduct);
    if (!p || !Number.isInteger(n) || n < 1) return setToast('Select a product and enter a valid quantity.');
    setDb(prev => ({ ...prev, products: prev.products.map(x => x.id === p.id ? { ...x, stock: x.stock + n } : x), logs: [{ id: id('LOG'), action: 'STOCK_RECEIVED', detail: `${p.name} × ${n} · ${currency(stockCost)}`, date: new Date().toISOString() }, ...prev.logs] }));
    setStockQty(''); setStockCost(''); setToast('Stock updated.');
  }
  function deleteProduct(p) {
    if (!confirm(`Remove ${p.name} from active inventory?`)) return;
    setDb(prev => ({ ...prev, products: prev.products.filter(x => x.id !== p.id), logs: [{ id: id('LOG'), action: 'PRODUCT_REMOVED', detail: p.name, date: new Date().toISOString() }, ...prev.logs] }));
  }
  async function bulkEmail() {
    const recipients = [...new Set(mailRecipients.split(/[;,\n]/).map(x => x.trim().toLowerCase()).filter(Boolean))];
    if (!recipients.length || !mailSelection.length) {
      setToast('Select invoices and enter recipient email addresses.');
      return;
    }
    const invalid = recipients.find(email => !isValidEmailAddress(email));
    if (invalid) {
      setToast(`Invalid email address: ${invalid}`);
      return;
    }
    const selectedInvoices = db.invoices.filter(invoice => mailSelection.includes(invoice.id));
    if (!selectedInvoices.length) {
      setToast('No selected invoices were found.');
      return;
    }
    if (mailSending) return;

    setMailSending(true);
    let sent = 0;
    const failures = [];
    try {
      // Send each invoice-recipient pair separately; never expose other recipients.
      // EmailJS free-tier rate limits require spacing between requests.
      for (const invoice of selectedInvoices) {
        for (const recipient of recipients) {
          try {
            await sendInvoiceWithEmailJs(invoice, recipient);
            sent += 1;
          } catch (error) {
            failures.push(`${invoice.id} → ${recipient}: ${error.message}`);
          }
          await new Promise(resolve => window.setTimeout(resolve, 1100));
        }
      }

      if (failures.length) {
        setToast(`${sent} email(s) accepted; ${failures.length} failed. First error: ${failures[0].slice(0, 150)}`);
      } else {
        setToast(`EmailJS accepted ${sent} invoice email(s).`);
        setMailRecipients('');
        setMailSelection([]);
      }
    } finally {
      setMailSending(false);
    }
  }
  const visibleInvoices = db.invoices.filter(x => `${x.id} ${x.customer.name} ${x.customer.phone}`.toLowerCase().includes(invoiceSearch.toLowerCase()));
  const todayKey = new Date().toDateString();
  const todayInvoices = db.invoices.filter(x => new Date(x.date).toDateString() === todayKey);
  const todayReturns = db.returns.filter(x => {
    const originalInvoice = db.invoices.find(invoice => invoice.id === x.invoiceId);
    return originalInvoice && new Date(originalInvoice.date).toDateString() === todayKey;
  });
  const salesToday = todayInvoices.reduce((s, x) => s + x.amountReceived, 0) - todayReturns.reduce((s, x) => s + x.refund, 0);
  const salesSeries = useMemo(() => {
    const now = new Date();
    const periods = [];
    if (salesRange === '1D') {
      for (let i = 23; i >= 0; i--) { const d = new Date(now); d.setMinutes(0,0,0); d.setHours(d.getHours()-i); periods.push({ start:d, end:new Date(d.getTime()+3600000), label:d.toLocaleTimeString('en-IN',{hour:'numeric'}) }); }
    } else if (salesRange === '1W' || salesRange === '1M') {
      const count = salesRange === '1W' ? 7 : 30;
      for (let i = count-1; i >= 0; i--) { const d = new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate()-i); const end=new Date(d); end.setDate(end.getDate()+1); periods.push({start:d,end,label:d.toLocaleDateString('en-IN',{day:'numeric',month:count===7?'short':undefined})}); }
    } else {
      const first = salesRange === '1Y' ? new Date(now.getFullYear(), now.getMonth()-11, 1) : (() => { const dates=[...db.invoices.map(x=>new Date(x.date)),...db.returns.map(x=>new Date(x.date))].filter(d=>!Number.isNaN(d.getTime())); return dates.length ? new Date(Math.min(...dates.map(d=>d.getTime()))) : new Date(now.getFullYear(),now.getMonth()-11,1); })();
      const start = new Date(first.getFullYear(), first.getMonth(), 1);
      const maxMonths = salesRange === '1Y' ? 12 : 36;
      while (start <= now && periods.length < maxMonths) { const d=new Date(start); const end=new Date(d.getFullYear(),d.getMonth()+1,1); periods.push({start:d,end,label:d.toLocaleDateString('en-IN',{month:'short',year:salesRange==='ALL'?'2-digit':undefined})}); start.setMonth(start.getMonth()+1); }
    }
    return periods.map(period => {
      const sold = db.invoices.filter(inv => { const d=new Date(inv.date); return d>=period.start && d<period.end; }).reduce((sum,inv)=>sum+Number(inv.amountReceived ?? inv.total ?? 0),0);
      const refunded = db.returns.filter(ret => { const d=new Date(ret.date); return d>=period.start && d<period.end; }).reduce((sum,ret)=>sum+Number(ret.refund||0),0);
      return {...period, value:Math.max(0,sold-refunded)};
    });
  }, [db.invoices, db.returns, salesRange]);
  const salesTotal = salesSeries.reduce((sum,p)=>sum+p.value,0);
  const previousSeries = useMemo(() => {
    if (salesRange === 'ALL') return [];
    const first = salesSeries[0]?.start;
    if (!first) return [];
    const duration = salesRange === '1D' ? 24*3600000 : salesRange === '1W' ? 7*86400000 : salesRange === '1M' ? 30*86400000 : 365*86400000;
    const start = new Date(first.getTime()-duration), end = first;
    const sold = db.invoices.filter(inv=>{const d=new Date(inv.date);return d>=start&&d<end;}).reduce((a,x)=>a+Number(x.amountReceived??x.total??0),0);
    const refunded = db.returns.filter(ret=>{const d=new Date(ret.date);return d>=start&&d<end;}).reduce((a,x)=>a+Number(x.refund||0),0);
    return [Math.max(0,sold-refunded)];
  }, [db.invoices, db.returns, salesRange, salesSeries]);
  const salesChange = previousSeries.length && previousSeries[0] > 0 ? ((salesTotal-previousSeries[0])/previousSeries[0])*100 : null;
  const chartPoints = salesSeries.map((p,i)=>({ ...p, x: 12 + (i*(676/Math.max(1,salesSeries.length-1))), y: 148 - (p.value/Math.max(1,...salesSeries.map(x=>x.value)))*124 }));
  const chartPath = chartPoints.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const chartArea = chartPath + (chartPoints.length ? ` L ${chartPoints[chartPoints.length-1].x} 154 L ${chartPoints[0].x} 154 Z` : '');
  const nav = [ ['Dashboard', LayoutDashboard], ['New Sale', ReceiptText], ['Invoices', FileText], ['Returns', RotateCcw], ['Inventory', Package], ['Logs & Pricing', ClipboardList] ];

  if (publicInvoice) return <PublicInvoice invoice={publicInvoice} shop={shop} onDownload={() => printInvoice(publicInvoice)} />;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark">D</div><div><b>DEMO</b><span>ONE GRAM JEWELLERY</span></div></div>
      <div className="nav-caption">WORKSPACE</div>
      {nav.map(([name, Icon]) => <button key={name} className={`nav-link ${page === name ? 'active' : ''}`} onClick={() => { setPage(name); setMobileNav(false); }}><Icon size={18}/><span>{name}</span></button>)}
      <div className="sidebar-bottom"><div className="demo-tag">DEMO ENVIRONMENT</div><small>Demo data · Resettable</small></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button><div><div className="breadcrumb">DEMO / WORKSPACE</div><h1>{page}</h1></div><div className="topbar-right"><span className="status-dot"/> Demo mode <button className="reset-btn" onClick={() => { if (confirm('Reset all demo data?')) { localStorage.removeItem(STORE_KEY); setDb(seed); setToast('Demo data reset.'); } }}>Reset demo</button></div></header>
      {toast && <div className="toast"><Check size={16}/>{toast}<button onClick={() => setToast('')}><X size={15}/></button></div>}
      {page === 'Dashboard' && <>
        <section className="welcome"><div><div className="eyebrow">JEWELLERY RETAIL WORKSPACE</div><h2>Business overview</h2><p>Sales, inventory, invoices and returns in one place.</p></div><button className="primary-btn" onClick={() => setPage('New Sale')}><Plus size={17}/> Create new sale</button></section>
        <div className="stat-grid"><Stat icon={Wallet} label="Today's net sales" value={currency(salesToday)} hint={`${todayInvoices.length} invoices · ${todayReturns.length} returns`}/><Stat icon={ReceiptText} label="Invoices created" value={db.invoices.length} hint="All saved invoices"/><Stat icon={Boxes} label="Products in inventory" value={products.length} hint={`${products.reduce((s,p)=>s+p.stock,0)} total units available`}/></div>
        <section className="card sales-chart-card"><div className="sales-chart-heading"><div><CardTitle title="Sales performance" subtitle="Net sales movement · invoices less refunds"/><div className="sales-chart-total">{currency(salesTotal)} <span className={salesChange===null?'trend-neutral':salesChange>=0?'trend-up':'trend-down'}>{salesChange===null?'—':`${salesChange>=0?'↗':'↘'} ${Math.abs(salesChange).toFixed(1)}% vs previous period`}</span></div></div><div className="sales-range">{['1D','1W','1M','1Y','ALL'].map(r=><button key={r} className={salesRange===r?'selected':''} onClick={()=>setSalesRange(r)}>{r}</button>)}</div></div><div className="stock-chart-wrap"><div className="stock-chart-ylabels"><span>{currency(Math.max(0,...salesSeries.map(p=>p.value)))}</span><span>{currency(Math.max(0,...salesSeries.map(p=>p.value))/2)}</span><span>₹0</span></div><svg className="stock-chart" viewBox="0 0 700 170" preserveAspectRatio="none" role="img" aria-label="Sales movement line chart"><defs><linearGradient id="salesAreaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2c69c9" stopOpacity=".22"/><stop offset="100%" stopColor="#2c69c9" stopOpacity="0"/></linearGradient></defs>{[24,86,148].map(y=><line key={y} x1="0" x2="700" y1={y} y2={y} className="stock-gridline"/>)}{chartPoints.length>1&&<path d={chartArea} fill="url(#salesAreaFill)"/>}{chartPoints.length>1&&<path d={chartPath} className="stock-line"/>}{chartPoints.map((p,i)=><g key={`${p.label}-${i}`}><circle cx={p.x} cy={p.y} r="3.5" className="stock-point"><title>{p.label}: {currency(p.value)}</title></circle></g>)}</svg></div><div className="stock-chart-xlabels"><span>{salesSeries[0]?.label}</span><span>{salesSeries[Math.floor((salesSeries.length-1)/2)]?.label}</span><span>{salesSeries[salesSeries.length-1]?.label}</span></div><div className="stock-chart-foot"><span> <i/> Net sales</span><small>{salesSeries.length} data points · INR</small></div></section>
        <div className="content-grid"><section className="card"><CardTitle title="Recent invoices" action="View all" onAction={() => setPage('Invoices')}/>{db.invoices.length ? db.invoices.slice(0,6).map(inv => <InvoiceRow key={inv.id} invoice={inv} onClick={() => {setActiveInvoice(inv);setPage('Invoices');}}/>) : <Empty text="No invoices created yet. Start with a new bill."/>}</section><section className="card"><CardTitle title="Inventory snapshot" action="Manage" onAction={() => setPage('Inventory')}/>{products.slice(0,6).map(p=><div className="stock-row" key={p.id}><div><b>{p.name}</b><small>{p.sku}</small></div><span className={p.stock < 5 ? 'low-stock' : 'stock-count'}>{p.stock} units</span></div>)}</section></div>
      </>}
      {page === 'New Sale' && <>
        <section className="page-intro"><div><div className="eyebrow">POINT OF SALE</div><h2>Create sale</h2><p>Add products, adjust pricing, apply discount and GST, then record payment.</p></div><div className="invoice-date"><CalendarDays size={16}/> {dateTime(new Date())}</div></section>
        <div className="billing-layout"><section className="card billing-card"><CardTitle title="Add products" subtitle="Search by product name or SKU. Only available inventory can be billed."/>
          <div className="pinned-products"><span>Quick add</span>{products.filter(p=>p.pinned).map(p=><button key={p.id} onClick={()=>{setSelected(p.id);setQuery(p.name);}}>{p.name} <b>+</b></button>)}{!products.some(p=>p.pinned)&&<small>Pin frequently sold products from Inventory for quick access.</small>}</div><div className="product-add-row"><div className="field grow"><label>Search inventory</label><div className="input-icon"><Search size={17}/><input value={query} onChange={e=>{setQuery(e.target.value);setSelected('');}} placeholder="Start typing a product name…"/></div>{query && <div className="suggestions">{matches.length ? matches.map(p=><button key={p.id} onClick={()=>{setSelected(p.id);setQuery(p.name);}}><span><b>{p.name}</b><small>{p.sku} · {currency(p.price)}</small></span><em>{p.stock} available</em></button>) : <div className="no-suggestion">No matching product in inventory.</div>}</div>}</div><div className="field qty-field"><label>Quantity</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)}/></div><button className="primary-btn add-btn" onClick={addLine}><Plus size={17}/> Add item</button></div>
          <div className="cart-head"><b>Invoice items</b><span>{cart.length} lines</span></div>{cart.length ? <div className="cart-table"><div className="cart-table-head"><span>Item</span><span>Qty</span><span>Unit price</span><span>Line total</span><span/></div>{cart.map(line=><div className="cart-row" key={line.lineId}><div><b>{line.name}</b><small>Available: {products.find(p=>p.id===line.productId)?.stock ?? 0}</small></div><input aria-label="Quantity" type="number" min="1" max={products.find(p=>p.id===line.productId)?.stock || 1} value={line.qty} onChange={e=>updateLine(line.lineId,'qty',e.target.value)}/><input aria-label="Selling price" type="number" min="0" step="0.01" value={line.price} onChange={e=>updateLine(line.lineId,'price',e.target.value)}/><b>{currency(line.qty*line.price)}</b><button className="icon-action danger-text" onClick={()=>setCart(prev=>prev.filter(x=>x.lineId!==line.lineId))}><Trash2 size={16}/></button></div>)}</div> : <Empty text="No items added. Search inventory above to begin."/>}
          <div className="customer-fields"><div className="field"><label>Customer name <small>Optional</small></label><input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Customer name"/></div><div className="field"><label>WhatsApp number <small>Include country code</small></label><input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="91XXXXXXXXXX"/></div><div className="field"><label>Email address <small>Optional</small></label><input type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})} placeholder="customer@example.com"/></div></div>
        </section><aside className="card summary-card"><CardTitle title="Bill summary" subtitle="Discount and GST can be entered as a percentage or fixed amount."/><div className="adjust-row"><div className="field"><label>Discount</label><input type="number" min="0" value={discount} onChange={e=>setDiscount(e.target.value)}/></div><select value={discountMode} onChange={e=>setDiscountMode(e.target.value)}><option value="percent">%</option><option value="amount">₹</option></select></div><div className="adjust-row"><div className="field"><label>GST</label><input type="number" min="0" value={gst} onChange={e=>setGst(e.target.value)}/></div><select value={gstMode} onChange={e=>setGstMode(e.target.value)}><option value="percent">%</option><option value="amount">₹</option></select></div><div className="summary-lines"><div><span>Subtotal</span><b>{currency(subtotal)}</b></div><div><span>Discount</span><b className="discount-value">− {currency(discountValue)}</b></div><div><span>GST</span><b>{currency(gstValue)}</b></div></div><div className="grand-total"><span>Invoice total</span><strong>{currency(total)}</strong></div><div className="field received-field"><label>Amount received</label><input type="number" min="0" step="0.01" value={received === '' ? (cart.length ? total.toFixed(2) : '') : received} onChange={e=>setReceived(e.target.value)} placeholder="Amount received"/><small>Pre-filled from invoice total. You can edit this amount.</small></div><div className="field"><label>Payment method</label><select value={payment} onChange={e=>setPayment(e.target.value)}><option>Cash</option><option>UPI</option><option>Card</option><option>Bank transfer</option><option>Split payment</option></select></div><button className="primary-btn full-btn" onClick={completeBill} disabled={!cart.length}><ReceiptText size={17}/> Save invoice</button><p className="secure-note">Invoice number and purchase timestamp are generated when you save.</p></aside></div>
      </>}
      {page === 'Invoices' && <>
        <section className="page-intro"><div><div className="eyebrow">SALES RECORDS</div><h2>Invoice register</h2><p>Find, preview, print, download and share saved invoices.</p></div><div className="invoice-search"><Search size={16}/><input placeholder="Search invoice or customer" value={invoiceSearch} onChange={e=>setInvoiceSearch(e.target.value)}/></div></section>
        <section className="card"><CardTitle title="All invoices" subtitle={`${visibleInvoices.length} records`}/>{visibleInvoices.length ? <div className="invoice-list">{visibleInvoices.map(inv=><div className="invoice-card-row" key={inv.id}><div className="invoice-id"><b>{inv.id}</b><small>{dateTime(inv.date)}</small></div><div className="invoice-customer"><b>{inv.customer.name || 'Walk-in customer'}</b><small>{inv.customer.phone || 'No phone number'}</small></div><div className="invoice-amount"><b>{currency(inv.total)}</b><small>{inv.items.length} items · {inv.payment}</small></div><span className="status-pill">{(inv.returnedItems||[]).length ? 'PART RETURNED' : 'PAID'}</span><button className="icon-action" title="Preview invoice" onClick={()=>setActiveInvoice(inv)}><Eye size={17}/></button><button className="icon-action" title="Print / Download PDF" onClick={()=>printInvoice(inv)}><Download size={17}/></button><button className="icon-action" title="Share on WhatsApp" onClick={()=>shareWhatsApp(inv)}><MessageCircle size={17}/></button><button className="icon-action" title="Email invoice" onClick={()=>editAndEmailInvoice(inv)} disabled={mailSending}><Mail size={17}/></button></div>)}</div> : <Empty text="No invoices found."/>}</section>

      </>}
      {page === 'Returns' && <>
        <section className="page-intro"><div><div className="eyebrow">AFTER-SALES</div><h2>Sales returns</h2><p>Find the original invoice, select returned products and record the refund method.</p></div></section>
        <section className="card return-card"><CardTitle title="Process a return" subtitle="Returned quantity is added back to inventory and refund is recorded against the original invoice."/><div className="return-form"><div className="field"><label>Original invoice number</label><input value={returnInvoice} onChange={e=>{setReturnInvoice(e.target.value);setReturnItem('');}} placeholder="INV-…" list="invoice-ids"/><datalist id="invoice-ids">{db.invoices.map(x=><option key={x.id} value={x.id}/>)}</datalist></div><div className="field"><label>Product on invoice</label><select value={returnItem} onChange={e=>setReturnItem(e.target.value)}><option value="">Select invoiced product</option>{(db.invoices.find(x=>x.id.toLowerCase()===returnInvoice.trim().toLowerCase())?.items||[]).map((x,i)=><option key={`${x.productId}-${i}`} value={x.productId}>{x.name} · sold {x.qty} · returned {(db.invoices.find(y=>y.id===returnInvoice)?.returnedItems||[]).filter(r=>r.productId===x.productId).reduce((s,r)=>s+r.qty,0)}</option>)}</select></div><div className="field"><label>Quantity to return</label><input type="number" min="1" value={returnQty} onChange={e=>setReturnQty(e.target.value)}/></div><div className="field"><label>Refund through</label><select value={refundMethod} onChange={e=>setRefundMethod(e.target.value)}><option>Cash</option><option>UPI</option></select></div><button className="primary-btn" onClick={processReturn}><RotateCcw size={17}/> Confirm return</button></div></section>
        <section className="card"><CardTitle title="Return history" subtitle="Previously processed returns."/>{db.returns.length ? db.returns.map(r=><div className="stock-row" key={r.id}><div><b>{r.name} × {r.qty}</b><small>{r.id} · Original {r.invoiceId} · {dateTime(r.date)}</small></div><div className="return-amount"><b>{currency(r.refund)}</b><small>Refunded via {r.method}</small></div></div>) : <Empty text="No returns recorded yet."/>}</section>
      </>}
      {page === 'Inventory' && <>
        <section className="page-intro inventory-intro"><div><div className="eyebrow">PRODUCT CONTROL</div><h2>Inventory</h2><p>Manage your jewellery catalogue, stock levels and selling prices.</p></div><div className="inventory-value"><small>Inventory value · purchase cost</small><strong>{currency(products.reduce((s,p)=>s+p.stock*p.cost,0))}</strong></div></section>
        <section className="card"><CardTitle title={editingProduct ? 'Edit product' : 'Add a product'} subtitle="Product names are shown as text only throughout the billing workspace."/><form className="product-form" onSubmit={saveProduct}><div className="field"><label>Product name</label><input required value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} placeholder="e.g. Gold chain"/></div><div className="field"><label>SKU / code</label><input value={productForm.sku} onChange={e=>setProductForm({...productForm,sku:e.target.value})} placeholder="GC-006"/></div><div className="field"><label>Category</label><input value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}/></div><div className="field"><label>Opening stock</label><input type="number" min="0" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})}/></div><div className="field"><label>Purchase cost (₹)</label><input type="number" min="0" step="0.01" value={productForm.cost} onChange={e=>setProductForm({...productForm,cost:e.target.value})}/></div><div className="field"><label>Selling price (₹)</label><input type="number" min="0.01" step="0.01" required value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})}/></div><div className="form-actions"><button className="primary-btn"><Plus size={16}/>{editingProduct?'Save product':'Add product'}</button>{editingProduct&&<button type="button" className="secondary-btn" onClick={()=>{setEditingProduct('');setProductForm({name:'',sku:'',category:'General',stock:'',cost:'',price:''});}}>Cancel</button>}</div></form></section>
        <section className="card"><CardTitle title="Receive stock" subtitle="Increase available quantity for an existing product."/><form className="stock-form" onSubmit={receiveStock}><div className="field"><label>Product</label><select required value={stockProduct} onChange={e=>setStockProduct(e.target.value)}><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.name} · {p.stock} in stock</option>)}</select></div><div className="field"><label>Quantity received</label><input type="number" min="1" required value={stockQty} onChange={e=>setStockQty(e.target.value)}/></div><div className="field"><label>Total purchase cost (₹)</label><input type="number" min="0" value={stockCost} onChange={e=>setStockCost(e.target.value)}/></div><button className="primary-btn"><Plus size={16}/> Receive stock</button></form></section>
        <section className="card"><CardTitle title="Product catalogue" subtitle={`${products.length} products`}/><div className="inventory-toolbar"><div className="invoice-search"><Search size={16}/><input placeholder="Search product or SKU" value={inventorySearch} onChange={e=>setInventorySearch(e.target.value)}/></div><select value={inventorySort} onChange={e=>setInventorySort(e.target.value)}><option value="name">Name A–Z</option><option value="stock">Lowest stock</option><option value="price">Price: low to high</option></select></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Purchase cost</th><th>Selling price</th><th>Available</th><th>Actions</th></tr></thead><tbody>{[...products].filter(p=>`${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(inventorySearch.toLowerCase())).sort((a,b)=>inventorySort==='stock'?a.stock-b.stock:inventorySort==='price'?a.price-b.price:a.name.localeCompare(b.name)).map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.sku||'—'}</td><td>{p.category}</td><td>{currency(p.cost)}</td><td>{currency(p.price)}</td><td><span className={p.stock<5?'low-stock':'stock-count'}>{p.stock}</span></td><td><button className="text-action" onClick={()=>setDb(prev=>({...prev,products:prev.products.map(x=>x.id===p.id?{...x,pinned:!x.pinned}:x)}))}>{p.pinned?"Unpin":"Pin"}</button><button className="text-action" onClick={()=>{setEditingProduct(p.id);setProductForm({name:p.name,sku:p.sku,category:p.category,stock:String(p.stock),cost:String(p.cost),price:String(p.price)});window.scrollTo({top:0,behavior:'smooth'});}}>Edit</button><button className="text-action danger-text" onClick={()=>deleteProduct(p)}>Remove</button></td></tr>)}</tbody></table></div></section>
      </>}
      {page === 'Logs & Pricing' && <>
        <section className="page-intro"><div><div className="eyebrow">AUDIT TRAIL</div><h2>Logs & pricing</h2><p>Review stock, invoice and return activity. Manage current product pricing in Inventory.</p></div><button className="secondary-btn" onClick={()=>setPage('Inventory')}><Settings2 size={16}/> Manage pricing</button></section>
        <section className="card"><div className="log-toolbar"><CardTitle title="Activity log" subtitle="Latest actions appear first."/><select value={logFilter} onChange={e=>setLogFilter(e.target.value)}><option value="ALL">All activity</option><option value="INVOICE">Invoices</option><option value="RETURN">Returns</option><option value="PRODUCT">Products</option><option value="STOCK">Stock</option></select></div>{db.logs.filter(x=>logFilter==='ALL'||x.action.includes(logFilter)).length ? db.logs.filter(x=>logFilter==='ALL'||x.action.includes(logFilter)).map(x=><div className="log-row" key={x.id}><div className="log-marker"/><div><b>{x.action.replaceAll('_',' ')}</b><p>{x.detail}</p><small>{dateTime(x.date)}</small></div></div>) : <Empty text="No activity matches this filter."/>}</section>
        <section className="card"><CardTitle title="Current price list" subtitle="Selling prices used as defaults when adding items to a bill."/><div className="table-scroll"><table className="data-table"><thead><tr><th>Product</th><th>SKU</th><th>Purchase cost</th><th>Selling price</th><th>Margin / unit</th><th/></tr></thead><tbody>{[...products].filter(p=>`${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(inventorySearch.toLowerCase())).sort((a,b)=>inventorySort==='stock'?a.stock-b.stock:inventorySort==='price'?a.price-b.price:a.name.localeCompare(b.name)).map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.sku}</td><td>{currency(p.cost)}</td><td>{currency(p.price)}</td><td>{currency(p.price-p.cost)}</td><td><button className="text-action" onClick={()=>{setPage('Inventory');setEditingProduct(p.id);setProductForm({name:p.name,sku:p.sku,category:p.category,stock:String(p.stock),cost:String(p.cost),price:String(p.price)});}}>Edit price</button></td></tr>)}</tbody></table></div></section>
      </>}
      <footer className="app-footer">DEMO · One Gram Jewellery · Sample business data is stored in this browser.</footer>
    </main>
    {activeInvoice && <div className="modal-backdrop" onClick={()=>setActiveInvoice(null)}><div className="invoice-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">INVOICE PREVIEW</div><h2>{activeInvoice.id}</h2></div><button className="icon-action" onClick={()=>setActiveInvoice(null)}><X/></button></div><div className="invoice-paper"><div className="paper-brand"><div><h2>{shop.name}</h2><p>{shop.address}<br/>{shop.phone}</p></div><div className="paper-invoice"><b>INVOICE</b><span>{dateTime(activeInvoice.date)}</span></div></div><div className="paper-customer"><b>Bill to</b><input aria-label="Customer name" value={activeInvoice.customer.name||''} placeholder="Customer name" onChange={e=>{const v=e.target.value;setActiveInvoice(x=>({...x,customer:{...x.customer,name:v}}));setDb(d=>({...d,invoices:d.invoices.map(x=>x.id===activeInvoice.id?{...x,customer:{...x.customer,name:v}}:x)}));}}/><input aria-label="Customer phone" value={activeInvoice.customer.phone||''} placeholder="Phone" onChange={e=>{const v=e.target.value;setActiveInvoice(x=>({...x,customer:{...x.customer,phone:v}}));setDb(d=>({...d,invoices:d.invoices.map(x=>x.id===activeInvoice.id?{...x,customer:{...x.customer,phone:v}}:x)}));}}/><input aria-label="Customer email" value={activeInvoice.customer.email||''} placeholder="Email" onChange={e=>{const v=e.target.value;setActiveInvoice(x=>({...x,customer:{...x.customer,email:v}}));setDb(d=>({...d,invoices:d.invoices.map(x=>x.id===activeInvoice.id?{...x,customer:{...x.customer,email:v}}:x)}));}}/></div><table className="paper-table"><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>{activeInvoice.items.map((x,i)=><tr key={i}><td>{x.name}</td><td>{x.qty}</td><td>{currency(x.price)}</td><td>{currency(x.qty*x.price)}</td></tr>)}</tbody></table><div className="paper-totals"><div><span>Subtotal</span><b>{currency(activeInvoice.subtotal)}</b></div><div><span>Discount</span><b>− {currency(activeInvoice.discountAmount)}</b></div><div><span>GST</span><b>{currency(activeInvoice.gstAmount)}</b></div><div className="paper-grand"><span>Total</span><b>{currency(activeInvoice.total)}</b></div><div><span>Amount received</span><b>{currency(activeInvoice.amountReceived)}</b></div><div><span>Paid through</span><b>{activeInvoice.payment}</b></div></div><p className="paper-thanks">Thank you for shopping with us.</p></div><div className="modal-actions"><button className="secondary-btn" onClick={()=>printInvoice(activeInvoice)}><Printer size={16}/> Print / Download PDF</button><button className="secondary-btn" onClick={()=>shareWhatsApp(activeInvoice)}><MessageCircle size={16}/> WhatsApp</button><button className="primary-btn" onClick={()=>editAndEmailInvoice(activeInvoice)} disabled={mailSending}><Mail size={16}/> Email invoice</button></div></div></div>}
  </div>;
}
function PublicInvoice({ invoice, shop, onDownload }) {
  const currency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n || 0));
  const dateTime = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return <main className="public-invoice-page">
    <header className="public-invoice-top"><div className="public-brand-mark">D</div><div><b>{shop.name}</b><small>OFFICIAL INVOICE</small></div><span className="public-secure-label">CUSTOMER COPY</span></header>
    <section className="public-invoice-card">
      <div className="public-invoice-heading"><div><span className="public-kicker">INVOICE DETAILS</span><h1>Thank you for your purchase</h1><p>Your invoice is ready to view and download.</p></div><span className="public-paid-pill">{invoice.status || 'PAID'}</span></div>
      <div className="public-invoice-meta"><div><small>INVOICE NUMBER</small><b>{invoice.id}</b></div><div><small>DATE ISSUED</small><b>{dateTime(invoice.date)}</b></div></div>
      <div className="public-billto"><small>BILLED TO</small><b>{invoice.customer?.name || 'Customer'}</b></div>
      <div className="public-items-wrap"><table className="public-items"><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>{invoice.items.map((item,i)=><tr key={`${item.productId || item.name}-${i}`}><td>{item.name}</td><td>{item.qty}</td><td>{currency(item.price)}</td><td>{currency(item.qty*item.price)}</td></tr>)}</tbody></table></div>
      <div className="public-totals"><div><span>Subtotal</span><b>{currency(invoice.subtotal)}</b></div><div><span>Discount</span><b>− {currency(invoice.discountAmount)}</b></div><div><span>GST</span><b>{currency(invoice.gstAmount)}</b></div><div className="public-grand-total"><span>Total paid</span><strong>{currency(invoice.total)}</strong></div><div><span>Payment method</span><b>{invoice.payment || 'Not specified'}</b></div></div>
      {(invoice.returnedItems || []).length > 0 && <div className="public-return-note">This invoice includes recorded return adjustments.</div>}
      <button className="public-download-btn" onClick={onDownload}><Download size={18}/> Download / Print invoice</button>
      <p className="public-thanks">Thank you for choosing {shop.name}.</p>
    </section>
    <footer className="public-footer">{shop.address} · {shop.phone}<br/>This is a customer invoice view. No account access is available here.</footer>
  </main>;
}

function escapeHtml(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function Stat({icon:Icon,label,value,hint}) { return <div className="stat-card"><div className="stat-label">{label}<Icon size={18}/></div><strong>{value}</strong><small>{hint}</small></div>; }
function CardTitle({title,subtitle,action,onAction}) { return <div className="card-title"><div><h3>{title}</h3>{subtitle&&<p>{subtitle}</p>}</div>{action&&<button className="text-action" onClick={onAction}>{action} <ArrowUpRight size={14}/></button>}</div>; }
function Empty({text}) { return <div className="empty-state">{text}</div>; }
function InvoiceRow({invoice,onClick}) { return <button className="recent-invoice" onClick={onClick}><div><b>{invoice.id}</b><small>{invoice.customer.name||'Walk-in customer'} · {dateOnly(invoice.date)}</small></div><strong>{currency(invoice.total)}</strong><ArrowUpRight size={16}/></button>; }
function StockRow({product}) { return <div className="stock-row"><div><b>{product.name}</b><small>{product.sku}</small></div><span>{product.stock} units</span></div>; }
function InvoiceRowUnused() { return null; }
function AppRoot() { return <App/>; }

createRoot(document.getElementById('root')).render(<AppRoot/>);
