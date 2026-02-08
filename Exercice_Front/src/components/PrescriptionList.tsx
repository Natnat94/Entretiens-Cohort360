import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { Filters, Prescription } from "@serviceApi/prescriptionApi";
import { fetchPrescriptions } from "@serviceApi/prescriptionApi";
import { DatePicker, FloatButton, Input, Table, message, Drawer } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import CreatePrescriptionForm from "./CreatePrescriptionForm";

const { RangePicker } = DatePicker;

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prescriptionsData] = await Promise.all([
        fetchPrescriptions(filters),
      ]);
      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      message.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [filters, loadData]);

  const handleFilterChange = (
    key: keyof Filters,
    value: number | string | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      title: "Nom du patient",
      dataIndex: "patient",
      key: "patient",
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            allowClear
            onChange={(e) => handleFilterChange("patient", e.target.value)}
          />
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      sorter: (a: Prescription, b: Prescription) =>
        a.patient.localeCompare(b.patient),
    },
    {
      title: "Médicament",
      dataIndex: "medication",
      key: "medication",
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            allowClear
            onChange={(e) => handleFilterChange("medication", e.target.value)}
          />
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      sorter: (a: Prescription, b: Prescription) =>
        a.medication.localeCompare(b.medication),
    },
    {
      title: "Date de début",
      dataIndex: "starting_date",
      key: "starting_date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: Prescription, b: Prescription) =>
        a.starting_date.localeCompare(b.starting_date),
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <RangePicker
            allowClear
            placeholder={["A partir de", "Jusqu'au"]}
            allowEmpty={[true, true]}
            onChange={(dates) => {
              if (dates) {
                handleFilterChange(
                  "starting_date__gte",
                  dates[0]?.format("YYYY-MM-DD"),
                );
                handleFilterChange(
                  "starting_date__lte",
                  dates[1]?.format("YYYY-MM-DD"),
                );
              } else {
                handleFilterChange("starting_date__gte", undefined);
                handleFilterChange("starting_date__lte", undefined);
              }
            }}
          />
        </div>
      ),
    },

    {
      title: "Date de fin",
      dataIndex: "ending_date",
      key: "ending_date",
      render: (date?: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: Prescription, b: Prescription) =>
        a.ending_date.localeCompare(b.ending_date),
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <RangePicker
            allowClear
            placeholder={["A partir de", "Jusqu'au"]}
            allowEmpty={[true, true]}
            onChange={(dates) => {
              if (dates) {
                handleFilterChange(
                  "ending_date__gte",
                  dates[0]?.format("YYYY-MM-DD"),
                );
                handleFilterChange(
                  "ending_date__lte",
                  dates[1]?.format("YYYY-MM-DD"),
                );
              } else {
                handleFilterChange("ending_date__gte", undefined);
                handleFilterChange("ending_date__lte", undefined);
              }
            }}
          />
        </div>
      ),
    },
    {
      title: "Commentaire",
      dataIndex: "comment",
      key: "comment",
      render: (comment?: string | null) => comment || "N/A",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={prescriptions}
        loading={loading}
        rowKey="id"
        pagination={{
          defaultPageSize: 12,
        }}
      />
      <FloatButton
        icon={<PlusOutlined />}
        onClick={() => setOpenDrawer(true)}
      />
      <Drawer
        title="Ajouter une préscription"
        size={720}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        destroyOnHidden
      >
        <CreatePrescriptionForm onSuccess={() => setOpenDrawer(false)} />
      </Drawer>
    </div>
  );
};

export default PrescriptionList;
