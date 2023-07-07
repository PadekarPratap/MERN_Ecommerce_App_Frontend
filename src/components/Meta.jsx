import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
    title: "Welcome to Code Shop Pro | Home",
    description: "Discover a world of convenience and endless choices with our online ecommerce app. Shop for top-notch electronics, mobiles, stylish menswear, fashionable womenswear, and delightful toys. Experience seamless browsing, secure transactions, and doorstep delivery. Start exploring today!",
    keywords: "ecommerce app, online shopping, electronics, mobiles, mens wear, womens wear, toys, gadgets, smartphones, fashion, online store, online marketplace, convenient shopping, secure transactions, doorstep delivery"
}

export default Meta;
