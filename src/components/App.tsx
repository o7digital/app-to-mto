import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  UserRound,
  ShoppingBag,
  Heart,
  Check,
  CheckCheck,
  ShieldCheck,
  Clock3,
  Star,
  CalendarDays,
  SlidersHorizontal,
  LayoutGrid,
  Droplets,
  Zap,
  PaintRoller,
  BrickWall,
  Sprout,
  Sparkles,
  Umbrella,
  Wind,
  Hammer,
  KeyRound,
  WashingMachine,
  Bug,
  Sun,
  Ruler,
  Home,
  Building2,
  Headphones,
  GraduationCap,
  BookOpen,
  Smartphone,
  Bell,
  Plus,
  Send,
  CheckCircle2,
  Circle,
  Download,
  TrendingUp,
  BriefcaseBusiness,
  ClipboardList,
  ChevronLeft,
  Camera,
  BadgeCheck,
  Play,
  Globe2,
  Wrench,
  Settings2,
} from "lucide-react";
import {
  departments,
  services,
  locations,
  initialRequests,
  articles,
  courses,
  suppliers,
  type Service,
} from "../data/catalog";

const iconMap: any = {
  LayoutGrid,
  Droplets,
  Zap,
  PaintRoller,
  BrickWall,
  Sprout,
  Sparkles,
  Umbrella,
  Wind,
  Hammer,
  KeyRound,
  WashingMachine,
  Bug,
  Sun,
  Ruler,
};
const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
const norm = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const photos = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];
const statuses = [
  "Por confirmar",
  "Confirmada",
  "En camino",
  "En servicio",
  "Por validar",
  "Completada",
];
type Request = (typeof initialRequests)[number];
type View =
  | "home"
  | "catalog"
  | "directory"
  | "academy"
  | "magazine"
  | "launch"
  | "client"
  | "partner"
  | "operations"
  | "mobile";
function Mark() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="43"
      height="43"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#f68442" />
      <path d="m10 23 14-12 14 12v16H28V27h-8v12H10V23Z" fill="#153e35" />
      <path
        d="m20 22 4-3 4 3"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Photo({
  index = 0,
  className = "",
  label = "Servicio de mantenimiento",
}: {
  index?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={"service-photo " + className}
      style={{ backgroundPosition: photos[index] }}
    />
  );
}
function Status({ value }: { value: string }) {
  return (
    <span
      className={
        "status " +
        (value === "Completada"
          ? "done"
          : value === "Por confirmar"
            ? "pending"
            : "active")
      }
    >
      <i />
      {value}
    </span>
  );
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prev = document.activeElement as HTMLElement;
    ref.current?.querySelector<HTMLElement>("button,input,select")?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled]),input,textarea,select,a[href]",
          ) || [],
        );
        if (!nodes.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", listener);
      prev?.focus();
    };
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={ref}
        className={"modal " + (wide ? "wide" : "")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [directoryType, setDirectoryType] = useState("Servicios");
  const [supplierIndex, setSupplierIndex] = useState(0);
  const [category, setCategory] = useState("Todos");
  const [location, setLocation] = useState("CDMX");
  const [query, setQuery] = useState("");
  const [onlyToday, setOnlyToday] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [saved, setSaved] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [step, setStep] = useState(0);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [slot, setSlot] = useState("10:00–12:00");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(20);
  const [bookedId, setBookedId] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const [articleIndex, setArticleIndex] = useState(0);
  const [courseIndex, setCourseIndex] = useState(0);
  const [lesson, setLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: "assistant",
      text: "Hola, soy Olivia. Te ayudo a encontrar un servicio, preparar una solicitud o contactar a soporte. ¿Qué necesita tu casa?",
    },
  ]);
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [opsFilter, setOpsFilter] = useState("Todas");
  const [partnerTab, setPartnerTab] = useState("Agenda");
  const [mobileRole, setMobileRole] = useState("Cliente");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tickets, setTickets] = useState<
    { id: string; subject: string; status: string }[]
  >([]);
  const [signupDone, setSignupDone] = useState(false);
  const [partnerDone, setPartnerDone] = useState(false);
  const [storageOK, setStorageOK] = useState(true);
  useEffect(() => {
    try {
      const savedState = JSON.parse(
        localStorage.getItem("atm-demo-v1") || "null",
      );
      if (savedState) {
        setSaved(savedState.saved || []);
        setCart(savedState.cart || []);
        setRequests(savedState.requests || initialRequests);
        setTickets(savedState.tickets || []);
        setCompletedLessons(savedState.completedLessons || []);
      }
    } catch {
      setStorageOK(false);
    }
    setLoaded(true);
    const route = window.location.hash.slice(1) as View;
    if (
      [
        "home",
        "catalog",
        "directory",
        "academy",
        "magazine",
        "launch",
        "client",
        "partner",
        "operations",
        "mobile",
      ].includes(route)
    )
      setView(route);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        "atm-demo-v1",
        JSON.stringify({ saved, cart, requests, tickets, completedLessons }),
      );
    } catch {
      setStorageOK(false);
    }
  }, [loaded, saved, cart, requests, tickets, completedLessons]);
  useEffect(() => {
    const listener = () => {
      const hash = window.location.hash.slice(1) as View;
      if (
        [
          "home",
          "catalog",
          "directory",
          "academy",
          "magazine",
          "launch",
          "client",
          "partner",
          "operations",
          "mobile",
        ].includes(hash)
      )
        setView(hash);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  const go = (v: View) => {
    setView(v);
    setMenuOpen(false);
    window.location.hash = v;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const chooseCategory = (c: string) => {
    setCategory(c);
    setQuery("");
    go("catalog");
  };
  const openService = (s: Service) => {
    setSelected(s);
    setStep(0);
    setQuantity(20);
    setAddress("");
    setNotes("");
  };
  const toggleSaved = (id: string) =>
    setSaved((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  const addCart = (id: string) => {
    setCart((old) => (old.includes(id) ? old : [...old, id]));
    setToast("Servicio añadido a tu lista");
  };
  const total = (s: Service) =>
    s.id === "pint-01" ? s.price * quantity : s.price;
  const book = () => {
    if (!selected) return;
    const id = "MT-" + String(Date.now()).slice(-6);
    const r: Request = {
      id,
      serviceId: selected.id,
      service: selected.name,
      provider: selected.provider,
      date: bookingDate,
      slot,
      status: "Por confirmar",
      amount: total(selected),
      address: address + " · " + location,
      notes,
      tech: "Sin asignar",
      evidence: false,
    };
    setRequests((old) => [r, ...old]);
    setCart((old) => old.filter((x) => x !== selected.id));
    setBookedId(id);
    setStep(3);
  };
  const updateRequest = (id: string, change: Partial<Request>) => {
    setRequests((old) =>
      old.map((r) => (r.id === id ? { ...r, ...change } : r)),
    );
    if (activeRequest?.id === id)
      setActiveRequest({ ...activeRequest, ...change });
    setToast("Solicitud actualizada en esta demostración");
  };
  const filtered = services
    .filter(
      (s) =>
        (category === "Todos" || s.category === category) &&
        s.area.includes(location) &&
        (!onlyToday || s.today) &&
        (!query ||
          norm(
            s.name + " " + s.category + " " + s.provider + " " + s.desc,
          ).includes(norm(query))),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "rating"
          ? Number(b.rating) - Number(a.rating)
          : 0,
    );
  const chat = (text: string) => {
    if (!text.trim()) return;
    const n = norm(text);
    let response =
      "Puedo ayudarte a buscar un profesional, consultar tus solicitudes o abrir un caso con soporte. Para una cotización final, el profesional deberá confirmar el alcance.";
    if (/fuga|agua|plom/.test(n))
      response =
        "Para una fuga visible puedes solicitar Plomería desde $490 MXN por visita en esta demo. No incluye refacciones ni obra civil. Abre “Ver plomería” para consultar el alcance y la disponibilidad.";
    else if (/electric|luz|cable/.test(n))
      response =
        "La revisión eléctrica cuesta desde $650 MXN en esta demo. Si hay humo, chispas u olor a quemado, aléjate y contacta a los servicios de emergencia. No manipules la instalación.";
    else if (/solicitud|pedido|estado/.test(n))
      response = `Tienes ${requests.filter((r) => r.status !== "Completada").length} solicitudes abiertas en esta demostración. Puedes ver sus estados desde “Mi hogar”.`;
    else if (/humano|soporte|reclamo|fraude/.test(n)) {
      const ticket = {
        id: "SUP-" + String(Date.now()).slice(-5),
        subject: text,
        status: "Abierto",
      };
      setTickets((old) => [ticket, ...old]);
      response = `Creé el caso ${ticket.id} en la bandeja de soporte de esta demo. Puedes verlo en Operaciones. No se ha enviado a un equipo real.`;
    }
    setMessages((old) => [
      ...old,
      { role: "user", text },
      { role: "assistant", text: response },
    ]);
    setChatText("");
  };
  const serviceCard = (s: Service) => (
    <article className="service-card" key={s.id}>
      <div className="card-image">
        <button
          className="photo-button"
          onClick={() => openService(s)}
          aria-label={"Ver " + s.name}
        >
          <Photo index={s.photo} label={s.category} />
        </button>
        {s.badge && <span className="image-badge">{s.badge}</span>}
        <button
          className={"save-btn " + (saved.includes(s.id) ? "saved" : "")}
          onClick={() => toggleSaved(s.id)}
          aria-label={
            saved.includes(s.id) ? "Quitar de favoritos" : "Guardar " + s.name
          }
        >
          <Heart
            size={18}
            fill={saved.includes(s.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="card-content">
        <div className="card-category">
          {s.category}
          <span>
            <Star size={12} fill="currentColor" />
            {s.rating}
            <small>({s.reviews})</small>
          </span>
        </div>
        <button className="card-title" onClick={() => openService(s)}>
          {s.name}
        </button>
        <p className="provider-name">
          <BadgeCheck size={14} />
          {s.provider}
        </p>
        <div className="availability">
          <i className={s.today ? "" : "muted-dot"} />
          {s.today ? "Disponible hoy" : "Con cita previa"}
          <span>· {location}</span>
        </div>
        <div className="price-row">
          <div>
            <small>Desde</small>
            <strong>
              {money(s.price)} <em>MXN</em>
            </strong>
            <span>{s.unit}</span>
          </div>
          <button
            className="circle-arrow"
            onClick={() => openService(s)}
            aria-label={"Reservar " + s.name}
          >
            <ArrowUpRight size={21} />
          </button>
        </div>
      </div>
    </article>
  );
  const Heading = ({
    eyebrow,
    title,
    desc,
    children,
  }: {
    eyebrow?: string;
    title: string;
    desc?: string;
    children?: React.ReactNode;
  }) => (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {children}
    </div>
  );
  const RequestList = ({ interactive = false }: { interactive?: boolean }) => (
    <div className="requests-list">
      {requests.map((r) => (
        <button
          key={r.id}
          className="request-row"
          onClick={() => setActiveRequest(r)}
        >
          <div className="request-icon">
            <Wrench size={21} />
          </div>
          <div className="request-main">
            <small>
              {r.id} · {r.date}
            </small>
            <strong>{r.service}</strong>
            <span>
              {r.provider} · {r.slot}
            </span>
          </div>
          <Status value={r.status} />
          <ChevronRight size={18} />
        </button>
      ))}
      {requests.length === 0 && (
        <p className="empty">
          Todavía no hay solicitudes. Explora los servicios para crear una.
        </p>
      )}
    </div>
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Ir al contenido
      </a>
      <div className="concept-bar">
        <span>
          <span className="tiny-dot" /> Hecho para la vida real. Pensado para tu
          hogar.
        </span>
        <span>Concepto interactivo · datos y precios ilustrativos</span>
      </div>
      <header className="header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => go("home")}
            aria-label="App to mantenimiento, inicio"
          >
            <Mark />
            <span>
              <b>app to</b>
              <strong>
                mantenimiento<span>.</span>
              </strong>
            </span>
          </button>
          <button
            className="location-button"
            onClick={() => setModal("location")}
          >
            <MapPin size={21} />
            <span>
              <small>Servicios cerca de ti</small>
              <b>{location}</b>
            </span>
            <ChevronDown size={13} />
          </button>
          <form
            className="searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              setCategory("Todos");
              go("catalog");
            }}
          >
            <input
              aria-label="Buscar servicios"
              placeholder="¿Qué necesita tu casa?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button aria-label="Buscar">
              <Search size={21} />
            </button>
          </form>
          <button className="header-account" onClick={() => go("client")}>
            <UserRound size={22} />
            <span>
              <small>Hola, bienvenida/o</small>
              <b>Mi hogar</b>
            </span>
          </button>
          <button
            className="cart-btn"
            onClick={() => setModal("cart")}
            aria-label={"Mi lista, " + cart.length + " servicios"}
          >
            <ShoppingBag size={23} />
            <span>{cart.length}</span>
          </button>
          <button
            className="mobile-menu icon-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <Menu />
          </button>
        </div>
      </header>
      <nav
        className={"main-nav " + (menuOpen ? "open" : "")}
        aria-label="Navegación principal"
      >
        <div className="nav-inner">
          <button onClick={() => setModal("departments")}>
            <Menu size={17} /> Todos los departamentos
          </button>
          <div className="nav-links">
            {[
              ["home", "Explorar"],
              ["directory", "Profesionales"],
              ["academy", "Academia"],
              ["magazine", "Revista & tips"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={view === v ? "current" : ""}
                onClick={() => go(v as View)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <button onClick={() => go("launch")}>
              Conoce el proyecto
              <ArrowUpRight size={14} />
            </button>
            <button
              className={view === "partner" ? "current" : ""}
              onClick={() => go("partner")}
            >
              Soy profesional
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>
      <main id="main">
        {view === "home" && (
          <>
            <div className="container">
              <section className="hero">
                <div className="hero-copy">
                  <span className="hero-kicker">
                    <span /> TU HOGAR MERECE ESTAR BIEN
                  </span>
                  <h1>
                    Tu casa, en <br />
                    buenas manos<span>.</span>
                  </h1>
                  <p>
                    Encuentra a quien resuelva los pendientes.
                    <br />
                    Recupera tiempo para lo que de verdad importa.
                  </p>
                  <div className="hero-actions">
                    <button
                      className="btn orange"
                      onClick={() => go("catalog")}
                    >
                      Encuentra tu servicio
                      <ArrowRight size={18} />
                    </button>
                    <button
                      className="hero-text-link"
                      onClick={() => go("launch")}
                    >
                      Así funciona
                      <Play size={14} />
                    </button>
                  </div>
                  <div className="hero-promises">
                    <span>
                      <ShieldCheck size={17} /> Perfiles y alcances claros
                    </span>
                    <span>
                      <CalendarDays size={17} /> Tú eliges cuándo
                    </span>
                  </div>
                </div>
                <div className="hero-image">
                  <img
                    src="/images/home-service.png"
                    alt="Profesional de mantenimiento en una casa luminosa"
                  />
                  <div className="hero-image-label">
                    <span className="check-seal">
                      <Check size={19} />
                    </span>
                    <div>
                      <b>Un pendiente menos.</b>
                      <span>Y más tiempo para ti.</span>
                    </div>
                    <span className="sun-doodle">✳</span>
                  </div>
                  <span className="photo-caption">Imagen conceptual</span>
                </div>
              </section>
              <section className="departments-section">
                <Heading title="¿Qué necesita tu hogar?">
                  <button
                    className="text-link"
                    onClick={() => setModal("departments")}
                  >
                    Ver departamentos <ArrowRight size={16} />
                  </button>
                </Heading>
                <div className="department-grid">
                  {departments.slice(1, 9).map((d, i) => {
                    const Icon = iconMap[d.icon];
                    return (
                      <button
                        key={d.name}
                        className={"department d" + i}
                        onClick={() => chooseCategory(d.name)}
                      >
                        <span>
                          <Icon strokeWidth={1.65} size={28} />
                        </span>
                        <b>{d.name}</b>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="popular-section">
                <Heading
                  eyebrow="RESUELVE HOY, DISFRUTA MAÑANA"
                  title="Un buen lugar para empezar"
                  desc="Servicios que hacen la diferencia en tu día a día."
                >
                  <button className="text-link" onClick={() => go("catalog")}>
                    Explorar servicios <ArrowRight size={16} />
                  </button>
                </Heading>
                <div className="service-grid">
                  {services
                    .filter((s) => s.area.includes(location))
                    .slice(0, 4)
                    .map(serviceCard)}
                </div>
                <p className="demo-caption">
                  Catálogo de ejemplo. Los perfiles, reseñas, disponibilidades y
                  precios mostrados son ilustrativos.
                </p>
              </section>
              <section className="confidence-strip">
                <div className="confidence-intro">
                  <ShieldCheck size={32} />
                  <h3>
                    La confianza <br />
                    está en los detalles.
                  </h3>
                </div>
                <div>
                  <b>Sabes a quién contratas</b>
                  <p>
                    Perfil, especialidad y controles de identidad previstos.
                  </p>
                </div>
                <div>
                  <b>Todo queda por escrito</b>
                  <p>Alcance, cotización y cambios autorizados.</p>
                </div>
                <div>
                  <b>Acompañamiento de principio a fin</b>
                  <p>Seguimiento, evidencias y canal de soporte.</p>
                </div>
              </section>
              <section className="discovery-grid">
                <div className="academy-promo">
                  <span className="eyebrow">ACADEMIA · APRENDE Y CRECE</span>
                  <h2>
                    El conocimiento
                    <br />
                    también cuida tu casa.
                  </h2>
                  <p>
                    Guías para tu hogar. Capacitación para quienes lo hacen
                    posible.
                  </p>
                  <button className="btn white" onClick={() => go("academy")}>
                    Descubre la academia
                    <ArrowUpRight size={17} />
                  </button>
                  <GraduationCap
                    className="promo-icon"
                    size={130}
                    strokeWidth={0.7}
                  />
                </div>
                <div className="magazine-promo">
                  <Photo index={3} />
                  <div>
                    <span className="eyebrow">
                      REVISTA · CASA EN EQUILIBRIO
                    </span>
                    <h2>
                      Pequeños cambios.
                      <br />
                      Mejores espacios.
                    </h2>
                    <button
                      className="text-link"
                      onClick={() => go("magazine")}
                    >
                      Inspírate aquí
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </section>
              <section className="partner-strip">
                <div className="partner-symbol">
                  <Wrench size={30} />
                </div>
                <div>
                  <h2>Tu talento merece más oportunidades.</h2>
                  <p>
                    Profesionales, empresas y proveedores: hay un lugar para
                    ustedes.
                  </p>
                </div>
                <button className="btn dark" onClick={() => go("partner")}>
                  Quiero ser socio
                  <ArrowUpRight size={17} />
                </button>
              </section>
            </div>
          </>
        )}

        {view === "catalog" && (
          <div className="container page">
            <div className="breadcrumbs">
              <button onClick={() => go("home")}>Inicio</button>
              <ChevronRight size={13} />
              Servicios
              <ChevronRight size={13} />
              {category}
            </div>
            <Heading
              eyebrow="EL MARKETPLACE DE TU HOGAR"
              title={
                category === "Todos" ? "Todo lo que tu casa necesita" : category
              }
              desc={`Explora profesionales y servicios en ${location}.`}
            />
            <div className="catalog-layout">
              <aside className="filters">
                <h3>
                  <SlidersHorizontal size={18} /> Encuentra tu servicio
                </h3>
                <label>
                  Tu zona
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={onlyToday}
                    onChange={(e) => setOnlyToday(e.target.checked)}
                  />
                  Disponible hoy
                </label>
                <div className="filter-title">DEPARTAMENTOS</div>
                {departments.map((d) => {
                  const Icon = iconMap[d.icon];
                  return (
                    <button
                      className={category === d.name ? "selected" : ""}
                      key={d.name}
                      onClick={() => {
                        setCategory(d.name);
                        setQuery("");
                      }}
                    >
                      <Icon size={16} />
                      {d.name}
                      <span>
                        {
                          services.filter(
                            (s) =>
                              s.area.includes(location) &&
                              (d.name === "Todos" || s.category === d.name),
                          ).length
                        }
                      </span>
                    </button>
                  );
                })}
              </aside>
              <div className="catalog-results">
                <div className="results-toolbar">
                  <span>
                    <b>{filtered.length}</b> servicios{" "}
                    {query && <>para “{query}”</>}
                  </span>
                  <label>
                    Ordenar por{" "}
                    <select
                      aria-label="Ordenar servicios"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="recommended">Recomendados</option>
                      <option value="price">Menor precio base</option>
                      <option value="rating">Mejor valoración</option>
                    </select>
                  </label>
                </div>
                {filtered.length ? (
                  <div className="service-grid three">
                    {filtered.map(serviceCard)}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Search size={35} />
                    <h3>No hay coincidencias en esta zona.</h3>
                    <p>
                      Prueba otra categoría, cambia la ubicación o elimina el
                      filtro de disponibilidad.
                    </p>
                    <button
                      className="btn dark"
                      onClick={() => {
                        setCategory("Todos");
                        setQuery("");
                        setOnlyToday(false);
                      }}
                    >
                      Ver todos los servicios
                    </button>
                  </div>
                )}
                <p className="demo-caption">
                  Precios orientativos de demostración en MXN. Verifica alcance,
                  materiales, traslado e impuestos en cada cotización final.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === "directory" && (
          <div className="container page">
            <Heading
              eyebrow="EL TALENTO DETRÁS DE TU HOGAR"
              title="Personas que saben. Negocios que crecen."
              desc="Explora el directorio por especialidad y zona. Todos los perfiles son ejemplos del futuro marketplace."
            />
            <div className="dashboard-tabs">
              {["Servicios", "Materiales & equipos", "Formación"].map((t) => (
                <button
                  key={t}
                  className={directoryType === t ? "active" : ""}
                  onClick={() => {
                    setDirectoryType(t);
                    setCategory("Todos");
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="directory-toolbar">
              <select
                aria-label="Categoría de proveedor"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
              <select
                aria-label="Zona de proveedor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button
                className="btn dark"
                onClick={() => {
                  setPartnerDone(false);
                  setModal("partner");
                }}
              >
                Registrar mi negocio
                <Plus size={16} />
              </button>
            </div>
            <div className="provider-grid">
              {directoryType !== "Servicios" &&
                suppliers
                  .map((s, i) => ({ s, i }))
                  .filter(
                    ({ s }) =>
                      s.areas.includes(location) &&
                      (category === "Todos" || category === s.category) &&
                      (directoryType === "Formación"
                        ? s.type === "Formación"
                        : s.type !== "Formación"),
                  )
                  .map(({ s, i }) => (
                    <article className="provider-card" key={s.name}>
                      <div className="provider-card-top">
                        <div className={"avatar av" + (i % 4)}>
                          <Building2 size={25} />
                        </div>
                        <span className="tag">Proveedor demo</span>
                      </div>
                      <h3>{s.name}</h3>
                      <span className="provider-specialty">
                        {s.category} · {s.type}
                      </span>
                      <p>
                        <MapPin size={15} />
                        {s.areas.join(" · ")}
                      </p>
                      <p className="supplier-specialty">{s.specialty}</p>
                      <div className="provider-controls">
                        <small>
                          Ficha ilustrativa · sin existencias ni contacto real
                        </small>
                      </div>
                      <button
                        className="btn outline full"
                        onClick={() => {
                          setSupplierIndex(i);
                          setModal("supplier");
                        }}
                      >
                        Ver ficha
                        <ArrowUpRight size={16} />
                      </button>
                    </article>
                  ))}
              {directoryType === "Servicios" &&
                services
                  .filter(
                    (s) =>
                      s.area.includes(location) &&
                      (category === "Todos" || category === s.category),
                  )
                  .map((s, i) => (
                    <article className="provider-card" key={s.id}>
                      <div className="provider-card-top">
                        <div className={"avatar av" + (i % 4)}>
                          {s.provider
                            .split(" ")
                            .slice(0, 2)
                            .map((x) => x[0])
                            .join("")}
                        </div>
                        <span className="tag">Perfil demo</span>
                      </div>
                      <h3>{s.provider}</h3>
                      <span className="provider-specialty">{s.category}</span>
                      <p>
                        <MapPin size={15} />
                        {s.area.join(" · ")}
                      </p>
                      <div className="provider-rating">
                        <Star size={15} fill="currentColor" />
                        {s.rating}
                        <span>· {s.reviews} reseñas ilustrativas</span>
                      </div>
                      <div className="provider-controls">
                        <span>
                          <Check size={14} />
                          Identidad
                        </span>
                        <span>
                          <Check size={14} />
                          Experiencia
                        </span>
                        <small>Controles propuestos para el lanzamiento</small>
                      </div>
                      <button
                        className="btn outline full"
                        onClick={() => openService(s)}
                      >
                        Ver perfil y servicio
                        <ArrowUpRight size={16} />
                      </button>
                    </article>
                  ))}
            </div>
            <section className="network-callout">
              <Building2 size={35} />
              <div>
                <h3>Una red de negocios, muchas posibilidades.</h3>
                <p>
                  Canales de incorporación previstos: socios actuales de Victor,
                  cámaras empresariales como COPARMEX, portal ARRIBA y
                  profesionales independientes. Alianzas sujetas a acuerdo; sin
                  afiliación confirmada.
                </p>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setPartnerDone(false);
                  setModal("partner");
                }}
              >
                Explorar una alianza
                <ArrowRight size={16} />
              </button>
            </section>
          </div>
        )}

        {view === "academy" && (
          <div className="container page">
            <section className="editorial-hero">
              <div>
                <span className="eyebrow">ACADEMIA APP TO MANTENIMIENTO</span>
                <h1>
                  Más conocimiento.
                  <br />
                  Mejor mantenimiento.
                </h1>
                <p>
                  Para quienes cuidan su casa y para quienes hacen de ese
                  cuidado su profesión.
                </p>
                <div className="pill-row">
                  <span>Hogar</span>
                  <span>Profesionales</span>
                  <span>Negocio y atención</span>
                </div>
              </div>
              <GraduationCap size={160} strokeWidth={0.65} />
            </section>
            <Heading
              title="Aprende algo útil hoy"
              desc="Cursos de muestra. No acreditan formación profesional ni sustituyen certificaciones."
            />
            <div className="course-grid">
              {courses.map((c, i) => (
                <article className="course-card" key={c.id}>
                  <Photo index={c.photo} />
                  <div>
                    <span className="eyebrow">{c.category}</span>
                    <h3>{c.title}</h3>
                    <p>
                      <Clock3 size={15} />
                      {c.duration} · {c.lessons.length} lecciones
                    </p>
                    <div className="progress-track">
                      <span
                        style={{
                          width:
                            (c.lessons.filter((_, j) =>
                              completedLessons.includes(c.id + "-" + j),
                            ).length /
                              c.lessons.length) *
                              100 +
                            "%",
                        }}
                      />
                    </div>
                    <button
                      className="text-link"
                      onClick={() => {
                        setCourseIndex(i);
                        setLesson(0);
                        setModal("course");
                      }}
                    >
                      Explorar curso
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {view === "magazine" && (
          <div className="container page">
            <div className="magazine-masthead">
              <span>LA REVISTA DE TU HOGAR</span>
              <h1>Casa en equilibrio</h1>
              <p>Ideas útiles. Espacios vivos. Menos pendientes.</p>
              <small>Nombre editorial de concepto · marca por validar</small>
            </div>
            <button
              className="featured-article"
              onClick={() => {
                setArticleIndex(0);
                setModal("article");
              }}
            >
              <Photo index={1} />
              <div>
                <span className="eyebrow">{articles[0].tag}</span>
                <h2>{articles[0].title}</h2>
                <p>{articles[0].subtitle}</p>
                <span className="text-link">
                  Leer la guía · {articles[0].time}
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </button>
            <div className="article-grid">
              {articles.slice(1).map((a, i) => (
                <button
                  className="article-card"
                  key={a.title}
                  onClick={() => {
                    setArticleIndex(i + 1);
                    setModal("article");
                  }}
                >
                  <Photo index={a.photo} />
                  <div>
                    <span className="eyebrow">{a.tag}</span>
                    <h3>{a.title}</h3>
                    <p>{a.subtitle}</p>
                    <span className="text-link">
                      Leer artículo · {a.time}
                      <ArrowRight size={17} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === "launch" && (
          <>
            <section className="launch-hero">
              <div className="container launch-inner">
                <div>
                  <span className="eyebrow">
                    NACE UNA NUEVA FORMA DE CUIDAR TU HOGAR
                  </span>
                  <h1>
                    Tú vives tu vida.
                    <br />
                    Tu casa sigue
                    <br />
                    <em>en buenas manos.</em>
                  </h1>
                  <p>
                    Servicios, profesionales y conocimiento en un mismo lugar.
                    App to mantenimiento empieza en México, con la mirada puesta
                    en Estados Unidos.
                  </p>
                  <div className="hero-actions">
                    <button
                      className="btn orange"
                      onClick={() => {
                        setSignupDone(false);
                        setModal("signup");
                      }}
                    >
                      Quiero enterarme primero
                      <ArrowRight size={18} />
                    </button>
                    <button className="light-link" onClick={() => go("home")}>
                      Explorar el concepto
                    </button>
                  </div>
                  <span className="launch-note">
                    Próximo lanzamiento · fecha y cobertura por definir
                  </span>
                </div>
                <div className="launch-visual">
                  <img
                    src="/images/home-service.png"
                    alt="Una profesional preparada para cuidar tu hogar"
                  />
                  <div className="floating-card">
                    <ShieldCheck size={25} />
                    <span>
                      Más claridad.<b>Menos pendientes.</b>
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <div className="container">
              <section className="steps-section">
                <Heading
                  eyebrow="ASÍ DEBERÍA SER DE FÁCIL"
                  title="De “lo tengo pendiente” a “ya quedó”."
                />
                <div className="how-steps">
                  {[
                    [
                      "01",
                      "Cuéntanos qué necesitas",
                      "Elige el servicio, tu ubicación y el mejor momento.",
                    ],
                    [
                      "02",
                      "Elige con información",
                      "Compara perfiles, alcances y cotizaciones por escrito.",
                    ],
                    [
                      "03",
                      "Sigue cada paso",
                      "Consulta la visita, las evidencias y el estado del trabajo.",
                    ],
                    [
                      "04",
                      "Disfruta el resultado",
                      "Valida la entrega y conserva el historial de tu hogar.",
                    ],
                  ].map(([n, t, p]) => (
                    <div key={n}>
                      <span>{n}</span>
                      <h3>{t}</h3>
                      <p>{p}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="app-feature">
                <div>
                  <span className="eyebrow">CONTIGO, DONDE ESTÉS</span>
                  <h2>
                    Un hogar conectado.
                    <br />
                    Una experiencia completa.
                  </h2>
                  <p>
                    Desde la web y, en la siguiente etapa, desde las apps iOS y
                    Android. Tu historial, tus citas y tu equipo de soporte
                    siempre a mano.
                  </p>
                  <div className="app-platforms">
                    <span>
                      <Smartphone />
                      iOS · prevista
                    </span>
                    <span>
                      <Smartphone />
                      Android · prevista
                    </span>
                    <span>
                      <Globe2 />
                      Web portal
                    </span>
                  </div>
                  <button className="btn dark" onClick={() => go("mobile")}>
                    Ver experiencia móvil
                    <ArrowRight size={17} />
                  </button>
                </div>
                <div className="mini-phone">
                  <div className="phone-notch" />
                  <div className="phone-greeting">
                    Buenos días, Alex<span>Tu casa está al día.</span>
                  </div>
                  <div className="phone-appointment">
                    <CalendarDays />
                    <small>TU PRÓXIMA VISITA</small>
                    <h3>Revisión eléctrica</h3>
                    <p>Miércoles · 10:00–12:00</p>
                    <Status value="Confirmada" />
                  </div>
                  <div className="phone-tiles">
                    <span>
                      <Droplets />
                      Plomería
                    </span>
                    <span>
                      <PaintRoller />
                      Pintura
                    </span>
                    <span>
                      <Sprout />
                      Jardín
                    </span>
                  </div>
                  <div className="phone-bottom">
                    <Home />
                    <ClipboardList />
                    <Headphones />
                    <UserRound />
                  </div>
                </div>
              </section>
              <section className="ecosystem">
                <Heading title="Un proyecto. Todo un ecosistema." />
                <div className="ecosystem-grid">
                  {[
                    [
                      Home,
                      "Cliente",
                      "Tu casa, tus servicios y tu historial.",
                      "client",
                    ],
                    [
                      BriefcaseBusiness,
                      "Socio de negocio",
                      "Agenda, oportunidades y ejecución.",
                      "partner",
                    ],
                    [
                      Headphones,
                      "Soporte",
                      "Solicitudes, incidencias y seguimiento.",
                      "operations",
                    ],
                    [
                      TrendingUp,
                      "Startup",
                      "Visión de operación, calidad y crecimiento.",
                      "operations",
                    ],
                  ].map(([Icon, t, d, v]: any) => (
                    <button key={t} onClick={() => go(v)}>
                      <Icon size={28} />
                      <h3>{t}</h3>
                      <p>{d}</p>
                      <ArrowUpRight size={20} />
                    </button>
                  ))}
                </div>
              </section>
              <section className="launch-bottom">
                <h2>Hagamos espacio para lo que importa.</h2>
                <button
                  className="btn orange"
                  onClick={() => {
                    setSignupDone(false);
                    setModal("signup");
                  }}
                >
                  Me interesa
                  <ArrowRight size={18} />
                </button>
              </section>
            </div>
          </>
        )}

        {view === "client" && (
          <div className="container page dashboard">
            <div className="dashboard-heading">
              <div>
                <span className="eyebrow">
                  MI HOGAR · PERFIL DE DEMOSTRACIÓN
                </span>
                <h1>
                  Hola, Alex<span className="orange-text">.</span>
                </h1>
                <p>Un solo lugar para todos los pendientes de tu casa.</p>
              </div>
              <button className="btn dark" onClick={() => go("catalog")}>
                <Plus size={18} />
                Solicitar un servicio
              </button>
            </div>
            <div className="client-grid">
              <div>
                <div className="home-summary">
                  <div className="home-summary-icon">
                    <Home size={32} />
                  </div>
                  <div>
                    <span>MI CASA</span>
                    <h2>Tu espacio en {location}</h2>
                    <p>
                      Domicilio de demostración · Actualiza la zona al buscar
                    </p>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={() => setModal("location")}
                    aria-label="Cambiar zona"
                  >
                    <Settings2 size={20} />
                  </button>
                </div>
                <Heading
                  title="Mis solicitudes"
                  desc="Las reservas que hagas en el mockup aparecerán aquí."
                />
                <RequestList />
                <div className="section-spacer" />
                <Heading title="Mi lista de favoritos" />
                <div className="saved-mini">
                  {saved.length ? (
                    saved.map((id) => {
                      const s = services.find((x) => x.id === id)!;
                      return (
                        <button key={id} onClick={() => openService(s)}>
                          <Photo index={s.photo} />
                          <span>
                            <b>{s.name}</b>
                            <small>Desde {money(s.price)} MXN</small>
                          </span>
                          <ChevronRight size={18} />
                        </button>
                      );
                    })
                  ) : (
                    <div className="quiet-empty">
                      <Heart size={22} />
                      <p>
                        Guarda servicios con el corazón para encontrarlos aquí.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <aside className="client-sidebar">
                <div className="care-card">
                  <span className="eyebrow">PREVENIR SE SIENTE BIEN</span>
                  <h3>Tu checklist de temporada</h3>
                  {[
                    "Revisar filtraciones",
                    "Limpiar desagües",
                    "Revisar iluminación",
                    "Cuidar el jardín",
                  ].map((t, i) => (
                    <label key={t}>
                      <input type="checkbox" />
                      {t}
                    </label>
                  ))}
                  <button className="text-link" onClick={() => go("magazine")}>
                    Ver guía de mantenimiento
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="support-card">
                  <Headphones size={27} />
                  <h3>Te acompañamos.</h3>
                  <p>
                    Olivia orienta tu solicitud. Nuestro flujo de soporte
                    permite escalarla a una persona.
                  </p>
                  <button
                    className="btn outline full"
                    onClick={() => setChatOpen(true)}
                  >
                    Hablar con Olivia
                    <Sparkles size={16} />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        )}

        {view === "partner" && (
          <div className="container page dashboard">
            <div className="dashboard-heading">
              <div>
                <span className="eyebrow">SOCIOS DE NEGOCIO · VISTA DEMO</span>
                <h1>El siguiente paso de tu negocio.</h1>
                <p>Tu experiencia en campo. Una plataforma para organizarla.</p>
              </div>
              <button
                className="btn orange"
                onClick={() => {
                  setPartnerDone(false);
                  setModal("partner");
                }}
              >
                Unirme a la red
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="dashboard-tabs">
              {["Agenda", "Oportunidades", "Mi negocio", "Red de socios"].map(
                (t) => (
                  <button
                    key={t}
                    className={partnerTab === t ? "active" : ""}
                    onClick={() => setPartnerTab(t)}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
            {partnerTab === "Agenda" && (
              <>
                <div className="metric-grid">
                  <div>
                    <small>Solicitudes abiertas</small>
                    <strong>
                      {requests.filter((r) => r.status !== "Completada").length}
                    </strong>
                    <span>En esta demostración</span>
                  </div>
                  <div>
                    <small>Por confirmar</small>
                    <strong>
                      {
                        requests.filter((r) => r.status === "Por confirmar")
                          .length
                      }
                    </strong>
                    <span>Revisa el alcance antes de aceptar</span>
                  </div>
                  <div>
                    <small>Servicios completados</small>
                    <strong>
                      {requests.filter((r) => r.status === "Completada").length}
                    </strong>
                    <span>Con validación del cliente</span>
                  </div>
                  <div>
                    <small>Volumen solicitado</small>
                    <strong>
                      {money(requests.reduce((n, r) => n + r.amount, 0))}
                    </strong>
                    <span>MXN · no representa cobros</span>
                  </div>
                </div>
                <Heading
                  title="Tu agenda de servicios"
                  desc="Abre una solicitud para asignar técnico, aceptar o actualizar el avance."
                />
                <RequestList interactive />
              </>
            )}
            {partnerTab === "Oportunidades" && (
              <div className="opportunity-grid">
                {requests
                  .filter((r) => r.status === "Por confirmar")
                  .map((r) => (
                    <article key={r.id}>
                      <span className="tag">Nueva solicitud</span>
                      <h3>{r.service}</h3>
                      <p>
                        <MapPin size={16} />
                        {r.address.split(" · ").at(-1)}
                      </p>
                      <p>
                        <CalendarDays size={16} />
                        {r.date} · {r.slot}
                      </p>
                      <strong>{money(r.amount)} MXN</strong>
                      <small>Importe de referencia · confirma el alcance</small>
                      <button
                        className="btn dark full"
                        onClick={() => setActiveRequest(r)}
                      >
                        Revisar solicitud
                        <ArrowRight size={17} />
                      </button>
                    </article>
                  ))}
                {!requests.some((r) => r.status === "Por confirmar") && (
                  <div className="empty-state">
                    <CheckCircle2 />
                    <h3>Todo al día.</h3>
                    <p>No hay nuevas solicitudes por confirmar.</p>
                  </div>
                )}
              </div>
            )}
            {partnerTab === "Mi negocio" && (
              <div className="business-panel">
                <div>
                  <span className="eyebrow">
                    PERFIL DEMO · SIN VERIFICACIÓN REAL
                  </span>
                  <h2>Tu reputación empieza con información clara.</h2>
                  <p>
                    El alta de socios prevé identidad, datos fiscales,
                    experiencia, cobertura, cuenta de cobro y documentación
                    específica por oficio.
                  </p>
                  <div className="verification-list">
                    {[
                      "Identidad del responsable",
                      "Especialidades y experiencia",
                      "Cobertura y disponibilidad",
                      "Datos fiscales y de facturación",
                      "Licencias o acreditaciones cuando apliquen",
                      "Condiciones de atención y garantías",
                    ].map((t) => (
                      <div key={t}>
                        <Circle size={17} />
                        {t}
                        <span>Pendiente</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="care-card">
                  <h3>Mejora tu perfil</h3>
                  <p>
                    Aprende a preparar cotizaciones, documentar el trabajo y
                    comunicarte con tus clientes.
                  </p>
                  <button className="btn dark" onClick={() => go("academy")}>
                    Ir a Academia
                    <GraduationCap size={18} />
                  </button>
                </div>
              </div>
            )}
            {partnerTab === "Red de socios" && (
              <div className="network-panel">
                <h2>Una red abierta, con criterios comunes.</h2>
                <p>
                  El modelo contempla distintos canales de incorporación. Las
                  organizaciones mencionadas son posibilidades de prospección,
                  no alianzas existentes.
                </p>
                <div className="network-grid">
                  {[
                    "Socios actuales de Victor",
                    "Profesionales independientes",
                    "Redes empresariales · COPARMEX",
                    "Portales de negocio · ARRIBA",
                    "Proveedores de materiales",
                    "Capacitadores y especialistas",
                  ].map((t) => (
                    <div key={t}>
                      <Building2 size={24} />
                      <h3>{t}</h3>
                      <span>Canal propuesto</span>
                      <button
                        className="text-link"
                        onClick={() => {
                          setPartnerDone(false);
                          setModal("partner");
                        }}
                      >
                        Explorar participación
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === "operations" && (
          <div className="container page dashboard">
            <div className="dashboard-heading">
              <div>
                <span className="eyebrow">
                  CENTRO DE OPERACIONES · STARTUP & SOPORTE
                </span>
                <h1>La operación, en perspectiva.</h1>
                <p>
                  Demostración multirol. No representa una sesión con permisos
                  reales.
                </p>
              </div>
              <button
                className="btn outline"
                onClick={() => {
                  const csv =
                    "ID,Servicio,Estado,Fecha,Importe MXN\n" +
                    requests
                      .map((r) =>
                        [r.id, r.service, r.status, r.date, r.amount]
                          .map(
                            (v) => '"' + String(v).replaceAll('"', '""') + '"',
                          )
                          .join(","),
                      )
                      .join("\n");
                  const url = URL.createObjectURL(
                    new Blob(["\ufeff" + csv], {
                      type: "text/csv;charset=utf-8;",
                    }),
                  );
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "solicitudes-demo.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={17} />
                Exportar solicitudes
              </button>
            </div>
            <div className="metric-grid">
              <div>
                <small>Solicitudes totales</small>
                <strong>{requests.length}</strong>
                <span>Datos de tu sesión demo</span>
              </div>
              <div>
                <small>En curso</small>
                <strong>
                  {
                    requests.filter(
                      (r) =>
                        !["Completada", "Por confirmar"].includes(r.status),
                    ).length
                  }
                </strong>
                <span>Seguimiento activo</span>
              </div>
              <div>
                <small>Casos de soporte</small>
                <strong>
                  {tickets.filter((t) => t.status === "Abierto").length}
                </strong>
                <span>Generados con Olivia</span>
              </div>
              <div>
                <small>Volumen de solicitudes</small>
                <strong>
                  {money(requests.reduce((n, r) => n + r.amount, 0))}
                </strong>
                <span>MXN · no es ingreso de plataforma</span>
              </div>
            </div>
            <div className="operations-layout">
              <div className="table-panel">
                <div className="panel-head">
                  <h2>Control de solicitudes</h2>
                  <select
                    value={opsFilter}
                    onChange={(e) => setOpsFilter(e.target.value)}
                    aria-label="Filtrar solicitudes por estado"
                  >
                    <option>Todas</option>
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Solicitud / servicio</th>
                        <th>Profesional</th>
                        <th>Estado</th>
                        <th>Importe</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests
                        .filter(
                          (r) =>
                            opsFilter === "Todas" || opsFilter === r.status,
                        )
                        .map((r) => (
                          <tr key={r.id}>
                            <td>
                              <small>
                                {r.id} · {r.date}
                              </small>
                              <b>{r.service}</b>
                            </td>
                            <td>
                              {r.provider}
                              <small>{r.tech}</small>
                            </td>
                            <td>
                              <Status value={r.status} />
                            </td>
                            <td>{money(r.amount)}</td>
                            <td>
                              <button
                                className="text-link"
                                onClick={() => setActiveRequest(r)}
                              >
                                Gestionar
                                <ChevronRight size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <aside className="support-queue">
                <h2>
                  <Headphones size={20} />
                  Soporte
                </h2>
                {tickets.length ? (
                  tickets.map((t) => (
                    <div className="ticket" key={t.id}>
                      <small>{t.id}</small>
                      <b>{t.subject}</b>
                      <Status value={t.status} />
                      {t.status === "Abierto" && (
                        <button
                          className="text-link"
                          onClick={() => {
                            setTickets((old) =>
                              old.map((x) =>
                                x.id === t.id
                                  ? { ...x, status: "Completada" }
                                  : x,
                              ),
                            );
                            setToast("Caso resuelto en la demostración");
                          }}
                        >
                          Marcar resuelto
                          <Check size={15} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="quiet-empty">
                    <CheckCircle2 />
                    <p>
                      No hay casos abiertos. Pide a Olivia hablar con soporte
                      para probar la escalación.
                    </p>
                  </div>
                )}
              </aside>
            </div>
            <section className="ops-roadmap">
              <div>
                <span className="eyebrow">CALIDAD DE LA RED</span>
                <h3>Antes de operar, verificar.</h3>
                <p>
                  Alta y revisión de proveedores, licencias por especialidad,
                  gestión de incidencias y trazabilidad de cotizaciones.
                </p>
              </div>
              <div>
                <span className="eyebrow">DIRECCIÓN DE LA STARTUP</span>
                <h3>Crecer ciudad por ciudad.</h3>
                <p>
                  El futuro panel medirá conversión, cobertura, calidad y
                  comisión neta con datos reales del backend.
                </p>
              </div>
            </section>
          </div>
        )}

        {view === "mobile" && (
          <div className="container page mobile-showcase">
            <div>
              <span className="eyebrow">
                UNA EXPERIENCIA, EN TODOS TUS DISPOSITIVOS
              </span>
              <h1>
                Tu casa. <br />
                En tu bolsillo.
              </h1>
              <p>
                Explora cómo se vive el servicio desde el cliente y desde el
                equipo de campo.
              </p>
              <div className="segmented">
                {["Cliente", "Técnico"].map((r) => (
                  <button
                    key={r}
                    className={mobileRole === r ? "active" : ""}
                    onClick={() => setMobileRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="mobile-benefits">
                <span>
                  <CheckCircle2 />
                  Historial y solicitudes compartidos
                </span>
                <span>
                  <CheckCircle2 />
                  Estados y evidencias del servicio
                </span>
                <span>
                  <CheckCircle2 />
                  Soporte en el mismo lugar
                </span>
              </div>
              <p className="muted">
                Vista previa web. Las apps nativas iOS y Android son una etapa
                de desarrollo posterior.
              </p>
            </div>
            <div className="interactive-phone">
              <div className="phone-notch" />
              <div className="phone-top">
                <Mark />
                <Bell size={20} />
              </div>
              <span className="eyebrow">
                {mobileRole === "Cliente" ? "MI HOGAR" : "MI JORNADA"}
              </span>
              <h2>
                {mobileRole === "Cliente"
                  ? "Hola, Alex."
                  : "Listo para empezar."}
              </h2>
              <p>
                {mobileRole === "Cliente"
                  ? "¿Qué resolvemos hoy?"
                  : "Tu próxima visita, a un toque."}
              </p>
              {mobileRole === "Cliente" && (
                <div
                  className="phone-search"
                  onClick={() => go("catalog")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && go("catalog")}
                >
                  <Search size={17} />
                  Buscar un servicio
                </div>
              )}
              <div className="phone-request-list">
                {requests.slice(0, 3).map((r) => (
                  <button key={r.id} onClick={() => setActiveRequest(r)}>
                    <span>
                      <CalendarDays size={18} />
                      {r.date}
                    </span>
                    <h3>{r.service}</h3>
                    <p>{r.slot}</p>
                    <Status value={r.status} />
                  </button>
                ))}
              </div>
              <button
                className="btn dark full"
                onClick={() =>
                  mobileRole === "Cliente"
                    ? go("catalog")
                    : setActiveRequest(requests[0])
                }
              >
                {mobileRole === "Cliente"
                  ? "Nuevo servicio"
                  : "Abrir intervención"}
                <ArrowRight size={17} />
              </button>
              <div className="phone-bottom">
                <button onClick={() => go("home")} aria-label="Inicio">
                  <Home />
                </button>
                <button onClick={() => go("client")} aria-label="Solicitudes">
                  <ClipboardList />
                </button>
                <button onClick={() => setChatOpen(true)} aria-label="Soporte">
                  <Headphones />
                </button>
                <button
                  onClick={() => go("partner")}
                  aria-label="Perfil profesional"
                >
                  <UserRound />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer>
        <div className="container footer-top">
          <div>
            <button className="brand" onClick={() => go("home")}>
              <Mark />
              <span>
                <b>app to</b>
                <strong>
                  mantenimiento<span>.</span>
                </strong>
              </span>
            </button>
            <p>
              Tu casa, en buenas manos.
              <br />
              Tu tiempo, para lo que importa.
            </p>
            <span className="market-label">
              <span>MX</span> México primero. Estados Unidos después.
            </span>
          </div>
          <div>
            <h4>Para tu hogar</h4>
            <button onClick={() => go("catalog")}>Explorar servicios</button>
            <button onClick={() => go("directory")}>
              Encontrar profesionales
            </button>
            <button onClick={() => go("client")}>Mis solicitudes</button>
            <button onClick={() => go("magazine")}>Revista & tips</button>
          </div>
          <div>
            <h4>Para tu negocio</h4>
            <button onClick={() => go("partner")}>Ser socio de negocio</button>
            <button onClick={() => go("academy")}>Academia</button>
            <button onClick={() => go("operations")}>
              Operaciones & soporte
            </button>
            <button onClick={() => go("launch")}>Conoce el proyecto</button>
          </div>
          <div>
            <h4>Estamos contigo</h4>
            <button onClick={() => setChatOpen(true)}>
              Conversa con Olivia
            </button>
            <button onClick={() => go("mobile")}>
              Vista previa de las apps
            </button>
            <button onClick={() => setModal("trust")}>
              Modelo de confianza
            </button>
            <button onClick={() => setModal("privacy")}>
              Acerca de esta demo
            </button>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 App to mantenimiento · Concepto de producto</span>
          <span>
            Precios, perfiles y reseñas ilustrativos. Sin contrataciones ni
            cobros reales.
          </span>
        </div>
      </footer>
      <button
        className={"olivia-launcher " + (chatOpen ? "is-open" : "")}
        onClick={() => setChatOpen(!chatOpen)}
        aria-label={chatOpen ? "Cerrar Olivia" : "Abrir asistente Olivia"}
      >
        {chatOpen ? (
          <X size={24} />
        ) : (
          <>
            <span className="olivia-avatar">
              <Sparkles size={21} />
            </span>
            <span>
              <b>¿Te ayudo?</b>
              <small>Conversa con Olivia</small>
            </span>
            <span className="online-dot" />
          </>
        )}
      </button>
      {chatOpen && (
        <section className="chat-panel" aria-label="Asistente Olivia">
          <header>
            <span className="olivia-avatar">
              <Sparkles size={21} />
            </span>
            <div>
              <b>Olivia</b>
              <small>Asistente de tu hogar · demo guiada</small>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="icon-btn"
              aria-label="Cerrar chat"
            >
              <X size={19} />
            </button>
          </header>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div className={"message " + m.role} key={i}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-suggestions">
            <button
              onClick={() => {
                chooseCategory("Plomería");
                setChatOpen(false);
              }}
            >
              Ver plomería
            </button>
            <button onClick={() => chat("Consultar mis solicitudes")}>
              Mis solicitudes
            </button>
            <button onClick={() => chat("Quiero hablar con soporte humano")}>
              Soporte humano
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              chat(chatText);
            }}
          >
            <input
              aria-label="Mensaje para Olivia"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Cuéntame qué necesitas…"
            />
            <button aria-label="Enviar mensaje">
              <Send size={19} />
            </button>
          </form>
          <small className="chat-footnote">
            Respuestas de demostración. Olivia v5 aún no está conectada.
          </small>
        </section>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
        </div>
      )}
      {!storageOK && (
        <div className="storage-notice" role="status">
          El navegador no permite guardar la demo. Los cambios durarán esta
          sesión.
        </div>
      )}
      {selected && (
        <Modal
          title={
            step === 3
              ? "Tu solicitud está lista"
              : step === 0
                ? "Conoce tu servicio"
                : step === 1
                  ? "Organiza tu visita"
                  : "Revisa tu solicitud"
          }
          onClose={() => setSelected(null)}
          wide
        >
          {step < 3 && (
            <div className="booking-steps">
              {["Servicio", "Tu visita", "Resumen"].map((t, i) => (
                <span key={t} className={i <= step ? "active" : ""}>
                  <b>{i + 1}</b>
                  {t}
                </span>
              ))}
            </div>
          )}
          {step === 0 && (
            <div className="service-detail">
              <Photo index={selected.photo} label={selected.category} />
              <div className="detail-content">
                <div className="eyebrow">
                  {selected.category} · {location}
                </div>
                <h3>{selected.name}</h3>
                <p>{selected.desc}</p>
                <div className="detail-provider">
                  <BadgeCheck size={19} />
                  <b>{selected.provider}</b>
                  <span>
                    <Star size={14} fill="currentColor" />
                    {selected.rating} · perfil demo
                  </span>
                </div>
                <h4>¿Qué incluye?</h4>
                <ul className="check-list">
                  {selected.included.map((t) => (
                    <li key={t}>
                      <Check size={17} />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="scope-note">
                  <b>Ten en cuenta</b>
                  <p>{selected.excluded}</p>
                </div>
                <div className="detail-price">
                  <div>
                    Desde{" "}
                    <strong>
                      {money(selected.price)} <small>MXN</small>
                    </strong>
                    <span>{selected.unit}</span>
                  </div>
                  <span>
                    <Clock3 size={17} />
                    {selected.duration}
                  </span>
                </div>
                <p className="small-muted">
                  Precio ilustrativo. El profesional confirmará impuestos,
                  traslado, materiales y total antes de cualquier contratación.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn outline"
                    onClick={() => addCart(selected.id)}
                  >
                    Añadir a mi lista
                    <Plus size={16} />
                  </button>
                  <button
                    className="btn dark"
                    disabled={!selected.area.includes(location)}
                    onClick={() => setStep(1)}
                  >
                    {selected.area.includes(location)
                      ? "Solicitar visita"
                      : "Fuera de tu zona"}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <form
              className="booking-form"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <p className="booking-service-name">
                {selected.name} <span>con {selected.provider}</span>
              </p>
              <p className="small-muted">
                Usa datos ficticios. Esta demostración guarda la solicitud solo
                en tu navegador.
              </p>
              <div className="form-grid">
                <label>
                  Fecha deseada
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </label>
                <label>
                  Horario preferido
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                  >
                    <option>10:00–12:00</option>
                    <option>12:00–14:00</option>
                    <option>15:00–17:00</option>
                    <option>17:00–19:00</option>
                  </select>
                </label>
              </div>
              <label>
                Dirección de demostración en {location}
                <input
                  placeholder="Ej. Casa de muestra, calle ejemplo 123"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={160}
                />
              </label>
              {selected.id === "pint-01" && (
                <label>
                  Superficie estimada (m² · mínimo 20)
                  <input
                    type="number"
                    min="20"
                    max="1000"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </label>
              )}
              <label>
                ¿Qué debe saber el profesional?
                <textarea
                  placeholder="Describe el problema, sin datos personales…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                />
              </label>
              <p className="inline-note">
                <CalendarDays size={18} />
                Fecha y horario sujetos a confirmación del profesional.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setStep(0)}
                >
                  <ChevronLeft size={16} />
                  Volver
                </button>
                <button className="btn dark">
                  Revisar solicitud
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div className="booking-review">
              <h3>{selected.name}</h3>
              <div className="summary-lines">
                <div>
                  <span>Profesional</span>
                  <b>{selected.provider}</b>
                </div>
                <div>
                  <span>Visita solicitada</span>
                  <b>
                    {bookingDate} · {slot}
                  </b>
                </div>
                <div>
                  <span>Zona</span>
                  <b>{location}</b>
                </div>
                <div>
                  <span>Dirección demo</span>
                  <b>{address}</b>
                </div>
                {selected.id === "pint-01" && (
                  <div>
                    <span>Superficie</span>
                    <b>{quantity} m²</b>
                  </div>
                )}
                <div className="total">
                  <span>Estimación de referencia</span>
                  <strong>{money(total(selected))} MXN</strong>
                </div>
              </div>
              <div className="scope-note">
                <ShieldCheck size={24} />
                <div>
                  <b>Primero, claridad. Después, confirmación.</b>
                  <p>
                    Esta acción crea una solicitud de prueba, sin pago ni
                    contrato. El alcance y el importe final deberán ser
                    aprobados antes del servicio real.
                  </p>
                </div>
              </div>
              <div className="modal-actions">
                <button className="text-link" onClick={() => setStep(1)}>
                  <ChevronLeft size={16} />
                  Editar
                </button>
                <button className="btn orange" onClick={book}>
                  Crear solicitud demo
                  <Check size={18} />
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="booking-success">
              <div className="success-icon">
                <CheckCheck size={35} />
              </div>
              <span className="eyebrow">
                UN PENDIENTE MÁS CERCA DE RESOLVERSE
              </span>
              <h3>Tu solicitud está creada.</h3>
              <p>
                Referencia <b>{bookedId}</b>. Ya puedes verla en Mi hogar,
                Socios y Operaciones.
              </p>
              <div className="scope-note">
                No se ha contactado a un proveedor ni realizado un cobro.
              </div>
              <button
                className="btn dark"
                onClick={() => {
                  setSelected(null);
                  go("client");
                }}
              >
                Ver mi solicitud
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </Modal>
      )}
      {modal === "departments" && (
        <Modal
          title="Todo para cuidar tu hogar"
          onClose={() => setModal(null)}
          wide
        >
          <p className="modal-intro">
            Encuentra el oficio y el servicio que necesitas.
          </p>
          <div className="departments-modal">
            {departments.slice(1).map((d) => {
              const Icon = iconMap[d.icon];
              return (
                <button
                  key={d.name}
                  onClick={() => {
                    setModal(null);
                    chooseCategory(d.name);
                  }}
                >
                  <Icon size={25} />
                  <span>
                    <b>{d.name}</b>
                    <small>{d.detail}</small>
                  </span>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </Modal>
      )}
      {modal === "location" && (
        <Modal title="Primero, tu ubicación" onClose={() => setModal(null)}>
          <div className="modal-pad">
            <p>
              Elige una zona para explorar la disponibilidad del catálogo de
              demostración.
            </p>
            <div className="location-options">
              {locations.map((l) => (
                <button
                  key={l}
                  className={location === l ? "selected" : ""}
                  onClick={() => {
                    setLocation(l);
                    setModal(null);
                    setToast("Mostrando servicios en " + l);
                  }}
                >
                  <MapPin size={20} />
                  <b>{l}</b>
                  {location === l ? (
                    <Check size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              ))}
            </div>
            <div className="inline-note">
              <Globe2 size={20} />
              México es el primer mercado. La cobertura de Estados Unidos se
              definirá en una etapa posterior.
            </div>
            <small className="small-muted">
              Selección manual de zona. La ubicación GPS y las distancias reales
              se integrarán con el backend.
            </small>
          </div>
        </Modal>
      )}
      {modal === "cart" && (
        <Modal title="Tu lista de servicios" onClose={() => setModal(null)}>
          <div className="modal-pad">
            {cart.length ? (
              <>
                <p>
                  Organiza tus pendientes y solicita cada visita por separado.
                </p>
                {cart.map((id) => {
                  const s = services.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="cart-item">
                      <Photo index={s.photo} />
                      <div>
                        <b>{s.name}</b>
                        <span>Desde {money(s.price)} MXN</span>
                        <button
                          className="text-link"
                          onClick={() => {
                            setModal(null);
                            openService(s);
                          }}
                        >
                          Ver y reservar
                          <ArrowRight size={14} />
                        </button>
                      </div>
                      <button
                        className="icon-btn"
                        onClick={() =>
                          setCart((old) => old.filter((x) => x !== id))
                        }
                        aria-label={"Quitar " + s.name}
                      >
                        <X size={17} />
                      </button>
                    </div>
                  );
                })}
                <small className="small-muted">
                  Cada profesional confirma alcance, zona y precio final. Esta
                  lista no constituye una compra.
                </small>
              </>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={36} />
                <h3>Tu próximo pendiente empieza aquí.</h3>
                <p>Añade servicios desde su ficha para compararlos después.</p>
                <button
                  className="btn dark"
                  onClick={() => {
                    setModal(null);
                    go("catalog");
                  }}
                >
                  Explorar servicios
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
      {modal === "article" && (
        <Modal title="Casa en equilibrio" onClose={() => setModal(null)} wide>
          <article className="article-reader">
            <Photo index={articles[articleIndex].photo} />
            <div>
              <span className="eyebrow">
                {articles[articleIndex].tag} · {articles[articleIndex].time}
              </span>
              <h2>{articles[articleIndex].title}</h2>
              {articles[articleIndex].body.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <button
                className="btn dark"
                onClick={() => {
                  setModal(null);
                  go("catalog");
                }}
              >
                Encuentra un profesional
                <ArrowRight size={17} />
              </button>
            </div>
          </article>
        </Modal>
      )}
      {modal === "course" && (
        <Modal
          title={courses[courseIndex].title}
          onClose={() => setModal(null)}
          wide
        >
          <div className="course-reader">
            <aside>
              {courses[courseIndex].lessons.map((l, i) => (
                <button
                  className={lesson === i ? "active" : ""}
                  key={l}
                  onClick={() => setLesson(i)}
                >
                  {completedLessons.includes(
                    courses[courseIndex].id + "-" + i,
                  ) ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Play size={16} />
                  )}
                  <span>
                    {i + 1}. {l}
                  </span>
                </button>
              ))}
            </aside>
            <div>
              <span className="eyebrow">
                LECCIÓN DE MUESTRA {lesson + 1} / 3
              </span>
              <h3>{courses[courseIndex].lessons[lesson]}</h3>
              <div className="lesson-illustration">
                <BookOpen size={65} strokeWidth={1} />
              </div>
              <p>
                {courseIndex === 0
                  ? "Empieza por anotar el estado de cada espacio, registrar las reparaciones y planificar revisiones periódicas. Para riesgos eléctricos, de gas o estructurales, consulta a personal capacitado."
                  : courseIndex === 1
                    ? "Una cotización clara identifica el trabajo, materiales, exclusiones, plazos y condiciones de pago. Los cambios deben autorizarse por escrito antes de ejecutarse."
                    : "Confirma el alcance antes de llegar, comunica los cambios y documenta el resultado. La validación del cliente y el seguimiento cierran una buena experiencia."}
              </p>
              <div className="scope-note">
                Contenido introductorio de demostración. El catálogo completo,
                instructores y evaluaciones están por desarrollar.
              </div>
              <button
                className="btn dark"
                onClick={() => {
                  const id = courses[courseIndex].id + "-" + lesson;
                  setCompletedLessons((old) =>
                    old.includes(id) ? old : [...old, id],
                  );
                  if (lesson < 2) setLesson(lesson + 1);
                  else setToast("Curso de muestra completado");
                }}
              >
                {completedLessons.includes(
                  courses[courseIndex].id + "-" + lesson,
                )
                  ? "Lección completada"
                  : "Marcar como completada"}
                <Check size={17} />
              </button>
            </div>
          </div>
        </Modal>
      )}
      {(modal === "signup" || modal === "partner") && (
        <Modal
          title={
            modal === "partner"
              ? "Haz crecer tu negocio con nosotros"
              : "Sé parte del comienzo"
          }
          onClose={() => setModal(null)}
        >
          <div className="modal-pad">
            {(modal === "signup" ? signupDone : partnerDone) ? (
              <div className="booking-success">
                <div className="success-icon">
                  <Check size={32} />
                </div>
                <h3>
                  {modal === "partner"
                    ? "Tu interés está registrado en la demo."
                    : "¡Ya conoces el primer paso!"}
                </h3>
                <p>
                  Este formulario es una vista previa: no transmite información
                  ni te incorpora a una lista real.
                </p>
                <button className="btn dark" onClick={() => setModal(null)}>
                  Entendido
                </button>
              </div>
            ) : (
              <form
                className="signup-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  modal === "signup"
                    ? setSignupDone(true)
                    : setPartnerDone(true);
                }}
              >
                <p>
                  {modal === "partner"
                    ? "Profesionales, proveedores, empresas y aliados: construyamos una red con alcances claros y un estándar común de atención."
                    : "México primero. Una nueva forma de encontrar servicios de mantenimiento, cuidar tu hogar y recuperar tu tiempo."}
                </p>
                <p className="small-muted">
                  Formulario de prueba. Utiliza datos ficticios.
                </p>
                <label>
                  {modal === "partner"
                    ? "Nombre del negocio de ejemplo"
                    : "Nombre de ejemplo"}
                  <input
                    required
                    placeholder={
                      modal === "partner" ? "Ej. Mi taller" : "Ej. Alex"
                    }
                    maxLength={80}
                  />
                </label>
                <label>
                  Correo de prueba
                  <input
                    required
                    type="email"
                    placeholder="ejemplo@example.com"
                  />
                </label>
                <label>
                  Ciudad
                  <select>
                    {locations.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                    <option>Otra ciudad de México</option>
                    <option>Estados Unidos · próxima etapa</option>
                  </select>
                </label>
                {modal === "partner" && (
                  <label>
                    Me interesa participar como
                    <select>
                      <option>Profesional de mantenimiento</option>
                      <option>Empresa de servicios</option>
                      <option>Proveedor de materiales</option>
                      <option>Capacitador</option>
                      <option>Aliado comercial / red empresarial</option>
                    </select>
                  </label>
                )}
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  Entiendo que es un formulario de demostración, sin envío real.
                </label>
                <button className="btn orange full">
                  {modal === "partner"
                    ? "Probar registro de socio"
                    : "Probar registro de interés"}
                  <ArrowRight size={17} />
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
      {modal === "supplier" && (
        <Modal
          title={suppliers[supplierIndex].name}
          onClose={() => setModal(null)}
        >
          <div className="modal-pad">
            <span className="eyebrow">DIRECTORIO · PERFIL FICTICIO</span>
            <h3>{suppliers[supplierIndex].specialty}</h3>
            <p style={{ marginTop: 18 }}>{suppliers[supplierIndex].desc}</p>
            <div className="scope-note">
              <b>Cobertura de ejemplo</b>
              {suppliers[supplierIndex].areas.join(" · ")}
            </div>
            <p style={{ marginTop: 18 }}>
              La versión operativa permitirá consultar productos, solicitar
              cotización y compartir requerimientos con un proveedor autorizado.
            </p>
            <button
              className="btn dark"
              onClick={() => {
                setModal(null);
                setChatOpen(true);
              }}
            >
              Consultar con Olivia
              <Sparkles size={17} />
            </button>
          </div>
        </Modal>
      )}
      {modal === "trust" && (
        <Modal title="La confianza se construye" onClose={() => setModal(null)}>
          <div className="modal-pad trust-details">
            <ShieldCheck size={40} />
            <p>
              El modelo propuesto combina controles concretos en cada etapa:
            </p>
            {[
              [
                "Antes de contratar",
                "Identidad, experiencia, documentación y licencias cuando correspondan.",
              ],
              [
                "Antes de empezar",
                "Alcance escrito, presupuesto desglosado, horario y aprobación del cliente.",
              ],
              [
                "Durante la visita",
                "Estados de avance, mensajes y autorización de cualquier cambio.",
              ],
              [
                "Al terminar",
                "Evidencias, validación de entrega, historial y canal de reclamación.",
              ],
            ].map(([t, d]) => (
              <div key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
            <small>
              Son mecanismos propuestos, todavía no operativos. La plataforma no
              debe prometer ausencia total de fraude ni garantías no
              contratadas.
            </small>
          </div>
        </Modal>
      )}
      {modal === "privacy" && (
        <Modal
          title="Acerca de esta demostración"
          onClose={() => setModal(null)}
        >
          <div className="modal-pad">
            <p>
              Este prototipo utiliza servicios, proveedores, valoraciones,
              precios y solicitudes ficticios para explicar la experiencia.
            </p>
            <p>
              Las solicitudes, favoritos, cursos y casos de soporte se conservan
              en este navegador. No se transmiten a Railway, a proveedores, a
              Olivia ni a un procesador de pagos.
            </p>
            <p>
              No introduzcas datos personales reales. El aviso de privacidad,
              los términos comerciales y los controles de acceso deberán
              implementarse antes del lanzamiento.
            </p>
            <button className="btn outline" onClick={() => setModal("reset")}>
              Restablecer datos de demostración
            </button>
          </div>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="Restablecer la demo" onClose={() => setModal(null)}>
          <div className="modal-pad">
            <p>
              Se quitarán las solicitudes, favoritos y casos que creaste en este
              navegador y se restaurarán los ejemplos iniciales.
            </p>
            <div className="modal-actions">
              <button className="btn outline" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button
                className="btn dark"
                onClick={() => {
                  setRequests(initialRequests);
                  setCart([]);
                  setSaved([]);
                  setTickets([]);
                  setCompletedLessons([]);
                  setModal(null);
                  setToast("Datos de demostración restablecidos");
                }}
              >
                Restablecer
              </button>
            </div>
          </div>
        </Modal>
      )}
      {activeRequest && (
        <Modal
          title={"Solicitud " + activeRequest.id}
          onClose={() => setActiveRequest(null)}
          wide
        >
          <div className="request-detail">
            <div className="request-detail-top">
              <div>
                <span className="eyebrow">{activeRequest.provider}</span>
                <h3>{activeRequest.service}</h3>
                <p>
                  <CalendarDays size={17} />
                  {activeRequest.date} · {activeRequest.slot}
                </p>
              </div>
              <Status value={activeRequest.status} />
            </div>
            <div className="timeline">
              {statuses.map((s, i) => (
                <div
                  className={
                    statuses.indexOf(activeRequest.status) >= i
                      ? "complete"
                      : ""
                  }
                  key={s}
                >
                  <span>
                    {statuses.indexOf(activeRequest.status) >= i ? (
                      <Check size={15} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <b>{s}</b>
                </div>
              ))}
            </div>
            <div className="request-columns">
              <div>
                <h4>Detalles de la visita</h4>
                <p>
                  <MapPin size={16} />
                  {activeRequest.address}
                </p>
                <p>
                  <UserRound size={16} />
                  Técnico: {activeRequest.tech}
                </p>
                <p>{activeRequest.notes || "Sin observaciones adicionales."}</p>
                <div className="quote-summary">
                  <span>Referencia de presupuesto</span>
                  <strong>{money(activeRequest.amount)} MXN</strong>
                  <small>
                    Sin pago real. Total sujeto a alcance y confirmación.
                  </small>
                </div>
              </div>
              <div className="action-panel">
                {view === "operations" ||
                view === "partner" ||
                (view === "mobile" && mobileRole === "Técnico") ? (
                  <>
                    <h4>Gestionar intervención</h4>
                    <label>
                      Asignar técnico
                      <select
                        value={activeRequest.tech}
                        onChange={(e) =>
                          updateRequest(activeRequest.id, {
                            tech: e.target.value,
                          })
                        }
                      >
                        <option>Sin asignar</option>
                        <option>Daniel R.</option>
                        <option>Mariana L.</option>
                        <option>Carlos M.</option>
                      </select>
                    </label>
                    {activeRequest.status !== "Por validar" &&
                      activeRequest.status !== "Completada" && (
                        <button
                          className="btn dark full"
                          onClick={() => {
                            const next =
                              statuses[
                                statuses.indexOf(activeRequest.status) + 1
                              ];
                            if (
                              next === "Por validar" &&
                              !activeRequest.evidence
                            ) {
                              setToast(
                                "Añade la evidencia de ejemplo antes de solicitar validación",
                              );
                              return;
                            }
                            updateRequest(activeRequest.id, { status: next });
                          }}
                        >
                          {activeRequest.status === "Por confirmar"
                            ? "Aceptar solicitud"
                            : activeRequest.status === "Confirmada"
                              ? "Marcar en camino"
                              : activeRequest.status === "En camino"
                                ? "Iniciar servicio"
                                : "Solicitar validación"}
                          <ArrowRight size={17} />
                        </button>
                      )}
                    {activeRequest.status === "Por validar" && (
                      <p className="scope-note">
                        Pendiente de aprobación en la vista Cliente. El técnico
                        no puede validar la entrega por el cliente.
                      </p>
                    )}
                    <button
                      className="btn outline full"
                      onClick={() =>
                        updateRequest(activeRequest.id, { evidence: true })
                      }
                    >
                      <Camera size={17} />
                      {activeRequest.evidence
                        ? "Evidencia demo añadida"
                        : "Añadir evidencia de ejemplo"}
                    </button>
                  </>
                ) : (
                  <>
                    <h4>Tu acompañamiento</h4>
                    <button
                      className="btn dark full"
                      onClick={() => {
                        setActiveRequest(null);
                        setChatOpen(true);
                      }}
                    >
                      <Headphones size={17} />
                      Contactar a soporte
                    </button>
                    {activeRequest.status === "Por validar" && (
                      <button
                        className="btn orange full"
                        onClick={() =>
                          updateRequest(activeRequest.id, {
                            status: "Completada",
                          })
                        }
                      >
                        Validar entrega
                        <Check size={17} />
                      </button>
                    )}
                    <p className="small-muted">
                      La validación de entrega aparece cuando el profesional
                      termina y presenta evidencias.
                    </p>
                  </>
                )}
              </div>
            </div>
            {activeRequest.evidence && (
              <div className="evidence-preview">
                <Photo
                  index={
                    services.find((s) => s.id === activeRequest.serviceId)
                      ?.photo || 0
                  }
                />
                <div>
                  <b>Evidencia de demostración</b>
                  <p>
                    Imagen conceptual que representa el registro final del
                    servicio. No es una fotografía de una intervención real.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
