import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import MenuButton from "../MenuButton";
import useViewport from "@/hooks/useViewport";
import { MENU_ITEMS } from "./menu";
// import Link from "next/link";
// import Image from "next/image";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useViewport();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileActiveItem, setMobileActiveItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileMenu(false);
    }
  }, [isMobile]);

  const handleMenuItemOnClick = (route: string) => {
    setShowMobileMenu(false);
    router.push(route);
  };

  return (
    <div className={styles.NavContainer} >
      <nav
        className={styles.Navbar}
        style={{
          background:
            (router.pathname === "/" || router.pathname === "/home") &&
            !showMobileMenu && !isScrolled && !isMobile
              ? "transparent"
              : "white", // #f3f4f6
          flexDirection: showMobileMenu ? "column" : "row",
          height: showMobileMenu ? 480 : 60,
        }}
      >
        <div className={styles.topbar}>
          {/* <Link href="/">
            <Image
              src="/assets/icons/logo.png"
              width={40}
              height={40}
              alt="logo"
            />
          </Link> */}
          {isMobile && (
            <div>
              <MenuButton
                isExpanded={showMobileMenu}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              />
            </div>
          )}
        </div>

        <div
          className={`${styles.MenuItemContainer} ${
            isMobile && !showMobileMenu ? styles.hidden : ""
          }`}
        >
          {MENU_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`${styles.MenuItem} ${
                router.pathname === item.route ? styles.on : ""
              }`}
              onClick={() => {
                if (isMobile) {
                  // mobile
                  if (!item.subItems) {
                    handleMenuItemOnClick(item.route);
                  } else {
                    setMobileActiveItem(
                      mobileActiveItem === item.title ? null : item.title
                    );
                  }
                } else {
                  // PC
                  if (!item.subItems) {
                    handleMenuItemOnClick(item.route);
                  }
                }
              }}
              onMouseEnter={() => !isMobile && setHoveredItem(item.title)} // Only in PC
              onMouseLeave={() => !isMobile && setHoveredItem(null)} // Only in PC
            >
              <span
                className={`${styles.navTitle} ${
                  router.pathname === item.route ? styles.on : ""
                }`}
                style={{
                  color: (router.pathname === "/" || router.pathname === "/home") &&
                  !showMobileMenu && !isScrolled ? "white" : "black",
                }}
              >
                {item.title}
              </span>

              {/* PC mode subitem */}
              {item.subItems && !isMobile && hoveredItem === item.title && (
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

              {/* Mobile mode subitem */}
              {item.subItems && isMobile && mobileActiveItem === item.title && (
                <div className={styles.SubMenu} style={{transform: "translateX(70%)",}}>
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
  );
};

export default Navbar;
