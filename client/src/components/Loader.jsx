import React from "react";

/* ───────────────── GLOBAL STYLES ───────────────── */
const GlobalStyles = () => (
  <style>{`
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes float {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes pulseCore {
      0%,100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.4); }
    }

    @keyframes wave {
      0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.6); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
    }

    @keyframes shimmerMove {
      100% { left: 150%; }
    }

    @keyframes gradientFlow {
      100% { background-position: 200% 0; }
    }

    @keyframes progressReal {
      0% { width: 15%; }
      40% { width: 55%; }
      70% { width: 80%; }
      100% { width: 92%; }
    }

    .glass {
      background: rgba(255,255,255,0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.3);
    }

    .shimmer {
      position: relative;
      overflow: hidden;
      background: rgba(255,255,255,0.5);
      border-radius: 10px;
    }

    .shimmer::after {
      content: "";
      position: absolute;
      top: 0;
      left: -150%;
      width: 150%;
      height: 100%;
      background: linear-gradient(
        120deg,
        transparent,
        rgba(99,102,241,0.25),
        transparent
      );
      animation: shimmerMove 1.5s infinite;
    }
  `}</style>
);

/* ───────────────── AI LOADER ───────────────── */
export const Spinner = ({ text = "AI is scanning jobs..." }) => {
  return (
    <>
      <GlobalStyles />

      <div style={styles.page}>
        <div style={styles.card} className="glass">

          {/* AI Pulse Loader */}
          <div style={styles.aiLoader}>
            <div style={styles.core}></div>
            <div style={{ ...styles.wave, animationDelay: "0s" }} />
            <div style={{ ...styles.wave, animationDelay: "0.3s" }} />
            <div style={{ ...styles.wave, animationDelay: "0.6s" }} />
          </div>

          {/* Text */}
          <h3 style={styles.title}>{text}</h3>
          <p style={styles.sub}>Analyzing skills & matching jobs...</p>

          {/* Animated dots */}
          <div style={styles.dots}>
            <span style={styles.dot}></span>
            <span style={{ ...styles.dot, animationDelay: "0.2s" }}></span>
            <span style={{ ...styles.dot, animationDelay: "0.4s" }}></span>
          </div>

        </div>
      </div>
    </>
  );
};

/* ───────────────── SKELETON CARD ───────────────── */
export const JobCardSkeleton = () => {
  return (
    <>
      <GlobalStyles />

      <div style={styles.skeletonCard} className="glass">

        <div style={styles.row}>
          <div className="shimmer" style={styles.logo}></div>

          <div style={{ flex: 1 }}>
            <div className="shimmer" style={styles.titleSk}></div>
            <div className="shimmer" style={styles.subSk}></div>
          </div>

          <div className="shimmer" style={styles.badge}></div>
        </div>

        <div style={styles.row}>
          <div className="shimmer" style={styles.line}></div>
          <div className="shimmer" style={styles.line}></div>
          <div className="shimmer" style={styles.line}></div>
        </div>

        <div style={styles.row}>
          <div className="shimmer" style={styles.skill}></div>
          <div className="shimmer" style={styles.skill}></div>
          <div className="shimmer" style={styles.skill}></div>
        </div>

      </div>
    </>
  );
};

/* ───────────────── PAGE SKELETON ───────────────── */
export const JobsPageSkeleton = () => {
  return (
    <div>
      {[1,2,3,4].map(i => <JobCardSkeleton key={i} />)}
    </div>
  );
};

/* ───────────────── FULL PAGE LOADER ───────────────── */
export const PageLoader = () => {
  return (
    <>
      <GlobalStyles />

      <div style={styles.page}>
        <div style={styles.card} className="glass">

          <div style={styles.aiLoader}>
            <div style={styles.core}></div>
            <div style={styles.wave}></div>
            <div style={{ ...styles.wave, animationDelay: "0.3s" }}></div>
          </div>

          <h2 style={styles.title}>Fetching Jobs</h2>
          <p style={styles.sub}>Searching LinkedIn • Indeed • Portal</p>

          {/* Progress bar */}
          <div style={styles.progress}>
            <div style={styles.progressFill}></div>
          </div>

        </div>
      </div>
    </>
  );
};

/* ───────────────── MINI LOADER ───────────────── */
export const MiniLoader = () => (
  <>
    <GlobalStyles />
    <div style={styles.mini}></div>
  </>
);

/* ───────────────── STYLES ───────────────── */
const styles = {

  page: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  card: {
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    animation: "float 3s infinite ease-in-out"
  },

  title: {
    fontSize: "20px",
    fontWeight: "700",
    marginTop: "20px"
  },

  sub: {
    color: "#64748b",
    fontSize: "14px"
  },

  /* AI Loader */
  aiLoader: {
    position: "relative",
    width: "80px",
    height: "80px",
    margin: "auto"
  },

  core: {
    width: "18px",
    height: "18px",
    background: "#6366f1",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulseCore 1.5s infinite",
    boxShadow: "0 0 20px #6366f1"
  },

  wave: {
    position: "absolute",
    width: "70px",
    height: "70px",
    border: "2px solid rgba(99,102,241,0.3)",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "wave 1.5s infinite"
  },

  dots: {
    marginTop: "10px"
  },

  dot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    background: "#6366f1",
    borderRadius: "50%",
    margin: "0 3px",
    animation: "pulseCore 1s infinite"
  },

  /* Skeleton */
  skeletonCard: {
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "16px"
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center"
  },

  logo: { width: 50, height: 50 },
  titleSk: { width: 180, height: 18 },
  subSk: { width: 120, height: 12 },
  badge: { width: 70, height: 25 },
  line: { width: 100, height: 12 },
  skill: { width: 70, height: 25 },

  /* Progress */
  progress: {
    height: "6px",
    background: "#e0e7ff",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "20px"
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)",
    backgroundSize: "200% 100%",
    animation: "gradientFlow 2s linear infinite, progressReal 3s ease-in-out infinite"
  },

  /* Mini */
  mini: {
    width: "18px",
    height: "18px",
    border: "2px solid #ddd",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite"
  }
};