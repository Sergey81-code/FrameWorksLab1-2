import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Tabs,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../app/slices/authSlice";
import { useLoginMutation, useRegisterMutation } from "../app/api/authApi";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const tokens = await login(values).unwrap();
      dispatch(setCredentials(tokens));
      message.success("Вход выполнен");
      navigate("/catalog");
    } catch (e: any) {
      message.error(e?.data?.error ?? "Ошибка входа");
    }
  };

  const handleRegister = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      await register(values).unwrap();
      message.success("Регистрация выполнена, теперь войди в аккаунт");
      setTab("login");
      loginForm.setFieldsValue({ email: values.email });
    } catch (e: any) {
      message.error(e?.data?.error ?? "Ошибка регистрации");
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={22} sm={18} md={12} lg={8} xl={6}>
        <Card
          style={{
            borderRadius: 24,
            boxShadow: "0 10px 30px rgba(250, 140, 22, 0.12)",
          }}
        >
          <Typography.Title level={2} style={{ color: "#d46b08", marginTop: 0 }}>
            Orange Shop
          </Typography.Title>

          <Tabs
            activeKey={tab}
            onChange={(key) => setTab(key as "login" | "register")}
            items={[
              {
                key: "login",
                label: "Вход",
                children: (
                  <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, message: "Введите email" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Пароль"
                      rules={[{ required: true, message: "Введите пароль" }]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loginLoading}
                      block
                    >
                      Войти
                    </Button>
                  </Form>
                ),
              },
              {
                key: "register",
                label: "Регистрация",
                children: (
                  <Form
                    form={registerForm}
                    layout="vertical"
                    onFinish={handleRegister}
                  >
                    <Form.Item
                      name="name"
                      label="Имя"
                      rules={[{ required: true, message: "Введите имя" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, message: "Введите email" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Пароль"
                      rules={[{ required: true, message: "Введите пароль" }]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={registerLoading}
                      block
                    >
                      Создать аккаунт
                    </Button>
                  </Form>
                ),
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}