import { Layout } from "antd";
import React from "react";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  fontSize: 'xx-large'}

const Header: React.FC = () => {
  return <Layout.Header style={headerStyle}>Gestion des préscriptions</Layout.Header>;
};

export default Header;
