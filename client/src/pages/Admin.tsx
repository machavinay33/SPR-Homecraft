import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, BarChart3, Check, FileImage, Inbox, LayoutDashboard, LogOut, Package, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Enquiry, EnquiryStatus, MediaAsset, Product, ProductStatus } from "@/lib/supabase.types";

type View = "overview" | "products" | "enquiries" | "media";

type ProductForm = {
  name: string;
  category: string;
  description: string;
  price_label: string;
  image_url: string;
  status: ProductStatus;
  featured: boolean;
};

const emptyProduct: ProductForm = { name: "", category: "Custom sofas", description: "", price_label: "", image_url: "", status: "draft", featured: false };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function LoginPanel() {
  const { configured, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await signIn(email, password);
    if (result.error) setError(result.error);
    setSubmitting(false);
  }

  return <main className="admin-login-page"><div className="admin-login-card"><a href="/" className="admin-back-link"><ArrowLeft size={15} /> Back to showroom</a><div className="admin-login-brand"><span>SPR</span><small>HOMECRAFT / ADMIN</small></div><p className="eyebrow">PRIVATE WORKSPACE</p><h1>Run the room<br /><em>behind the room.</em></h1><p className="admin-login-copy">Sign in to manage products, enquiries, and the media library.</p>{!configured && <div className="admin-alert admin-alert--warning">Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in Netlify before signing in.</div>}<form onSubmit={submit} className="admin-login-form"><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@sprhomecraft.com" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required /></label>{error && <p className="admin-form-error">{error}</p>}<button className="button button--gold" type="submit" disabled={submitting || !configured}>{submitting ? "SIGNING IN…" : "SIGN IN"}</button></form><p className="admin-login-footnote">Admin access is controlled by Supabase Auth and the <code>admin_users</code> table.</p></div></main>;
}

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon: typeof Package }) {
  return <article className="admin-stat-card"><div className="admin-stat-icon"><Icon size={17} /></div><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}

export default function Admin() {
  const { session, loading: authLoading, signOut } = useAuth();
  const [view, setView] = useState<View>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productModal, setProductModal] = useState<Product | null | false>(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);

  useEffect(() => {
    if (!session || !supabase) return;
    setDataLoading(true);
    void Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
    ]).then(([productResult, enquiryResult, mediaResult]) => {
      if (productResult.error) toast.error(productResult.error.message); else setProducts((productResult.data ?? []) as Product[]);
      if (enquiryResult.error) toast.error(enquiryResult.error.message); else setEnquiries((enquiryResult.data ?? []) as Enquiry[]);
      if (mediaResult.error) toast.error(mediaResult.error.message); else setMedia((mediaResult.data ?? []) as MediaAsset[]);
      setDataLoading(false);
    });
  }, [session]);

  const filteredProducts = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase())), [productSearch, products]);
  const openProduct = (product?: Product) => { setProductModal(product ?? null); setProductForm(product ? { name: product.name, category: product.category, description: product.description ?? "", price_label: product.price_label ?? "", image_url: product.image_url ?? "", status: product.status, featured: product.featured } : emptyProduct); };

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !productForm.name.trim()) return;
    const payload = { ...productForm, slug: slugify(productForm.name), description: productForm.description || null, price_label: productForm.price_label || null, image_url: productForm.image_url || null };
    const result = productModal ? await supabase.from("products").update(payload).eq("id", productModal.id).select().single() : await supabase.from("products").insert(payload).select().single();
    if (result.error) toast.error(result.error.message); else { const saved = result.data as Product; setProducts((current) => productModal ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]); setProductModal(false); toast.success(productModal ? "Product updated" : "Product created"); }
  }

  async function archiveProduct(product: Product) {
    if (!supabase) return;
    const result = await supabase.from("products").update({ status: "archived" }).eq("id", product.id);
    if (result.error) toast.error(result.error.message); else { setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: "archived" } : item)); toast.success("Product archived"); }
  }

  async function updateEnquiryStatus(enquiry: Enquiry, status: EnquiryStatus) {
    if (!supabase) return;
    const result = await supabase.from("enquiries").update({ status }).eq("id", enquiry.id);
    if (result.error) toast.error(result.error.message); else setEnquiries((current) => current.map((item) => item.id === enquiry.id ? { ...item, status } : item));
  }

  async function uploadMedia(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !mediaFile || !session) return;
    setMediaUploading(true);
    const safeName = mediaFile.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${session.user.id}/${Date.now()}-${safeName}`;
    const upload = await supabase.storage.from("media").upload(path, mediaFile, { upsert: false, contentType: mediaFile.type });
    if (upload.error) { toast.error(upload.error.message); setMediaUploading(false); return; }
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    const kind = mediaFile.type.startsWith("video/") ? "video" : "image";
    const result = await supabase.from("media_assets").insert({ name: mediaFile.name, path, public_url: publicUrl.publicUrl, kind, alt_text: mediaAlt || null, uploaded_by: session.user.id }).select().single();
    if (result.error) toast.error(result.error.message); else { setMedia((current) => [result.data as MediaAsset, ...current]); setMediaFile(null); setMediaAlt(""); toast.success("Media uploaded"); }
    setMediaUploading(false);
  }

  if (authLoading) return <div className="admin-loading">Loading admin workspace…</div>;
  if (!session) return <LoginPanel />;

  const nav: { id: View; label: string; icon: typeof Package }[] = [{ id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "products", label: "Products", icon: Package }, { id: "enquiries", label: "Enquiries", icon: Inbox }, { id: "media", label: "Media library", icon: FileImage }];
  const pendingEnquiries = enquiries.filter((enquiry) => enquiry.status !== "closed").length;

  return <div className="admin-shell"><aside className="admin-sidebar"><a href="/" className="admin-brand"><span>SPR</span><small>HOMECRAFT / ADMIN</small></a><nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><Icon size={17} />{label}</button>)}</nav><div className="admin-sidebar-bottom"><a href="/"><ArrowLeft size={15} /> Public showroom</a><button onClick={() => void signOut()}><LogOut size={15} /> Sign out</button></div></aside><main className="admin-main"><header className="admin-topbar"><div><p className="eyebrow">SPR HOMECRAFT / CONTROL ROOM</p><h1>{view === "overview" ? "A clear view of the work." : nav.find((item) => item.id === view)?.label}</h1></div><div className="admin-user"><span>{session.user.email?.slice(0, 1).toUpperCase()}</span><div><strong>{session.user.email}</strong><small>Administrator</small></div></div></header>{dataLoading && <div className="admin-syncing">Syncing with Supabase…</div>}

      {view === "overview" && <section className="admin-content"><div className="admin-stat-grid"><StatCard label="Published products" value={products.filter((product) => product.status === "published").length} detail={`${products.length} total records`} icon={Package} /><StatCard label="Open enquiries" value={pendingEnquiries} detail={`${enquiries.length} total enquiries`} icon={Inbox} /><StatCard label="Media assets" value={media.length} detail="Storage library records" icon={FileImage} /><StatCard label="Featured pieces" value={products.filter((product) => product.featured).length} detail="Shown across the site" icon={BarChart3} /></div><div className="admin-overview-grid"><article className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">RECENT ENQUIRIES</p><h2>People ready to talk.</h2></div><button className="text-link text-link--dark" onClick={() => setView("enquiries")}>VIEW ALL <ArrowLeft size={14} /></button></div>{enquiries.slice(0, 4).map((enquiry) => <div className="admin-list-row" key={enquiry.id}><div><strong>{enquiry.name}</strong><small>{enquiry.email}</small></div><span className={`status-pill status-pill--${enquiry.status}`}>{enquiry.status.replace("_", " ")}</span></div>)}{!enquiries.length && <div className="admin-empty">No enquiries yet. New showroom submissions will appear here.</div>}</article><article className="admin-panel admin-panel--forest"><p className="eyebrow eyebrow--gold">WORKSPACE NOTE</p><h2>Keep every<br /><em>detail moving.</em></h2><p>Products, enquiries and media are connected to your Supabase project. Use the SQL migration in <code>supabase/migrations</code> before inviting your first admin.</p><button className="button button--gold" onClick={() => setView("products")}>MANAGE PRODUCTS <ArrowLeft size={15} /></button></article></div></section>}

      {view === "products" && <section className="admin-content"><div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search products" /></label><button className="button button--gold" onClick={() => openProduct()}><Plus size={16} /> ADD PRODUCT</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Featured</th><th>Updated</th><th /></tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.id}><td><div className="admin-product-cell">{product.image_url ? <img src={product.image_url} alt="" /> : <span className="admin-image-placeholder"><Package size={16} /></span>}<strong>{product.name}</strong></div></td><td>{product.category}</td><td><span className={`status-pill status-pill--${product.status}`}>{product.status}</span></td><td>{product.featured ? <Check size={17} className="admin-check" /> : "—"}</td><td>{new Date(product.updated_at).toLocaleDateString()}</td><td><div className="admin-row-actions"><button aria-label={`Edit ${product.name}`} onClick={() => openProduct(product)}><Pencil size={15} /></button><button aria-label={`Archive ${product.name}`} onClick={() => void archiveProduct(product)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>{!filteredProducts.length && <div className="admin-empty">No products match this view. Add the first piece to your collection.</div>}</div></section>}

      {view === "enquiries" && <section className="admin-content"><div className="admin-section-intro"><div><p className="eyebrow">INBOX / {enquiries.length} RECORDS</p><h2>Every enquiry is a beginning.</h2></div><p>Keep the first response personal, timely, and tied to the room they are imagining.</p></div><div className="admin-enquiry-list">{enquiries.map((enquiry) => <article className="admin-enquiry-card" key={enquiry.id}><div className="admin-enquiry-top"><div><span className="admin-enquiry-date">{new Date(enquiry.created_at).toLocaleString()}</span><h3>{enquiry.name}</h3><p>{enquiry.email}{enquiry.phone ? ` · ${enquiry.phone}` : ""}</p></div><select value={enquiry.status} onChange={(event) => void updateEnquiryStatus(enquiry, event.target.value as EnquiryStatus)}><option value="new">New</option><option value="in_progress">In progress</option><option value="closed">Closed</option></select></div><p className="admin-enquiry-message">{enquiry.message}</p></article>)}{!enquiries.length && <div className="admin-empty">No enquiries yet. The next conversation will land here.</div>}</div></section>}

      {view === "media" && <section className="admin-content"><div className="admin-section-intro"><div><p className="eyebrow">STORAGE / MEDIA LIBRARY</p><h2>Keep the material close.</h2></div><p>Upload public showroom imagery and video into your Supabase <code>media</code> bucket.</p></div><form className="admin-upload-panel" onSubmit={uploadMedia}><label className="admin-dropzone"><Upload size={22} /><strong>{mediaFile ? mediaFile.name : "Choose an image or video"}</strong><small>Images and MP4 videos · stored in Supabase Storage</small><input type="file" accept="image/*,video/mp4,video/webm" onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)} /></label><label>Alt text<input value={mediaAlt} onChange={(event) => setMediaAlt(event.target.value)} placeholder="Describe this media for accessibility" /></label><button className="button button--gold" disabled={!mediaFile || mediaUploading} type="submit">{mediaUploading ? "UPLOADING…" : "UPLOAD TO STORAGE"} <Upload size={15} /></button></form><div className="admin-media-grid">{media.map((asset) => <article className="admin-media-card" key={asset.id}>{asset.kind === "video" ? <video src={asset.public_url} muted controls /> : <img src={asset.public_url} alt={asset.alt_text ?? asset.name} />}<div><strong>{asset.name}</strong><small>{asset.kind} · {new Date(asset.created_at).toLocaleDateString()}</small></div></article>)}{!media.length && <div className="admin-empty">No uploaded media records yet.</div>}</div></section>}
    </main>{productModal !== false && <div className="admin-modal-backdrop"><form className="admin-modal" onSubmit={saveProduct}><button type="button" className="admin-modal-close" onClick={() => setProductModal(false)} aria-label="Close"><X size={18} /></button><p className="eyebrow">{productModal ? "EDIT PRODUCT" : "NEW PRODUCT"}</p><h2>{productModal ? "Refine the piece." : "Add a piece to the collection."}</h2><label>Product name<input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required /></label><div className="admin-form-grid"><label>Category<input value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} /></label><label>Price label<input value={productForm.price_label} onChange={(event) => setProductForm({ ...productForm, price_label: event.target.value })} placeholder="On enquiry" /></label></div><label>Description<textarea rows={4} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} /></label><label>Image URL<input value={productForm.image_url} onChange={(event) => setProductForm({ ...productForm, image_url: event.target.value })} placeholder="Paste a Supabase public URL" /></label><div className="admin-form-grid"><label>Status<select value={productForm.status} onChange={(event) => setProductForm({ ...productForm, status: event.target.value as ProductStatus })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="admin-checkbox"><input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} /> Featured on showroom</label></div><button className="button button--gold" type="submit">{productModal ? "SAVE CHANGES" : "CREATE PRODUCT"} <Check size={15} /></button></form></div>}</div>;
}
