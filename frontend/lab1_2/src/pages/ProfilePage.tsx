import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Row,
  Space,
  Tabs,
  Table,
  Tag,
  Upload,
  message,
  Typography,
  Input,
} from "antd";
import type { UploadProps } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
} from "../app/api/userApi";
import { useGetOrdersByUserQuery } from "../app/api/orderApi";
import { useGetDeliveriesQuery } from "../app/api/deliveryApi";
import { useGetProductsQuery } from "../app/api/catalogApi";
import { logout, setUser } from "../app/slices/authSlice";
import { useNavigate } from "react-router-dom";

import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type ProfileForm = {
  name?: string;
  phone?: string;
  birth_date?: any;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: me } = useGetMeQuery();
  const [updateMe, { isLoading: updateLoading }] = useUpdateMeMutation();
  const [deleteMe] = useDeleteMeMutation();

  const [form] = Form.useForm<ProfileForm>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { data: orders = [] } = useGetOrdersByUserQuery(me?.id ?? "", {
    skip: !me?.id,
  });
  const { data: deliveries = [] } = useGetDeliveriesQuery();
  const { data: products = [] } = useGetProductsQuery();

  useEffect(() => {
    if (me) {
      setAvatarUrl(me.avatar ?? null);
      dispatch(setUser(me));
      form.setFieldsValue({
        name: me.name,
        phone: me.phone,
        birth_date: me.birth_date ? dayjs(me.birth_date) : undefined,
      });
    }
  }, [me, dispatch, form]);

  const deliveryMap = useMemo(() => {
    const map = new Map<string, (typeof deliveries)[number]>();
    deliveries.forEach((d) => map.set(d.order_id, d));
    return map;
  }, [deliveries]);

  const productNameMap = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [products]);

  const onSave = async (values: ProfileForm) => {
    try {
      await updateMe({
        name: values.name,
        phone: values.phone,
        birth_date: values.birth_date
          ? dayjs(values.birth_date).format("YYYY-MM-DD")
          : undefined,
      }).unwrap();

      message.success("Профиль обновлён");
    } catch (e: any) {
      message.error(e?.data?.error ?? "Не удалось обновить профиль");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMe().unwrap();
      dispatch(logout());
      message.success("Аккаунт удалён");
      navigate("/auth");
    } catch {
      message.error("Не удалось удалить аккаунт");
    }
  };

  const uploadProps: UploadProps = {
    accept: "image/*",
    maxCount: 1,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("avatar", file as Blob);

        const res = await fetch("/users/me/avatar", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        onSuccess?.(data, file);
        setAvatarUrl(data.avatar);
      } catch (err) {
        onError?.(err as Error);
        message.error("Не удалось загрузить аватар");
      }
    },
  };

  const orderRows = orders.map((order) => ({
    ...order,
    delivery: deliveryMap.get(order.id),
    delivery_date: deliveryMap.get(order.id)?.delivery_date
      ? dayjs(deliveryMap.get(order.id)!.delivery_date).add(3, "hour")
      : null,
  }));

  const sortedOrders = useMemo(() => {
    const statusOrder = ["pending", "processing", "shipped", "delivered", "canceled"];
    return [...orderRows].sort((a, b) => {
      const statusDiff =
        statusOrder.indexOf(a.delivery?.status ?? "") -
        statusOrder.indexOf(b.delivery?.status ?? "");
      if (statusDiff !== 0) return statusDiff;

      if (!a.delivery_date) return 1;
      if (!b.delivery_date) return -1;
      return a.delivery_date.isAfter(b.delivery_date) ? 1 : -1;
    });
  }, [orderRows]);

  const orderColumns = [
    {
      title: "Заказ",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <Typography.Text code>{id}</Typography.Text>,
    },
    {
      title: "Статус заказа",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : status === "canceled" ? "red" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Сумма",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `${total.toLocaleString()} ₽`,
    },
    {
      title: "Адрес",
      key: "address",
      render: (_: unknown, row: any) => row.delivery?.address ?? "—",
    },
    {
      title: "Дата и время доставки",
      key: "deliveryDate",
      render: (_: unknown, row: any) =>
        row.delivery_date ? dayjs.utc(row.delivery_date).local().format("DD.MM.YYYY HH:mm") : "—",
    },
    {
      title: "Доставка",
      key: "deliveryStatus",
      render: (_: unknown, row: any) =>
        row.delivery ? (
          <Tag color={row.delivery.status === "delivered" ? "green" : "blue"}>
            {row.delivery.status}
          </Tag>
        ) : (
          "—"
        ),
    },
    {
      title: "Товары",
      key: "items",
      render: (_: unknown, row: any) =>
        row.items
          .map((it: any) => `${productNameMap.get(it.product_id) ?? it.product_id} × ${it.quantity}`)
          .join(", "),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ marginBottom: 0 }}>
        Личный кабинет
      </Typography.Title>

      <Tabs
        items={[
          {
            key: "profile",
            label: "Профиль",
            children: (
              <Card style={{ borderRadius: 20 }}>
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Space direction="vertical" align="center" style={{ width: "100%" }}>
                      <Avatar
                        size={128}
                        src={avatarUrl || undefined}
                        icon={!avatarUrl ? <UserOutlined /> : undefined}
                      />
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Изменить аватар</Button>
                      </Upload>
                    </Space>
                  </Col>

                  <Col xs={24} md={16}>
                    <Form form={form} layout="vertical" onFinish={onSave}>
                      <Form.Item name="name" label="Имя">
                        <Input />
                      </Form.Item>
                      <Form.Item name="phone" label="Телефон">
                        <Input />
                      </Form.Item>
                      <Form.Item name="birth_date" label="Дата рождения">
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>

                      <Space wrap>
                        <Button type="primary" htmlType="submit" loading={updateLoading}>
                          Сохранить
                        </Button>
                        <Button danger onClick={handleDeleteAccount}>
                          Удалить аккаунт
                        </Button>
                      </Space>
                    </Form>
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: "orders",
            label: "Заказы",
            children: sortedOrders.length === 0 ? (
              <Empty description="Заказов пока нет" />
            ) : (
              <Table
                rowKey="id"
                dataSource={sortedOrders}
                columns={orderColumns}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
              />
            ),
          },
        ]}
      />
    </Space>
  );
}