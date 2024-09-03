import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function Head(props) {
return (
<Helmet>
<title>{props.title} - Cloud Upload</title>
</Helmet>
)
}