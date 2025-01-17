import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import styles from "./index.module.scss"
import MenuButton from "../MenuButton"
import useViewport from "@/hooks/useViewport"
import { MENU_ITEMS } from "./menu"

/**
 * Home, About, Contact, ....
 */
const Navbar: React.FC = () => {
  const router = useRouter()
  const { isMobile } = useViewport()
  const [ showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
  const [ hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileMenu(false)
    }
  }, [isMobile])

  const handleMenuItemOnClick = (route: string) => {
    setShowMobileMenu(false)
    router.push(route)
  }

  return (
    <div className={styles.NavContainer}>
      <nav
        className={styles.Navbar}
        style={{
          background:
            (router.pathname === "/" || router.pathname === "/home") &&
              !showMobileMenu
              // ? "transparent"
              ? "white"
              : "white", // #f3f4f6
          flexDirection: showMobileMenu ? "column" : "row",
          height: showMobileMenu ? 480 : 60,
        }}
      >
        <div className={styles.topbar}>
          <Image
            src='/assets/icons/logo.png'
            width={40}
            height={40}
            alt='logo'
          />
          {isMobile && (
            <div>
              <MenuButton
                isExpanded={showMobileMenu}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              />
            </div>
          )}
        </div>

        <div className={styles.MenuItemContainer}>
          {MENU_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`${styles.MenuItem} ${router.pathname === item.route ? styles.on : ""
                }`}
              onClick={(e) => {
                if (!item.subItems) {
                  handleMenuItemOnClick(item.route);
                } else {
                  e.stopPropagation();
                }
              }}
              onMouseEnter={() => setHoveredItem(item.title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span
                className={`${styles.navTitle} ${router.pathname === item.route ? styles.on : ""
                  }`}
              >
                {item.title}
              </span>

              {item.subItems && hoveredItem === item.title && (
                <div className={styles.SubMenu}>
                  {item.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={styles.SubMenuItem}
                      onClick={() => handleMenuItemOnClick(subItem.route)}
                    >
                      {subItem.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </nav>
    </div>
  )
}

export default Navbar