import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Lock,
  LogOut,
  Search,
  Disc3,
  BookOpen,
  Shirt,
  Watch,
  ShoppingBasket,
  Package,
  AlertTriangle,
  Check,
  X,
  PlusCircle,
  LucideIcon,
  Plane,
  Users,
  ArrowRightLeft,
  CalendarDays,
  Clock,
} from "lucide-react";

// ---------- Types ----------
type Category = "Music" | "Books" | "Clothing" | "Accessories" | "Groceries";

interface Product {
  id: string;
  title: string;
  subtitle: string; // artist / author / brand
  category: Category;
  genre?: string; // only meaningful for Music
  price: number;
  stock: number;
  catalog: string;
  color: string;
}

interface CartLine {
  id: string;
  qty: number;
}

// ---------- Design tokens ----------
const CATEGORY_META: Record<Category, { icon: LucideIcon; color: string }> = {
  Music: { icon: Disc3, color: "#C97A3D" },
  Books: { icon: BookOpen, color: "#3D5A8A" },
  Clothing: { icon: Shirt, color: "#7A3D6E" },
  Accessories: { icon: Watch, color: "#2F7A6B" },
  Groceries: { icon: ShoppingBasket, color: "#8A7A3D" },
};

const GENRE_COLORS: Record<string, string> = {
  Jazz: "#C97A3D",
  Soul: "#B8543A",
  Funk: "#3D8A5C",
  Electronic: "#3D6FA8",
};

const CATEGORIES: Category[] = ["Music", "Books", "Clothing", "Accessories", "Groceries"];

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", title: "Midnight Corridor", subtitle: "Lena Voss", category: "Music", genre: "Jazz", price: 28, stock: 6, catalog: "NF-101", color: GENRE_COLORS.Jazz },
  { id: "p2", title: "Slow Static", subtitle: "The Fernways", category: "Music", genre: "Soul", price: 24, stock: 3, catalog: "NF-102", color: GENRE_COLORS.Soul },
  { id: "p3", title: "Analog Weather", subtitle: "Kilo Frame", category: "Music", genre: "Electronic", price: 32, stock: 9, catalog: "NF-103", color: GENRE_COLORS.Electronic },
  { id: "p4", title: "Nocturne Atlas", subtitle: "Wren Ashby", category: "Books", price: 18, stock: 5, catalog: "NF-104", color: CATEGORY_META.Books.color },
  { id: "p5", title: "Field Notes on Silence", subtitle: "Ines Marlow", category: "Books", price: 22, stock: 0, catalog: "NF-105", color: CATEGORY_META.Books.color },
  { id: "p6", title: "Waxed Canvas Jacket", subtitle: "Northfield Goods", category: "Clothing", price: 128, stock: 4, catalog: "NF-106", color: CATEGORY_META.Clothing.color },
  { id: "p7", title: "Ribbed Wool Sweater", subtitle: "Northfield Goods", category: "Clothing", price: 76, stock: 0, catalog: "NF-107", color: CATEGORY_META.Clothing.color },
  { id: "p8", title: "Brass Compass Keyring", subtitle: "Salt & Iron", category: "Accessories", price: 24, stock: 15, catalog: "NF-108", color: CATEGORY_META.Accessories.color },
  { id: "p9", title: "Leather Card Wallet", subtitle: "Salt & Iron", category: "Accessories", price: 38, stock: 6, catalog: "NF-109", color: CATEGORY_META.Accessories.color },
  { id: "p10", title: "Single-Origin Coffee Beans", subtitle: "Northfield Pantry", category: "Groceries", price: 16, stock: 20, catalog: "NF-110", color: CATEGORY_META.Groceries.color },
  { id: "p11", title: "Wildflower Honey Jar", subtitle: "Northfield Pantry", category: "Groceries", price: 12, stock: 9, catalog: "NF-111", color: CATEGORY_META.Groceries.color },
];

const ADMIN_PASSWORD = "admin123";

function currency(n: number) {
  return `$${n.toFixed(2)}`;
}

// ---------- Product card ----------
function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (id: string) => void;
}) {
  const outOfStock = product.stock <= 0;
  const Icon = CATEGORY_META[product.category].icon;
  const isMusic = product.category === "Music";

  return (
    <div className="group flex flex-col">
      <div
        className="relative aspect-square overflow-hidden rounded-sm border border-black/10"
        style={{ backgroundColor: product.color }}
      >
        <span className="absolute left-3 top-3 z-10 font-mono text-[10px] tracking-widest text-white/70">
          {product.catalog}
        </span>

        {isMusic ? (
          <div
            className="absolute right-[-38%] top-1/2 h-[85%] w-[85%] -translate-y-1/2 rounded-full bg-black/80 shadow-xl transition-transform duration-500 ease-out group-hover:right-[8%]"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at center, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 2px, transparent 5px)",
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-black/80"
              style={{ backgroundColor: product.color }}
            />
          </div>
        ) : (
          <Icon
            size={64}
            strokeWidth={1.25}
            className="absolute bottom-3 right-3 text-white/25 transition-transform duration-300 group-hover:scale-110"
          />
        )}

        {outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <span className="rounded-sm border border-white/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-semibold leading-tight text-[#14121A]">
            {product.title}
          </p>
          <p className="truncate text-sm text-[#14121A]/60">{product.subtitle}</p>
        </div>
        <p className="shrink-0 font-mono text-sm text-[#14121A]">{currency(product.price)}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/90"
          style={{ backgroundColor: product.color }}
        >
          {product.category}
          {product.genre ? ` · ${product.genre}` : ""}
        </span>
        <button
          onClick={() => onAdd(product.id)}
          disabled={outOfStock}
          className="rounded-sm border border-[#14121A] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#14121A] transition-colors hover:bg-[#14121A] hover:text-[#F2EDE4] disabled:cursor-not-allowed disabled:border-[#14121A]/20 disabled:text-[#14121A]/30 disabled:hover:bg-transparent"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

// ---------- Store view ----------
function StoreView({
  products,
  onAdd,
}: {
  products: Product[];
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesQuery =
        query.trim().length === 0 ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="border-b border-[#F2EDE4]/10 bg-[#14121A] px-6 py-14 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E8A33D]">
          Five departments, one counter
        </p>
        <h1 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-[1.05] text-[#F2EDE4] sm:text-5xl">
          Everything under one roof,
          <br />
          catalogued like it matters.
        </h1>
        <p className="mt-4 max-w-md text-sm text-[#F2EDE4]/60">
          Records, reading, wardrobe staples, small goods, and pantry
          essentials — each item numbered, stocked, and ready to go.
        </p>
      </div>

      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[#14121A]/10 bg-[#F2EDE4] px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex items-center gap-2 rounded-sm border border-[#14121A]/20 bg-white px-3 py-2 sm:w-72">
          <Search size={15} className="text-[#14121A]/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the catalog"
            className="w-full bg-transparent text-sm text-[#14121A] outline-none placeholder:text-[#14121A]/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition-colors ${
              category === null
                ? "border-[#14121A] bg-[#14121A] text-[#F2EDE4]"
                : "border-[#14121A]/20 text-[#14121A]/60 hover:border-[#14121A]/50"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition-colors ${
                category === c
                  ? "border-[#14121A] bg-[#14121A] text-[#F2EDE4]"
                  : "border-[#14121A]/20 text-[#14121A]/60 hover:border-[#14121A]/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#F2EDE4] px-6 py-8 sm:px-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="mb-3 text-[#14121A]/20" size={40} />
            <p className="font-serif text-lg text-[#14121A]">Nothing on the shelf for that.</p>
            <p className="mt-1 text-sm text-[#14121A]/50">Try a different search or department.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Cart view ----------
function CartView({
  products,
  cart,
  onQty,
  onRemove,
}: {
  products: Product[];
  cart: CartLine[];
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const [placed, setPlaced] = useState(false);

  const lines = cart
    .map((line) => {
      const product = products.find((p) => p.id === line.id);
      return product ? { product, qty: line.qty } : null;
    })
    .filter((l): l is { product: Product; qty: number } => l !== null);

  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  if (placed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F2EDE4] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6B8F71]">
          <Check className="text-white" size={26} />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-[#14121A]">Order placed</h2>
        <p className="mt-2 max-w-sm text-sm text-[#14121A]/60">
          Your order is on its way to the stockroom. This is a demo checkout,
          so no charge was made and nothing actually shipped.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#F2EDE4] px-6 py-10 sm:px-10">
      <h1 className="font-serif text-2xl font-semibold text-[#14121A]">Your cart</h1>
      {lines.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <ShoppingCart className="mb-3 text-[#14121A]/20" size={40} />
          <p className="font-serif text-lg text-[#14121A]">Your cart is empty.</p>
          <p className="mt-1 text-sm text-[#14121A]/50">Add a few things from the shop.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 divide-y divide-[#14121A]/10 border-y border-[#14121A]/10">
            {lines.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-4 py-4">
                <div
                  className="h-16 w-16 shrink-0 rounded-sm"
                  style={{ backgroundColor: product.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif font-semibold text-[#14121A]">{product.title}</p>
                  <p className="truncate text-sm text-[#14121A]/60">{product.subtitle}</p>
                  <p className="mt-1 font-mono text-xs text-[#14121A]/50">{currency(product.price)} each</p>
                </div>
                <div className="flex items-center gap-2 rounded-sm border border-[#14121A]/20 px-2 py-1">
                  <button
                    onClick={() => onQty(product.id, qty - 1)}
                    className="text-[#14121A]/60 hover:text-[#14121A]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center font-mono text-sm">{qty}</span>
                  <button
                    onClick={() => onQty(product.id, qty + 1)}
                    disabled={qty >= product.stock}
                    className="text-[#14121A]/60 hover:text-[#14121A] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="w-16 shrink-0 text-right font-mono text-sm text-[#14121A]">
                  {currency(product.price * qty)}
                </p>
                <button
                  onClick={() => onRemove(product.id)}
                  className="shrink-0 text-[#14121A]/40 hover:text-[#B8543A]"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit w-full rounded-sm border border-[#14121A]/10 bg-white p-5 lg:w-72">
            <div className="flex items-center justify-between text-sm text-[#14121A]/60">
              <span>Subtotal</span>
              <span className="font-mono">{currency(total)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-[#14121A]/60">
              <span>Shipping</span>
              <span className="font-mono">Free</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#14121A]/10 pt-3 font-serif text-lg font-semibold text-[#14121A]">
              <span>Total</span>
              <span className="font-mono">{currency(total)}</span>
            </div>
            <button
              onClick={() => setPlaced(true)}
              className="mt-5 w-full rounded-sm bg-[#14121A] py-2.5 text-sm font-medium uppercase tracking-wide text-[#F2EDE4] transition-colors hover:bg-[#14121A]/90"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Admin login ----------
function AdminLogin({ onLogin, onCancel }: { onLogin: () => void; onCancel: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#14121A] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-sm border border-[#F2EDE4]/10 bg-[#1C1926] p-8"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8A33D]/15">
          <Lock className="text-[#E8A33D]" size={18} />
        </div>
        <h2 className="mt-4 font-serif text-xl font-semibold text-[#F2EDE4]">Staff access</h2>
        <p className="mt-1 text-sm text-[#F2EDE4]/50">
          Sign in to manage inventory. Demo password: <span className="font-mono text-[#E8A33D]">{ADMIN_PASSWORD}</span>
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="mt-5 w-full rounded-sm border border-[#F2EDE4]/15 bg-transparent px-3 py-2.5 text-sm text-[#F2EDE4] outline-none placeholder:text-[#F2EDE4]/30 focus:border-[#E8A33D]"
        />
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#D9705C]">
            <AlertTriangle size={12} /> Incorrect password. Try again.
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-sm bg-[#E8A33D] py-2.5 text-sm font-medium uppercase tracking-wide text-[#14121A] transition-colors hover:bg-[#E8A33D]/90"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 w-full text-center text-xs text-[#F2EDE4]/40 hover:text-[#F2EDE4]/70"
        >
          Back to shop
        </button>
      </form>
    </div>
  );
}

// ---------- Admin dashboard ----------
function AdminDashboard({
  products,
  onDelete,
  onAdd,
  onLogout,
}: {
  products: Product[];
  onDelete: (id: string) => void;
  onAdd: (p: Omit<Product, "id" | "catalog">) => void;
  onLogout: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    category: CATEGORIES[0] as Category,
    genre: "",
    price: "",
    stock: "",
  });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const stockValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3).length;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    if (!form.title.trim() || !form.subtitle.trim() || isNaN(price) || isNaN(stock)) {
      showToast("Fill out every field with valid values.");
      return;
    }
    onAdd({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category,
      genre: form.category === "Music" && form.genre.trim() ? form.genre.trim() : undefined,
      price,
      stock,
      color:
        form.category === "Music" && form.genre.trim() && GENRE_COLORS[form.genre.trim()]
          ? GENRE_COLORS[form.genre.trim()]
          : CATEGORY_META[form.category].color,
    });
    setForm({ title: "", subtitle: "", category: CATEGORIES[0], genre: "", price: "", stock: "" });
    showToast("Item added to the catalog.");
  }

  function handleDelete(id: string) {
    onDelete(id);
    setConfirmId(null);
    showToast("Item removed from the catalog.");
  }

  return (
    <div className="min-h-[60vh] bg-[#F2EDE4] px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E8A33D]">Staff only</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-[#14121A]">Inventory dashboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-sm border border-[#14121A]/20 px-3 py-1.5 text-xs uppercase tracking-wide text-[#14121A]/70 hover:border-[#14121A]/50"
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-[#14121A]/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-[#14121A]/50">Items in catalog</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-[#14121A]">{products.length}</p>
        </div>
        <div className="rounded-sm border border-[#14121A]/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-[#14121A]/50">Units in stock</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-[#14121A]">{totalStock}</p>
        </div>
        <div className="rounded-sm border border-[#14121A]/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-[#14121A]/50">Stock value</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-[#14121A]">{currency(stockValue)}</p>
        </div>
      </div>

      {lowStock > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-sm border border-[#E8A33D]/40 bg-[#E8A33D]/10 px-4 py-2.5 text-sm text-[#8A5E1E]">
          <AlertTriangle size={15} />
          {lowStock} {lowStock === 1 ? "item has" : "items have"} 3 or fewer left in stock.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <form onSubmit={handleAdd} className="h-fit rounded-sm border border-[#14121A]/10 bg-white p-5">
          <p className="flex items-center gap-1.5 font-serif text-base font-semibold text-[#14121A]">
            <PlusCircle size={16} className="text-[#E8A33D]" /> Add an item
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <label className="text-xs uppercase tracking-wide text-[#14121A]/50">
              Department
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="mt-1 w-full rounded-sm border border-[#14121A]/20 px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-wide text-[#14121A]/50">
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-sm border border-[#14121A]/20 px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-[#14121A]/50">
              Artist / Author / Brand
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="mt-1 w-full rounded-sm border border-[#14121A]/20 px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
              />
            </label>
            {form.category === "Music" && (
              <label className="text-xs uppercase tracking-wide text-[#14121A]/50">
                Genre (optional)
                <input
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  placeholder="e.g. Jazz"
                  className="mt-1 w-full rounded-sm border border-[#14121A]/20 px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
                />
              </label>
            )}
            <div className="flex gap-3">
              <label className="flex-1 text-xs uppercase tracking-wide text-[#14121A]/50">
                Price
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-sm border border-[#14121A]/20 px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
                />
              </label>
              <label className="flex-1 text-xs uppercase tracking-wide text-[#14121A]/50">
                Stock
                <input
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  inputMode="numeric"
                  className="mt-1 w-full rounded-sm border border-[#14121A]/20 px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-1 rounded-sm bg-[#14121A] py-2.5 text-sm font-medium uppercase tracking-wide text-[#F2EDE4] hover:bg-[#14121A]/90"
            >
              Add to catalog
            </button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-sm border border-[#14121A]/10 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#14121A]/10 text-xs uppercase tracking-wide text-[#14121A]/50">
                <th className="px-4 py-3 font-medium">Catalog</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14121A]/10">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-mono text-xs text-[#14121A]/60">{p.catalog}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#14121A]">{p.title}</p>
                    <p className="text-xs text-[#14121A]/50">{p.subtitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#14121A]">{currency(p.price)}</td>
                  <td className="px-4 py-3 font-mono">
                    <span className={p.stock <= 3 ? "text-[#B8543A]" : "text-[#14121A]"}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmId === p.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-sm bg-[#B8543A] px-2 py-1 text-xs text-white hover:bg-[#B8543A]/90"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-sm border border-[#14121A]/20 p-1 text-[#14121A]/60 hover:border-[#14121A]/50"
                          aria-label="Cancel delete"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="inline-flex items-center gap-1 text-xs text-[#14121A]/50 hover:text-[#B8543A]"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#14121A]/40">
                    <Package className="mx-auto mb-2" size={22} />
                    No items in the catalog. Add one on the left.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-sm bg-[#14121A] px-4 py-2.5 text-sm text-[#F2EDE4] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

// ---------- Flights ----------
interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string; // "HH:MM"
  arriveTime: string; // "HH:MM"
  durationMinutes: number;
  stops: number;
  price: number;
}

const AIRLINES = ["Northfield Air", "Meridian Connect", "Skyline Express", "Alto Airways"];

function minutesToLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function seedFromString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash;
}

function generateFlights(origin: string, destination: string, date: string): Flight[] {
  const seed = seedFromString(`${origin.trim().toLowerCase()}-${destination.trim().toLowerCase()}-${date}`);
  const count = 3 + (seed % 3); // 3-5 results
  const flights: Flight[] = [];
  for (let i = 0; i < count; i++) {
    const local = seed + i * 97;
    const airline = AIRLINES[local % AIRLINES.length];
    const departHour = 5 + (local % 17); // 5am - 9pm
    const departMin = (local * 7) % 60;
    const durationMinutes = 75 + (local % 6) * 45; // 1h15 - 4h30
    const stops = local % 5 === 0 ? 1 : 0;
    const arriveTotal = departHour * 60 + departMin + durationMinutes;
    const arriveHour = Math.floor(arriveTotal / 60) % 24;
    const arriveMin = arriveTotal % 60;
    const price = 89 + (local % 14) * 17 + stops * -20;
    flights.push({
      id: `${date}-${i}`,
      airline,
      flightNumber: `${airline.split(" ").map((w) => w[0]).join("")}${100 + (local % 800)}`,
      origin: origin.trim(),
      destination: destination.trim(),
      departTime: `${departHour.toString().padStart(2, "0")}:${departMin.toString().padStart(2, "0")}`,
      arriveTime: `${arriveHour.toString().padStart(2, "0")}:${arriveMin.toString().padStart(2, "0")}`,
      durationMinutes,
      stops,
      price: Math.max(59, price),
    });
  }
  return flights.sort((a, b) => a.price - b.price);
}

function FlightsPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<Flight[] | null>(null);
  const [selected, setSelected] = useState<Flight | null>(null);
  const [booked, setBooked] = useState<{ flight: Flight; reference: string } | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!origin.trim() || !destination.trim() || !date) return;
    setSelected(null);
    setResults(generateFlights(origin, destination, date));
  }

  function swapCities() {
    setOrigin(destination);
    setDestination(origin);
    setResults(null);
  }

  function confirmBooking() {
    if (!selected) return;
    const reference = Math.random().toString(36).slice(2, 8).toUpperCase();
    setBooked({ flight: selected, reference });
  }

  if (booked) {
    const { flight, reference } = booked;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F2EDE4] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6B8F71]">
          <Check className="text-white" size={26} />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-[#14121A]">Flight booked</h2>
        <p className="mt-2 text-sm text-[#14121A]/60">
          {flight.origin} → {flight.destination} on {flight.airline} {flight.flightNumber}
        </p>
        <p className="mt-4 rounded-sm border border-[#14121A]/15 bg-white px-4 py-2 font-mono text-sm tracking-widest text-[#14121A]">
          REF {reference}
        </p>
        <p className="mt-3 max-w-sm text-xs text-[#14121A]/40">
          This is a demo booking. No payment was taken and no seat was
          actually reserved.
        </p>
        <button
          onClick={() => {
            setBooked(null);
            setResults(null);
            setSelected(null);
            setOrigin("");
            setDestination("");
            setDate("");
          }}
          className="mt-6 rounded-sm border border-[#14121A] px-4 py-2 text-xs font-medium uppercase tracking-wide text-[#14121A] hover:bg-[#14121A] hover:text-[#F2EDE4]"
        >
          Book another flight
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-[#F2EDE4]/10 bg-[#14121A] px-6 py-14 sm:px-10">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[#E8A33D]">
          <Plane size={13} /> Northfield Travel
        </p>
        <h1 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-[1.05] text-[#F2EDE4] sm:text-5xl">
          Book a flight,
          <br />
          then let us handle the rest.
        </h1>
        <p className="mt-4 max-w-md text-sm text-[#F2EDE4]/60">
          Search routes and compare times, stops, and fares side by side.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 border-b border-[#14121A]/10 bg-[#F2EDE4] px-6 py-6 sm:flex-row sm:items-end sm:px-10"
      >
        <label className="flex-1 text-xs uppercase tracking-wide text-[#14121A]/50">
          From
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="City or airport"
            required
            className="mt-1 w-full rounded-sm border border-[#14121A]/20 bg-white px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
          />
        </label>
        <button
          type="button"
          onClick={swapCities}
          aria-label="Swap origin and destination"
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-[#14121A]/20 text-[#14121A]/60 hover:border-[#14121A]/50 sm:self-end"
        >
          <ArrowRightLeft size={14} />
        </button>
        <label className="flex-1 text-xs uppercase tracking-wide text-[#14121A]/50">
          To
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="City or airport"
            required
            className="mt-1 w-full rounded-sm border border-[#14121A]/20 bg-white px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-[#14121A]/50 sm:w-40">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full rounded-sm border border-[#14121A]/20 bg-white px-3 py-2 text-sm text-[#14121A] outline-none focus:border-[#E8A33D]"
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-[#14121A]/50 sm:w-32">
          Passengers
          <div className="mt-1 flex items-center gap-2 rounded-sm border border-[#14121A]/20 bg-white px-2 py-2">
            <Users size={13} className="shrink-0 text-[#14121A]/40" />
            <button
              type="button"
              onClick={() => setPassengers((p) => Math.max(1, p - 1))}
              className="text-[#14121A]/60 hover:text-[#14121A]"
              aria-label="Fewer passengers"
            >
              <Minus size={13} />
            </button>
            <span className="w-4 text-center font-mono text-sm text-[#14121A]">{passengers}</span>
            <button
              type="button"
              onClick={() => setPassengers((p) => Math.min(9, p + 1))}
              className="text-[#14121A]/60 hover:text-[#14121A]"
              aria-label="More passengers"
            >
              <Plus size={13} />
            </button>
          </div>
        </label>
        <button
          type="submit"
          className="rounded-sm bg-[#14121A] px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-[#F2EDE4] hover:bg-[#14121A]/90"
        >
          Search flights
        </button>
      </form>

      <div className="bg-[#F2EDE4] px-6 py-8 sm:px-10">
        {results === null ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Plane className="mb-3 text-[#14121A]/20" size={40} />
            <p className="font-serif text-lg text-[#14121A]">Search for a route to see flights.</p>
            <p className="mt-1 text-sm text-[#14121A]/50">Fill in from, to, and a date above.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-lg text-[#14121A]">No flights found for that route.</p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col divide-y divide-[#14121A]/10 border-y border-[#14121A]/10">
            {results.map((f) => (
              <div key={f.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14121A]/5">
                    <Plane size={16} className="text-[#14121A]/60" />
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-[#14121A]">
                      {f.airline} <span className="font-mono text-xs text-[#14121A]/40">{f.flightNumber}</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-3 text-sm text-[#14121A]/60">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {f.departTime} → {f.arriveTime}
                      </span>
                      <span>{minutesToLabel(f.durationMinutes)}</span>
                      <span>{f.stops === 0 ? "Nonstop" : `${f.stops} stop`}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="font-mono text-lg text-[#14121A]">{currency(f.price * passengers)}</p>
                  <button
                    onClick={() => setSelected(f)}
                    className="rounded-sm border border-[#14121A] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-[#14121A] hover:bg-[#14121A] hover:text-[#F2EDE4]"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-sm border border-[#14121A]/10 bg-white p-6">
            <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[#E8A33D]">
              <CalendarDays size={13} /> Review booking
            </p>
            <h3 className="mt-2 font-serif text-xl font-semibold text-[#14121A]">
              {selected.origin} → {selected.destination}
            </h3>
            <div className="mt-3 space-y-1.5 text-sm text-[#14121A]/70">
              <p>{selected.airline} · {selected.flightNumber}</p>
              <p>{date} · {selected.departTime} – {selected.arriveTime} ({minutesToLabel(selected.durationMinutes)})</p>
              <p>{passengers} {passengers === 1 ? "passenger" : "passengers"} · {selected.stops === 0 ? "Nonstop" : `${selected.stops} stop`}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#14121A]/10 pt-3 font-serif text-lg font-semibold text-[#14121A]">
              <span>Total</span>
              <span className="font-mono">{currency(selected.price * passengers)}</span>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 rounded-sm border border-[#14121A]/20 py-2.5 text-xs font-medium uppercase tracking-wide text-[#14121A]/70 hover:border-[#14121A]/50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 rounded-sm bg-[#14121A] py-2.5 text-xs font-medium uppercase tracking-wide text-[#F2EDE4] hover:bg-[#14121A]/90"
              >
                Confirm booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- App ----------
type View = "store" | "cart" | "admin" | "flights";

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [view, setView] = useState<View>("store");
  const [isAdmin, setIsAdmin] = useState(false);
  const [catalogSeq, setCatalogSeq] = useState(112);

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);

  function addToCart(id: string) {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      const product = products.find((p) => p.id === id);
      if (!product) return prev;
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { id, qty: 1 }];
    });
  }

  function updateQty(id: string, qty: number) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const clamped = Math.max(1, Math.min(qty, product.stock));
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: clamped } : l)));
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((l) => l.id !== id));
  }

  function addProduct(p: Omit<Product, "id" | "catalog">) {
    const catalog = `NF-${catalogSeq}`;
    setCatalogSeq((s) => s + 1);
    setProducts((prev) => [...prev, { ...p, id: `p${Date.now()}`, catalog }]);
  }

  function logoutAdmin() {
    setIsAdmin(false);
    setView("store");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F2EDE4] font-sans">
      <header className="flex items-center justify-between border-b border-[#F2EDE4]/10 bg-[#14121A] px-6 py-4 sm:px-10">
        <button
          onClick={() => setView("store")}
          className="font-serif text-lg font-bold tracking-tight text-[#F2EDE4]"
        >
          NORTHFIELD <span className="text-[#E8A33D]">&amp;</span> CO.
        </button>
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setView("store")}
            className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-wide transition-colors ${
              view === "store" ? "bg-[#F2EDE4] text-[#14121A]" : "text-[#F2EDE4]/60 hover:text-[#F2EDE4]"
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setView("cart")}
            className={`relative flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs uppercase tracking-wide transition-colors ${
              view === "cart" ? "bg-[#F2EDE4] text-[#14121A]" : "text-[#F2EDE4]/60 hover:text-[#F2EDE4]"
            }`}
          >
            <ShoppingCart size={13} /> Cart
            {cartCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E8A33D] px-1 font-mono text-[10px] text-[#14121A]">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setView("flights")}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs uppercase tracking-wide transition-colors ${
              view === "flights" ? "bg-[#F2EDE4] text-[#14121A]" : "text-[#F2EDE4]/60 hover:text-[#F2EDE4]"
            }`}
          >
            <Plane size={13} /> Flights
          </button>
          {/* Admin tab is only ever rendered for a signed-in admin. */}
          {isAdmin && (
            <button
              onClick={() => setView("admin")}
              className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs uppercase tracking-wide transition-colors ${
                view === "admin" ? "bg-[#F2EDE4] text-[#14121A]" : "text-[#F2EDE4]/60 hover:text-[#F2EDE4]"
              }`}
            >
              <Lock size={12} /> Admin
            </button>
          )}
        </nav>
      </header>

      <div className="flex-1">
        {view === "store" && <StoreView products={products} onAdd={addToCart} />}
        {view === "cart" && (
          <CartView products={products} cart={cart} onQty={updateQty} onRemove={removeFromCart} />
        )}
        {view === "flights" && <FlightsPage />}
        {view === "admin" &&
          (isAdmin ? (
            <AdminDashboard
              products={products}
              onDelete={deleteProduct}
              onAdd={addProduct}
              onLogout={logoutAdmin}
            />
          ) : (
            <AdminLogin onLogin={() => setIsAdmin(true)} onCancel={() => setView("store")} />
          ))}
      </div>

      <footer className="flex items-center justify-between border-t border-[#14121A]/10 bg-[#F2EDE4] px-6 py-4 text-xs text-[#14121A]/40 sm:px-10">
        <span>© {new Date().getFullYear()} Northfield &amp; Co.</span>
        {/* Deliberately understated: customers browsing the shop won't notice this,
            but it's how staff reach the sign-in screen. */}
        {!isAdmin && (
          <button onClick={() => setView("admin")} className="hover:text-[#14121A]/70">
            Staff sign-in
          </button>
        )}
      </footer>
    </div>
  );
}
