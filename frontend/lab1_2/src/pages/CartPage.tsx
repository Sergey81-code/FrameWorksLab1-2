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

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const unitPrice = item.product.discount
        ? Math.floor(Number(item.product.price) * (1 - item.product.discount / 100))
        : Math.floor(Number(item.product.price));
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [cartItems]);

const submit = async (values: CheckoutForm) => {
  if (!values.delivery_date) {
    message.error("Выберите дату и время доставки");
    return;
  }

  const delivery = values.delivery_date;
  const nowPlus30 = dayjs().add(30, "minute");

  if (delivery.isBefore(nowPlus30)) {
    message.error("Время доставки должно быть не раньше, чем через 30 минут");
    return;
  }

  const hour = delivery.hour();
  const minute = delivery.minute();

  if (hour < 8 || hour >= 22) {
    message.error("Время доставки должно быть с 8:00 до 22:00");
    return;
  }

  if (minute % 15 !== 0) {
    message.error("Минуты доставки должны быть кратны 15");
    return;
  }

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
      delivery_date: delivery.toDate(),
    }).unwrap();

    dispatch(clearCart());
    message.success("Заказ оформлен");
    navigate("/profile");
  } catch (e: unknown) {
    const err = e as { data?: { error?: string } };
    message.error(err?.data?.error ?? "Не удалось оформить заказ");
  }
};

  if (cartItems.length === 0) {
    return <Empty description="Корзина пуста" />;
  }

  const now = dayjs().add(30, "minute").second(0);
const roundedMinute = Math.ceil(now.minute() / 15) * 15;
const defaultTime = roundedMinute >= 60
  ? now.clone().hour(now.hour() + 1).minute(0)
  : now.clone().minute(roundedMinute);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ marginBottom: 0 }}>
        Корзина
      </Typography.Title>

      <List
        dataSource={cartItems}
        renderItem={(item) => {
          const unitPrice = item.product.discount
            ? Math.floor(Number(item.product.price) * (1 - item.product.discount / 100))
            : Math.floor(Number(item.product.price));

          return (
            <List.Item
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
              actions={[
                <Button onClick={() => dispatch(decreaseQuantity(item.product.id))}>-</Button>,
                <Button onClick={() => dispatch(increaseQuantity(item.product.id))}>+</Button>,
                <Button danger onClick={() => dispatch(removeFromCart(item.product.id))}>
                  Удалить
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.product.name}
                description={
                  item.product.discount ? (
                    <span>
                      <Typography.Text delete style={{ marginRight: 8 }}>
                        {Math.floor(Number(item.product.price)).toLocaleString()} ₽
                      </Typography.Text>
                      <Typography.Text strong>
                        {unitPrice.toLocaleString()} ₽
                      </Typography.Text>
                      × {item.quantity}
                    </span>
                  ) : (
                    `${unitPrice.toLocaleString()} ₽ × ${item.quantity}`
                  )
                }
              />
              <Typography.Text strong>
                {(unitPrice * item.quantity).toLocaleString()} ₽
              </Typography.Text>
            </List.Item>
          );
        }}
      />

      <Card
        style={{ borderRadius: 20, borderColor: "#fde3c3" }}
        title="Оформление доставки"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={submit}
          initialValues={{
            address: "",
            delivery_date: dayjs().hour(10).minute(0),
          }}
        >
          <Form.Item label="Имя" valuePropName="value" initialValue={me?.name}>
            <Input value={me?.name} disabled />
          </Form.Item>

          <Form.Item label="Телефон" valuePropName="value" initialValue={me?.phone}>
            <Input value={me?.phone} disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label="Адрес доставки"
            rules={[{ required: true, message: "Введите адрес" }]}
          >
            <Input placeholder="Город, улица, дом, квартира" />
          </Form.Item>



<Form.Item
  name="delivery_date"
  label="Дата и время доставки"
  rules={[{ required: true, message: "Выберите дату и время доставки" }]}
>
  <DatePicker
    style={{ width: "100%" }}
    showTime={{
      format: "HH:mm",
      minuteStep: 15,
    }}
    disabledDate={(current) => current && current.isBefore(dayjs().startOf("day"))}
    disabledTime={(current: Dayjs | null) => {
      if (!current) return {};
      const today = dayjs();
      const isToday = current.isSame(today, "day");

      const disabledHoursArr: number[] = [];
      for (let h = 0; h < 24; h++) {
        if (h < 8 || h >= 22) disabledHoursArr.push(h);
        if (isToday && h < defaultTime.hour()) disabledHoursArr.push(h);
      }

      const disabledMinutesArr: number[] = [];
      for (let m = 0; m < 60; m++) {
        if (m % 15 !== 0) disabledMinutesArr.push(m);
        if (isToday && current.hour() === defaultTime.hour() && m < defaultTime.minute())
          disabledMinutesArr.push(m);
      }

      return {
        disabledHours: () => disabledHoursArr,
        disabledMinutes: () => disabledMinutesArr,
        disabledSeconds: () => [],
      };
    }}
    defaultValue={defaultTime}
  />
</Form.Item>

          <Divider />

          <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
            <Typography.Title level={4} style={{ margin: 0, color: "#d46b08" }}>
              Итого: {total.toLocaleString()} ₽
            </Typography.Title>

            <Button type="primary" htmlType="submit" loading={orderLoading || deliveryLoading}>
              Оформить заказ
            </Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}