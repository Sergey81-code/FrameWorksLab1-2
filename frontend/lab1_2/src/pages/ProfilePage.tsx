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
import {UserOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useGetMeQuery,
  useUpdateAvatarMutation,
  useUpdateMeMutation,
  useDeleteMeMutation,
} from "../app/api/userApi";
import { useGetOrdersByUserQuery } from "../app/api/orderApi";
import { useGetDeliveriesQuery } from "../app/api/deliveryApi";
import { useGetProductsQuery } from "../app/api/catalogApi";
import { logout, setUser } from "../app/slices/authSlice";
import { useNavigate } from "react-router-dom";

type ProfileForm = {
  name?: string;
  phone?: string;
  birth_date?: any;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: me } = useGetMeQuery();
  const [updateMe, { isLoading: updateLoading }] = useUpdateMeMutation();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [deleteMe] = useDeleteMeMutation();

  const [form] = Form.useForm<ProfileForm>();
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const { data: orders = [] } = useGetOrdersByUserQuery(me?.id ?? "", {
    skip: !me?.id,
  });
  const { data: deliveries = [] } = useGetDeliveriesQuery();
  const { data: products = [] } = useGetProductsQuery();

  useEffect(() => {
    if (me) {
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

      if (avatarBase64) {
        await updateAvatar({ avatar: avatarBase64 }).unwrap();
      }

      message.success("Профиль обновлён");
    } catch (e: any) {
      message.error(e?.data?.error ?? "Не удалось обновить профиль");
    }
  };

  const uploadProps: UploadProps = {
    accept: "image/*",
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarBase64(String(reader.result));
      };
      reader.readAsDataURL(file);
      return false;
    },
    maxCount: 1,
    showUploadList: false,
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

  const orderRows = orders.map((order) => ({
    ...order,
    delivery: deliveryMap.get(order.id),
  }));

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
                        src={avatarBase64 || currentUser?.avatar}
                        icon={!avatarBase64 && !currentUser?.avatar ? <UserOutlined /> : undefined}
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
            children: orderRows.length === 0 ? (
              <Empty description="Заказов пока нет" />
            ) : (
              <Table
                rowKey="id"
                dataSource={orderRows}
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