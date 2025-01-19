# Studio Portfolio
<div align="center">
    <img src="public/git/Home.png" alt="Home"/>
</div>

This is my studio website built by NEXT.js, Typescript and SCSS. 
Click [Here](https://studio-website-omega.vercel.app/) to check out my studio portfolio!

## File Structure
```
├── content                             # The content shows in different tab
├── public/  
│    ├── assets                         # pictures, videos, icons.....
│    │   ├── icons 
│    │   ├── pics                                
│    │   └── videos 
│    └── locals                         # Multi Language Change
│        ├── en
│        │  ├── translation.json        # Static content
│        │  └── dynamicContent.json     # Irregular updated content
│        ├── .... (jp/zh/fr/...)    
│        └── common                     # The variables can be used in the different languages 
│           └──  commonVariables.json   
└── src
│   ├── components                      # UI element
│   │   ├── ContactForm                 # In the "Book" page, using the emailjs for email sending
│   │   ├── Container                   # The space shows at the top of the "Navbar"
│   │   ├── Events                      # In the "Event" page, embeding different kinds of events.
│   │   ├── Footer
│   │   ├── Gallery                     # In the "Home" page, showing pictures, title, description. It can scoll by the left or right button.
│   │   ├── GoogleAnalyticsConfig       # In the "_App". It uses in Google Analytics.
│   │   ├── Googlemap                   # In the "Book" and "Home" page. Showing the location of the studio.
│   │   ├── LanguageSwitcher            # In the "Footer". It supports en, fr, chinese now.
│   │   ├── MenuButton                  # In the "Navbar", It shows Home, Studio, Portfolio, Contact..... button.
│   │   ├── NavBar                      # In every pages, shows on the top
│   │   ├── PortfolioCard               # In "Portfolio-Photography", "Portfolio-Videography", "Portfolio-Music", shows the picture on the first page. User can click it. It will shows more pictures at the second page. 
│   │   ├── Project                     # In the "Project" page. It shows the project that the studio/person did before.
│   │   └── StudioTabSection            # In the "Studio-Music", "Studio-Photography" page. It shows wallpaper on the top. Also, user can click the differet tab and show the content 
│   ├── helpers                         # Global variables
│   │   ├── config.tsx                  # System Config
│   │   └── constants.ts                # System variables
│   ├── hooks
│   │   └── useViewport.ts              # Detect the mode between PC and mobile
│   ├── pages                           # Different pages shows on the Navbar
│   │   ├── about
│   │   ├── book
│   │   ├── contact
│   │   ├── event
│   │   ├── home
│   │   ├── portfolio
│   │   ├── project
│   │   └── studio
│   ├── styles          
│   │   ├── common.module.css
│   │   ├── globals.css
│   │   └── variables.module.scs
│   ├── _app.tsx                        # Main. Component embed at here
│   ├── _document.tsx                   # Font import
│   ├── 404.tsx
│   ├── 500.tsx
│   └── index.tsx                       # Home page
├── .env.local                          # API Key(Mail, Google Analytics)
├── .gitignore
├── eslint.config.mjs
├── i18n.js                             # Language Setting
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── taliwind.config.ts
└── tsconfig.json
```