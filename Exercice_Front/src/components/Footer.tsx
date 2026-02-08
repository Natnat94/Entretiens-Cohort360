import { Layout } from "antd";
import React from "react";

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#001529",
};

const Footer: React.FC = () => (
  <Layout.Footer style={footerStyle}>Excercice FrontEnd 2026</Layout.Footer>
);

export default Footer;
