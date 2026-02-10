import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description = "Swift Sales Healthcare - Premier Medicine Distributor in Rahim Yar Khan & Pakistan. Reliable cold chain supply, genuine medicines, and 100% compliant distribution.",
    keywords = "Medicine Distributor, Rahim Yar Khan, Pharma Pakistan, Cold Chain, Swift Sales Healthcare, Medicine Supply, Pharma Distribution RYK, Authentic Medicine",
}) => {
    return (
        <Helmet>
            <title>{title} | Swift Sales Healthcare</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={`${title} | Swift Sales Healthcare`} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};
