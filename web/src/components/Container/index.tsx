import React, { ReactNode } from "react"
import styles from "./index.module.scss"

interface ContainerProps {
  children: ReactNode
}

/**
 * Nav top space
 * @param props 
 * @returns 
 */
const Container: React.FC<ContainerProps> = (props) => {
  return (
      <div className={styles.Container}>{props.children}</div>
  )
}

export default Container
