import {
  Button,
  Card,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Space,
  Typography,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../app/slices/cartSlice";
import { useGetMeQuery } from "../app/api/userApi";
import { useCreateOrderMutation } from "../app/api/orderApi";
import { useCreateDeliveryMutation } from "../app/api/deliveryApi";

type CheckoutForm = {
  address: string;
  delivery_date?: Dayjs;
};

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<CheckoutForm>();

  const cartItems = useAppSelector((state) => state.cart.items);
  const { data: me } = useGetMeQuery();

  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();
  const [createDelivery, { isLoading: deliveryLoading }] =
    useCreateDeliveryMutation();

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const submit = async (values: CheckoutForm) => {
    try {
      if (!me) {
        message.error("Пользователь не загружен");
        return;
      }

      const order = await createOrder({
        user_id: me.id,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      }).unwrap();

      await createDelivery({
        order_id: order.id,
        address: values.address,
        delivery_date: values.delivery_date?.toDate(),
      }).unwrap();

      dispatch(clearCart());
      message.success("Заказ оформлен");
      navigate("/profile");
    } catch (e: any) {
      message.error(e?.data?.error ?? "Не удалось оформить заказ");
    }
  };

  if (cartItems.length === 0) {
    return <Empty description="Корзина пуста" />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ marginBottom: 0 }}>
        Корзина
      </Typography.Title>

      <List
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
            actions={[
              <Button onClick={() => dispatch(decreaseQuantity(item.product.id))}>
                -
              </Button>,
              <Button onClick={() => dispatch(increaseQuantity(item.product.id))}>
                +
              </Button>,
              <Button danger onClick={() => dispatch(removeFromCart(item.product.id))}>
                Удалить
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.product.name}
              description={`${item.product.price} ₽ × ${item.quantity}`}
            />
            <Typography.Text strong>
              {(item.product.price * item.quantity).toLocaleString()} ₽
            </Typography.Text>
          </List.Item>
        )}
      />

      <Card
        style={{ borderRadius: 20, borderColor: "#fde3c3" }}
        title="Оформление доставки"
      >
        <Form layout="vertical" form={form} onFinish={submit} initialValues={{
          address: "",
          delivery_date: dayjs().add(1, "day"),
        }}>
          <Form.Item
            label="Имя"
            valuePropName="value"
            initialValue={me?.name}
          >
            <Input value={me?.name} disabled />
          </Form.Item>

          <Form.Item
            label="Телефон"
            valuePropName="value"
            initialValue={me?.phone}
          >
            <Input value={me?.phone} disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label="Адрес доставки"
            rules={[{ required: true, message: "Введите адрес" }]}
          >
            <Input placeholder="Город, улица, дом, квартира" />
          </Form.Item>

          <Form.Item name="delivery_date" label="Дата доставки">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Divider />

          <Space
            style={{ width: "100%", justifyContent: "space-between" }}
            wrap
          >
            <Typography.Title level={4} style={{ margin: 0, color: "#d46b08" }}>
              Итого: {total.toLocaleString()} ₽
            </Typography.Title>

            <Button
              type="primary"
              htmlType="submit"
              loading={orderLoading || deliveryLoading}
            >
              Оформить заказ
            </Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}