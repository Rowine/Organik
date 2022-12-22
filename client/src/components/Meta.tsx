import React from 'react'
import { Helmet } from 'react-helmet-async'

interface MetaProps {
  title?: string
  description?: string
  keywords?: string
}

const Meta: React.FC<MetaProps> = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Organik',
  description: 'We sell local organic products',
  keywords: 'organic, local, products',
}

export default Meta
