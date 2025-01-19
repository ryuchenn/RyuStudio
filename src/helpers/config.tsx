import Head from "next/head"
import { useTranslation } from 'react-i18next';

const SystemConfig = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  
  return (
    <>
      <Head>
        {/* Recommended Meta Tags */}
        <meta charSet='utf-8' />
        <meta name='language' content='english' />
        <meta httpEquiv='content-type' content='text/html' />
        <meta name='author' content={t("commonVariables:SystemConfig.StudioAuthor")} />
        <meta name='designer' content={t("commonVariables:SystemConfig.StudioAuthor")} />
        <meta name='publisher' content={t("commonVariables:SystemConfig.StudioAuthor")} />

        {/* Search Engine Optimization Meta Tags */}
        <title>{t("commonVariables:SystemConfig.StudioTitle")} </title>
        <meta name='description' content={t("commonVariables:SystemConfig.StudioDescription")} />
        <meta
          name='keywords'
          content={t("commonVariables:SystemConfig.StudioCategory")}
        />
        <meta name='robots' content='index,follow' />
        <meta name='distribution' content='web' />

        {/* 
      Facebook Open Graph meta tags
        documentation: https://developers.facebook.com/docs/sharing/opengraph */}
        <meta name='og:title' content={t("commonVariables:SystemConfig.StudioTitle")}  />
        <meta name='og:type' content='site' />
        <meta name='og:image' content={"/icons/share.png"} />
        <meta name='og:site_name' content={t("ScommonVariables:ystemConfig.StudioTitle")}  />
        <meta name='og:description' content={t("commonVariables:SystemConfig.StudioDescription")}  />
        <link rel='manifest' href='/manifest.json' />
        <link
          rel='mask-icon'
          color='#000000'
          href='/icons/safari-pinned-tab.svg'
        />

        {/* Meta Tags for HTML pages on Mobile */}
        {/* <meta name="format-detection" content="telephone=yes"/>
        <meta name="HandheldFriendly" content="true"/>  */}
        <meta
          name='viewport'
          content='width=device-width, minimum-scale=1, initial-scale=1.0'
        />
        <meta name='theme-color' content='#000' />
      </Head>
    </>
  )
}

export default SystemConfig
