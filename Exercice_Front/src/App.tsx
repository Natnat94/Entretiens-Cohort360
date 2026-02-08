import Footer from "@components/Footer";
import Header from "@components/Header";
import { ConfigProvider, Layout } from "antd";
import frFR from "antd/es/locale/fr_FR";
import React from "react";
import "./App.css";
import PrescriptionPage from "./pages/PrescriptionPage";

const { Content } = Layout;

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  overflow: "hidden",
  width: "100%",
  minHeight: "100vh",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
};

const App: React.FC = () => (
  <ConfigProvider locale={frFR}>
    <Layout style={layoutStyle}>
      <Header />
      <Content style={contentStyle}>
        <PrescriptionPage />
      </Content>
      <Footer />
    </Layout>
  </ConfigProvider>
);

export default App;
