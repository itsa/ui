import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

// Provides SEO related control including page title, description, language, meta tags & more.
const Seo = props => {
	const { title, description, lang, author, meta, ...other } = props;

	return (
		<Helmet
			title={title}
			htmlAttributes={{
				lang,
			}}
			meta={[
				{
					name: 'description',
					content: description,
				},
				{
					property: 'og:title',
					content: title,
				},
				{
					property: 'og:description',
					content: description,
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					name: 'twitter:card',
					content: 'summary',
				},
				{
					name: 'twitter:creator',
					content: author,
				},
				{
					name: 'twitter:title',
					content: title,
				},
				{
					name: 'twitter:description',
					content: description,
				},
			].concat(meta || [])}
			{...other}
		/>
	);
};

Seo.defaultProps = {
	title: null,
	description: null,
	lang: 'en',
	author: null,
	meta: null,
};

Seo.propTypes = {
	// Page title
	title: PropTypes.string,
	// Page description
	description: PropTypes.string,
	// Site language
	lang: PropTypes.string,
	// Site author
	author: PropTypes.string,
	// Meta tags
	meta: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
		}),
	),
};

export default Seo;
