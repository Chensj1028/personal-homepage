"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Language = "zh" | "en";

type ClockValue = {
  date: string;
  iso: string;
  time: string;
};

type Project = {
  category: Record<Language, string>;
  description: Record<Language, string>;
  featured: boolean;
  href: string;
  image?: {
    alt: Record<Language, string>;
    src: string;
  };
  technologies: string[];
  title: Record<Language, string>;
};

const skills = ["C++", "Qt", "OpenGL", "OCCT"];
const projects: Project[] = [];
const resumeUrl: string | undefined = undefined;

const copy = {
  zh: {
    skip: "跳到主要内容",
    homeLabel: "返回首页",
    nav: {
      about: "关于",
      journey: "历程",
      contact: "联系",
    },
    navLabel: "主要导航",
    languageLabel: "选择语言",
    role: "厦门大学本科生 · 信息与计算科学",
    tagline: "在数学与图形之间，探索清晰而有趣的数字表达。",
    heroSummary:
      "目前主要学习和实践 C++、Qt、OpenGL 与 OCCT，尝试将数学思维运用到图形应用、可视化与工程实现中。",
    talk: "和我聊聊",
    github: "访问 GitHub",
    portraitLabel: "陈少极的抽象头像占位",
    status: "目前开放交流与合作",
    collaboration: "课题讨论 · 学科竞赛",
    locationKicker: "Location & time",
    locationTitle: "中国 · 厦门",
    timezone: "UTC+8 · 厦门当地时间",
    clockFallback: "正在同步时间",
    skillsKicker: "Toolkit",
    skillsTitle: "技能轨道",
    skillsDescription: "持续学习，也持续把知识落到实践里。",
    aboutKicker: "About me",
    aboutTitle: "关于我",
    aboutBody: [
      "我是陈少极，目前就读于厦门大学信息与计算科学专业，入选拔尖班，专业排名前 20%，现已保研至本校学术型硕士项目。",
      "目前主要学习和实践 C++、Qt、OpenGL 与 OCCT，尝试将数学思维运用到图形应用、可视化与工程实现中。我喜欢从数学与计算的视角理解问题，也期待通过课题讨论和学科竞赛，与志同道合的伙伴共同探索和成长。",
    ],
    focusKicker: "Current focus",
    focusTitle: "正在探索",
    focusItems: ["图形应用", "可视化", "工程实现"],
    focusNote: "从抽象问题出发，寻找清晰、可靠且可交互的表达方式。",
    journeyKicker: "Journey",
    journeyTitle: "学习历程",
    educationPeriod: "2023—2027",
    school: "厦门大学",
    degree: "本科 · 信息与计算科学",
    educationDetails: "拔尖班 · 专业排名前 20% · 已保研本校学硕",
    contactKicker: "Contact",
    contactTitle: "一起交流",
    contactBody: "欢迎围绕课题想法、学科竞赛或图形技术和我聊聊。",
    emailLabel: "发送邮件",
    githubLabel: "GitHub · Chensj1028",
    resumeLabel: "查看简历",
    projectsKicker: "Selected work",
    projectsTitle: "精选项目",
    footer: "在厦门学习，也在持续探索中。",
    rights: "陈少极 · Shaoji Chen",
  },
  en: {
    skip: "Skip to main content",
    homeLabel: "Back to home",
    nav: {
      about: "About",
      journey: "Journey",
      contact: "Contact",
    },
    navLabel: "Primary navigation",
    languageLabel: "Choose language",
    role: "Undergraduate at Xiamen University / Information and Computational Science",
    tagline:
      "Exploring clear and thoughtful digital expression at the intersection of mathematics and graphics.",
    heroSummary:
      "I am learning and working with C++, Qt, OpenGL, and OCCT, exploring graphics, visualization, and practical engineering.",
    talk: "Let’s Talk",
    github: "Visit GitHub",
    portraitLabel: "Abstract portrait placeholder for Shaoji Chen",
    status: "Open to Collaboration",
    collaboration: "Research Discussions · Academic Competitions",
    locationKicker: "Location & time",
    locationTitle: "Xiamen, China",
    timezone: "UTC+8 · Xiamen local time",
    clockFallback: "Syncing local time",
    skillsKicker: "Toolkit",
    skillsTitle: "Skills in motion",
    skillsDescription: "Always learning, always turning knowledge into practice.",
    aboutKicker: "About me",
    aboutTitle: "A little about me",
    aboutBody: [
      "I am an undergraduate student in Information and Computational Science at Xiamen University. I am part of the honors program, rank in the top 20% of my major, and have secured recommended admission to an academic master’s program at XMU.",
      "I am currently learning and working with C++, Qt, OpenGL, and OCCT, exploring how mathematical thinking can be applied to graphics, visualization, and practical engineering. I enjoy understanding problems from both mathematical and computational perspectives, and I am open to research discussions and academic competition collaborations.",
    ],
    focusKicker: "Current focus",
    focusTitle: "What I’m exploring",
    focusItems: ["Graphics", "Visualization", "Engineering"],
    focusNote:
      "Starting with abstract problems and looking for clear, reliable, and interactive ways to express them.",
    journeyKicker: "Journey",
    journeyTitle: "Education",
    educationPeriod: "2023—2027",
    school: "Xiamen University",
    degree: "Undergraduate · Information and Computational Science",
    educationDetails: "Honors Program · Top 20% · Recommended Admission to XMU",
    contactKicker: "Contact",
    contactTitle: "Let’s connect",
    contactBody:
      "Feel free to reach out about research ideas, academic competitions, or graphics technologies.",
    emailLabel: "Send an email",
    githubLabel: "GitHub · Chensj1028",
    resumeLabel: "View résumé",
    projectsKicker: "Selected work",
    projectsTitle: "Projects",
    footer: "Learning in Xiamen, and always exploring.",
    rights: "陈少极 · Shaoji Chen",
  },
} as const;

function ProjectSection({ language }: { language: Language }) {
  if (projects.length === 0) {
    return null;
  }

  const content = copy[language];

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-title">
      <div className="section-heading">
        <p className="section-kicker">{content.projectsKicker}</p>
        <h2 id="projects-title">{content.projectsTitle}</h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <a
            className={`project-card bento-card ${project.featured ? "project-featured" : ""}`}
            href={project.href}
            key={project.title.en}
          >
            {project.image ? (
              <div
                className="project-image"
                role="img"
                aria-label={project.image.alt[language]}
                style={{ backgroundImage: `url(${project.image.src})` }}
              />
            ) : null}
            <div className="project-copy">
              <small>{project.category[language]}</small>
              <h3>{project.title[language]}</h3>
              <p>{project.description[language]}</p>
              <ul aria-label="Technologies">
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [languageReady, setLanguageReady] = useState(false);
  const [clock, setClock] = useState<ClockValue | null>(null);
  const content = copy[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("portfolio-language");
    if (savedLanguage === "zh" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) {
      return;
    }

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("portfolio-language", language);
  }, [language, languageReady]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const locale = language === "zh" ? "zh-CN" : "en-GB";
      const time = new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Shanghai",
      }).format(now);
      const date = new Intl.DateTimeFormat(locale, {
        month: language === "zh" ? "long" : "short",
        day: "numeric",
        weekday: "short",
        timeZone: "Asia/Shanghai",
      }).format(now);

      setClock({ date, iso: now.toISOString(), time });
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, [language]);

  useLayoutEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    elements.forEach((element) => element.classList.add("reveal-ready"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY}px`);
  };

  return (
    <div className="portfolio-page" onPointerMove={handlePointerMove}>
      <div className="pointer-glow" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <a className="skip-link" href="#main-content">
        {content.skip}
      </a>

      <header className="topbar site-frame">
        <a className="brand" href="#home" aria-label={content.homeLabel}>
          <span className="brand-mark" aria-hidden="true">
            陈
          </span>
          <span className="brand-name">陈少极</span>
        </a>

        <nav className="main-nav" aria-label={content.navLabel}>
          <a href="#about">{content.nav.about}</a>
          <a href="#journey">{content.nav.journey}</a>
          <a href="#contact">{content.nav.contact}</a>
        </nav>

        <div className="language-switch" role="group" aria-label={content.languageLabel}>
          <button
            type="button"
            aria-label="中文"
            aria-pressed={language === "zh"}
            className={language === "zh" ? "active" : ""}
            onClick={() => setLanguage("zh")}
          >
            中
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            aria-label="English"
            aria-pressed={language === "en"}
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
        </div>
      </header>

      <main id="main-content" className="site-frame" tabIndex={-1}>
        <section id="home" className="hero-grid" aria-labelledby="hero-title">
          <article className="hero-copy bento-card reveal reveal-one">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {content.role}
            </p>

            <div className="title-wrap">
              <h1 id="hero-title">陈少极</h1>
              <p className="english-name">Shaoji Chen</p>
            </div>

            <p className="tagline">{content.tagline}</p>
            <p className="hero-summary">{content.heroSummary}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="mailto:hello@example.com">
                {content.talk}
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button button-secondary"
                href="https://github.com/Chensj1028"
                target="_blank"
                rel="noreferrer"
              >
                {content.github}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>

          <div className="portrait-card bento-card reveal reveal-two">
            <div className="portrait-art" role="img" aria-label={content.portraitLabel}>
              <span className="portrait-orbit portrait-orbit-one" aria-hidden="true" />
              <span className="portrait-orbit portrait-orbit-two" aria-hidden="true" />
              <span className="portrait-grid" aria-hidden="true" />
              <span className="portrait-initials" aria-hidden="true">CSJ</span>
            </div>

            <div className="status-card">
              <span className="status-indicator" aria-hidden="true" />
              <span>
                <strong>{content.status}</strong>
                <small>{content.collaboration}</small>
              </span>
            </div>
          </div>
        </section>

        <section className="utility-grid" aria-label={language === "zh" ? "技能与位置" : "Skills and location"}>
          <article className="location-card bento-card reveal reveal-three">
            <div>
              <p className="section-kicker">{content.locationKicker}</p>
              <h2>{content.locationTitle}</h2>
            </div>
            <div className="clock-wrap">
              <time dateTime={clock?.iso}>
                <strong>{clock?.time ?? "UTC+8"}</strong>
                <span>{clock?.date ?? content.clockFallback}</span>
              </time>
              <p>{content.timezone}</p>
            </div>
          </article>

          <section className="skills-card bento-card reveal reveal-four" aria-labelledby="skills-title">
            <div className="skills-copy">
              <p className="section-kicker">{content.skillsKicker}</p>
              <h2 id="skills-title">{content.skillsTitle}</h2>
              <p>{content.skillsDescription}</p>
            </div>

            <ul className="sr-only">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <div className="skills-viewport" aria-hidden="true">
              <div className="skills-track">
                {[0, 1].map((setIndex) => (
                  <div className="skills-set" key={setIndex}>
                    {skills.map((skill) => (
                      <span className="skill-pill" key={`${setIndex}-${skill}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        <section className="story-grid">
          <article id="about" className="about-card bento-card reveal reveal-five" aria-labelledby="about-title">
            <p className="section-kicker">{content.aboutKicker}</p>
            <h2 id="about-title">{content.aboutTitle}</h2>
            <div className="about-body">
              {content.aboutBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className="focus-card bento-card reveal reveal-six">
            <p className="section-kicker">{content.focusKicker}</p>
            <h2>{content.focusTitle}</h2>
            <div className="focus-list">
              {content.focusItems.map((item, index) => (
                <div key={item}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
            <p className="focus-note">{content.focusNote}</p>
          </article>
        </section>

        <section className="lower-grid">
          <section id="journey" className="journey-card bento-card reveal reveal-seven" aria-labelledby="journey-title">
            <div className="section-heading">
              <p className="section-kicker">{content.journeyKicker}</p>
              <h2 id="journey-title">{content.journeyTitle}</h2>
            </div>

            <article className="timeline-entry">
              <div className="timeline-marker" aria-hidden="true">
                <span />
              </div>
              <p className="timeline-period">{content.educationPeriod}</p>
              <div className="timeline-content">
                <h3>{content.school}</h3>
                <p>{content.degree}</p>
                <small>{content.educationDetails}</small>
              </div>
            </article>
          </section>

          <aside id="contact" className="contact-card bento-card reveal reveal-eight" aria-labelledby="contact-title">
            <div>
              <p className="section-kicker">{content.contactKicker}</p>
              <h2 id="contact-title">{content.contactTitle}</h2>
              <p className="contact-body">{content.contactBody}</p>
            </div>

            <div className="contact-links">
              <a href="mailto:hello@example.com">
                <span>{content.emailLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://github.com/Chensj1028"
                target="_blank"
                rel="noreferrer"
              >
                <span>{content.githubLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
              {resumeUrl ? (
                <a href={resumeUrl} download>
                  <span>{content.resumeLabel}</span>
                  <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
          </aside>
        </section>

        <ProjectSection language={language} />
      </main>

      <footer className="footer site-frame">
        <p>{content.footer}</p>
        <p>© {new Date().getFullYear()} {content.rights}</p>
      </footer>
    </div>
  );
}
