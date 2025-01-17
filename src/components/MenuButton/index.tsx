import React from "react"
import styles from "./index.module.scss"

interface MenuButtonProps {
  style?: object
  isExpanded: boolean
  onClick: () => void
}

/**
 * Mobile mode button on Nav
 * @param props 
 * @returns 
 */
const MenuButton: React.FC<MenuButtonProps> = (props) => {
  return (
    <div className={styles.MenuButton} style={props.style}>
      <div
        className={`${styles.icon} ${props.isExpanded ? styles.open : ""}`}
        onClick={props.onClick}>
          
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default MenuButton
