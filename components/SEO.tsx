import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description = "Swift Sales Distributer - Premier Distributer in Rahim Yar Khan & Pakistan. Reliable cold chain supply, genuine products, and 100% compliant distribution.",
    keywords = "Medicine Distributor, Rahim Yar Khan, Distribution Pakistan, Cold Chain, Swift Sales Distributer, Product Supply, Distribution RYK, Authentic Products",
}) => {
    return (
        <Helmet>
            <title>{title} | Swift Sales Distributer</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={`${title} | Swift Sales Distributer`} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};
